# VYRDON

VYRDON is the validation-first public system behind VYRDX. It treats public action as something that must be tracked, certified, and verifiable before it is accepted as real.

This repository is the controlled public surface for VYRDON and VYRDX. It documents the teaser/prelaunch state, the public API flow, the certificate path, and the repo-local wiki source used for GitHub Wiki content.

## Live Links

- VYRDON: https://vyrdon.com
- VYRDX runtime: https://vyrdx.vyrdon.com

## VYRDX Runtime Purpose

VYRDX is the public runtime surface for VYRDON. Its job is to receive public feedback, open controlled TRY US ON US access, issue certification requests, and verify public certificate IDs through a bounded API contract.

VYRDX does not claim completion from a visual page alone. It must connect public actions to evidence, certificate status, and verification output.

## Menu Map

- US
- MISSION
- TRY US ON US
- CERTIFY
- VERIFY
- CONTACT
- LICENSE
- FOLLOW US

## Real API Flow

Public API routes expected by the teaser surface:

```text
POST /api/monitor/feedback
POST /api/try-us
POST /api/certify
GET  /api/verify/:id
```

Flow:

1. `POST /api/monitor/feedback` records public feedback and monitoring signals.
2. `POST /api/try-us` accepts controlled TRY US ON US access requests.
3. `POST /api/certify` starts the certificate flow for a public request.
4. `GET /api/verify/:id` verifies a certificate or evidence ID without exposing internal operations.

## Certificate Flow

The certificate flow is public and evidence-bound:

```text
request -> evidence record -> certificate issue/reject -> public verify lookup
```

A certificate is not a marketing claim. It is a verification output tied to a request ID, evidence state, and the public `GET /api/verify/:id` path.

## Status

- Controlled teaser / prelaunch
- No fake completion
- No untracked action
- No unsupported launch claims

This repo documents the public opening path. It does not publish non-public operations or untracked automation.

## Wiki Source

GitHub Wiki source pages live in `docs/wiki/`:

- `Home.md`
- `VYRDX-Runtime.md`
- `Certificate-Flow.md`
- `Evidence-and-Tracking.md`
- `API-Contract.md`
- `Operator-Runbook.md`
- `License-and-Open-Source.md`

## Validation

Run the public-surface validator:

```bash
node scripts/validate-public-surface.mjs
```

The validator checks the README, wiki source pages, public API contract language, license notes, private-surface guardrails, and AUTO_POST state. It writes evidence to:

```text
evidence/repo-public-surface/<timestamp>.json
```

## License

Apache-2.0 and MIT components may be used where appropriate.

VYRDON-owned runtime logic, evidence systems, brand assets, and verification outputs remain controlled. Public documentation in this repository does not grant rights to VYRDON marks, runtime evidence systems, certificate outputs, or controlled verification products beyond the licenses explicitly attached to individual components.
