# Operator Runbook

This public runbook is for repo-surface updates only.

## Before Editing

1. Confirm the target repository is `teee79A/VYRDON-`.
2. Work on a branch, not `main`.
3. Keep public docs limited to VYRDON and VYRDX.
4. Do not add launch claims that are not backed by evidence.

## Required Validation

Run:

```bash
node scripts/validate-public-surface.mjs
```

The command writes an evidence file under:

```text
evidence/repo-public-surface/
```

## GitHub Features

The public repo should have Wiki and Discussions enabled.

If CLI feature enablement fails, report the exact command output and use repository Settings -> Features -> Discussions as the manual fallback.

## Publishing Rule

Open a pull request only. Do not merge from this runbook.
