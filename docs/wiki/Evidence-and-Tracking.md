# Evidence and Tracking

VYRDON treats public actions as evidence candidates. A click, feedback event, request, or certificate submission becomes useful only when it is tracked with enough context to verify what happened.

## Public Evidence Inputs

- Monitor feedback from `POST /api/monitor/feedback`
- TRY US ON US requests from `POST /api/try-us`
- Certificate requests from `POST /api/certify`
- Verification lookups from `GET /api/verify/:id`

## Public Evidence Rules

- No untracked action.
- No fake completion.
- No auto-post behavior without explicit operator approval.
- No public claim unless the action has evidence.

## Tracking State

Public tracking should preserve:

- request ID
- route
- timestamp
- status
- verification ID when available
- public-safe evidence summary

Private logs, secrets, internal hostnames, and operational controls are outside the public wiki scope.
