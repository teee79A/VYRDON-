#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'USAGE'
Usage:
  TARGET_SSH=root@<approved-droplet-host> ./ops/droplet/verify-vyrdon-mother-staging.sh
  ./ops/droplet/verify-vyrdon-mother-staging.sh root@<approved-droplet-host>

Verifies /opt/vyrdon-mother/current without opening public ports.
USAGE
}

target="${TARGET_SSH:-${1:-}}"
if [[ -z "$target" ]]; then
  usage >&2
  exit 2
fi

ssh_args=(-o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=accept-new)
if [[ -n "${SSH_OPTS:-}" ]]; then
  read -r -a extra_ssh_args <<<"$SSH_OPTS"
  ssh_args+=("${extra_ssh_args[@]}")
fi

ssh "${ssh_args[@]}" "$target" 'bash -s' <<'REMOTE'
set -Eeuo pipefail

dest="/opt/vyrdon-mother"
current="${dest}/current"

echo "=== CURRENT RELEASE ==="
test -L "$current"
release="$(readlink -f "$current")"
echo "$release"
test -d "$release"

echo "=== FILE COUNT ==="
find "$release" -type f | wc -l

echo "=== MANIFEST VERIFY ==="
(
  cd "$release"
  test -f MANIFEST.sha256
  sha256sum -c MANIFEST.sha256
)

echo "=== ARTIFACT SIDECARE ==="
test -f "${release}/ARTIFACT_SHA256"
cat "${release}/ARTIFACT_SHA256"

echo "=== SECRET PATH SCAN ==="
secret_paths="$(find "$release" -type f \( \
  -name '.env' -o -name '.env.*' -o -name '*.pem' -o -name '*.key' \
  -o -name 'id_rsa' -o -name 'id_ed25519' -o -name '*.p12' -o -name '*.pfx' \
  -o -name '*.sql' -o -name '*.dump' -o -name '*.sqlite' -o -name '*.db' \
  -o -iname '*wallet*' -o -iname '*seed*' \) -print)"
if [[ -n "$secret_paths" ]]; then
  echo "$secret_paths" >&2
  exit 1
fi
echo "ok: no blocked secret paths"

echo "=== SECRET CONTENT SCAN ==="
private_key_re='-----BEGIN [A-Z0-9 ]*PRIV''ATE KEY-----'
aws_access_re='A''KIA[0-9A-Z]{16}'
aws_session_re='ASIA[0-9A-Z]{16}'
github_token_re='gh[pousr]_[A-Za-z0-9_]{30,}'
slack_token_re='xo''x[baprs]-[A-Za-z0-9-]{20,}'
openai_token_re='sk-(live|test|proj)-[A-Za-z0-9_-]{20,}'
assignment_secret_re='(api[_-]?key|token|secret|password)[[:space:]]*=[[:space:]]*["'\''"]?[A-Za-z0-9_./+=:-]{16,}'
secret_value_re="${private_key_re}|${aws_access_re}|${aws_session_re}|${github_token_re}|${slack_token_re}|${openai_token_re}|${assignment_secret_re}"
if grep -RInE -- "$secret_value_re" "$release"; then
  echo "blocked: high-confidence raw secret marker found" >&2
  exit 1
fi
echo "ok: no high-confidence raw secret marker"

echo "=== PUBLIC DATABASE PORT CHECK ==="
if ss -lntup | grep -E '(^|[[:space:]])(0\.0\.0\.0|\[::\]):(5432|3306|3307|27017|6379|9200|9300)\b'; then
  echo "blocked: public database-like port detected" >&2
  exit 1
fi
echo "ok: no public database-like listener detected"

echo "=== LOCAL HEALTH CHECK ==="
if command -v node >/dev/null 2>&1 && command -v curl >/dev/null 2>&1 && [[ -f "${release}/apps/node-blood/server.js" ]]; then
  port="${VYRDON_MOTHER_HEALTH_PORT:-7170}"
  if ss -ltn | grep -q ":${port} "; then
    echo "skip: local health port already in use: ${port}"
  else
    health_log="/tmp/vyrdon-mother-health-$(date -u +%Y%m%dT%H%M%SZ).log"
    (
      cd "$release"
      export NODE_BLOOD_HOST=127.0.0.1
      export NODE_BLOOD_PORT="$port"
      exec node apps/node-blood/server.js >"$health_log" 2>&1
    ) &
    pid="$!"
    sleep 1
    curl -fsS "http://127.0.0.1:${port}/health"
    kill "$pid" >/dev/null 2>&1 || true
    wait "$pid" >/dev/null 2>&1 || true
  fi
else
  echo "skip: node or curl unavailable, or node-blood missing"
fi

echo "=== SERVICE START CHECK ==="
systemctl list-units --type=service --state=running --no-pager | grep -Ei 'vyrdon-mother' || true

echo "status=VYRDON_MOTHER_STAGED_ON_DROPLET - NOT PUBLIC - WAITING OWNER REVIEW"
REMOTE
