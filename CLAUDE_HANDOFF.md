# CLAUDE_HANDOFF.md — Session Delta

> Read this FIRST at the start of every session.
> When you need deeper context, read MASTER.resume — it's the permanent reference.
> This file only contains the delta: what changed last, what's next, sessions remaining.

---

## Current state (as of 2026-06-12, post-Supabase session)

| Key | Value |
|---|---|
| Latest commit | `7bcaedd` ("Supabase: wire credentials + Supabase Auth into admin login") |
| Branch | `main`, clean, synced with origin |
| Live site | https://saikiranbiswal.github.io/portfolio/ |
| Server | `python3 -m http.server 8000` from repo root |

---

## What was done this session (delta)

1. **Admin v2 build plan finalized** — 6 phases (A–F), 7.5 sessions estimated, documented in MASTER.resume §7.
2. **MASTER.resume created** — permanent static reference for all sessions.
3. **CLAUDE_HANDOFF.md rewritten** — this file, now delta-only format.
4. **`js/supabase-client.js` created** — `SB.*` API: `signIn`, `signOut`, `saveContent`, `loadContent`, `saveDraft`, `loadDraft`, `loadAllDrafts`, `deleteDraft`, `uploadImage`.
5. **`supabase/schema.sql` created** — `cms_content` table + `portfolio-assets` storage bucket.
6. **Supabase Auth wired into admin.html** — email + password login form; `SB.signIn()` called on unlock; `SB.signOut()` on lock.
7. **Supabase Auth confirmed working** — Sai tested and verified login succeeds.

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
| **Supabase** | Auth + draft persistence | 1 | 🔄 Auth ✅ — drafts next |
| **A** | Data Liberation — `site.json` + page rewrites | 1.5 | ⬜ Not started |
| **B** | Form Engine — `FormEngine` class + `schemas.js` | 1 | ⬜ Not started |
| **C** | Structure Manager — Pages tab + drag-drop | 1.5 | ⬜ Not started |
| **D** | Publisher v2 — delete ops + Files tab + orphan detector | 1.5 | ⬜ Not started |
| **E** | Preview & Diff — `?preview=1` + publish dialog | 1 | ⬜ Not started |
| **F** | Hardening + docs | 0.5 | ⬜ Not started |
| **Total** | | **8** | (~0.5 saved — Supabase auth done) |

---

## Prioritized next actions

1. **Supabase drafts** — Wire `SB.saveDraft` / `SB.loadDraft` / `SB.loadAllDrafts` into `admin.html` to replace `localStorage` draft persistence. ~0.5 sessions. Also remove the legacy `portfolio123` fallback from `login()` once drafts are confirmed working cross-device.
2. **Admin v2 Phase A** — Start with `site.json` schema design (share with Sai before coding). ~1.5 sessions.
3. **LOS case study parity** — Verify `lending-os.html` is at feature parity with `collections-cloud.html`. Quick check.

---

## Resume prompt for next session

```
Read CLAUDE_HANDOFF.md first, then MASTER.resume only if you need deeper context.
Repo: /Users/saikiranbiswal/Downloads/portfolio
Latest commit: 7bcaedd, main clean.
Server: python3 -m http.server 8000

Supabase is live: project qasgswyjmnzhggqwuvqc, credentials in js/supabase-client.js,
SB.* API available in browser, Sai's login confirmed working.

Current task: [PICK ONE]
  - Supabase drafts: replace localStorage draft persistence in admin.html with SB.saveDraft/loadDraft
  - Admin v2 Phase A: design site.json schema first, present to Sai, then build
  - LOS case study parity check vs collections-cloud.html
```
