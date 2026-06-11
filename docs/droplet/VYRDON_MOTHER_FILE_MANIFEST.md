# VYRDON Mother File Manifest

## Source Rule

The VYRDON Mother package is built from an explicit allowlist. The package script must not copy a whole repository tree.

## Included Paths

```text
README.md
INTRODUCTION.md
CODE.md
LICENSE
Makefile
AGENTS.md
docs/validation-model.md
docs/wiki/Home.md
docs/wiki/Certificate-Flow.md
docs/wiki/Evidence-and-Tracking.md
docs/wiki/API-Contract.md
docs/wiki/Operator-Runbook.md
docs/wiki/License-and-Open-Source.md
docs/diagrams/topology.md
docs/droplet/VYRDON_MOTHER_DROPLET_STAGING_PLAN.md
docs/droplet/VYRDON_MOTHER_FILE_MANIFEST.md
docs/droplet/VYRDON_MOTHER_SECRETS_EXCLUSION_POLICY.md
docs/droplet/VYRDON_MOTHER_ROLLBACK.md
wiki/Home.md
wiki/Validation-Model.md
wiki/Architecture.md
wiki/Execution-Flow.md
wiki/Technical-Stack.md
apps/node-blood/server.js
scripts/validate-public-surface.mjs
ops/droplet/preflight-vyrdon-mother-droplet.sh
ops/droplet/package-vyrdon-mother.sh
ops/droplet/stage-vyrdon-mother.sh
ops/droplet/verify-vyrdon-mother-staging.sh
```

## Runtime Entry

The only runnable service file in this package is:

```text
apps/node-blood/server.js
```

It binds to `127.0.0.1` by default and is used for local health validation only. The staging workflow does not install a systemd unit and does not open a public port.

## Explicit Exclusions

```text
.git
.env
.env.*
node_modules
dist
coverage
*.log
*.pem
*.key
id_rsa
id_ed25519
*.p12
*.pfx
*.sql
*.dump
*.sqlite
*.db
wallet*
*wallet*
seed*
*seed*
```

## Non-Goals

- No VYRDX production deployment.
- No VYRDEN domain or Zero Trust files.
- No Cloudflare or DNS configuration.
- No Ledger, Safe, contract, wallet, or raw credential files.
- No public database exposure.
