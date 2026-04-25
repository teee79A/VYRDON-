# Execution Flow

This page maps the **exact execution paths** we validate before promotion.

## 1) Public Request Flow (VYRDx)

```text
Browser → Cloudflare Tunnel/Access → Public Service
  → route allowlist
  → billing/proof/receipt handlers
  → data store (Postgres/Redis)
  → response
```

Validation intent:
- public routes are explicit and limited
- internal/hidden lanes are not reachable

## 2) AI Room Flow (VYRDEN)

```text
Operator UI → Cloudflare Access → AI Room service (Fastify)
  → /auth/login (session) OR service-token OR shared secret
  → /api/chat or /ws
  → inference router (CF/MiniMax/Ollama/OpenRouter)
  → response (JSON/SSE/WS)
```

Failure checkpoints (debug order):
1. Cloudflare Access: `403` before app.
2. App auth: `401` or WS close `1008`.
3. Session/cookie mismatch (Secure cookie + plain http tests).
4. Inference offline (`offline-fallback`).
5. Service not booting (`/health` fails).

## 3) Gate Execution (PASS / NOPASS)

The system is promoted only if the gate evaluates to `PASS`:

```text
ROOT + VYRDX + GATE + VALID -> PASS
anything missing/false      -> NOPASS
```

Reference implementation: `apps/node-blood/server.js` (`POST /validate`).

## 4) Deployment Flow (Artifact + systemd)

```text
build → artifact → sync → install deps → systemd restart → verify
```

Minimum operator checks (per host):
```bash
systemctl is-active <service>
curl -sf http://127.0.0.1:<port>/health
journalctl -u <service> -n 50 --no-pager
```
