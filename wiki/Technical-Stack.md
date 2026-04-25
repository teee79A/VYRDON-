# Technical Stack

This is the reference stack for the hardened VYRDON split. Actual production choices may evolve, but validation rules remain stable.

## Runtime + Services

- **Node.js**: primary runtime for control-plane and bridge services.
- **Fastify**: API + WebSocket runtime (VYRDEN AI room, control-plane surfaces).
- **systemd**: service management (restart policies, hardening directives, logs).
- **Cloudflare Tunnel + Access**: controlled ingress; direct IP access is blocked.

## Data + Evidence

- **Postgres**: commercial/product state (VYRDx lane).
- **Redis**: ephemeral state + rate limits/queues (lane-specific).
- **JSONL evidence logs**: append-only audit trails and operator verification artifacts.

## Security Defaults

- Bind services to `127.0.0.1` unless explicitly required otherwise.
- Default-deny internal routes; authenticate with (Access token | session | shared secret).
- Never publish secrets, tunnel IDs, or private hostnames in public docs.

## Reference Implementations (In This Repo)

- `apps/node-blood/server.js`: dependency-free Node bridge + gate evaluator.
- `docs/validation-model.md`: operator checklist (commands + expected outcomes).
