import assert from "node:assert/strict";
import test from "node:test";
import {
  currentPilotReadiness,
  currentPilotReadinessEvidence,
  pilotCandidateLessonId,
} from "../app/data/pilot-readiness.ts";
import { lessonPackages } from "../app/data/lesson-packages.ts";

test("current pilot readiness names one candidate lesson and traceable evidence", () => {
  assert.equal(pilotCandidateLessonId, "lesson-19-polite-exchanges-package");
  assert.equal(
    lessonPackages.find(({ id }) => id === pilotCandidateLessonId)?.pathOrder,
    2,
  );
  assert.deepEqual(currentPilotReadinessEvidence.audioAttributionVerified, {
    status: "verified",
    evidenceRef: "docs/qa/lesson-2-20-390x844.md",
    checkedAt: "2026-07-26T03:23:27.000Z",
  });
  assert.deepEqual(currentPilotReadinessEvidence.mobileFlowEvidenceVerified, {
    status: "verified",
    evidenceRef: "docs/qa/lesson-2-20-390x844.md",
    checkedAt: "2026-07-26T03:23:27.000Z",
  });
  assert.deepEqual(currentPilotReadinessEvidence.contentHandoffAuthorized, {
    status: "verified",
    evidenceRef: "https://github.com/f8qtn9kycq-crypto/Taigi-starter/pull/206#issuecomment-5463466207",
    checkedAt: "2026-08-29T16:12:17.000Z",
  });
});

test("current pilot readiness reports only the remaining consent and privacy blockers", () => {
  assert.deepEqual(currentPilotReadiness, {
    ready: false,
    blockers: [
      "participant-consent",
      "privacy-review",
    ],
  });

  assert.deepEqual(currentPilotReadinessEvidence.facilitatorProtocolReady, {
    status: "verified",
    evidenceRef:
      "owner-controlled:m2.5-facilitator-rehearsal-2026-08-30T163038Z.yaml#sha256=e5c93f265e5733b51bb912054646e6ed09adf90f8f6dba181a12c6142241ba56",
    checkedAt: "2026-08-30T16:30:38.000Z",
  });

  for (const gate of [
    currentPilotReadinessEvidence.participantConsentReady,
    currentPilotReadinessEvidence.privacyReviewPassed,
  ]) {
    assert.deepEqual(gate, {
      status: "pending",
      evidenceRef: null,
      checkedAt: null,
    });
  }
});
