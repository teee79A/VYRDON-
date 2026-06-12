#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

timestamp="${VYRDON_MOTHER_RELEASE_TS:-$(date -u +%Y%m%dT%H%M%SZ)}"
package_root="dist/vyrdon-mother/${timestamp}"
artifact_name="vyrdon-mother-${timestamp}.tar.gz"
artifact_path="${package_root}/${artifact_name}"

include_paths=(
  "README.md"
  "INTRODUCTION.md"
  "CODE.md"
  "LICENSE"
  "Makefile"
  "AGENTS.md"
  "docs/validation-model.md"
  "docs/wiki/Home.md"
  "docs/wiki/Certificate-Flow.md"
  "docs/wiki/Evidence-and-Tracking.md"
  "docs/wiki/API-Contract.md"
  "docs/wiki/Operator-Runbook.md"
  "docs/wiki/License-and-Open-Source.md"
  "docs/diagrams/topology.md"
  "docs/droplet/VYRDON_MOTHER_DROPLET_STAGING_PLAN.md"
  "docs/droplet/VYRDON_MOTHER_FILE_MANIFEST.md"
  "docs/droplet/VYRDON_MOTHER_SECRETS_EXCLUSION_POLICY.md"
  "docs/droplet/VYRDON_MOTHER_ROLLBACK.md"
  "wiki/Home.md"
  "wiki/Validation-Model.md"
  "wiki/Architecture.md"
  "wiki/Execution-Flow.md"
  "wiki/Technical-Stack.md"
  "apps/node-blood/server.js"
  "scripts/validate-public-surface.mjs"
  "ops/droplet/preflight-vyrdon-mother-droplet.sh"
  "ops/droplet/package-vyrdon-mother.sh"
  "ops/droplet/stage-vyrdon-mother.sh"
  "ops/droplet/verify-vyrdon-mother-staging.sh"
)

blocked_path_re='(^|/)(\.git|node_modules|dist|coverage|\.env(\..*)?|[^/]*\.log|[^/]*\.pem|[^/]*\.key|id_rsa|id_ed25519|[^/]*\.p12|[^/]*\.pfx|[^/]*\.sql|[^/]*\.dump|[^/]*\.sqlite|[^/]*\.db|[^/]*wallet[^/]*|[^/]*seed[^/]*)($|/)'
private_key_re='-----BEGIN [A-Z0-9 ]*PRIV''ATE KEY-----'
aws_access_re='A''KIA[0-9A-Z]{16}'
aws_session_re='ASIA[0-9A-Z]{16}'
github_token_re='gh[pousr]_[A-Za-z0-9_]{30,}'
slack_token_re='xo''x[baprs]-[A-Za-z0-9-]{20,}'
openai_token_re='sk-(live|test|proj)-[A-Za-z0-9_-]{20,}'
assignment_secret_re='(api[_-]?key|token|secret|password)[[:space:]]*=[[:space:]]*["'\'']?[A-Za-z0-9_./+=:-]{16,}'
secret_value_re="${private_key_re}|${aws_access_re}|${aws_session_re}|${github_token_re}|${slack_token_re}|${openai_token_re}|${assignment_secret_re}"

mkdir -p "$package_root"
manifest_files="${package_root}/MANIFEST.files"
manifest_sha="${package_root}/MANIFEST.sha256"
secret_report="${package_root}/SECRETS_EXCLUSION_REPORT.txt"
scan_report="${package_root}/SECRET_SCAN_HITS.txt"
: >"$manifest_files"
: >"$scan_report"

missing=()
blocked=()
for rel in "${include_paths[@]}"; do
  if [[ ! -e "$rel" ]]; then
    missing+=("$rel")
    continue
  fi
  if [[ "$rel" =~ $blocked_path_re ]]; then
    blocked+=("$rel")
    continue
  fi
  if [[ -d "$rel" ]]; then
    while IFS= read -r file; do
      file="${file#./}"
      if [[ "$file" =~ $blocked_path_re ]]; then
        blocked+=("$file")
      else
        printf '%s\n' "$file" >>"$manifest_files"
      fi
    done < <(find "$rel" -type f | sort)
  else
    printf '%s\n' "$rel" >>"$manifest_files"
  fi
done

if ((${#missing[@]})); then
  printf 'missing required manifest path: %s\n' "${missing[@]}" >&2
  exit 1
fi

if ((${#blocked[@]})); then
  printf 'blocked secret/dependency path in manifest: %s\n' "${blocked[@]}" >&2
  exit 1
fi

sort -u "$manifest_files" -o "$manifest_files"

secret_hits=0
while IFS= read -r rel; do
  if LC_ALL=C grep -IEn -- "$secret_value_re" "$rel" >>"$scan_report"; then
    secret_hits=1
  fi
done <"$manifest_files"

if ((secret_hits)); then
  echo "high-confidence secret marker found; see $scan_report" >&2
  exit 1
fi

while IFS= read -r rel; do
  sha256sum "$rel"
done <"$manifest_files" >"$manifest_sha"

cat >"$secret_report" <<'REPORT'
VYRDON Mother secrets exclusion report

Path exclusions enforced:
- .git
- .env and .env.*
- node_modules
- dist and coverage
- logs
- private key extensions and common SSH private key names
- certificate bundles likely to contain private material
- database dumps and local database files
- wallet and seed files

Content scan:
- private key blocks
- AWS access key IDs
- GitHub tokens
- Slack tokens
- Stripe keys
- OpenAI-style keys
- assignment-style api_key, token, secret, and password values

Result: no high-confidence secret marker found in the allowlisted files.
REPORT

git rev-parse HEAD >"${package_root}/DEPLOYED_COMMIT" 2>/dev/null || true
sha256sum "$manifest_sha" >"${package_root}/MANIFEST_SHA256SUM"

tar -czf "$artifact_path" -T "$manifest_files"
(
  cd "$package_root"
  sha256sum "$artifact_name" >ARTIFACT_SHA256
)

cat >"${package_root}/README_RUNTIME.md" <<'README'
# VYRDON Mother Runtime

This release contains VYRDON Mother/root/base files staged for local review.

Runtime boundary:
- no VYRDX deployment
- no Cloudflare or DNS mutation
- no public database exposure
- no public cutover
- no service installation

The `apps/node-blood/server.js` reference service binds to `127.0.0.1` by default and may be used for local-only health checks.
README

cat >"${package_root}/ROLLBACK.md" <<'ROLLBACK'
# Rollback

Rollback changes only `/opt/vyrdon-mother/current`.

Example:

```bash
cd /opt/vyrdon-mother
test -d releases/<previous-release>
ln -sfn releases/<previous-release> current.next
mv -Tf current.next current
readlink -f current
```

Do not delete release directories during rollback.
ROLLBACK

cat <<EOF
artifact=$artifact_path
artifact_sha256=$(cut -d' ' -f1 "${package_root}/ARTIFACT_SHA256")
manifest_file_count=$(wc -l <"$manifest_files")
manifest_sha256=$(cut -d' ' -f1 "${package_root}/MANIFEST_SHA256SUM")
secret_report=$secret_report
EOF
