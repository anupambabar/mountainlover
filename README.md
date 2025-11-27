
# MountainLover

![coverage](https://img.shields.io/badge/coverage-96%25-yellow)

**How CI computes coverage**: a GitHub Actions workflow runs backend and frontend tests with coverage, merges LCOV, publishes an HTML report to GitHub Pages, and enforces a project coverage gate using the combined report.

This repository contains the MountainLover platform (backend and frontend). See `docs/production-readiness-checklist.md` for the project's production checklist and `docs/architecture.md` for the layering/bounded-context guide that reviewers follow.

## Developer Workflow

1. `npm install` inside both `backend/` and `frontend/`.
2. Run `npm run lint && npm run test` in each package before pushing.
3. For backend schema changes, update `backend/prisma/schema.prisma`, run `npm run db:validate`, and add a migration under `backend/prisma/migrations/`.
4. The Safe Build Gate (`scripts/check-safe-build.js`) must report all controls as `Done` or the build fails.



