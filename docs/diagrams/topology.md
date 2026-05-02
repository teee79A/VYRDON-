# Topology Diagrams

## Public Surface

```text
Visitor
  |
  v
vyrdon.com
  |
  v
vyrdx.vyrdon.com
  |
  +--> POST /api/monitor/feedback
  +--> POST /api/try-us
  +--> POST /api/certify
  +--> GET  /api/verify/:id
```

## Certificate Path

```text
Public request
  -> evidence record
  -> certificate review
  -> issue or reject
  -> public verify lookup
```

## Public Validation Path

```text
README + docs/wiki + API contract + license boundary + evidence JSON
  -> node scripts/validate-public-surface.mjs
  -> PASS / NOPASS
```
