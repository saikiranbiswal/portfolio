# CLAUDE_HANDOFF.md — Session Delta

> Read this FIRST at the start of every session.
> When you need deeper context, read MASTER.resume — it's the permanent reference.
> This file only contains the delta: what changed last, what's next, sessions remaining.

---

## Current state (as of 2026-06-12, post-planning session)

| Key | Value |
|---|---|
| Latest commit | `58ce9cf` ("Finish: About proof screenshots + mobile QA + v10 cache bump") |
| Branch | `main`, clean, synced with origin |
| Live site | https://saikiranbiswal.github.io/portfolio/ |
| Server | `python3 -m http.server 8000` from repo root |

---

## What was done this session (delta)

1. **Admin v2 build plan finalized** — 6 phases (A–F), 7.5 sessions estimated, documented in MASTER.resume §7.
2. **MASTER.resume created** — permanent static reference for all sessions; covers repo anatomy, content model, design language, admin v1 state, admin v2 plan, Supabase plan, Jira structure, decisions made/open.
3. **CLAUDE_HANDOFF.md rewritten** — this file, now delta-only format.
4. **`js/supabase-client.js` created** — Supabase auth + draft persistence wrapper, ready to configure with project URL + anon key.

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
| **A** | Data Liberation — `site.json` + page rewrites | 1.5 | ⬜ Not started |
| **B** | Form Engine — `FormEngine` class + `schemas.js` | 1 | ⬜ Not started |
| **C** | Structure Manager — Pages tab + drag-drop | 1.5 | ⬜ Not started |
| **D** | Publisher v2 — delete ops + Files tab + orphan detector | 1.5 | ⬜ Not started |
| **E** | Preview & Diff — `?preview=1` + publish dialog | 1 | ⬜ Not started |
| **F** | Hardening + docs | 0.5 | ⬜ Not started |
| **Supabase** | Auth + draft persistence | 1 | ⬜ Config needed |
| **Total** | | **8.5** | |

**Supabase blocker:** Sai needs to create a Supabase project and paste `SUPABASE_URL` + `SUPABASE_ANON_KEY` into `js/supabase-client.js`. See MASTER.resume §8 for the SQL to run.

---

## Prioritized next actions

1. **Supabase setup** — Sai creates project at supabase.com, runs the SQL from MASTER.resume §8, pastes credentials into `js/supabase-client.js`. Then one session to wire it into admin.html.
2. **Admin v2 Phase A** — Start with `site.json` schema design (share with Sai before coding). ~1.5 sessions.
3. **LOS case study parity** — Verify `lending-os.html` is at feature parity with `collections-cloud.html` (7 stages, working prototype screen, PRD link). Quick check, not a full session.

---

## Resume prompt for next session

```
Read CLAUDE_HANDOFF.md first, then MASTER.resume only if you need deeper context.
Repo: /Users/saikiranbiswal/Downloads/portfolio
Latest commit: 58ce9cf, main clean.
Server: python3 -m http.server 8000

Current task: [PICK ONE]
  - Supabase wire-up: paste credentials into js/supabase-client.js, wire auth + drafts into admin.html
  - Admin v2 Phase A: design site.json schema first, present to Sai, then build
  - LOS case study parity check vs collections-cloud.html
```
