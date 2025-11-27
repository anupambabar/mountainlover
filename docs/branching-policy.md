# Branching Policy

Repository branching model (enforced):

- `main` — production code only. No direct pushes; merges only from `release-*` branches via protected PRs.
- `develop` — latest development code. No direct pushes; merges via PRs.
- `release-*` — release-specific branches (example: `release-1.0.0.0`). Prepare release code here.
- `feature/*` — feature branches created by developers. Developers must create feature branches from the appropriate `release-*` branch.

Rules (summary):
- Developers create a feature branch from the target `release-*` branch:
  - `git checkout -b feature/<short-name> release-1.0.0.0`
- Developers push feature branches to `origin` and open a PR with base `release-1.0.0.0`.
- PRs from `feature/*` must target `release-*` branches. The CI will block PRs that do not follow this rule.
- `main` contains production code only; create release PRs to merge release branches into `main` through the release process.

Example workflow for a developer (local commands):

1. Create your feature branch from the release branch:

```powershell
git fetch origin
git checkout origin/release-1.0.0.0 -b feature/my-awesome-fix
```

2. Make changes, commit, and push:

```powershell
git add .
git commit -m "feat: add awesome fix"
git push -u origin feature/my-awesome-fix
```

3. Create a PR to `release-1.0.0.0` (using GitHub UI or CLI):

Using GitHub CLI:
```powershell
gh pr create --base release-1.0.0.0 --head feature/my-awesome-fix --title "feat: my awesome fix" --body "Description of the change"
```

CI enforcement
- The repository contains an Actions workflow `branch-policy.yml` that validates PRs. It enforces that feature branches only target `release-*` branches.
- The workflow also flags direct pushes to `main`, `develop`, and `release-*` branches; branch protection rules should require the workflow to pass.

If you need different rules (e.g., allow feature → develop PRs), update the policy and CI workflow accordingly.
