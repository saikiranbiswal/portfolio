# Mobile-Friendly Roadmap — Portfolio Apps

**Goal:** make every app in `apps/` work and *feel* good on a phone, the way the
portfolio shell already does. Today the shell (Work / Labs / About / Contact) is
responsive, but the embedded apps are **desktop-first** — built for a mouse and a
wide canvas. The one exception is **NeuralPath**, which is already mobile-native.

This is scoped as a **one-shot activity**: one focused pass that lands a shared
mobile baseline plus per-app fixes, verified at 375 px.

---

## Why the apps look "web-native, not mobile-native" today

A quick audit of `apps/*/index.html` found the usual desktop-first signals:

| Signal | Why it breaks on mobile |
| --- | --- |
| `<table>` heavy screens (lending-cloud ×9, excel tools, dashboard-studio) | Wide tables overflow the viewport; horizontal scroll hides columns |
| Fixed pixel widths (`640px`, `720px`, `820px`, `980px`…) | Containers wider than the screen → zoom-out / side-scroll |
| Multi-column grids (`1fr 1fr …`, ~12 instances) | Columns get crushed to unreadable widths |
| Persistent sidebars (collections-cloud, dashboard-studio, lending-cloud) | A fixed side nav eats half a phone screen |
| Hover-only affordances (~68 `:hover` / `onMouseOver`) | No hover on touch → actions become undiscoverable |
| Almost no `@media` queries (7 total across 9 apps) | No responsive breakpoints defined at all |

The fix is the same family of moves everywhere: **stack instead of columns,
turn tables into cards, replace the sidebar with a top bar / drawer, give every
control a 44 px touch target, and add a real breakpoint.**

---

## Shared foundation (do this first — unblocks every app)

1. **Viewport meta** — confirm every `apps/*/index.html` has
   `<meta name="viewport" content="width=device-width, initial-scale=1">`.
   *(All already do; NeuralPath also locks zoom with `maximum-scale=1` — fine for
   a game, but do **not** copy that to the data apps; users need to pinch-zoom tables.)*
2. **A shared `mobile.css`** dropped into each app (or a `<style>` block) with one
   `@media (max-width: 640px)` baseline:
   - `*, body { max-width: 100%; }` and `img, table, pre { max-width: 100%; }`
   - collapse the primary grid to a single column
   - min tap target: `button, a, input, select { min-height: 44px; }`
   - base font ≥ 16px on inputs (prevents iOS auto-zoom on focus)
3. **Table → card pattern** — a reusable rule: below 640px, `table, thead, tbody,
   tr, td { display: block; }`, hide `thead`, and render each row as a labelled
   card using `td::before { content: attr(data-label); }`. (Requires adding
   `data-label` to cells — small, mechanical edit per table.)
4. **Sidebar → top bar / drawer** — convert fixed side navs to a sticky top bar
   with a hamburger drawer under 640px.
5. **Touch alternatives for hover** — anything revealed on `:hover` also shows on
   `:focus`/tap, or moves into an always-visible affordance.

---

## Per-app plan (priority order)

Priority weighs **portfolio prominence × current breakage × effort**.
Flagship and high-traffic apps first.

| # | App | State today | Effort | Key work |
| --- | --- | --- | --- | --- |
| 1 | **collections-cloud** *(flagship)* | 1.6 MB React app, sidebar, dense | **L** | Sidebar→drawer; stack the dashboard cards; make charts fluid (`maintainAspectRatio:false` + container width); 44px controls |
| 2 | **lending-cloud** | 9 tables (LOS/LMS), sidebars | **L** | Tables→cards (biggest lift); collapse multi-col forms; drawer nav; sticky action bar |
| 3 | **dashboard-studio** | Drag-and-drop builder, 27 sidebar refs | **L** | Drag-drop needs touch (Pointer Events / long-press); panel→bottom-sheet; preview stacks under controls |
| 4 | **synthesis** | Framework builder, *already 3 `@media`* | **M** | Finish the responsive pass it started; stack import→configure→export steps |
| 5 | **excel-transformer** | 1 table, file drop | **M** | Table→cards; ensure file picker (not just drag) on mobile; fluid controls |
| 6 | **excel-merger** | 2 tables, multi-file | **M** | Same as transformer; column-strategy UI stacks vertically |
| 7 | **contract-intelligence** | Small (12 KB) | **S** | Single-column layout; scale type; verify upload affordance |
| 8 | **loan-origination-system** | Small (12 KB) | **S** | Single-column; touch targets |
| 9 | **neuralpath** | ✅ already mobile-native | — | Spot-check only |

**Effort key:** S ≈ <½ day · M ≈ ~1 day · L ≈ 1–2 days each.

---

## Suggested phasing (the "one shot")

- **Phase 0 — Foundation (½ day):** ship the shared `mobile.css` + table/card and
  sidebar/drawer patterns; wire them into all apps. Many small apps (7, 8) are
  basically done after this.
- **Phase 1 — Quick wins (1 day):** contract-intelligence, loan-origination,
  excel-transformer, excel-merger, synthesis.
- **Phase 2 — Heavy hitters (2–3 days):** dashboard-studio (touch drag-drop),
  lending-cloud (tables), collections-cloud (flagship polish).
- **Phase 3 — QA pass (½ day):** every app verified at 375 × 812 and 768 × 1024.

Total ≈ **4–5 focused days**, front-loaded so the portfolio reads as mobile-ready
after Phase 1.

---

## Definition of done (per app, checked at 375 px)

- [ ] No horizontal scroll; nothing clipped past the right edge
- [ ] No text smaller than 14px; inputs ≥ 16px (no iOS zoom-on-focus)
- [ ] Every interactive control ≥ 44 × 44 px and reachable by thumb
- [ ] Tables are readable (card layout or intentional, contained scroll)
- [ ] Primary nav usable without a mouse (drawer / top bar, not a fixed sidebar)
- [ ] Charts/canvas resize to fit width
- [ ] No action depends on hover alone
- [ ] Verified in the preview at **375×812** *and* **768×1024**

---

## Notes / open questions for the owner

- **Native vs. responsive web:** "mobile native" here means *responsive web* — the
  apps stay HTML so they keep loading inside the portfolio modal/iframe and on
  GitHub Pages. True native (App Store) would be a separate, much larger track; flag
  if that's actually the intent.
- **Bundled apps:** collections-cloud is a single large pre-built bundle. If the
  original source isn't available, mobile fixes there are limited to an appended
  responsive stylesheet rather than component-level refactors — worth confirming
  what source you still have for each app before Phase 2.
