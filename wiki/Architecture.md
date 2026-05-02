# Architecture

VYRDON public architecture is intentionally narrow.

```text
Public visitor
  -> vyrdon.com
  -> vyrdx.vyrdon.com
  -> bounded public API
  -> evidence-backed response
```

## Public Surface

VYRDX receives feedback, TRY US ON US requests, certificate requests, and verification lookups.

## Route Boundary

```text
POST /api/monitor/feedback
POST /api/try-us
POST /api/certify
GET  /api/verify/:id
```

No private runtime operations belong in the public repo surface.
