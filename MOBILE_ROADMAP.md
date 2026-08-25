# Mobile-Friendly Roadmap — Portfolio Apps

**Goal:** every app in `apps/` should work and *feel* good on a phone, the way the
portfolio shell already does.

**Status: Phase 0 complete across all 14 apps (2026-08-26).**
Enforced by `scripts/check_mobile_baseline.py`, which fails if any app is unwired.

---

## What Phase 0 is

One shared stylesheet, `apps/_shared/mobile.css`, linked into every app after its own
styles so it wins on small screens. Safe, universal rules only:

- no horizontal blow-out (`overflow-x: hidden` on the phone breakpoint)
- wide tables become self-contained horizontal scrollers instead of pushing the page out
- 44px minimum touch targets on buttons and form controls
- 16px inputs, so iOS stops auto-zooming on focus
- long code and tokens wrap instead of forcing the viewport wider
- a visible focus ring, and `prefers-reduced-motion` respected

Plus `apps/_shared/return-bar.js`, which renders a "← Portfolio" pill on full-page
prototype visits, skipping iframes and installed PWAs.

---

## The two wiring styles, and why there are two

| Style | Used by | How |
| --- | --- | --- |
| `head-link` | atlas, collections-cloud, dashboard-studio, dep, excel-merger, excel-transformer, lending-cloud, synthesis | A plain `<link>` immediately before `</head>` |
| `post-write` | channelops, documentops-ai, house-quotation-copilot, papercraft, roamradio | Re-attached **after** `document.close()` |

**The trap that made this necessary.** The `post-write` apps ship as a gzipped, base64
payload. They fetch it, decompress it with `DecompressionStream`, then call
`document.open(); document.write(html); document.close()`. That replaces the entire
document, **including `<head>`**, so a `<link>` placed in the loader's head is silently
discarded. It fails quietly: the page still renders, just without the baseline.

Anything new that uses the payload loader must use the `post-write` style. The guard
script checks for this specifically rather than just grepping for the filename.

### History of this trap
Phase 0 originally excluded `collections-cloud` for exactly this reason. That app has
since been rebuilt as plain `index.html` + `styles.css` + `app.js`, so it now takes a
normal head link. The constraint did not go away, it moved to the five payload apps.

---

## Deliberate exclusions

| App | Why |
| --- | --- |
| `neuralpath` | Already mobile-native, and intentionally locks zoom with `maximum-scale=1`. Do **not** copy that meta to the data apps; users need to pinch-zoom tables. |

---

## Phase 1 — per-app work, not yet started

Phase 0 stops apps from being *broken* on a phone. It does not make them *native*. The
per-app work below is deliberately out of scope until someone picks it up, because each
item touches app internals and carries real regression risk.

Priority weighs portfolio prominence x current awkwardness x effort.

| # | App | Key work | Effort |
| --- | --- | --- | --- |
| 1 | **collections-cloud** *(flagship)* | Sidebar to drawer; stack dashboard cards; fluid charts (`maintainAspectRatio:false`) | L |
| 2 | **lending-cloud** | 9 LOS/LMS tables to cards; collapse multi-column forms; sticky action bar | L |
| 3 | **dashboard-studio** | Drag-and-drop needs Pointer Events / long-press for touch; panel to bottom-sheet | L |
| 4 | **dep** | Its `.data-table` scrolls now, but reads better as cards under 640px | M |
| 5 | **synthesis** | Finish the responsive pass it started; stack import to configure to export | M |
| 6 | **excel-merger / excel-transformer** | Tables to cards; confirm the file picker works on touch, not just drag | M |

The reusable table-to-card pattern: below 640px set `table, thead, tbody, tr, td` to
`display: block`, hide `thead`, and render each row as a labelled card using
`td::before { content: attr(data-label); }`. That needs a `data-label` on each cell,
which is a small mechanical edit per table.

---

## Where Phase 0 does not fully land (measured 2026-08-26)

The baseline is a bare-element stylesheet, so a more specific app rule beats it. Two
cases remain, both cosmetic rather than broken, and both are per-app Phase 1 work.
Neither is worth forcing with `!important` in a stylesheet 14 apps share.

| App | What still misses | Why |
| --- | --- | --- |
| `collections-cloud` | 17 of 94 buttons are 42px, not 44px | `.nav-item` sets `min-height:42px`, more specific than the bare `button` rule |
| `roamradio` | one `<select>` stays at 12px | An app rule with higher specificity wins, so iOS may still zoom on that one control |

Everything else measured clean at 375px: no page overflow and no undersized tap targets
across all 14 apps.

---

## Known broken, unrelated to mobile

`house-quotation-copilot` does not load at all. Its payload is missing chunks `03` and
`04`, which were never committed, so the gzip stream is truncated and can never
decompress. It has been broken since it was published on 2026-08-17. Fixing it needs
the original v4.2 source to rebuild the payload; no complete copy exists in this repo
or in the vault.
