#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
expected_site_project_id="appgprj_6a50ce9195588191975740438c4a8f0e"
release_base_ref="${RELEASE_BASE_REF:-github/main}"
release_head="$(git -C "${project_root}" rev-parse HEAD)"
failure_count=0

fail() {
  echo "FAIL: $1" >&2
  failure_count=$((failure_count + 1))
}

require_command() {
  command -v "$1" >/dev/null || fail "missing command: $1"
}

require_command git
require_command node
require_command npm

if [[ -n "$(git -C "${project_root}" status --short)" ]]; then
  fail "release worktree is dirty"
fi

if [[ -n "${RELEASE_SHA:-}" && "${RELEASE_SHA}" != "${release_head}" ]]; then
  fail "RELEASE_SHA does not match HEAD (${release_head})"
fi

if ! git -C "${project_root}" rev-parse --verify "${release_base_ref}" >/dev/null 2>&1; then
  fail "release base ref is unavailable: ${release_base_ref}"
else
  if ! git -C "${project_root}" diff --check "${release_base_ref}...HEAD"; then
    fail "release diff contains whitespace errors"
  fi
fi

if ! node --input-type=module - "${project_root}/.openai/hosting.json" "${expected_site_project_id}" <<'NODE'
import { readFile } from "node:fs/promises";

const [hostingPath, expectedProjectId] = process.argv.slice(2);
const hosting = JSON.parse(await readFile(hostingPath, "utf8"));
if (hosting.project_id !== expectedProjectId) {
  throw new Error(`unexpected Sites project_id: ${hosting.project_id}`);
}
if (hosting.d1 !== "DB") {
  throw new Error(`expected D1 binding DB, received: ${hosting.d1}`);
}
NODE
then
  fail "Sites hosting manifest does not match the locked project and D1 binding"
fi

echo "Running automated release checks..."
if ! npm --prefix "${project_root}" test; then
  fail "npm test failed"
fi
if ! npm --prefix "${project_root}" run lint; then
  fail "npm run lint failed"
fi

for evidence_name in MANUAL_QA_STATUS OWNER_ATTESTATION_STATUS ROLLBACK_STATUS; do
  evidence_value="${!evidence_name:-}"
  if [[ "${evidence_value}" != "pass" ]]; then
    fail "${evidence_name}=pass evidence is required"
  fi
done

if (( failure_count > 0 )); then
  echo "Production preflight blocked with ${failure_count} failure(s)." >&2
  exit 78
fi

echo "Production preflight passed for ${release_head}."
