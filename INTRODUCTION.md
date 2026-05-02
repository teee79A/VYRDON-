# Introduction

VYRDON is engineered around hard boundaries, fail-closed validation, and public evidence. The goal of this repository is to document the controlled public surface without publishing non-public runtime operations.

## What This Repo Is

This repository is the public documentation and validation gate for:

- VYRDON identity and operating rules.
- VYRDX public runtime purpose.
- Public teaser/prelaunch API flow.
- Certificate verification flow.
- Public-safe wiki source pages.

If a change cannot be expressed as a validation step, it is not done.

## Core Operator Laws

1. Fail closed: missing truth becomes `NOPASS`, not best effort.
2. Public routes are bounded and explicit.
3. Public evidence must be tracked before a claim is accepted.
4. No fake completion and no untracked action.

## Where To Read

- `README.md`: public entrypoint and links.
- `docs/wiki/`: public wiki source.
- `docs/validation-model.md`: public-surface validation checklist.
- `CODE.md`: reference gate logic.

## How To Contribute

- Keep docs copy/paste friendly.
- Redact secrets as `[REDACTED_SECRET]`.
- Do not add unsupported launch claims.
- Do not add non-public runtime details.
