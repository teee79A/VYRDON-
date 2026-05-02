# VYRDX Runtime

VYRDX is the public runtime surface for VYRDON.

Its purpose is to receive public signals, route TRY US ON US requests, start certificate requests, and expose public verification lookups through bounded routes.

## Public Runtime Duties

- Receive public monitor feedback.
- Accept controlled TRY US ON US requests.
- Start certificate requests.
- Return public verification status by ID.
- Preserve evidence linkage for public actions.

## Public Links

- https://vyrdon.com
- https://vyrdx.vyrdon.com

## Public Route Contract

```text
POST /api/monitor/feedback
POST /api/try-us
POST /api/certify
GET  /api/verify/:id
```

## Status Boundary

VYRDX is in controlled teaser / prelaunch mode. A visible page is not proof of launch completion. A public action must be tracked, tied to evidence, and verifiable before it is treated as accepted.
