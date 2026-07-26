#!/usr/bin/env bash
set -euo pipefail

mode="${1:-check}"
database_name="${D1_DATABASE_NAME:-}"
artifact="${D1_RECOVERY_ARTIFACT:-}"
target_database="${D1_RECOVERY_TARGET_DATABASE_NAME:-}"
confirmation="${D1_RECOVERY_CONFIRM:-}"

usage() {
  cat <<'USAGE'
Usage:
  D1_DATABASE_NAME=<name> bash scripts/d1-recovery.sh check
  D1_DATABASE_NAME=<name> bash scripts/d1-recovery.sh backup
  D1_DATABASE_NAME=<production> D1_RECOVERY_TARGET_DATABASE_NAME=<staging> \
    D1_RECOVERY_ARTIFACT=<file.sql> \
    D1_RECOVERY_CONFIRM=I_UNDERSTAND_STAGING_RESTORE \
    bash scripts/d1-recovery.sh restore
  D1_DATABASE_NAME=<name> D1_RECOVERY_BOOKMARK=<bookmark> \
    D1_RECOVERY_CONFIRM=I_UNDERSTAND_PRODUCTION_RESTORE \
    bash scripts/d1-recovery.sh time-travel-restore

The restore modes are intentionally guarded. Never restore production data
without an owner-approved bookmark and a captured pre-restore backup.
USAGE
}

require_database() {
  if [[ -z "${database_name}" ]]; then
    echo "D1_DATABASE_NAME is required" >&2
    exit 64
  fi
}

require_confirmation() {
  local expected="$1"
  if [[ "${confirmation}" != "${expected}" ]]; then
    echo "Refusing destructive recovery: set D1_RECOVERY_CONFIRM=${expected}" >&2
    exit 77
  fi
}

case "${mode}" in
  check)
    require_database
    npx wrangler d1 info "${database_name}"
    if npx wrangler d1 time-travel info "${database_name}"; then
      echo "D1 recovery capability: time-travel"
    else
      echo "Time Travel info unavailable; checking legacy backup support." >&2
      npx wrangler d1 backup list "${database_name}"
      echo "D1 recovery capability: legacy-backup"
    fi
    ;;
  backup)
    require_database
    if [[ -z "${artifact}" ]]; then
      echo "D1_RECOVERY_ARTIFACT must point to a new .sql output file" >&2
      exit 64
    fi
    if [[ -e "${artifact}" ]]; then
      echo "Refusing to overwrite existing recovery artifact: ${artifact}" >&2
      exit 73
    fi
    mkdir -p "$(dirname "${artifact}")"
    npx wrangler d1 export "${database_name}" --remote --output="${artifact}"
    test -s "${artifact}"
    if command -v shasum >/dev/null 2>&1; then
      shasum -a 256 "${artifact}" | tee "${artifact}.sha256"
    else
      sha256sum "${artifact}" | tee "${artifact}.sha256"
    fi
    echo "D1 backup export complete: ${artifact}"
    ;;
  restore)
    require_database
    if [[ -z "${target_database}" || -z "${artifact}" ]]; then
      echo "D1_RECOVERY_TARGET_DATABASE_NAME and D1_RECOVERY_ARTIFACT are required" >&2
      exit 64
    fi
    if [[ "${target_database}" == "${database_name}" && "${D1_RECOVERY_ALLOW_PRODUCTION:-}" != "true" ]]; then
      echo "Refusing same-database restore; use an isolated target or explicitly set D1_RECOVERY_ALLOW_PRODUCTION=true" >&2
      exit 77
    fi
    require_confirmation "I_UNDERSTAND_STAGING_RESTORE"
    test -s "${artifact}"
    npx wrangler d1 execute "${target_database}" --remote --file="${artifact}"
    echo "D1 artifact restore complete: ${target_database}"
    ;;
  time-travel-restore)
    require_database
    bookmark="${D1_RECOVERY_BOOKMARK:-}"
    if [[ -z "${bookmark}" ]]; then
      echo "D1_RECOVERY_BOOKMARK is required" >&2
      exit 64
    fi
    require_confirmation "I_UNDERSTAND_PRODUCTION_RESTORE"
    npx wrangler d1 time-travel restore "${database_name}" --bookmark="${bookmark}"
    echo "D1 Time Travel restore complete: ${database_name}"
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage >&2
    exit 64
    ;;
esac
