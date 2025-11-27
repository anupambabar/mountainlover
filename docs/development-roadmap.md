# Development Roadmap — MountainLover Platform

Goal
- Deliver a production-ready, cloud-agnostic platform for MMC, MAF, and MIM using progressive MVPs that minimize risk and deliver user value fast.

Phases overview (Discovery → MVP-1 → MVP-2 → MVP-3 → Stabilize & Scale)
- Discovery (2 weeks)
- MVP-1: User & Events Core (6–8 weeks)
- MVP-2: Payments, Roles & Instructor Flows (8–12 weeks)
- MVP-3: Mobile wrappers, Offline & Leader tools (8–12 weeks)
- Stabilize & Scale (ongoing)

Conversion assumptions
- Team: 2 full-stack devs, 1 backend dev, 1 QA/automation, 1 part-time DevOps for initial phases.
- Cloud choice: start managed (AWS/GCP/Azure) — RDS, managed Redis, S3, Cloud Run or small k8s.
- Authentication: phone OTP using Twilio or Firebase Auth.

Phase details

## Discovery (2 weeks)
Objective
- Validate requirements, finalize tech choices, produce ERD and API contract, create project skeleton.
Deliverables
- Finalized functional spec and acceptance criteria.
- ERD and key sequence diagrams (registration → payment → refund).
- Minimal repo structure: frontend PWA skeleton (React + Ionic) and backend skeleton (NestJS or Django) with CI.
- Basic IaC skeleton (Terraform with variables) targeting managed services.
Acceptance criteria
- Stakeholder sign-off on functional spec.
- CI pipeline passing lint and unit test for skeleton.

## MVP-1: User & Events Core (6–8 weeks)
Objective
- Implement core user flows, event listing and registration (no payment capture yet), admin CRUD, and basic notifications.
Scope
- Frontend PWA: signup (firstName, lastName, email, phone), OTP login, dashboard with upcoming events.
- Backend: Users, Events, Registrations APIs; Postgres schema + migrations; Redis session cache.
- Admin UI: create/modify events, view registrants.
- Notifications: transactional email (SendGrid) and in-app notifications.
- Basic analytics: event counts and participation metrics.
Deliverables
- End-to-end flow: guest → register → login → register for event (reservation persisted).
- Automated tests: unit tests and a set of integration tests for main APIs.
- Deployed staging environment with basic monitoring (Prometheus metrics, logging).
Acceptance criteria
- 90% of core user API tests passing; manual smoke tests for flows.
- Documentation: API OpenAPI spec and README for developers.

## MVP-2: Payments, Roles & Instructor Flows (8–12 weeks)
Objective
- Add payment capture & refunds, multi-role accounts, instructor leader capabilities.
Scope
- Integrate Stripe/Razorpay payment intents; implement transaction ledger and webhook handling.
- Refund/carry-forward workflows with staff approval flows.
- Role management & switching between entities (MMC/MAF/MIM).
- Instructor dashboard: accept assignments, calendar view, attendance marking, participants charter access.
- Leader tools: pickup/halt lists, publish updates (media uploads), expense submission form (with itemized fields).
- Security & compliance: RLS policies, audit logging, PII encryption at rest for sensitive fields.
Deliverables
- Payment flows: test-mode payments, webhook reconciliation, ledger export.
- Role-based dashboards and role-switching in UI.
- Staff workflows for refunds and reports.
- Expanded test coverage: integration tests for payment flows.
Acceptance criteria
- Payment end-to-end test in sandbox mode.
- Refunds processed with audit trail; staff approval flow tested.

## MVP-3: Mobile wrappers, Offline & Leader advanced (8–12 weeks)
Objective
- Provide mobile apps (iOS/Android), offline-first syncing for remote events, and leader advanced features.
Scope
- Build Capacitor wrappers and publishable builds (debug/test) for Android & iOS.
- Offline sync: local DB (IndexedDB/SQLite) with conflict resolution and queue for uploads.
- SOS & live-checkin feature for events (opt-in), geolocation tracking with consent capture.
- Media handling: efficient uploads (resizing) and CDN-backed delivery.
- Analytics pipeline: ETL to data warehouse and scheduled reports.
Deliverables
- Playstore/TestFlight builds, offline sync demo, SOS demo.
- Documentation for app release and data privacy (consent process).
Acceptance criteria
- Successful E2E tests on PWA and at least one mobile platform.
- Offline sync tested in low-connectivity scenarios.

## Stabilize & Scale (ongoing)
Objective
- Harden the platform for production, implement HA, observability, and site reliability practices.
Scope
- Add read replicas for Postgres, set up auto-scaling (HPA), and implement canary releases.
- Improve monitoring & alerting (SLOs/SLIs), runbook creation, and DR plans.
- Cost optimizations: review infra spend and consider hybrid/self-hosting strategic moves.
Deliverables
- HA deployment in production, monthly runbooks, and quarterly recovery drills.
- Load testing reports and performance tuning.
Acceptance criteria
- SLOs met for 90-day baseline; documented DR and runbooks.
