#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'USAGE'
Usage:
  TARGET_SSH=root@<approved-droplet-host> \
  ARTIFACT=dist/vyrdon-mother/<timestamp>/vyrdon-mother-<timestamp>.tar.gz \
  SNAPSHOT_CONFIRMED=yes \
  SNAPSHOT_NAME=<digitalocean-snapshot-name> \
  SNAPSHOT_TIME_UTC=<snapshot-created-time> \
  OWNER_APPROVED_STAGE=yes \
  ./ops/droplet/stage-vyrdon-mother.sh

Stages to /opt/vyrdon-mother/releases/<timestamp> and updates current.
USAGE
}

target="${TARGET_SSH:-${1:-}}"
artifact="${ARTIFACT:-${2:-}}"

if [[ -z "$target" || -z "$artifact" ]]; then
  usage >&2
  exit 2
fi

if [[ "${SNAPSHOT_CONFIRMED:-}" != "yes" ]]; then
  echo "blocked: set SNAPSHOT_CONFIRMED=yes after owner confirms DigitalOcean snapshot" >&2
  exit 3
fi

if [[ -z "${SNAPSHOT_NAME:-}" || -z "${SNAPSHOT_TIME_UTC:-}" ]]; then
  echo "blocked: SNAPSHOT_NAME and SNAPSHOT_TIME_UTC are required" >&2
  exit 3
fi

if [[ "${OWNER_APPROVED_STAGE:-}" != "yes" ]]; then
  echo "blocked: set OWNER_APPROVED_STAGE=yes after owner approves staging mutation" >&2
  exit 3
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

if [[ ! -f "$artifact" ]]; then
  echo "artifact not found: $artifact" >&2
  exit 1
fi

package_dir="$(cd "$(dirname "$artifact")" && pwd)"
artifact_abs="${package_dir}/$(basename "$artifact")"
artifact_name="$(basename "$artifact_abs")"
release_ts="${artifact_name#vyrdon-mother-}"
release_ts="${release_ts%.tar.gz}"

required_sidecars=(
  "MANIFEST.files"
  "MANIFEST.sha256"
  "MANIFEST_SHA256SUM"
  "ARTIFACT_SHA256"
  "DEPLOYED_COMMIT"
  "README_RUNTIME.md"
  "ROLLBACK.md"
  "SECRETS_EXCLUSION_REPORT.txt"
)

for sidecar in "${required_sidecars[@]}"; do
  if [[ ! -f "${package_dir}/${sidecar}" ]]; then
    echo "missing package sidecar: ${package_dir}/${sidecar}" >&2
    exit 1
  fi
done

(
  cd "$package_dir"
  sha256sum -c ARTIFACT_SHA256
)

ssh_args=(-o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=accept-new)
scp_args=(-o BatchMode=yes -o ConnectTimeout=12 -o StrictHostKeyChecking=accept-new)
if [[ -n "${SSH_OPTS:-}" ]]; then
  read -r -a extra_ssh_args <<<"$SSH_OPTS"
  ssh_args+=("${extra_ssh_args[@]}")
  scp_args+=("${extra_ssh_args[@]}")
fi

remote_tmp="/tmp/vyrdon-mother-stage-${release_ts}"
ssh "${ssh_args[@]}" "$target" "mkdir -p '$remote_tmp'"
scp "${scp_args[@]}" \
  "$artifact_abs" \
  "${package_dir}/MANIFEST.files" \
  "${package_dir}/MANIFEST.sha256" \
  "${package_dir}/MANIFEST_SHA256SUM" \
  "${package_dir}/ARTIFACT_SHA256" \
  "${package_dir}/DEPLOYED_COMMIT" \
  "${package_dir}/README_RUNTIME.md" \
  "${package_dir}/ROLLBACK.md" \
  "${package_dir}/SECRETS_EXCLUSION_REPORT.txt" \
  "$target:$remote_tmp/"

ssh "${ssh_args[@]}" "$target" 'bash -s' -- "$remote_tmp" "$artifact_name" "$release_ts" "$SNAPSHOT_NAME" "$SNAPSHOT_TIME_UTC" <<'REMOTE'
set -Eeuo pipefail

remote_tmp="$1"
artifact_name="$2"
release_ts="$3"
snapshot_name="$4"
snapshot_time_utc="$5"

dest="/opt/vyrdon-mother"
release="${dest}/releases/${release_ts}"

if [[ -e "${dest}/current" && ! -L "${dest}/current" ]]; then
  echo "blocked: ${dest}/current exists and is not a symlink" >&2
  exit 1
fi

if [[ -e "$release" ]]; then
  echo "blocked: release already exists: $release" >&2
  exit 1
fi

mkdir -p "${dest}/releases"
mkdir "$release"

tar -xzf "${remote_tmp}/${artifact_name}" -C "$release"
cp "${remote_tmp}/MANIFEST.files" "$release/"
cp "${remote_tmp}/MANIFEST.sha256" "$release/"
cp "${remote_tmp}/MANIFEST_SHA256SUM" "$release/"
cp "${remote_tmp}/ARTIFACT_SHA256" "$release/"
cp "${remote_tmp}/DEPLOYED_COMMIT" "$release/"
cp "${remote_tmp}/README_RUNTIME.md" "$release/"
cp "${remote_tmp}/ROLLBACK.md" "$release/"
cp "${remote_tmp}/SECRETS_EXCLUSION_REPORT.txt" "$release/"

cat >"${release}/SNAPSHOT_CONFIRMATION" <<EOF
SNAPSHOT_CONFIRMED=yes
SNAPSHOT_NAME=${snapshot_name}
SNAPSHOT_TIME_UTC=${snapshot_time_utc}
EOF

(
  cd "$release"
  sha256sum -c MANIFEST.sha256
)

ln -sfn "releases/${release_ts}" "${dest}/current.next"
mv -Tf "${dest}/current.next" "${dest}/current"

echo "staged_path=$release"
echo "current=$(readlink -f "${dest}/current")"
echo "file_count=$(find "$release" -type f | wc -l)"
REMOTE
