# Validation Model

This document defines the public validation model for the VYRDON / VYRDX repository surface.

## Public Surface Gate

The repository public surface passes only when these checks are true:

```text
README_PRESENT
WIKI_SOURCE_PRESENT
PUBLIC_API_FLOW_PRESENT
CERTIFICATE_FLOW_PRESENT
LICENSE_BOUNDARY_PRESENT
NO_UNTRACKED_AUTO_POST
NO_NON_PUBLIC_RUNTIME_EXPOSURE
```

If any required item is missing, the result is `NOPASS`.

## Required Public API Flow

```text
POST /api/monitor/feedback
POST /api/try-us
POST /api/certify
GET  /api/verify/:id
```

## Status Requirements

The public docs must state:

- Controlled teaser / prelaunch
- No fake completion
- No untracked action

## Evidence Requirement

Run:

```bash
node scripts/validate-public-surface.mjs
```

Expected result:

```text
ok: true
evidence/repo-public-surface/<timestamp>.json written
```

## Public Documentation Boundary

Public docs may describe VYRDON, VYRDX, the certificate flow, public links, and public API routes. Public docs must not publish secrets, internal hostnames, untracked automation, unsupported launch claims, or non-public runtime operations.
