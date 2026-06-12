# VYRDON Mother Droplet Staging Plan

## Status

This plan stages VYRDON Mother Terminal files only. It does not deploy VYRDX, does not change DNS, does not open public ports, and does not start a public service.

## Boundary

- Target component: VYRDON Mother Terminal.
- Destination: `/opt/vyrdon-mother`.
- Release layout: `/opt/vyrdon-mother/releases/<timestamp>`.
- Active pointer: `/opt/vyrdon-mother/current -> releases/<timestamp>`.
- VYRDX production remains out of scope.
- VYRDEN domain, Zero Trust, Cloudflare, DNS, Ledger, Safe, contracts, and wallet material remain out of scope.

## Required Gate Order

1. Phase 0: run droplet identity inventory with no mutation.
2. Report hostname, user, path, disk, memory, listening ports, Docker containers, and `/opt`.
3. Owner creates a DigitalOcean snapshot before mutation.
4. Record snapshot name and UTC time.
5. Package from the VYRDON Mother allowlist only.
6. Stage to a timestamped release only after snapshot and owner stage approval.
7. Verify file hashes, file count, secrets exclusions, local-only health, and public database exposure.

## Snapshot Gate

Recommended snapshot name:

```text
vyrdon-prod-01-before-vyrdon-mother-terminal-stage-2026-06-11
```

The staging script refuses to mutate the droplet unless these environment variables are set:

```bash
SNAPSHOT_CONFIRMED=yes
SNAPSHOT_NAME=vyrdon-prod-01-before-vyrdon-mother-terminal-stage-2026-06-11
SNAPSHOT_TIME_UTC=<snapshot-created-time>
OWNER_APPROVED_STAGE=yes
```

## Inventory Command

Run from the repository root:

```bash
TARGET_SSH=root@<approved-droplet-host> ./ops/droplet/preflight-vyrdon-mother-droplet.sh
```

The script runs these remote commands only:

```bash
hostnamectl
whoami
pwd
df -h
free -h
ss -lntup
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'
ls -la /opt
```

It also prints a service hint list so the owner can decide whether the droplet currently runs anything important.

## Package Command

```bash
./ops/droplet/package-vyrdon-mother.sh
```

Output is written under:

```text
dist/vyrdon-mother/<timestamp>/
```

The package contains only the allowlisted paths in `VYRDON_MOTHER_FILE_MANIFEST.md`.

## Stage Command

```bash
TARGET_SSH=root@<approved-droplet-host> \
ARTIFACT=dist/vyrdon-mother/<timestamp>/vyrdon-mother-<timestamp>.tar.gz \
SNAPSHOT_CONFIRMED=yes \
SNAPSHOT_NAME=vyrdon-prod-01-before-vyrdon-mother-terminal-stage-2026-06-11 \
SNAPSHOT_TIME_UTC=<snapshot-created-time> \
OWNER_APPROVED_STAGE=yes \
./ops/droplet/stage-vyrdon-mother.sh
```

The script creates only:

```text
/opt/vyrdon-mother
/opt/vyrdon-mother/releases
/opt/vyrdon-mother/releases/<timestamp>
/opt/vyrdon-mother/current
```

It does not delete unknown files and does not overwrite a non-symlink `current`.

## Verify Command

```bash
TARGET_SSH=root@<approved-droplet-host> ./ops/droplet/verify-vyrdon-mother-staging.sh
```

Verification checks:

- file count
- `sha256sum -c MANIFEST.sha256`
- artifact hash sidecar presence
- no `.env` files
- no private key files
- no high-confidence raw secret markers
- no public database listener
- local-only `node-blood` health check when Node and curl are present
- no public cutover

## Expected Closeout

After successful staging and verification, report:

```text
VYRDON_MOTHER_STAGED_ON_DROPLET - NOT PUBLIC - WAITING OWNER REVIEW
```
