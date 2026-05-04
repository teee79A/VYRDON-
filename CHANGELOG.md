# CHANGELOG

## v0.1.0 — Public Launch (2026-01-07)

**VYRDON — The Law of Root**

First public release of VYRDON as production infrastructure.

### What's live

- **VYRDx** → execution + certification runtime at [vyrdx.vyrdon.com](https://vyrdx.vyrdon.com)
- **VYRDEN** → AI agent gateway (always-on, fallback-enabled)
- **VXSTATION** → monitoring and control interface

### API endpoints released

- `POST /api/public/certify` — certify a record, receive cert ID + hash
- `GET  /api/public/verify-record?q=` — verify by cert ID or hash
- `GET  /api/public/evidence` — browse the public evidence ledger
- `GET  /api/public/verify?q=` — human-readable verification page
- `POST /api/public/contact` — contact / pilot request

### Validation gate (Four Pillar Law)

```json
{ "authority": true, "executor": true, "evidence": true,
  "ledger": true, "integrity": true, "state": true }
```

ALL conditions true → `ACCEPT`  
ANY condition false → `REJECT`

### Deploying

- Frontend: Cloudflare Pages (`vyrdx-site.pages.dev`)
- Backend: DigitalOcean droplet behind Cloudflare proxy (`api.vyrdon.com`)
