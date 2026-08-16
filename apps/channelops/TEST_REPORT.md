# ChannelOps Test Report

## Build validation — 2026-08-15 — RBAC upgrade

### Goal-driven acceptance criteria

1. Role switching must change visible navigation.
2. Deep-link/direct route access must be blocked when the role cannot view it.
3. Mutating actions must be denied at the handler level, not merely hidden in the UI.
4. Role changes from an inaccessible view must redirect to the role's allowed default view.
5. Product / Admin must retain full access.
6. User-flow and RBAC documentation must be visible inside the product.

### Automated results

- JavaScript parse check with Node: **PASS**
- Node RBAC/state harness (`test_rbac.js`): **10/10 PASS**
  - Field Rep view scope: PASS
  - Field Rep direct DMS mutation blocked: PASS
  - Field Rep SFA order creation allowed: PASS
  - Distributor Operator onboarding mutation allowed: PASS
  - Distributor Operator direct SFA order creation blocked: PASS
  - Commercial Excellence admin scenario mutation blocked: PASS
  - Product / Admin scenario execution allowed: PASS
  - Restricted-role route redirect: PASS
  - Rendered Field Rep navigation hides DMS/Admin views: PASS
  - Built-in business-rule + RBAC tests: PASS
- Chromium E2E using Playwright `set_content` harness: **PASS**
  - Field Rep navigation filtering: PASS
  - Unauthorized direct `receiveStock()` mutation: PASS
  - Field Rep order capture through UI: PASS
  - Distributor Operator DMS action through UI: PASS
  - Commercial Excellence scenario denial: PASS
  - Product / Admin full navigation and scenario execution: PASS
  - Static RBAC-disabled buttons re-enable correctly when switching to an authorised role: PASS
  - In-product RBAC matrix + four user-flow cards rendered: PASS
  - JavaScript page errors: **0**
- Mobile Chromium RBAC check (390×844): **PASS**
  - top-bar role switch visible: PASS
  - mobile navigation re-filters by role: PASS

### Existing deterministic business rules retained

- Stock-equation reconstruction: PASS
- Scheme threshold calculation: PASS
- Below-threshold no-discount behavior: PASS
- Invoice stock movement: PASS
- Canonical outlet master presence: PASS
- SFA → DMS → ERP → BI event-chain model: PASS

### Public API note

The prototype keeps live API adapters browser-side with deterministic fallbacks. External API availability is intentionally not part of RBAC acceptance testing.
