import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const templateUrl = new URL(
  "../docs/pilot/participant-consent-template.md",
  import.meta.url,
);
const planUrl = new URL("../docs/beginner-pilot-plan.md", import.meta.url);
const readinessUrl = new URL("../app/data/pilot-readiness.ts", import.meta.url);

test("pilot consent template is versioned, reviewable, and not self-approving", async () => {
  const [template, plan, readiness] = await Promise.all([
    readFile(templateUrl, "utf8"),
    readFile(planUrl, "utf8"),
    readFile(readinessUrl, "utf8"),
  ]);

  for (const requiredText of [
    "Template ID: `m2.5-consent-v1`",
    "`template-only`／`not-approved`／`not-for-use`",
    "DO NOT COMMIT FILLED RECORDS",
    "[OWNER MUST SET]",
    "Separate delayed-recall opt-in",
    "查詢或閱覽、取得複製本、補充或更正、停止蒐集／",
    "蒐集者／執行單位名稱",
    "個人資料類別",
    "利用期間／retention",
    "利用地區",
    "利用對象／可存取角色",
    "利用方式",
    "唯一影響是無法參加本次 pilot",
    "只適用於能自行同意的成人 participant",
    "privacy/legal review",
  ]) {
    assert.match(template, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const article of [3, 7, 8]) {
    assert.match(template, new RegExp(`LawSingle\\.aspx\\?pcode=I0050021&flno=${article}`));
  }
  assert.match(plan, /docs\/pilot\/participant-consent-template\.md/);
  assert.match(readiness, /participantConsentReady: pendingEvidence/);
  assert.match(readiness, /privacyReviewPassed: pendingEvidence/);
  assert.doesNotMatch(readiness, /participantConsentReady: verifiedEvidence/);
  assert.doesNotMatch(readiness, /privacyReviewPassed: verifiedEvidence/);
});

test("blank consent record is de-identified and keeps consent choices separate", async () => {
  const template = await readFile(templateUrl, "utf8");
  const record = template.match(
    /<!-- CONSENT_RECORD_START -->([\s\S]*?)<!-- CONSENT_RECORD_END -->/,
  )?.[1];

  assert.ok(record, "blank consent record must remain machine-auditable");
  assert.match(record, /participantId: P__/);
  assert.match(record, /consentRecordedAt: YYYY-MM-DDTHH:mm:ss\.sssZ/);
  assert.match(record, /sessionChoice: consent/);
  assert.match(record, /delayedRecallChoice: opt-in-or-decline-or-not-offered/);
  assert.match(record, /deletionCompletedAt: ISO-timestamp-or-none/);
  assert.doesNotMatch(
    record,
    /participant(?:Name|Email|Phone|Signature|Address|ExactLocation):/i,
  );
});
