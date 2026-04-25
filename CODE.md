# CODE (Core Logic + Reference Services)

This repo is docs-first, but it also contains reference implementations that demonstrate the **fail-closed gating model** and “node bridge” patterns used across VYRDON lanes.

## `apps/node-blood` — Node Bridge (“Nerve System”)

`apps/node-blood/server.js` is a dependency-free Node HTTP service that exposes:

- `GET /health` — liveness (uptime + timestamp).
- `GET /status` — runtime config (host/port/env; no secrets).
- `POST /validate` — evaluate the VYRDON/VYRDx PASS/NOPASS gate.

Run locally:
```bash
node apps/node-blood/server.js
curl -sf http://127.0.0.1:7070/health | jq
```

Validate a gate (fail-closed):
```bash
curl -sf -X POST http://127.0.0.1:7070/validate \
  -H 'content-type: application/json' \
  --data '{
    "rootTrue": true,
    "vyrdxTrue": true,
    "certifiedGate": true,
    "auditorOk": true,
    "rootLock": true,
    "validTrue": true,
    "stealthRequested": false
  }' | jq
```

## DX Native Gate Logic (Fail-Closed)

This is the minimal production form implemented by `POST /validate`:

```txt
ROOT.FALSE  -> PASS.FALSE
VYRDX.FALSE -> PASS.FALSE
GATE.FALSE  -> PASS.FALSE
VALID.FALSE -> PASS.FALSE

ROOT.TRUE + VYRDX.TRUE + GATE.TRUE + VALID.TRUE -> PASS.TRUE
```

Derived values:
- `GATE_TRUE := CERTIFIED_GATE + AUDITOR_OK + ROOT_LOCK`
- `CORE_TRUE := ROOT_TRUE + VYRDX_TRUE + GATE_TRUE + VALID_TRUE`
- `STEALTH_TRUE := CORE_TRUE + STEALTH_REQUESTED`

## Hardening Notes (Reference)

- Bind bridge services to `127.0.0.1` by default; expose only via a controlled proxy/tunnel.
- Limit request body size, parse JSON strictly, and return `400` on malformed input.
- Never return secrets via `/status` (only show env var names or boolean “configured” flags).
