# VYRDON Mother Rollback

## Rollback Scope

Rollback changes only the `/opt/vyrdon-mother/current` symlink. It does not delete release directories and does not remove unknown files.

## Inspect Current Release

```bash
ssh root@<approved-droplet-host> 'readlink -f /opt/vyrdon-mother/current && ls -la /opt/vyrdon-mother/releases'
```

## Roll Back To Previous Release

Replace `<previous-release>` with an existing directory name under `/opt/vyrdon-mother/releases`.

```bash
ssh root@<approved-droplet-host> 'set -euo pipefail
cd /opt/vyrdon-mother
test -d "releases/<previous-release>"
ln -sfn "releases/<previous-release>" current.next
mv -Tf current.next current
readlink -f current
'
```

## Verify After Rollback

```bash
TARGET_SSH=root@<approved-droplet-host> ./ops/droplet/verify-vyrdon-mother-staging.sh
```

## Do Not Do

- Do not delete `/opt/vyrdon-mother/releases/<timestamp>`.
- Do not remove unknown `/opt` files.
- Do not reboot for rollback.
- Do not expose a public port.
- Do not change DNS.
