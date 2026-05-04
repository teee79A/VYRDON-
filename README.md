# VYRDON — Validation-Gated Execution System

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-public%20launch-brightgreen.svg)](https://vyrdx.vyrdon.com)
[![Live Demo](https://img.shields.io/badge/live-vyrdx.vyrdon.com-d8ff3c.svg)](https://vyrdx.vyrdon.com)
[![API](https://img.shields.io/badge/api-api.vyrdon.com-lightgrey.svg)](https://api.vyrdon.com/api/health)

> **An operation is not accepted unless it can be verified.**

VYRDON enforces a validation gate between request and acceptance. Execution may occur — but acceptance requires verified authority, traceable execution, structured evidence, and recorded state. If any condition fails, the result is `REJECT`.

---

## Live System

| Surface | URL | Access |
|---|---|---|
| Public product | https://vyrdx.vyrdon.com | Open |
| API health | https://api.vyrdon.com/api/health | Open |
| Certify endpoint | https://api.vyrdon.com/api/public/certify | Open |
| Verify endpoint | https://api.vyrdon.com/api/public/verify-record | Open |
| Evidence ledger | https://api.vyrdon.com/api/public/evidence | Open |

---

## Try It Now

```bash
# Health check
curl -fsS https://api.vyrdon.com/api/health

# Certify a record
curl -X POST https://api.vyrdon.com/api/public/certify \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "you@example.com",
    "content": "The content or statement to certify",
    "content_type": "text"
  }'

# Verify by cert ID or hash
curl "https://api.vyrdon.com/api/public/verify-record?q=<cert_id>"

# Browse evidence ledger
curl "https://api.vyrdon.com/api/public/evidence"
```

---

## Validation Model

An operation passes the gate only when all six conditions are satisfied:

```json
{
  "authority":  true,
  "executor":   true,
  "evidence":   true,
  "ledger":     true,
  "integrity":  true,
  "state":      true
}
```

```
ALL true  →  ACCEPT
ANY false →  REJECT
```

---

## Execution Flow

```
REQUEST
  ↓
VALIDATION GATE
  ↓
EXECUTION
  ↓
EVIDENCE GENERATION
  ↓
STATE COMMIT
  ↓
INTEGRITY CHECK
  ↓
ACCEPT / REJECT
```

---

## System Layers

| Layer | Role |
|---|---|
| **VYRDON** | Authority and validation logic |
| **VYRDx** | Public execution runtime (this repo's live surface) |
| **Consolab** | Validation artifacts and certification |
| **Vyrden** | Analysis and decision support |
| **VXStation** | Control and monitoring interface |

---

## Core Laws (Fail-Closed)

- **Execution ≠ Acceptance** — running does not mean accepted
- **Fail closed** — unknown state becomes `NOPASS`, not best-effort
- **Default deny** — internal mutation requires explicit authority
- **Separate ingress** — public product surface ≠ hidden control lanes
- **Evidence-first** — every accepted operation produces a verifiable record

---

## Repo Structure

```
VYRDON-/
├── README.md               — this file
├── INTRODUCTION.md         — intent, boundaries, operator laws
├── CODE.md                 — core gate logic + reference services
├── AGENTS.md               — agent/automation instructions
├── Makefile                — make verify, make check
├── apps/
│   └── node-blood/         — Node.js reference bridge + gate evaluator
├── docs/
│   └── validation-model.md — executable checklist with commands + outputs
└── wiki/
    ├── Home.md             — overview
    ├── Architecture.md     — service boundary model + trust zones
    ├── Execution-Flow.md   — request paths and deployment flow
    ├── Technical-Stack.md  — multi-language architecture
    └── Validation-Model.md — validation gate specification
```

---

## Quick Validation

```bash
make verify
```

---

## Security

- Never commit secrets — use `[REDACTED_SECRET]`
- Do not publish production IPs, tunnel IDs, or internal hostnames
- Public surface (`VYRDx`) and control plane (`KITTY/VXSTATION`) do not share entrypoints

---

## Contact & Pilot

Enterprise access, pilot programs, and partnership inquiries:
→ https://vyrdx.vyrdon.com (click CONTACT)
→ contact@vyrdon.com

---

## License

Apache 2.0 — see [LICENSE](LICENSE)

---

*VYRDON is built and operated by [VYRDON](https://vyrdon.com) — a validation-gated execution system designed for production use.*
