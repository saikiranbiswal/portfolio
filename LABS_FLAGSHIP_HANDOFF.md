# Next-Session Handoff: Labs Flagship Case Studies

Last updated: June 10, 2026

## ⭐ SESSION 6 — Gamified interactive case study (NEW, built + browser-verified)

A bespoke, **enterprise "Cloud"-styled interactive case study** now exists for the
AI Collections flagship. It turns the six artifacts into living diagrams with a
progress spine, instead of the static scrolling SPA version.

- **File:** [`case-studies/collections-cloud.html`](case-studies/collections-cloud.html)
  — one self-contained page (embedded CSS + JS). Navy/blue "Cloud" design language
  (matches `apps/collections-cloud/`), Inter + Newsreader.
- **Hybrid data:** the page **fetches `../labs.json`** for content (source of truth)
  and falls back to `window.LABS_SEED` (`../js/labs-data.js`) on `file://`. No third
  data copy — edit `labs.json` and this page updates too.
- **7 stages, each a "level":** 0 Hero/the pain (chaos cluster) · 1 PRD (personas +
  in/out-of-scope) · 2 User Flow (clickable nodes + "play the walkthrough") · 3
  Metrics Tree (SVG connectors, hover-to-trace lineage) · 4 Architecture (animated
  pipeline pulse + feedback loop) · 5 Before/After (toggle) · 6 Prototype (5
  HTML-built screen mockups + switcher → links to live app).
- **Gamified spine:** top reading-progress bar, left dot-stepper rail (Intersection
  Observer marks stages visited), "N / 7 stages explored" counter.
- **Discipline tags** on each artifact link back into the Labs discipline labs.
- **Attached PRD deck:** `case-studies/ai-collections-cloud-prd.pdf` (11 slides). Source
  was a Xavier-AI-generated deck; cleaned with PyMuPDF — the "Xavier AI" logo on the
  title slide (page 1, img xref 8, bbox [44,40,196,71]) was covered with a
  background-matched off-white rect (do NOT use redaction IMAGE_REMOVE — it nukes the
  slide's background imagery), and the gated "Data only available in Pro Plan" last
  slide (old page 12) was deleted. Linked from the hero (ghost "Read the full PRD"
  button) and the PRD stage (`.prd-doc` callout) via the `PRD_PDF` const.
- **Reached from Labs index:** `js/labs-app.js` has an `EXPERIENCE` map
  (`ai-collections → case-studies/collections-cloud.html`); the flagship card renders
  as an `<a data-explore>` with an "▸ INTERACTIVE" badge + "Open the interactive case
  study" CTA. CSS for the badge is in `css/labs.css` (`.flag-interactive`).
- **Verified** on localhost:8000 at 1280px: all 7 stages render, 24 tree connector
  paths draw, screen switcher / before-after toggle / driver-hover / flow-play /
  pipeline-pulse all work, zero console errors. Responsive: stacks <880px.

**STATUS:** committed to `main` June 11, 2026 (commit subject "Labs: gamified AI
Collections Cloud case study + flagship restructure") — NOT pushed yet.
Files in that commit: `case-studies/collections-cloud.html`,
`case-studies/ai-collections-cloud-prd.pdf`, `js/labs-app.js`, `css/labs.css`,
`js/labs-data.js`, `labs.json`, `LABS_FLAGSHIP_HANDOFF.md`. To publish to the live
site, `git push` (Sai must confirm — publishing is outward-facing).

**RESUME NEXT SESSION — START HERE (in priority order):**
1. ⬜ **Background consistency (Sai's feedback, June 11).** Sai: "the background should
   be consistent across screens — everything else is fine, it looks good." Make the
   backgrounds consistent. Best guess at scope = the **5 prototype mock-up screens**
   inside the device frame on Stage 6 (some are white-card-on-canvas, the AI-panel one
   is mostly a navy card → they read as different "products"); also sanity-check the
   per-stage section backgrounds (navy hero vs `--canvas` body) read as one system.
   **Confirm with Sai exactly which screens he means before changing.** Files:
   `case-studies/collections-cloud.html` — `.screen` / `.scr` / `.mk-*` styles and the
   `buildMocks()` markup.
2. ⬜ **Clone the experience to LOS** → `case-studies/lending-os.html` (same 7-stage
   pattern, pull lab `los` / product `lending-os` from `labs.json`), add `los` to the
   `EXPERIENCE` map in `js/labs-app.js`, and attach the LOS PRD the same way if one
   exists.
3. ⬜ Optional: drop real product screenshots into the Stage-6 mock-ups; `git push` to
   publish (Sai confirms).

---


## Resume Prompt

Continue the Labs flagship case-study work in `/Users/saikiranbiswal/Downloads/portfolio`.
Read this file first, then run the site (`python3 -m http.server 8000`, open
`http://localhost:8000/labs.html`) and verify before changing anything. Before a
structural change, present options + a recommendation to Sai for confirmation.

## What This Workstream Is

Showcase two flagship PM products as complete, end-to-end case studies inside the
existing Labs section, each carrying six artifacts (PRD, User Flow, Metrics Tree,
Workflow Diagram, Before/After, Prototype/Screens), following Sai's "I found a
painful workflow → I built the thing" narrative.

The two flagships:

- **AI Collections Cloud** — AI-native collections workspace (live app: `apps/collections-cloud/`)
- **LOS — Loan Origination System** — guided, state-based loan origination (live app: `apps/lending-cloud/`)

## Decisions Already Made (do not relitigate without reason)

- **Structure = Option B (product-as-case-study).** Each flagship is ONE scrolling
  page; the six artifacts are anchored sections, not separate pages or tabs.
  (Rejected: Option A artifact-as-page, Option C tabbed workbench.)
- **Scope = feature the two, keep the rest.** The six discipline labs (Founder,
  Analytics, AI, Architecture, Data, Product) stay untouched below the flagships.
- **Disciplines become tags.** Every artifact is tagged with the discipline lab it
  draws on, and each tag links into that lab (e.g. Metrics Tree → "Analytics lab ↗").

## What Is DONE (built + browser-verified, zero console errors)

### Data — `labs.json`
- Two flagship labs prepended to the `labs` array, each with `flagship: true` and a
  single product:
  - lab `ai-collections` → product `collections-cloud`
  - lab `los` → product `lending-os`
- Each product carries the case-study schema (new fields): `why`, `users[]`,
  `mvp[]`, `testing`, `next`, plus the existing `tagline`/`what`/`features`/`role`/
  `year`/`stage2`/`stack`/`url`, and an `artifacts[]` array.
- `artifacts[]` item shapes by `kind`:
  - `prd` — `goal`, `users[]`, `mvp[]`, `nongoals[]`
  - `flow` — `steps[]`
  - `metrics` — `business`, `drivers[]`, `product[]`
  - `workflow` — `steps[]`
  - `beforeafter` — `before`, `after`
  - `screens` — `items[]` (each `{name, img?}`)
  - every artifact also has `label` and `tags[]` (discipline names)
- `meta` header reframed (eyebrow/title/intro) to introduce flagships + six labs.

### Seed — `js/labs-data.js`
- Regenerated from `labs.json` (it is now `window.LABS_SEED = <labs.json contents>`).
- IMPORTANT: this file is auto-generated. If you edit `labs.json`, regenerate with:
  ```
  python3 -c "import json;d=json.load(open('labs.json'));open('js/labs-data.js','w').write(open('js/labs-data.js').read().split('window.LABS_SEED')[0]+'window.LABS_SEED = '+json.dumps(d,indent=2,ensure_ascii=False)+';\n')"
  ```
  (Or just keep the header comment and rewrite the assignment.)

### Renderer — `js/labs-app.js`
- `renderIndex()` splits labs into `flagship` vs rest: renders a "Flagship case
  studies" strip (`flagCardHTML`) above the classic discipline list. Flagship cards
  nav straight to their single product (skip the one-card lab grid).
- `renderProduct()` extended: after the existing prod-body it appends
  `caseStudyHTML(p, base)` → sections Why / Who & what / Product artifacts /
  Hypothesis & next.
- Artifact sub-renderers: `artifactHTML(a)` switches on `a.kind`; helpers
  `csSection`, `prdCol`, `disciplineTags`, plus `DISCIPLINE_LAB` map.
- Flagship single-product labs: back-link goes to index ("← All labs"); "Next"
  cross-sells the OTHER flagship case study.

### Styles — `css/labs.css`
- Appended (before the Footer block): `.flag-head/.flag-strip/.flag-card/...`,
  `.case-study/.cs-section/.cs-twocol/...`, and per-artifact styles
  (`.art-prd/.prd-grid`, `.flow-steps`, `.metric-tree`, `.pipeline`, `.ba-grid`,
  `.screens-grid`). On-theme (uses existing tokens), responsive, dark/Noir-safe.

### Verified in browser (localhost:8000)
- Index flagship strip + discipline labs renumber 03–08. ✅
- Both case studies render all 6 artifacts, all 4 sections. ✅
- Discipline tag click navigates to the right lab (Metrics Tree → Analytics Lab). ✅
- Flagship cross-sell (AI Collections Cloud → "Next: LOS"). ✅
- Mobile (375px): flagship cards and PRD grid stack to one column. ✅
- No console errors. ✅

## NOT Done / Open Next Steps

1. **Not committed or pushed.** All changes are local on `main`. Live site
   (`https://saikiranbiswal.github.io/portfolio/`) does NOT yet show this. Files
   changed: `labs.json`, `js/labs-data.js`, `js/labs-app.js`, `css/labs.css`.
   → Next: commit + push to publish (Sai must confirm).
2. **Screens are labeled placeholders** — no real images. Each
   `artifacts → (kind:screens) → items[]` entry can take an `img` path
   (relative, e.g. `assets/screenshots/...` or `assets/labs/...`). Drop in real
   screenshots when available.
3. **Admin CMS does not edit artifacts yet.** `admin.html` serializes the whole
   `models.labs` object on publish, so the new fields SURVIVE a CMS round-trip —
   but there is no form UI for `why/users/mvp/testing/next/artifacts`. Editing is
   currently raw-JSON only. → Optional: extend `admin.html` (renderLabs / labBlock /
   product editor near lines 315–385) with artifact fields. `labs.json` is
   intentionally NOT in `.pages.yml` (Pages CMS), so that path is unaffected.
4. **Stats not updated.** `meta.statProducts` still "27"; flagship products aren't
   counted. Cosmetic — decide whether to bump.

## Guardrails / Gotchas

- `labs.json` is the source of truth on the live (http) site; `js/labs-data.js` is
  only the `file://` fallback. Keep them in sync (regenerate the seed).
- Router is hash-based: `#/`, `#/lab/<id>`, `#/product/<labId>/<prodId>`.
- The build script used this session lives at `/tmp/build_flagships.py` (ephemeral;
  the content is already baked into `labs.json` so it is not needed again).
- `gh` CLI is not installed; publishing is done via the admin CMS (GitHub Contents
  API + keychain token `atlassian-...`) or plain `git push` if a remote/creds exist.

## Definition of Success for Next Session

1. Confirm with Sai: commit + push to publish (and whether to extend the admin CMS).
2. If publishing: commit the four changed files with a clear message, push, verify live.
3. If continuing build: add real screen images and/or the admin artifact editor.
