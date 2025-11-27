# Production Readiness & Code Review Checklist

Purpose
- Provide a single, actionable checklist and evaluation guide for moving the MountainLover platform from skeleton to production-grade. The document covers architecture, design patterns, coding standards, dependency hygiene, maintainability, performance, scalability, observability, security (application, financial, PII), data validation and normalization, and an automated test framework target (95% coverage mandatory).

How to use
- Run this checklist during design reviews, pull-request reviews, sprint planning, and release readiness gates. Treat items as either: `Done`, `Partial` (needs follow-up), or `Missing`.

**Summary Acceptance Criteria**
- All `Critical` items must be `Done` before production deployment.
- Automated tests must reach at least **95% line coverage** for backend and frontend combined (exceptions allowed only by documented risk assessment).
- CI must run linting, unit tests, integration tests, and coverage report on every push/PR.
- A staging deployment must exist with production-like data (anonymized) and smoke tests passing.

## Safe Build Gate
The `scripts/check-safe-build.js` script runs automatically before any `npm run build` in `frontend/` or `backend/`. It parses this table and fails the build when any status is not `Done`. Update the `Evidence` column with links to commits, docs, or dashboards when you close a gap.

| Control | Status | Evidence |
| --- | --- | --- |
| Best coding standards & lint enforcement | Done | Root `.eslintrc.cjs`, `.prettierrc.json`, `.editorconfig`, package-level lint/format scripts, and CI lint stages (`.github/workflows/ci.yml`). |
| Maintainability & readability guardrails | Done | `docs/architecture.md` defines layering/bounded contexts and `.github/PULL_REQUEST_TEMPLATE.md` enforces reviewer checklist; controllers now route to services. |
| Design patterns & layering enforcement | Done | `backend/src/modules/events/*` implements controller → service → repository split with DTOs and sanitization. |
| Data validations & sanitization coverage | Done | Zod schemas (`backend/src/modules/events/events.schema.ts`, `backend/src/schema.ts`) plus `validateRequest` middleware sanitize inputs before persistence. |
| Normalized DB schema & migrations | Done | Prisma schema + migrations under `backend/prisma/` capture normalized Postgres tables, indexes, FK constraints; `npm run db:validate` runs in CI. |
| Safe build automation rule | Done | `scripts/check-safe-build.js` blocks builds until all controls read `Done`. |

## 1) Architecture & Design
- **Bounded Contexts:** Separate core domains (Users, Events, Payments, Admin, Notifications). Ensure clear API boundaries and data ownership.
- **Layered Architecture:** Use presentation → application → domain → infrastructure separation. Keep business logic out of controllers/routes.
- **Stateless Services:** Design services to be horizontally scalable; session state in Redis (or signed JWTs) only.
- **API Contracts:** Provide OpenAPI (Swagger) spec for all public/private APIs; publish versioned specs.
- **Design Patterns:** Use Repository/Service patterns for data access, DTOs for external contracts, and factories where object creation logic grows.
- **Modularity:** Keep backend packages small and cohesive (e.g., `users`, `events`, `registrations`, `payments`). Frontend components should be reusable and domain-scoped.
- **Acceptance Criteria:** Clear component boundaries, OpenAPI published, and at least one integration test across each bounded context.

## 2) Code Quality & Best Practices
- **Style & Linting:** Enforce ESLint/TSLint with a shared config; Prettier for formatting. Block merges if linting fails.
- **Type Safety:** Prefer strict TypeScript config (`strict: true`). Avoid `any` except in well-justified migration shims.
- **Error Handling:** Centralized error types and handlers; don't leak internal error messages to clients.
- **Secrets in Code:** No secrets in repo; fail PR checks when env files or secrets are committed.
- **Static Analysis:** Run static scanners (e.g., SonarCloud, Snyk) on every PR to detect code smells and vulnerabilities.
- **Acceptance Criteria:** Lint passes, no `any` outside clearly documented areas, PRs use templates with checklist items.

## 3) Dependency Management & Versioning
- **Pin Major Versions:** Use caret-aware but test major upgrades in a dedicated branch. Maintain `dependabot` or similar for automated PRs.
- **Latest Stable Releases:** Regularly review and upgrade dependencies at least monthly for critical/security fixes.
- **Vulnerability Scanning:** Enable automated vulnerability alerts and block high/critical severity dependencies until resolved.
- **Acceptance Criteria:** `package.json` audited, no critical vulnerabilities, dependency upgrade backlog < 30 days for critical issues.

## 4) Security (Application, Financial, PII)
- **Authentication & Authorization:** Implement robust auth (OTP via Firebase/Twilio or token-based), RBAC for admin/instructor roles, least-privilege principle.
- **Encryption:** TLS everywhere (ingress + internal where feasible). Encrypt PII fields at rest (column-level) using DB-native or envelope encryption with KMS.
- **Payments:** Use PCI-compliant payment providers (Stripe/Razorpay) and never store card data; use webhooks with signature verification.
- **Secrets Management:** Use a secrets manager (AWS Secrets Manager / GCP Secret Manager / Azure Key Vault). Rotate keys periodically.
- **Input Validation:** Strong server-side validation (schema validation with Zod/Joi) for all API inputs and storage.
- **Audit Trails:** Immutable audit logs for payments, refunds, role changes, and PII access with user & timestamp.
- **Data Minimization & Retention:** Only collect necessary PII fields; document retention policies and deletion workflows.
- **Pen Tests & Scans:** Schedule external pen tests and static dependency scanning before production release.
- **Acceptance Criteria:** Auth flows implemented, PII encrypted at rest, webhook verification for payments, audit logs enabled.

## 5) Data Modeling & Persistence
- **Relational Schema:** Use normalized Postgres schema for Users, Events, Registrations, Payments, AuditLogs. Apply FK constraints and transactions where required.
- **Migrations:** Use a migrations tool (Prisma Migrate, Knex, Flyway, or TypeORM migrations). Migrations must be versioned and run in CI.
- **Indexes:** Create indexes for query patterns (user phone/email, event date, registration status). Avoid excessive indexes that slow writes.
- **RLS & Encryption:** Consider Row-Level Security for multi-tenant or role-isolated data; encrypt sensitive columns.
- **Data Validation:** Enforce domain invariants at DB layer (CHECK constraints, UNIQUE constraints) where appropriate.
- **Acceptance Criteria:** Migration scripts present, CI runs migrations against ephemeral DB for integration tests, schema reviewed for normalization and indexing.

## 6) Data Validation & Input Sanitization
- **Strong Schemas:** Use Zod/TypeBox/Joi for request and response validation throughout the stack.
- **Sanitization:** Escape/sanitize content used in templates, storage, or logging to avoid injection attacks.
- **Canonicalization:** Normalize phone/email formats at ingestion; store canonical forms and raw forms where necessary.
- **Acceptance Criteria:** All endpoints have request schemas and tests for invalid inputs.

## 7) Automated Testing Strategy (Mandatory 95% coverage)
- **Coverage Target:** 95% line coverage across the repository. Coverage must be reported separately for `backend` and `frontend` and combined in CI.
- **Test Types:** Unit tests (fast, isolated), Integration tests (DB, cache, external API stubs), End-to-end tests (critical user flows on staging/PWA). Mock external providers (Twilio, SendGrid, Stripe) in unit tests and use sandbox in integration tests.
- **Quality Gates:** Block merges if coverage drops or tests fail. Run full test-suite nightly and on PRs.
- **Test Data:** Use factories and fixtures to create representative datasets; include edge-cases and property-based tests where beneficial.
- **Flaky Tests:** Track flaky tests and quarantine until fixed. Flakes should not mask real regressions.
- **Acceptance Criteria:** CI passes, coverage >= 95%, integration tests for events/registration/auth flows present.

## 8) CI/CD & Release Management
- **Pipelines:** Require PR checks: lint → unit tests → build → integration tests → security scans → coverage report. Merge only on green.
- **Staging:** Auto-deploy to a staging environment on merge to `main` or on tag. Smoke tests run post-deploy.
- **Production Releases:** Use tagged releases and automated changelogs. Prefer blue/green or canary deployments for production.
- **Rollback Strategy:** Automatic rollback on health check failures and quick rollback playbooks.
- **Acceptance Criteria:** CI pipeline defined in repo (`.github/workflows` or equivalent), staging auto-deploys and runs smoke tests.

## 9) Observability & Monitoring
- **Logs:** Structured logs (JSON) with correlation IDs; redact PII from logs by default with allow-listing for debug when authorized.
- **Metrics:** Instrument business metrics and technical metrics (request latencies, error rates, DB connections, queue depth). Export Prometheus metrics.
- **Tracing:** Add distributed tracing (OpenTelemetry) across request boundaries to trace registration → notification flows.
- **Dashboards & Alerts:** Build key dashboards (health, errors, user signups, registration rate). Define alert thresholds and on-call escalation.
- **Acceptance Criteria:** Prometheus + Grafana or cloud equivalent configured for staging, alerting rules, and at least one playbook for incidents.

## 10) Performance & Scalability
- **Load Testing:** Perform load tests (k6, JMeter) for expected peak and 2x peak. Document limits and bottlenecks.
- **Caching:** Use Redis for session/cache and page fragments where appropriate. Cache invalidation strategy must be explicit.
- **DB Scaling:** Plan for read replicas, partitioning, and connection pooling. Use EXPLAIN for slow queries; set slow-query alert.
- **Autoscaling:** Container orchestration settings (HPA) and resource requests/limits defined in manifests.
- **Acceptance Criteria:** Load test report in `docs/`, caching strategy documented, autoscaling validated in staging.

## 11) Operational Readiness
- **Runbooks:** Playbooks for deploy, rollback, on-call triage, and data recovery. Keep runbooks in `docs/runbooks/`.
- **Backups & DR:** Regular backups (daily), automated restore drills, and RTO/RPO documented.
- **SLOs/SLIs:** Define service-level objectives for availability and latency; track them and report monthly.
- **Acceptance Criteria:** Runbooks present, backups tested, SLOs agreed and monitored.

## 12) Privacy, Compliance & Legal
- **Data Protection:** Map PII data flows and document processors. Implement data subject request workflows for deletion/exports.
- **Consent & Policies:** Capture user consent for emails, SMS, and geolocation. Provide privacy policy and data retention durations.
- **Third-party Compliance:** Ensure payment and email providers meet compliance requirements (PCI, GDPR, local laws).
- **Acceptance Criteria:** Privacy policy present, DSR workflows tested, third-party contracts validated.

## 13) Financial Controls & Payments
- **Ledger:** Implement an immutable transaction ledger for payments, refunds, adjustments, and reconciliation records.
- **Webhooks:** Signed webhook verification and idempotency handling for payment events.
- **Reconciliation:** Daily reconciliation tasks and exportable reports for finance teams.
- **Acceptance Criteria:** Sandbox payment test passing, ledger exists, webhook signatures verified, idempotency keys in place.

## 14) Developer UX & Onboarding
- **README & Contributing:** High-quality `README.md` with local dev setup steps, test/run instructions, and architecture overview.
- **Onboarding Guide:** Quickstart for new contributors and dev environment scripts (Docker Compose or dev containers).
- **Code Owners:** `CODEOWNERS` and PR templates to route reviews to appropriate teams.
- **Acceptance Criteria:** New developer can run app + tests locally within documented steps.

## 15) Checklist: Critical Items (Blocker for Prod)
- **Auth & RBAC implemented and tested.**
- **95% automated test coverage with CI enforcement.**
- **PII encrypted at rest and redacted in logs.**
- **Payments integrated with webhook verification and ledger.**
- **Staging deployment with smoke tests.**
- **Observability: metrics + alerts configured.**
- **Backups & DR tested.**

## 16) Recommended Tools & Integrations
- **Backend:** Node + TypeScript, Express/Nest, Prisma/TypeORM, Zod for validation.
- **Frontend:** React + Vite, React Testing Library, Vitest, MSW for mocks.
- **DB:** Postgres, pg-bouncer for pooling.
- **Cache:** Redis.
- **CI/CD:** GitHub Actions or GitLab CI, Dependabot, Snyk.
- **Observability:** Prometheus + Grafana, OpenTelemetry, Loki or cloud logs.
- **Secrets:** AWS Secrets Manager / Vault.
- **Payments:** Stripe (recommended) or Razorpay.

## 17) Suggested Roadmap & Prioritization
1. Implement authentication, RBAC, and basic user signup (high).
2. Add Postgres schema and migrations; persist events & registrations (high).
3. Add automated tests for user flows; raise coverage to 80% (then 95%) (high).
4. Integrate payment sandbox with webhook handling and ledger (medium).
5. Implement observability (metrics + alerts) and staging deploy (medium).
6. Harden security for PII, secrets, and backups (high).

## 18) Templates & Acceptance Evidence
- Include templates for PR checklist, runbook, incident report, test plan, and security review.
- For each acceptance criteria, include required evidence (logs, coverage report, smoke test output, dashboard screenshots).

## 19) Next Steps (Immediate)
- Add this file to `docs/` (done).
- Run repository-wide test coverage and add coverage badge to `README.md`.
- Create CI workflow that enforces the gates in **Summary Acceptance Criteria**.
- I can open PRs to add: OpenAPI spec skeleton, CI pipeline, basic Postgres migrations, and a dev-run Docker Compose if you want — tell me which to start with.

---
*This checklist is opinionated and designed to be pragmatic — adapt items to constraints and local regulations. For any item you want me to implement or audit in the repo, tell me which one and I'll start with a prioritized patch and tests.*
