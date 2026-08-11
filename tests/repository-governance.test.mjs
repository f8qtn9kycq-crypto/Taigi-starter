import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Keep the repository-level governance contract executable in CI.
const templateUrl = new URL("../.github/pull_request_template.md", import.meta.url);

test("pull request template is valid UTF-8 with required delivery gates", async () => {
  const bytes = await readFile(templateUrl);
  const template = new TextDecoder("utf-8", { fatal: true }).decode(bytes);

  for (const heading of [
    "## Goal",
    "## Scope",
    "## Risk tier",
    "## Review mode",
    "## Validation",
    "## UX evidence",
    "## Human approval",
    "## Safety and privacy",
  ]) {
    assert.match(template, new RegExp(`^${heading.replaceAll("#", "\\#")}$`, "m"));
  }

  assert.match(template, /Exact-head Vercel Preview is Ready/);
  assert.match(template, /Post-merge Vercel Production read-back/);
  assert.match(template, /CI, Preview, real-device, and participant evidence are reported separately/);
  assert.match(template, /Required human demo completed on the exact PR head/);
});
