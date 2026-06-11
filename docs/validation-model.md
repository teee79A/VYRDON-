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

## VYRDON Mother Droplet Staging Gate

The Mother Terminal droplet package is valid only when these checks are true:

```text
DROPLET_PREFLIGHT_BEFORE_MUTATION
DIGITALOCEAN_SNAPSHOT_CONFIRMED_BY_OWNER
ALLOWLIST_PACKAGE_ONLY
NO_SECRET_PATHS_OR_RAW_SECRET_MARKERS
TIMESTAMPED_RELEASE_UNDER_OPT_VYRDON_MOTHER
CURRENT_SYMLINK_ONLY_AFTER_STAGE_APPROVAL
NO_VYRDX_DEPLOY
NO_CLOUDFLARE_OR_DNS_MUTATION
NO_PUBLIC_DATABASE_PORT
NO_PUBLIC_CUTOVER
```

Validation commands:

```bash
bash -n ops/droplet/preflight-vyrdon-mother-droplet.sh
bash -n ops/droplet/package-vyrdon-mother.sh
bash -n ops/droplet/stage-vyrdon-mother.sh
bash -n ops/droplet/verify-vyrdon-mother-staging.sh
./ops/droplet/package-vyrdon-mother.sh
```

Droplet mutation is blocked unless the owner has confirmed a DigitalOcean snapshot and approved staging.
