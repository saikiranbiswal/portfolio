# ChannelOps — DMS + SFA Commercial Execution Command Center

A single-file enterprise prototype connecting SFA field execution, distributor operations, cross-system transaction state, commercial analytics, failure recovery and role-based controls.

## Personas

- **Field Rep** — beat plan, pre-call context, check-in, order capture, offline queue and sync.
- **Distributor Operator** — onboarding, stock receipt, accepted orders, invoicing, claims and reconciliation.
- **Commercial Excellence** — read-only commercial diagnosis across adoption, primary/secondary movement, stock, latency and service.
- **Product / Admin** — integration health, scenario injection, recovery, API enrichment and control ownership.

## Product model

`SFA → Integration/API validation → DMS → ERP acknowledgement → BI / commercial visibility`

The deterministic transaction core owns price, schemes and transaction truth; AI/public APIs enrich decisions rather than becoming the financial system of record.

## QA

See `TEST_REPORT.md` and `USER_FLOWS_AND_RBAC.md`. The latest regression suite covers role filtering, handler-level authorization, core business rules, Chromium E2E and mobile behavior.

## Run

Open `index.html` in a modern browser.
