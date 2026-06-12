# ConsoleLab Audit Challenge

ConsoleLab reviews route evidence: file manifest, sha256 sums, secret scan result, ports, services, and rollback path.

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
