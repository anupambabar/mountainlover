# MountainLover Architecture Overview

## Layered Structure
1. **Presentation (frontend React app)** — renders domain-specific components and calls backend APIs only through typed hooks/fetchers.
2. **Interface (backend controllers + routers)** — express routes perform input validation, sanitization, and translate HTTP semantics to application commands.
3. **Application Services** — orchestrate business workflows, enforce domain policies, and call repositories.
4. **Domain/Repositories** — encapsulate persistence, publish domain entities, and hide storage details (currently Prisma/Postgres ready with an in-memory fallback used in tests).
5. **Infrastructure** — Prisma migrations, external gateways (payments, notifications), observability, and background workers.

## Bounded Contexts
- `users`: identity, RBAC, and contact data.
- `events`: trekking events, schedules, inventory, and difficulty metadata.
- `registrations`: connects users ↔ events with payment and waiver status.
- `payments`: ledger, webhooks, reconciliation.
- `notifications`: email/SMS/push fan-out and retry logic.

Each context gets a dedicated module folder under `backend/src/modules/<context>` with controllers, services, schemas, and repositories. Frontend mirrors this with feature folders under `frontend/src/features/<context>`.

## Validation & Data Hygiene
- All inbound HTTP payloads pass through Zod schemas via `validateRequest` middleware.
- Strings are canonicalized (trimmed) and sanitized with `sanitizeText` before storage or rendering.
- DTOs prevent leaking internal entity shapes across module boundaries.

## Persistence & Normalization
- Postgres is the source of truth, modeled via Prisma (`backend/prisma/schema.prisma`) with versioned migrations covering Users, Events, Registrations, Payments, and AuditLogs.
- Repositories expose methods returning immutable domain entities; swapping from in-memory to Prisma only requires binding the repository implementation.

## Observability Hooks
- Controllers and services emit structured logs (via `logger` util soon) and register OpenTelemetry spans (queued work).
- Request/response validation errors map to `400` with machine-friendly error codes for dashboards.

## Coding Standards & Reviews
- Shared ESLint/Prettier config enforces TypeScript strictness, unused import bans, and uniform formatting.
- PR template requires authors to confirm checklist items (validation, design patterns, migrations, tests).
- Architecture doc acts as source for onboarding reviewers and ensuring new code fits the layering rules.

