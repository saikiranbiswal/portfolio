# Persona and RBAC Access Model

## Access matrix

| Capability | Customer | Operations | Bank PM | Tenant Admin | Platform PM |
|---|---:|---:|---:|---:|---:|
| Personal accounts and transfers | Own only | No | No | No | No |
| Customer 360 | No | Tenant customers | No | No | No |
| Journey instances | No | Operational detail | Aggregate/masked | No | Cross-tenant/masked |
| PM Command Centre | No | No | Tenant | Tenant | Cross-tenant |
| Incidents | No | Tenant | Tenant | Tenant | Cross-tenant |
| Tenant configuration | No | No | No | Own tenant | Cross-tenant |
| Architecture and canonical model | No | No | No | No | Yes |
| API and event observatory | No | No | No | No | Yes |

## Enforcement demonstrated

1. **Navigation:** only authorised workspaces are rendered in the sidebar.
2. **Routes:** a user cannot open a workspace by creating or invoking a hidden route.
3. **Actions:** buttons are hidden and the action dispatcher independently denies unauthorised execution.
4. **Data:** customers see self-only data; operations users are tenant-scoped; PM identities are masked; only platform PMs can switch tenants.

## Production hardening

A production implementation should move these controls beyond the browser:

- Identity provider claims for persona, tenant and customer identity
- API gateway policy checks for route and action entitlements
- Backend authorisation on every command and query
- Database row-level security by tenant ID and customer ID
- Field-level masking for PII and sensitive financial attributes
- Audit logging for viewed, changed, approved, exported and retried actions
- Segregation of duties for configuration, approval and production release
- Periodic entitlement review and emergency-access workflows
