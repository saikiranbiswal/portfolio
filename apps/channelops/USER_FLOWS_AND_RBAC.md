# ChannelOps — User Flows & RBAC

## RBAC model

The role picker is a **demo impersonation control**, not a production authentication mechanism. In a production deployment, the current role would be supplied by SSO/identity claims. The prototype now enforces authorization in two places:

1. **View-level access** — users only see navigation entries allowed for their role, and direct navigation to an unauthorised route is blocked.
2. **Action-level access** — every mutating handler re-checks permission before changing business state. Hiding a button is therefore not the security boundary.

| Role | Visible views | Write actions |
|---|---|---|
| Field Rep | Overview, SFA Field Day, How It Works | Check in, capture order, offline/online mode, sync queue, verify outlet location |
| Distributor Operator | Overview, DMS Distributor, Control Tower, How It Works | Advance onboarding, receive stock, invoice, approve claim, reconcile inventory |
| Commercial Excellence | Overview, Control Tower, Commercial Excellence, How It Works | Read-only operational analysis |
| Product / Admin | All views | Full demo administration, API enrichments, scenarios, integration recovery, reset |

## Flow 1 — Field Rep

**Goal:** execute the rep's day with minimum friction while preserving reliable transaction identity.

**Journey:** Open beat → review pre-call context → check in → capture order → if offline, queue locally → reconnect → sync → receive downstream acknowledgement.

**System path:** SFA → Integration/API validation → DMS accepted state → ERP acknowledgement → BI demand visibility.

**Success outcome:** trusted field activity and acknowledged demand without duplicate submission.

## Flow 2 — Distributor Operator

**Goal:** operate the downstream distributor lifecycle and keep inventory/secondary-sales state reconcilable.

**Journey:** Complete onboarding → receive stock → review accepted orders → invoice → handle claims → run reconciliation.

**System path:** DMS operational state ↔ ERP acknowledgements → BI secondary-sales/inventory visibility.

**Success outcome:** accurate secondary sales, inventory movements, claims and auditable commercial rules.

## Flow 3 — Commercial Excellence

**Goal:** diagnose commercial execution rather than merely consume a KPI dashboard.

**Journey:** Review baseline → inspect adoption funnel → compare primary vs secondary → inspect inventory/latency → segment root cause → drive field/commercial action.

**Primary decisions:** Is performance constrained by coverage, field productivity, stock availability, stale data, adoption, or service reliability?

**Success outcome:** decision-grade visibility that separates user, process, data, stock and service constraints.

## Flow 4 — Product / Admin

**Goal:** operate the product, integrations, failure controls and demo test harness.

**Journey:** Review system health → trace event chain → run a controlled failure scenario → diagnose → retry/apply fix → verify guardrail recovery.

**Admin-only actions:** inject integration failures, resolve/retry integration exceptions, run/clear scenarios, run public API enrichments and reset the shared demo state.

**Success outcome:** observable and recoverable cross-system product operations with explicit control ownership.

## RBAC verification scenarios

1. As **Field Rep**, direct invocation of `receiveStock()` must not change inventory.
2. As **Distributor Operator**, direct invocation of `createOrder()` must not create an SFA order.
3. As **Commercial Excellence**, `runScenario()` must be denied and leave scenario state unchanged.
4. As **Product / Admin**, all eight views must be available and failure scenarios must execute.
5. Switching from an admin-only view to a restricted role must automatically redirect to that role's default permitted view.
