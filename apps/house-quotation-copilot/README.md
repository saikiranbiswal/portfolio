# House Quotation Copilot v4.2

This version separates **real WhatsApp Cloud API delivery** from the operating-system share sheet.

## The core workflow

1. Create a governed quote from an approved contractor rate card.
2. Commercial approval is applied if required.
3. House Copilot generates the frozen PDF revision in the browser.
4. `Send PDF via WhatsApp` POSTs the PDF bytes to the included Node server.
5. The server uploads the PDF to Meta's WhatsApp media endpoint.
6. The server sends a WhatsApp `document` message using the returned media ID.
7. The returned `wamid` is stored against the quote.
8. Delivery/read webhook events update the server status store; the UI can refresh them.

The access token never enters browser code or localStorage.

## Quick start — testable immediately

Requires Node.js 18+.

```bash
cd house-copilot-v4.2
node server.js
```

Open:

```text
http://localhost:8000
```

The default is **mock mode**. It exercises the full quote → PDF → backend → WhatsApp-message-ID → delivery-status workflow, but deliberately sends nothing to a real customer.

## Switch to real WhatsApp Cloud API

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env`:

```dotenv
WHATSAPP_MODE=real
META_GRAPH_VERSION=<current version shown by your Meta app>
META_PHONE_NUMBER_ID=<your WhatsApp Phone Number ID>
META_ACCESS_TOKEN=<server-side system-user/access token>

# Webhook support
META_WEBHOOK_VERIFY_TOKEN=<a random secret you choose>
META_APP_SECRET=<your Meta app secret>
```

Then restart:

```bash
node server.js
```

Do **not** put the access token into `index.html`, browser settings, GitHub, or client-side JavaScript.

## Meta webhook

Configure the WhatsApp webhook callback to point to:

```text
https://YOUR_PUBLIC_HTTPS_HOST/webhooks/whatsapp
```

Use the same value as `META_WEBHOOK_VERIFY_TOKEN` for verification. When `META_APP_SECRET` is set, this prototype also verifies `X-Hub-Signature-256` on webhook POSTs.

The server stores status records under `.runtime/whatsapp-messages.json` (ignored by git). This is prototype persistence, not a multi-tenant production database.

## Important Meta messaging constraint

The implemented live path sends a free-form document message. WhatsApp conversation-window/template rules still apply to the Meta account and customer conversation. If Meta requires an approved template for a given outbound situation, the server surfaces the Meta error instead of faking delivery. Template orchestration is intentionally not guessed because the approved template structure is account-specific.

## Buttons now mean different things

- **Send PDF via WhatsApp** → server-side WhatsApp Cloud API delivery.
- **Generic Share** → macOS/iOS/Android/Web Share sheet; not guaranteed to include WhatsApp.
- **Download PDF** → local file.
- **Open WhatsApp · message only** → `wa.me` text fallback; does not attach the PDF.

## Included files

- `index.html` — House Copilot UI and deterministic PDF generator.
- `server.js` — zero-dependency static server + WhatsApp Cloud API adapter + webhook receiver.
- `.env.example` — configuration template.
- `package.json` — convenience start/test commands; no runtime packages are required.
- `ARCHITECTURE.md` — integration and lifecycle design.
- `QA_REPORT.txt` — executed test results.

## Official Meta references used

- Meta WhatsApp Business Platform / Media: https://www.postman.com/meta/whatsapp-business-platform/folder/13382743-ecb27be5-4d27-4763-bbee-6a8002c04bf3
- Meta WhatsApp Cloud API / Messages: https://www.postman.com/meta/whatsapp-business-platform/folder/o48mro7/messages
- Meta WhatsApp Business Platform / Webhooks: https://www.postman.com/meta/whatsapp-business-platform/folder/lboq68h/webhooks
