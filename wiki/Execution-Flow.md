# Execution Flow

The public execution flow is evidence-bound.

```text
public action
  -> public API route
  -> tracking record
  -> certificate or feedback state
  -> public verification result when available
```

## Public Routes

- `POST /api/monitor/feedback`
- `POST /api/try-us`
- `POST /api/certify`
- `GET /api/verify/:id`

## Rule

A visible page is not completion. Public action must be tracked and verifiable before it is treated as accepted.
