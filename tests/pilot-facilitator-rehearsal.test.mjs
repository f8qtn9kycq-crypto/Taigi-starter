import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("facilitator rehearsal is executable without self-approving readiness", async () => {
  const [artifact, readinessSource, plan] = await Promise.all([
    readFile(new URL("../docs/pilot/facilitator-rehearsal.md", import.meta.url), "utf8"),
    readFile(new URL("../app/data/pilot-readiness.ts", import.meta.url), "utf8"),
    readFile(new URL("../docs/beginner-pilot-plan.md", import.meta.url), "utf8"),
  ]);

  assert.match(artifact, /m2\.5-facilitator-rehearsal-v1/);
  assert.match(artifact, /not-completed/);
  assert.match(artifact, /not-participant-evidence/);
  assert.match(artifact, /DO NOT COMMIT FILLED RECORDS/);
  assert.match(artifact, /不提示答案/);
  assert.match(artifact, /不錄音替代路徑/);
  assert.match(artifact, /立即停止/);
  assert.match(artifact, /participantPresent: no/);
  assert.match(artifact, /participantRecordCreated: no/);
  assert.match(artifact, /FACILITATOR_REHEARSAL_RECORD_START/);
  assert.match(artifact, /FACILITATOR_REHEARSAL_RECORD_END/);
  assert.match(plan, /docs\/pilot\/facilitator-rehearsal\.md/);
  assert.match(readinessSource, /facilitatorProtocolReady: pendingEvidence/);
  assert.doesNotMatch(readinessSource, /facilitatorProtocolReady: verifiedEvidence/);
});
