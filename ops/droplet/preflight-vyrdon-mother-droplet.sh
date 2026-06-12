#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'USAGE'
Usage:
  TARGET_SSH=root@<approved-droplet-host> ./ops/droplet/preflight-vyrdon-mother-droplet.sh
  ./ops/droplet/preflight-vyrdon-mother-droplet.sh root@<approved-droplet-host>

Phase 0 only. Runs inventory commands and writes a local evidence log.
USAGE
}

target="${TARGET_SSH:-${1:-}}"
if [[ -z "$target" ]]; then
  usage >&2
  exit 2
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
outdir="${PREFLIGHT_OUTDIR:-evidence/droplet/vyrdon-mother}"
mkdir -p "$outdir"
log_path="$outdir/preflight-${timestamp}.log"

ssh_args=(-o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=accept-new)
if [[ -n "${SSH_OPTS:-}" ]]; then
  read -r -a extra_ssh_args <<<"$SSH_OPTS"
  ssh_args+=("${extra_ssh_args[@]}")
fi

ssh "${ssh_args[@]}" "$target" 'bash -s' 2>&1 <<'REMOTE' | tee "$log_path"
set -Eeuo pipefail

echo "=== TIME UTC ==="
date -u

echo "=== HOSTNAMECTL ==="
hostnamectl

echo "=== WHOAMI ==="
whoami

echo "=== PWD ==="
pwd

echo "=== DISK ==="
df -h

echo "=== MEMORY ==="
free -h

echo "=== LISTENING PORTS ==="
ss -lntup

echo "=== DOCKER CONTAINERS ==="
if command -v docker >/dev/null 2>&1; then
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'
else
  echo "docker: not installed"
fi

echo "=== OPT INVENTORY ==="
ls -la /opt

echo "=== IMPORTANT RUNNING SERVICE HINTS ==="
systemctl list-units --type=service --state=running --no-pager \
  | grep -Ei 'vyr|vx|mother|docker|nginx|postgres|mysql|mariadb|redis|mongo|node|cloudflared' || true
REMOTE

echo "preflight_log=$log_path"
