# Next-Session Handoff: Labs Flagship Case Studies

Last updated: June 12, 2026 (session 8)

---

## ⭐⭐⭐ SESSION 8 — "The Product Memo" design revamp — M1–M6 DONE, pushed & LIVE

**Commits (all on `main`, pushed):**
```
8a5ee79  Case-study bridge + consistency sweep
e8158a6  Site chrome: unified footer + head hygiene + design foundations
4f03b65  Work: two flagship case-study cards + LOS naming + Pune location
```

### What was built this session (the delta)

**Design language: "The Product Memo"** — editorial clay (Work/Labs/About/Contact) + navy
"Cloud" (case studies/apps) — unified under one type system.

#### Typography & tokens (`css/styles.css`)
- `Hanken Grotesk` replaced by **`Inter`** site-wide (`--sans` var).
- Type-scale CSS variables added: `--t-display`, `--t-h2`, `--t-h3`, `--t-lead`, `--t-body`,
  `--t-mono`, `--ease`, `--stagger`.
- `body::before` paper grain at 2.5% opacity (SVG noise, `position:fixed`, `pointer-events:none`,
  `z-index:1`). Nav sits at `z-index:10` (above grain).
- `::selection` → clay background on paper pages.
- New classes: `.figcap` (tick + mono cap), `.cta-band` (dark pre-footer strip), `.colophon`.
- View-transition CSS: `@view-transition { navigation: auto; }`.
- `prefers-reduced-motion`: kills all transitions + animation.
- Footer grid: `1.5fr 1fr 1fr 1fr` (4 columns, stacks at 760px).

#### Work page (`products.html`, `js/site.js`)
- Favicon link, `<meta description>`, OG tags, cache-busted `?v=9` refs.
- Hero stat strip: `2 / 7 / 7` (case studies · products · years) with count-up JS animation
  (IntersectionObserver, runs once, 900ms eased). `.count-num[data-target]` pattern.
- Colophon line: "SET IN NEWSREADER & INTER · BUILT BY HAND · NO TEMPLATES".
- CTA dark band before footer: "Building something *hard?*" + clay "Get in touch →" button.
- Footer: 4-column (Navigate · Case Studies · Elsewhere + brand tagline).
- `site.js`: copyright year auto (`new Date().getFullYear()`).

#### Labs page (`labs.html`, `js/labs-app.js`, `labs.json`, `js/labs-data.js`)
- `labs.json` + `labs-data.js`: `statYears` "10+" → **"7"** (regenerated seed).
- `labs.json` + `labs-data.js`: product name "Enterprise Lending Cloud" → "LOS — Loan Origination
  System" in Architecture Lab (non-flagship product, line ~968).
- `labs.html`: favicon, meta/OG, cache-busted `?v=9`.
- `labs-app.js`: nav Work link `index.html` → `products.html`; full 4-col footer (auto year +
  Case Studies column); craft divider ("The craft behind the flagships — six labs, every layer.")
  inserted between flagship strip and discipline list; CTA band before footer.

#### About page (`about.html`, `js/about.js`)
- Favicon, meta/OG, cache-busted refs.
- "Proof, not promises" section added before CTA band: two flagship cards (Collections + LOS)
  using existing `.flagship` / `.flagship.flip` / `.flag-stack` CSS — each links to its case study.
- CTA dark band replaces the old dark `<section class="band">` CTA.
- Footer: full 4-col with auto year.

#### Contact page (`contact.html`, `js/contact.js`)
- Favicon, meta/OG, cache-busted refs.
- "Or start with the work" row added below the link grid: ghost buttons
  `FIG. 01 · AI Collections Cloud →` and `FIG. 02 · LOS — Loan Origination →`.
- Footer: full 4-col with auto year.

#### Case studies (both `case-studies/*.html`)
- Topbar: `← Labs` → **`← Portfolio`** (href `../products.html`).
- Favicon `../assets/favicon.svg`, `<meta description>`, OG tags.
- `body::before` grain overlay at **2% opacity** (navy pages — slightly lighter than editorial 2.5%).
- `.figcap` CSS added (blue `#2f6fed` tick instead of clay, matches navy language).
- **FIG. 06 figcap** rendered below the device frame in JS (stage 6 prototype section):
  - Collections: `FIG. 06 — AI COLLECTIONS CLOUD · WORKING PROTOTYPE`
  - LOS: `FIG. 06 — LOS — LOAN ORIGINATION SYSTEM · WORKING PROTOTYPE`

#### Global
- `assets/favicon.svg` — clay SK monogram on paper background (SVG, 32×32, r=8 rounded rect).
- All JS footers (labs/about/contact): inline `style` overrides removed; CSS grid handles
  both 4-col desktop and 1-col mobile without specificity conflict.

---

### What the design direction planned but was NOT built this session

These are the remaining "inspired tier" items from the plan. Pick them up as M2 in the next session:

| Item | File(s) | Notes |
|------|---------|-------|
| **Hero line-by-line reveal** | `products.html` + small `reveal.js` ext or inline `<script>` | Wrap each h1 line in `<span class="line"><span>…</span></span>`; inner spans `translateY(110%)→0`, staggered 70ms. Must be authored line breaks, not text-measured splits. |
| **Work index rows: dotted leaders** | `js/site.js` `workRow()` + `css/styles.css` | `.work-row .titles .t` gets `flex:1; display:flex; align-items:baseline; gap:0` with a dotted `border-bottom:1px dotted var(--line)` leader between name and meta column. Hover: name shifts 6px right, dots turn clay. |
| **Flagship card `.figcap`** on Work + About | `js/site.js` `flagshipHTML()`, `js/about.js` proof section | Add `<p class="figcap">FIG. 01 — …</p>` and `FIG. 02 — …` below each flagship `.ph` image block. Sequential numbering per page. |
| **About: portrait plate tilt** | `css/styles.css` `.portrait` | `transform: rotate(-.5deg)` + `hover: rotate(0)` (400ms). Hairline frame + 8px paper mat. |
| **About: ledger timeline** | `css/styles.css` `.timeline`/`.tl-row` | Vertical 1px rule left, mono year ticks offset left. Currently a clean grid — refine spacing/rule only, no data changes. |
| **Contact: email display hero** | `js/contact.js` `render()` | `h1` becomes the email address in Newsreader italic at display size with clay underline draw-in on hover; click = `navigator.clipboard.writeText()` + show mono toast "COPIED — NOW WRITE THE HARD PROBLEM". |
| **Labs hero stat count-up** | `js/labs-app.js` `statHTML()` | Add `data-target` on the stat number spans; inject the same 15-line IntersectionObserver count-up script used on `products.html`. |
| **Nav + footer link hover underline draw** | `css/styles.css` | `.nav-links a` already has `::after` underline — verify `.footer-col a` also gets the draw-in (currently only color transition). |

---

### Current working-tree state

Clean. Local `main` == `origin/main`. Latest commit `8a5ee79`.

### QA status (verified this session)

| Check | Status |
|-------|--------|
| Zero console errors — all 4 editorial pages | ✅ |
| Zero console errors — both case studies | ✅ |
| No horizontal scroll at 375px — products, labs | ✅ |
| Stat strip 2/7/7 renders + count-up wired | ✅ |
| Labs stats 6/27/7 (years fixed) | ✅ |
| Flagship cards link to case studies | ✅ |
| CTA band on Work + Labs + About | ✅ |
| Case study topbar "← Portfolio" | ✅ |
| FIG. 06 figcap in both case studies | ✅ |
| Favicon visible in browser tab | ✅ |
| Footer 4-col + Case Studies column | ✅ |
| Footer mobile stacks (760px) | ✅ |

---

### Resume prompt for next session

```
Continue the portfolio design revamp in /Users/saikiranbiswal/Downloads/portfolio.
Read LABS_FLAGSHIP_HANDOFF.md first (Session 8 section at the top).
The revamp M1–M6 are DONE and live. Pick up the remaining "inspired tier" items
listed in the "NOT built" table — these are the M2 delta.
Start the server: python3 -m http.server 8000
Verify current state before touching anything.
Build and QA one item at a time; commit after each group that passes QA.
```

---

## ⭐⭐ SESSION 7 — Published everything + rich flagship cards (DONE, pushed & LIVE)

Everything from sessions 5 + 6 + 7 is now **pushed to `main` and live** on
https://saikiranbiswal.github.io/portfolio/labs.html. Two things happened:

1. **Published the backlog.** The session-5+6 commit `f5b5d2b` (gamified case study +
   flagship restructure + PRD pdf) was pushed (`00f9692..f5b5d2b`). It was committed
   but never pushed.

2. **Rebuilt the flagship cards on the Labs index** (commit `74675c6`). Sai's ask:
   "restructure this page and add those case studies to this page and organize it."
   He couldn't tell what had changed because his browser was showing a **stale cached
   `js/labs-app.js`** (flagships flattened into the 01/02 numbered list) while the live
   server already had the new flagship-strip code.
   - **⚠️ CACHE GOTCHA:** python `http.server` + the browser heuristic-cache `js/*.js`
     and `css/*.css` even after a push. Sai must **hard-refresh (Cmd+Shift+R)** to see
     JS/CSS changes. In the preview tool, programmatic navigation reloads stale JS too —
     re-render with `fetch('js/labs-app.js?x='+Date.now(),{cache:'no-store'}).then(t=>eval(t))`
     or inject a `?v=` cache-busted `<link>`/`<script>`.
   - **What Sai chose** (via AskUserQuestion): *rich featured cards that still click
     through* + *built-in HTML mini-mockups* (no screenshot uploads).
   - **Implemented** in `js/labs-app.js` — rewrote `flagCardHTML`, added `flagMock(labId)`
     (live in-card product mini-UI) and `artOf(p,kind)` helper — and `css/labs.css`
     (`.flag-mock`, shared `.fm-*` mini-UI classes, `.flag-ba` From→To, `.flag-goal`).
     Each flagship card now shows: a live mini-mockup (AI Collections = command center
     with 3 KPI tiles + ranked queue + dark AI next-best-action bar; LOS = Apply→KYC→
     Decision→Offer stepper + status rows + dark TAT bar — **shared `.fm-*` classes so
     both read as one product family**), kicker "Case study · Working prototype", name,
     tagline, From/To problem→outcome (from artifact `beforeafter`), "What it moves" =
     `metrics.business`, and artifact chips. Theme-safe (clay/noir/slate tokens).
   - **Verified** in preview: 2 cards, mocks/KPIs/steps/From-To/goal all render, zero
     console errors. (Screenshot only captures cleanly after hiding elements above the
     strip — the preview screenshot tool captures scroll≈0 regardless of programmatic
     scroll.)
   - **`js/labs-data.js` was NOT regenerated** — it's the data seed, not the renderer.
     Only `js/labs-app.js` + `css/labs.css` changed this session.

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

**STATUS (end of session 7):** EVERYTHING IS PUSHED & LIVE. Local `main` == `origin/main`
(latest commit `74675c6` "Labs: rich flagship case-study cards…"). Working tree clean.
The session-5/6 commit `f5b5d2b` and the session-7 rich-cards commit `74675c6` are both
on GitHub Pages. Sai should hard-refresh (Cmd+Shift+R) to see the rich cards.

**RESUME NEXT SESSION — START HERE (in priority order):**
1. ⬜ **Background consistency on `collections-cloud.html` (Sai's feedback, scope = BOTH).**
   Sai confirmed scope = **Both**: (a) the **5 Stage-6 prototype mock-up screens** in the
   device frame read as different "products" — screens 1 & 4 carry a big navy `.mk-ai`
   panel while 2/3/5 are light white-card-on-canvas; AND (b) the **per-stage section
   backgrounds** (navy hero → `--canvas` body → dark accent cards) should read as one
   system top to bottom. **Sai deferred the AI-accent design call to Claude:** keep the
   navy AI panel as the deliberate "AI = navy" signature (matches the live app + the rest
   of the page's navy accent cards), but contain/normalize it so each screen reads as the
   same light workspace with the AI panel as a consistent accent. Files:
   `case-studies/collections-cloud.html` — `.screen` / `.scr` / `.mk-*` / `.mk-ai` styles +
   `buildMocks()`. This was deprioritized when Sai redirected to the Labs-page restructure;
   it's the first thing to finish.
2. ⬜ **Clone the gamified experience to LOS** → `case-studies/lending-os.html` (same
   7-stage pattern, pull lab `los` / product `lending-os` from `labs.json`), add `los` to
   the `EXPERIENCE` map in `js/labs-app.js`. (Right now the LOS flagship card opens the
   in-SPA product view, not a bespoke interactive page like AI Collections.) Attach the
   LOS PRD the same way if one exists.
3. ⬜ Optional polish on the rich flagship cards (`flagMock()` in `js/labs-app.js`,
   `.fm-*` in `css/labs.css`): tune the mini-mockup content, or swap to real screenshots
   later. QA both cards at 375px (the `.flag-strip` stacks to 1-col <820px — confirm the
   mocks don't overflow).
4. ⬜ Older backlog still open (see `portfolio-cms-state.md` memory): delete orphaned
   `apps/contract-intelligence/` + `apps/loan-origination-system/`; MOBILE_ROADMAP
   Phase 1/2; Labs identity duplication (glyph shows "a", reads owner from labs.json meta).

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
