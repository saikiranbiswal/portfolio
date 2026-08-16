'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ROOT = __dirname;
function loadDotEnv() {
  const envFile = path.join(ROOT, '.env');
  if (!fs.existsSync(envFile)) return;
  for (const raw of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx < 1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('\"') && value.endsWith('\"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadDotEnv();

const PORT = Number(process.env.PORT || 8000);
const MODE = String(process.env.WHATSAPP_MODE || 'mock').toLowerCase();
const TOKEN = process.env.META_ACCESS_TOKEN || '';
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || '';
const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || '';
const APP_SECRET = process.env.META_APP_SECRET || '';
const RUNTIME_DIR = path.join(ROOT, '.runtime');
const MESSAGE_FILE = path.join(RUNTIME_DIR, 'whatsapp-messages.json');
const MAX_JSON_BYTES = 16 * 1024 * 1024;

fs.mkdirSync(RUNTIME_DIR, { recursive: true });

function json(res, status, body) {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length,
    'Cache-Control': 'no-store'
  });
  res.end(data);
}

function readMessages() {
  try { return JSON.parse(fs.readFileSync(MESSAGE_FILE, 'utf8')); }
  catch { return {}; }
}

function writeMessages(messages) {
  const tmp = MESSAGE_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(messages, null, 2));
  fs.renameSync(tmp, MESSAGE_FILE);
}

function saveMessage(id, patch) {
  const all = readMessages();
  all[id] = { ...(all[id] || {}), ...patch, messageId: id, updatedAt: new Date().toISOString() };
  writeMessages(all);
  return all[id];
}

function configured() {
  if (MODE === 'mock') return true;
  return MODE === 'real' && Boolean(TOKEN && PHONE_NUMBER_ID && GRAPH_VERSION);
}

function configPayload() {
  return {
    configured: configured(),
    mode: MODE,
    graphVersion: GRAPH_VERSION || null,
    phoneNumberIdPresent: Boolean(PHONE_NUMBER_ID),
    accessTokenPresent: Boolean(TOKEN),
    webhookVerifyTokenPresent: Boolean(VERIFY_TOKEN),
    webhookSignatureVerification: Boolean(APP_SECRET),
    note: MODE === 'mock'
      ? 'Mock mode: no customer message is sent. Set WHATSAPP_MODE=real and Meta credentials for live delivery.'
      : configured()
        ? 'Real Meta Cloud API mode.'
        : 'Real mode requires META_ACCESS_TOKEN, META_PHONE_NUMBER_ID and META_GRAPH_VERSION.'
  };
}

async function readBody(req, maxBytes = MAX_JSON_BYTES) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw Object.assign(new Error('Request body too large'), { statusCode: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function cleanDigits(value) { return String(value || '').replace(/\D/g, ''); }
function safeFileName(value) { return String(value || 'quotation.pdf').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120); }

async function metaJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { raw: text }; }
  if (!response.ok) {
    const msg = body?.error?.message || body?.message || `Meta API HTTP ${response.status}`;
    const err = new Error(msg);
    err.statusCode = 502;
    err.meta = body;
    throw err;
  }
  return body;
}

async function sendRealDocument({ to, fileName, pdfBuffer, caption, quoteId, documentId }) {
  const base = `https://graph.facebook.com/${encodeURIComponent(GRAPH_VERSION)}/${encodeURIComponent(PHONE_NUMBER_ID)}`;
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), fileName);

  const media = await metaJson(`${base}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: form
  });
  if (!media.id) throw Object.assign(new Error('Meta upload succeeded without a media ID'), { statusCode: 502 });

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'document',
    document: {
      id: media.id,
      filename: fileName,
      caption: String(caption || '').slice(0, 1024)
    }
  };
  const sent = await metaJson(`${base}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const messageId = sent?.messages?.[0]?.id;
  if (!messageId) throw Object.assign(new Error('Meta accepted the request without a WhatsApp message ID'), { statusCode: 502 });

  saveMessage(messageId, {
    status: 'submitted',
    mode: 'real',
    to,
    mediaId: media.id,
    fileName,
    quoteId: quoteId || null,
    documentId: documentId || null,
    submittedAt: new Date().toISOString(),
    metaResponse: sent
  });
  return { mode: 'real', status: 'submitted', messageId, mediaId: media.id };
}

async function sendDocument(req, res) {
  if (!configured()) return json(res, 503, { error: configPayload().note, ...configPayload() });
  const raw = await readBody(req);
  let body;
  try { body = JSON.parse(raw.toString('utf8')); }
  catch { return json(res, 400, { error: 'Invalid JSON body' }); }

  const to = cleanDigits(body.to);
  const fileName = safeFileName(body.fileName);
  if (!/^\d{10,15}$/.test(to)) return json(res, 400, { error: 'Recipient must be 10–15 digits in international format without +.' });
  if (!body.pdfBase64) return json(res, 400, { error: 'pdfBase64 is required' });
  let pdfBuffer;
  try { pdfBuffer = Buffer.from(body.pdfBase64, 'base64'); }
  catch { return json(res, 400, { error: 'Invalid base64 PDF' }); }
  if (!pdfBuffer.length || !pdfBuffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) return json(res, 400, { error: 'Payload is not a valid PDF file' });
  if (pdfBuffer.length > 10 * 1024 * 1024) return json(res, 413, { error: 'Prototype PDF upload limit is 10 MB' });

  if (MODE === 'mock') {
    const messageId = `wamid.mock.${Date.now()}.${crypto.randomBytes(4).toString('hex')}`;
    const mediaId = `media.mock.${crypto.randomBytes(5).toString('hex')}`;
    saveMessage(messageId, {
      status: 'sent',
      mode: 'mock',
      to,
      mediaId,
      fileName,
      quoteId: body.quoteId || null,
      documentId: body.documentId || null,
      submittedAt: new Date().toISOString(),
      deliveredAt: null,
      readAt: null
    });
    return json(res, 200, { mode: 'mock', status: 'sent', messageId, mediaId, warning: 'Mock mode only; no customer message was sent.' });
  }

  try {
    const result = await sendRealDocument({
      to,
      fileName,
      pdfBuffer,
      caption: body.caption,
      quoteId: body.quoteId,
      documentId: body.documentId
    });
    return json(res, 200, result);
  } catch (err) {
    return json(res, err.statusCode || 502, { error: err.message, meta: err.meta || null });
  }
}

function verifyWebhook(req, res, url) {
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  if (mode === 'subscribe' && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end(challenge || '');
  }
  return json(res, 403, { error: 'Webhook verification failed' });
}

function signatureValid(raw, signature) {
  if (!APP_SECRET) return true;
  if (!signature || !signature.startsWith('sha256=')) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(raw).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function receiveWebhook(req, res) {
  const raw = await readBody(req, 2 * 1024 * 1024);
  if (!signatureValid(raw, req.headers['x-hub-signature-256'])) return json(res, 401, { error: 'Invalid webhook signature' });
  let body;
  try { body = JSON.parse(raw.toString('utf8')); }
  catch { return json(res, 400, { error: 'Invalid webhook JSON' }); }

  const statuses = [];
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      for (const st of change?.value?.statuses || []) statuses.push(st);
    }
  }
  for (const st of statuses) {
    if (!st.id) continue;
    const patch = { status: st.status || 'unknown', recipientId: st.recipient_id || null, webhook: st };
    const ts = st.timestamp ? new Date(Number(st.timestamp) * 1000).toISOString() : new Date().toISOString();
    if (st.status === 'sent') patch.sentAt = ts;
    if (st.status === 'delivered') patch.deliveredAt = ts;
    if (st.status === 'read') patch.readAt = ts;
    if (st.status === 'failed') patch.error = st.errors || 'Delivery failed';
    saveMessage(st.id, patch);
  }
  return json(res, 200, { received: true, statusesProcessed: statuses.length });
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return ({ '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.css':'text/css; charset=utf-8', '.md':'text/markdown; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.pdf':'application/pdf', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg' })[ext] || 'application/octet-stream';
}

function serveStatic(res, pathname) {
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(ROOT, relative);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) return json(res, 403, { error: 'Forbidden' });
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return json(res, 404, { error: 'Not found' });
  const data = fs.readFileSync(file);
  res.writeHead(200, { 'Content-Type': contentType(file), 'Content-Length': data.length, 'Cache-Control': 'no-cache' });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'GET' && url.pathname === '/api/whatsapp/config') return json(res, 200, configPayload());
    if (req.method === 'POST' && url.pathname === '/api/whatsapp/send-document') return await sendDocument(req, res);
    if (req.method === 'GET' && url.pathname.startsWith('/api/whatsapp/status/')) {
      const id = decodeURIComponent(url.pathname.slice('/api/whatsapp/status/'.length));
      const record = readMessages()[id];
      return record ? json(res, 200, record) : json(res, 404, { error: 'Message status not found' });
    }
    if (req.method === 'GET' && url.pathname === '/webhooks/whatsapp') return verifyWebhook(req, res, url);
    if (req.method === 'POST' && url.pathname === '/webhooks/whatsapp') return await receiveWebhook(req, res);
    if (req.method === 'GET') return serveStatic(res, url.pathname);
    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return json(res, err.statusCode || 500, { error: err.message || 'Server error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`House Copilot v4.2 running at http://localhost:${PORT}`);
  console.log(`WhatsApp mode: ${MODE}${configured() ? ' (ready)' : ' (not configured)'}`);
});
