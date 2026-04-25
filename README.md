# VYRDON — Validation-Gated Execution System

VYRDON treats **execution as an event**, not proof. An operation is accepted only when it passes explicit gates and produces verifiable evidence.

## Start Here

- `INTRODUCTION.md` — intent, boundaries, and operator laws.
- `docs/validation-model.md` — executable checklist (commands + expected outcomes).
- `wiki/Home.md` — architecture, execution flow, stack, and validation pages.
- `CODE.md` — core gate logic + reference services.
- `apps/node-blood/server.js` — reference Node bridge (“nerve system”) + gate evaluator.

## Core Laws (Fail-Closed)

- **Execution ≠ Acceptance**
- **Fail closed**: unknown becomes `NOPASS`
- **Default deny**: internal mutation requires explicit auth
- **Separate ingress**: public product ≠ hidden lanes
- **Evidence-first**: promotion requires commands + outputs

## System Model

```text
REQUEST
  ↓
VALIDATION GATE
  ↓
EXECUTION
  ↓
EVIDENCE
  ↓
STATE COMMIT
  ↓
INTEGRITY CHECK
  ↓
ACCEPT / REJECT
```

## Boundary Model (Lanes)

```text
Internet → Cloudflare (Tunnel+Access)
  ├─ VYRDx (Public Product)    : public allowlist only
  ├─ VYRDEN (AI Room)          : authenticated, default-deny
  └─ KITTY / VXSTATION (Ops)   : operator-only control plane
```

## Quick Validation

```bash
make verify
```

## Security Notes

- Never commit secrets. Use `[REDACTED_SECRET]`.
- Avoid publishing production IPs, tunnel IDs, or internal hostnames in public docs.
