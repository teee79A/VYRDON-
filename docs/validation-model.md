# Validation Model (VYRDON Split Hardening)

This document defines **what must be true** before promoting changes to a real-market rollout. It is written to be executed as a checklist.

## 1) VYRDEN AI Communication Failure Path (Exact)

**Primary path (browser / operator):**

```text
Browser UI → Cloudflare Tunnel/Access → Fastify server
  → auth (session | CF Access | shared secret)
  → /api/chat or /ws
  → inference router (Cloudflare Workers AI | MiniMax | Ollama | OpenRouter)
  → response (JSON or SSE/WebSocket)
```

**Failure gates (in order to check):**
1. **Cloudflare Access deny**: `403` before your app (policy/service token miswired).
2. **App auth deny**: `401` on `/api/*` or WS close `1008 UNAUTHORIZED` (missing `cf-access-*` headers, session, or shared secret).
3. **Cookie/session not sticking**: `/auth/login` returns OK but next call is `401` (common when cookies are `Secure` and you test over plain `http://`).
4. **Inference is offline**: `/api/chat` returns `offline-fallback` (provider secrets missing, provider error, or Ollama down).
5. **Boot-time crash**: service never reaches `/health` (missing required env like `AIROOM_SECRET` / DB password).

## 2) Hardening & Fix Order (VYRDEN AI Domain)

1. **OS baseline** (droplet): update packages, then reboot if required.
2. **Pin runtime**: install a known Node LTS version and confirm `node --version` matches your deploy expectation.
3. **Bind private-by-default**: run AI room on `127.0.0.1` and expose only via Cloudflare tunnel (no direct `0.0.0.0` ingress).
4. **Default-deny auth**: require *one* of (Cloudflare Access service token, authenticated session, shared secret) for every non-public route.
5. **Narrow CORS**: allow only the intended origins; do not use `*` with credentials.
6. **Auditability**: ensure `journalctl` logs, evidence/audit directories, and rate limiting are on.

## 3) Deployment Cut (Hardened Split)

Goal: **no mixed public + hidden control planes on the same ingress surface**.

- **KITTY / VXSTATION droplet**: control-plane runtime + operator surfaces (port 7800 local-only + tunnel).
- **VYRDx-only droplet**: the public product surface and its dependencies (no AI-room routes, no hidden mutation endpoints).
- **VYRDEN AI Room**: separate service boundary (own systemd unit + tunnel), authenticated, and not treated as a public API.

If you must co-locate temporarily, keep these boundaries:
- separate systemd units
- separate `/opt/<service>` roots
- separate Cloudflare tunnel configs
- bind services to `127.0.0.1` and block direct IP access

## 4) Exact Services / Files / Build Scripts (Reference Implementation)

**VXSTATION (KITTY control plane)**
- systemd: `vxstation.service`
- deploy script: `deploy/deploy.sh`
- tunnel config: `deploy/cloudflare-tunnel.yml`
- runtime root: `/opt/vxstation/{releases,shared,current}`

**VYRDEN AI Room**
- systemd: `vyrden-airoom.service` (+ optional tunnel unit)
- deploy script: `deploy/deploy-vyrden-airoom.sh`
- tunnel config: `deploy/cloudflare-tunnel-vyrden.yml`
- runtime root: `/opt/vyrden-airoom/{releases,shared,current}`

## 5) Operator Validation Commands (Run on Each Host)

**Service + port sanity**
```bash
systemctl is-active vxstation vyrden-airoom cloudflared || true
ss -ltnp | rg ":(7800|3100)\\b" || true
journalctl -u vxstation -n 50 --no-pager || true
journalctl -u vyrden-airoom -n 50 --no-pager || true
```

**Local health (must succeed)**
```bash
curl -sf http://127.0.0.1:7800/health >/dev/null
curl -sf http://127.0.0.1:3100/health >/dev/null
```

**AI-room auth + chat (must succeed)**
```bash
login="$(curl -sf -X POST http://127.0.0.1:3100/auth/login -H 'content-type: application/json' --data '{\"guest\":true}')"
sid="$(node -e 'const j=JSON.parse(process.argv[1]);process.stdout.write(j.sessionId||\"\")' "$login")"
stok="$(node -e 'const j=JSON.parse(process.argv[1]);process.stdout.write(j.sessionToken||\"\")' "$login")"
curl -sf -X POST http://127.0.0.1:3100/api/chat \
  -H 'content-type: application/json' \
  -H "x-session-id: $sid" \
  -H "x-session-token: $stok" \
  --data '{"prompt":"health ping","maxTokens":64}' | head
```

**Fail-closed check (must be denied)**
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3100/api/memory/flush
```

Expected: `401`/`403` (never `200`) for internal mutation routes without auth.
