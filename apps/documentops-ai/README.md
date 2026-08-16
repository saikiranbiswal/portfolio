# DocumentOps AI V2

A working product prototype for turning business documents into explainable operational decisions and downstream actions.

## Core workflow

`Upload / Bulk Upload → Extract → Validate → Decide → Human Control → Execute → Audit`

## What the prototype demonstrates

- Single and multi-file bulk intake.
- Scenario-specific extraction and confidence.
- Deterministic validation controls with PASS / WARN / FAIL outcomes.
- Explainable business decisions such as straight-through eligibility, review, or exception.
- Recommended actions with owners and destinations.
- Human controls to approve, send for review, or reject.
- Execution results and per-document audit history.
- Workflow board for generated work items.

## Prototype boundary

The current demo is intentionally deterministic and uses simulated adapters rather than production OCR, ERP, LLM, or ticketing credentials. The product architecture is designed so those adapters can be replaced without changing the review-and-action workflow.

## Run

Open `index.html` directly in a modern browser.
