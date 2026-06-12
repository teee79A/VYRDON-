# API Contract

This page documents the controlled public API contract for the VYRDON / VYRDX teaser surface.

## Feedback API

```text
POST /api/monitor/feedback
```

Purpose: record public feedback, monitor signals, and public-safe telemetry for the teaser surface.

## TRY US ON US API

```text
POST /api/try-us
```

Purpose: accept controlled access requests. This route should return a tracked request status, not an unsupported access guarantee.

## Certify API

```text
POST /api/certify
```

Purpose: start a certificate request tied to evidence.

## Verify API

```text
GET /api/verify/:id
```

Purpose: return public-safe verification state for a certificate or evidence ID.

## Guardrails

- Public routes should return bounded public data.
- Unknown status should fail closed.
- API responses should not include secrets, private hostnames, raw internal logs, or private operational instructions.
