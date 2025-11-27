# CI & Coverage Setup Guide

This document lists the remaining manual steps and repository settings required to fully enable automated coverage publishing and enforcement.

Required repository settings (GitHub admin permissions)
- Enable GitHub Pages for the repository (branch `gh-pages` or `deploy from workflow`) so the coverage HTML site can be published by the workflow.
- Ensure `Actions` has permission to `Write` repository contents (required for the workflow to push README updates). In `Settings → Actions → Policies` set `Allow GitHub Actions to create and approve pull requests` as needed.
- Configure branch protection rules for `main` to require the `CI - Coverage` workflow status check before merging.

Recommended integration steps
- Install Dependabot or enable automated dependency updates.

How the pieces fit together
- `.github/workflows/coverage.yml` runs tests for backend and frontend, merges LCOV files, generates HTML, publishes the coverage HTML to GitHub Pages, and rejects the run if combined coverage < 95%.
- `scripts/merge-lcov.js` concatenates LCOV and writes `coverage/combined-coverage.txt` used by the badge updater.
- `scripts/update-badge.js` updates `README.md` with the latest coverage percentage and the workflow commits the change back to `main` when the coverage gate passes.

Troubleshooting
- If the workflow fails to push README changes, ensure the job has `contents: write` permission and that `Actions` has write access to repository contents.
- If the Pages deploy does not appear, check the `Deploy to GitHub Pages` step in the Actions run and confirm Pages is enabled for the repository (Settings → Pages).

Contact
- If you want, I can prepare a PR and guide you through enabling Pages and finalizing branch protection rules. Tell me which you'd like me to automate next.
