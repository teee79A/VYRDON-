# Architecture

VYRDON is a **multi-lane system**. Architecture is not “components” — it is **boundaries**.

## Lanes (Service Boundaries)

- **VYRDx (Public Product Lane)**  
  Public surface only. This lane is allowed to be reachable from the internet, but it must expose only approved public routes and data.

- **VYRDEN (AI Room / Intelligence Lane)**  
  Private lane. It can analyze, recommend, and generate plans — but must not expose public control APIs. Default-deny auth is mandatory.

- **KITTY / VXSTATION (Control Plane Lane)**  
  Operator lane. Deployment, orchestration, evidence logging, and internal operational surfaces live here. It is not the public product.

## Trust Zones

```text
ZONE 0 (Public Internet)
  |
  v
ZONE 1 (Cloudflare Tunnel + Access)
  |
  +--> ZONE 2A (VYRDx Public)  [public allowlist]
  |
  +--> ZONE 2B (VYRDEN AI)     [default-deny + operator auth]
  |
  +--> ZONE 2C (Control Plane) [operator-only]
```

## Hard Boundaries

### Separate ingress
Do not serve AI-room UI/APIs from the same public host as the public product surface.

### Default-deny for mutation
If a route mutates state (memory, tasks, models, deployment), it must require explicit auth.

### Fail-closed gating
If any pillar is unknown/false, the system result is `NOPASS`.

## File/Service Separation (Reference)

The reference split uses separate roots and separate systemd units:

- `/opt/vxstation/...` → `vxstation.service`
- `/opt/vyrden-airoom/...` → `vyrden-airoom.service`

Even when co-located temporarily: keep directories, tunnels, and ports distinct and bind services to localhost.
