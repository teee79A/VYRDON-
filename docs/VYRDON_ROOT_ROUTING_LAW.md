# VYRDON Root Routing Law

PASS is never default. A route passes only when proof, authority, trace, and state match the signed root hash.

## Route Decision

```text
REQUEST
  │
  ▼
VYRDON ROUTE GATE
  │
  ├── proof
  ├── authority
  ├── state
  ├── trace
  └── risk
        │
        ▼
PASS / HOLD / BLOCK / CHALLENGE
        │
        ▼
EXECUTION OR STOP
```
