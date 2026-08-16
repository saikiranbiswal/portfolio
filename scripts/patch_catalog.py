from pathlib import Path
import re

p = Path('universe.html')
s = p.read_text(encoding='utf-8')

# Replace the existing House Quotation card with current v4.2 positioning,
# then append the three newly published products directly after it.
pattern = re.compile(r"  \{\n    id:'house-quotation-copilot'.*?\n  \},", re.S)
replacement = """  {
    id:'house-quotation-copilot', no:'№ 07', title:'House Quotation Copilot', tag:'Proptech · Governed quoting + WhatsApp delivery',
    lede:'An India-oriented quotation operating system with governed rate cards, RBAC, commercial approvals, real PDF generation, and a server-side WhatsApp delivery path.',
    about:'House Quotation Copilot v4.2 turns contractor-controlled rate cards into governed customer quotations. It combines role-based controls, immutable quote revisions, commercial approval, deterministic PDF generation, customer response tracking and audit history. The source also includes a zero-dependency Node adapter for WhatsApp Cloud API media upload, document messaging and delivery-status webhooks. The static GitHub Pages demo runs the browser product; live WhatsApp delivery requires the included server and Meta credentials.',
    accent:'#4A7C59', live:'apps/house-quotation-copilot/index.html'
  },
  {
    id:'documentops-ai', no:'№ 08', title:'DocumentOps AI V2', tag:'Enterprise AI · Document operations',
    lede:'Turn business documents into explainable decisions, human-controlled actions, execution results, and an audit trail — with single or bulk intake.',
    about:'A working document-operations product prototype built around the lifecycle Upload or Bulk Upload → Extract → Validate → Decide → Human Control → Execute → Audit. It demonstrates scenario-specific extraction, deterministic validation controls, explainable business decisions, recommended actions, workflow creation, execution evidence and per-document audit history. The current demo uses simulated adapters so the operating model can be tested without exposing production OCR, LLM, ERP or ticketing credentials.',
    accent:'#3558E6', live:'apps/documentops-ai/index.html'
  },
  {
    id:'channelops', no:'№ 09', title:'ChannelOps · DMS + SFA Command Center', tag:'Enterprise SaaS · Commercial execution',
    lede:'One operating surface across field execution, distributor operations, integration trust, commercial diagnosis, RBAC, and failure recovery.',
    about:'A DMS + SFA commercial execution command center with four distinct operating personas: Field Rep, Distributor Operator, Commercial Excellence and Product/Admin. It connects beat execution and offline-safe order capture to distributor onboarding, stock, invoicing, claims, reconciliation, SFA → DMS → ERP → BI event traceability, integration failure recovery and commercial metrics. Authorization is enforced at both navigation and action-handler levels, with regression-tested deterministic business rules.',
    accent:'#0F766E', live:'apps/channelops/index.html'
  },
  {
    id:'roamradio', no:'№ 10', title:'RoamRadio', tag:'Travel · Internet radio PWA',
    lede:'A travel-first radio PWA with worldwide station discovery, nearby radio, driving mode, favourites, sleep timer, and an offline app shell.',
    about:'RoamRadio is a static, travel-first internet radio PWA powered by the open Radio Browser directory. It supports live station search, country and language discovery, browser geolocation with local Haversine distance, direct audio playback, favourites and recents, Data Saver, sleep timer, driving mode, Media Session controls and an offline application shell. No backend, database, account or API key is required; station audio streams directly from third-party broadcasters.',
    accent:'#68A7FF', live:'apps/roamradio/index.html'
  },"""

if not pattern.search(s):
    raise SystemExit('Could not find House Quotation project block in universe.html')
s = pattern.sub(replacement, s, count=1)

# Shift the old cards that followed House to make room for the new entries.
for old, new in [
    ("id:'excel-merger', no:'№ 08'", "id:'excel-merger', no:'№ 11'"),
    ("id:'excel-transformer', no:'№ 09'", "id:'excel-transformer', no:'№ 12'"),
    ("id:'synthesis', no:'№ 10'", "id:'synthesis', no:'№ 13'"),
    ("id:'neuralpath', no:'№ 11'", "id:'neuralpath', no:'№ 14'"),
]:
    s = s.replace(old, new, 1)

old_house_li = '''        <li><a class="ee-cert" href="apps/house-quotation-copilot/index.html" target="_blank" rel="noopener">House Quotation Copilot</a><span class="ee-cert-by">Proptech · AI pricing. A working prototype and 30-day validation kit for an AI house-quotation assistant.</span></li>'''
new_builds = '''        <li><a class="ee-cert" href="apps/documentops-ai/index.html" target="_blank" rel="noopener">DocumentOps AI V2</a><span class="ee-cert-by">Enterprise AI · document intake, validation, explainable decisioning, human control, execution evidence and bulk processing.</span></li>
        <li><a class="ee-cert" href="apps/channelops/index.html" target="_blank" rel="noopener">ChannelOps · DMS + SFA Command Center</a><span class="ee-cert-by">Commercial execution · field SFA, distributor operations, cross-system events, RBAC, failure recovery and decision-grade metrics.</span></li>
        <li><a class="ee-cert" href="apps/house-quotation-copilot/index.html" target="_blank" rel="noopener">House Quotation Copilot v4.2</a><span class="ee-cert-by">Proptech · governed rate cards, RBAC, commercial approvals, deterministic PDF revisions and a server-side WhatsApp Cloud API delivery path.</span></li>
        <li><a class="ee-cert" href="apps/roamradio/index.html" target="_blank" rel="noopener">RoamRadio</a><span class="ee-cert-by">Travel PWA · worldwide internet radio discovery, nearby stations, driving mode, favourites and offline shell support.</span></li>'''
if old_house_li not in s:
    raise SystemExit('Could not find independent-build House Quotation list item')
s = s.replace(old_house_li, new_builds, 1)

p.write_text(s, encoding='utf-8')
print('Portfolio catalog patched for selected product set.')
