# Topology Diagrams (ASCII)

## Service Boundary Split

```text
                ┌──────────────────────────┐
Internet  ───▶  │ Cloudflare (Tunnel+Access)│
                └─────────────┬────────────┘
                              │
         ┌────────────────────┴─────────────────────┐
         │                                          │
         ▼                                          ▼
┌───────────────────────┐                ┌────────────────────────┐
│ VYRDx Public Surface   │                │ VYRDEN AI Room          │
│ domain: vyrdx.*        │                │ domain: vyrden.*        │
│ - public routes only   │                │ - operator/agent auth   │
│ - billing/proof flows  │                │ - /ws + /api/chat       │
└───────────┬───────────┘                └────────────┬───────────┘
            │                                          │
            ▼                                          ▼
      Postgres/Redis                             Inference Router
      (product state)                       (CF/MiniMax/Ollama/OR)
```

## AI Room Request Path

```text
Browser UI
  ├─ POST /auth/login  → sets session cookie (secure)
  ├─ POST /api/chat    → JSON or SSE streaming
  └─ GET  /ws          → WebSocket (token/auth required)

Failure checkpoints:
  1) Cloudflare Access 403
  2) App auth 401 / WS close 1008
  3) Cookies not sent (Secure + http mismatch)
  4) Inference offline-fallback
  5) Service not booting (/health fails)
```
