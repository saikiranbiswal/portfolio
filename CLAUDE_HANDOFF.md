# CLAUDE_HANDOFF.md — Session Delta

> Read this FIRST at the start of every session.
> When you need deeper context, read MASTER.resume — it's the permanent reference.
> This file only contains the delta: what changed last, what's next, sessions remaining.

---

## Current state (as of 2026-06-12, post-Phase-C session)

| Key | Value |
|---|---|
| Latest commit | `4e130af` ("Phase C: Structure Manager — drag-sort nav + pages inventory tab") |
| Branch | `main`, clean, NOT yet pushed |
| Live site | https://saikiranbiswal.github.io/portfolio/ |
| Server | `python3 -m http.server 8000` from repo root |

---

## What was done this session (delta)

1. **Phase B: FormEngine** (`6c80ed4`) — `js/schemas.js` created with all 6 tab schemas (site, work, labs, about, contact, config). Labs was the only tab still using bespoke render functions (`prodMini`, `labBlock`); these ~70 lines deleted and replaced by schema + 3 new FormEngine helpers: `feLabList()`, `feProdList()`, and 3 new field types (`nested-list`, `feat-list`, `move-lab`). All 6 `render*()` functions are now 1-liners delegating to `feRender(key)`.
2. **Phase C: Structure Manager** (`4e130af`) — New "Structure" tab in admin with two sections: (a) **Navigation** — drag-to-reorder nav items via HTML5 DnD (event delegation on #panel, coexists with image DnD); (b) **Pages inventory** — shows `site.json pages[]` with visible toggle, drag reorder, and `+ New page` inline form. `migrateModels()` auto-initialises `pages[]` for existing drafts that predate Phase C. DnD fires `splice + saveDraft + renderTab` on drop.

---

## Design completion status

| Milestone | Status |
|---|---|
| M1–M6 "The Product Memo" design language | ✅ Done, live (Session 8) |
| M2 inspired-tier (8 items) | ✅ Done, live (Session 9) |
| About proof screenshots (real images) | ✅ Done, live (commit 58ce9cf) |
| Mobile QA pass | ✅ Done (commit 58ce9cf) |
| LOS case study (`lending-os.html`) | ✅ Exists, needs parity check with collections-cloud.html |

---

## Admin v2 — what's next and sessions remaining

| Phase | What | Sessions | Status |
|---|---|---|---|
| **Supabase** | Auth + draft persistence + Storage images | 1 | ✅ Done (`96f0f1b`) |
| **A** | Data Liberation — `site.json` + shared renderers | 1.5 | ✅ Done (`679e73a`) |
| **B** | Form Engine — `FormEngine` class + `schemas.js` | 1 | ✅ Done (`6c80ed4`) |
| **C** | Structure Manager — Pages tab + drag-drop | 1.5 | ✅ Done (`4e130af`) |
| **D** | Publisher v2 — delete ops + Files tab + orphan detector | 1.5 | ⬜ Not started |
| **E** | Preview & Diff — `?preview=1` + publish dialog | 1 | ⬜ Not started |
| **F** | Hardening + docs | 0.5 | ⬜ Not started |
| **Total remaining** | | **~5.5** | |

---

## Prioritized next actions

1. **Phase D — Publisher v2** — Delete ops, atomic folder deletes, cascade dialogs, orphan detector, Files tab.
2. **LOS case study parity** — Quick check: does `lending-os.html` match `collections-cloud.html` feature for feature (7 stages, interactive elements, figcap, PRD link)?
3. **site-config.js seed sync** — After any admin Config-tab publish, the embedded SEED in `js/site-config.js` goes stale. Two options: (a) admin also updates the SEED in site-config.js on publish (safe, file-based), or (b) accept the async fetch always wins on HTTP (SEED is only for file://). Decision deferred — document in MASTER.resume.

---

## Resume prompt for next session

```
Read CLAUDE_HANDOFF.md first, then MASTER.resume only if you need deeper context.
Repo: /Users/saikiranbiswal/Downloads/portfolio
Latest commit: 4e130af, main clean, NOT pushed (push before Phase D).
Server: python3 -m http.server 8000

Phase B (FormEngine) + Phase C (Structure Manager) DONE.
Next: Phase D (Publisher v2) or LOS case study parity check — decide with Sai.
```
