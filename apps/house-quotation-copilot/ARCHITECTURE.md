# House Copilot v4.2 — WhatsApp Delivery Architecture

## Design objective

Make the customer-delivery path truthful and testable:

```text
Approved quote revision
       ↓
Browser PDF generator
       ↓
application/pdf Blob
       ↓
POST /api/whatsapp/send-document
       ↓
Node server (token boundary)
       ↓
Meta: POST /{Phone-Number-ID}/media
       ↓
Media ID
       ↓
Meta: POST /{Phone-Number-ID}/messages
       ↓
WhatsApp message ID (wamid)
       ↓
Quote WhatsApp state = submitted
       ↓
Meta webhook
       ↓
sent / delivered / read / failed
```

## Why a backend is mandatory

The Meta access token is a server credential. A static HTML app cannot safely hold it. Therefore v4.2 keeps PDF construction client-side but moves Meta authentication and network calls into `server.js`.

## Minimal server API

### `GET /api/whatsapp/config`
Returns only non-secret readiness metadata. It never returns the access token.

### `POST /api/whatsapp/send-document`
Input:

```json
{
  "to": "919876543210",
  "fileName": "House-Quotation-Q-1024-R1.pdf",
  "pdfBase64": "...",
  "caption": "...",
  "quoteId": "Q-1024",
  "documentId": "Q-1024-R1"
}
```

Server controls:
- recipient digits validation;
- PDF magic-header validation;
- prototype body/file-size guardrail;
- server-only Meta token;
- media upload before message send;
- returned message ID persistence.

### `GET /api/whatsapp/status/:messageId`
Returns the latest stored Meta delivery state.

### `GET /webhooks/whatsapp`
Handles Meta verification challenge using `META_WEBHOOK_VERIFY_TOKEN`.

### `POST /webhooks/whatsapp`
Processes WhatsApp message-status webhooks. If `META_APP_SECRET` is supplied, the request signature is verified before processing.

## Quote state

Each quote now contains:

```text
whatsapp.status
whatsapp.messageId
whatsapp.mediaId
whatsapp.to
whatsapp.submittedAt
whatsapp.updatedAt
whatsapp.error
```

A successful API submission is not confused with an OS share-sheet action. Generic Share and `wa.me` remain independent fallbacks.

## Test modes

### Mock mode
Default. Server returns `wamid.mock.*`, stores a mock record and supports webhook/status tests. No customer message is sent.

### Real mode
Requires:
- current Meta Graph API version;
- WhatsApp Phone Number ID;
- access token with the required WhatsApp messaging permission;
- optional webhook verification token and app secret for callbacks/signature verification.

## Deliberately not added

- no external pricing API;
- no third-party WhatsApp wrapper;
- no browser-side access token;
- no guessed template definition;
- no CRM/database rewrite.

This keeps the v4.2 change directly traceable to the failed customer-PDF delivery requirement.
