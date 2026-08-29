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

test("current pilot readiness stays blocked on human evidence", () => {
  assert.deepEqual(currentPilotReadiness, {
    ready: false,
    blockers: [
      "facilitator-protocol",
      "participant-consent",
      "privacy-review",
    ],
  });

  for (const gate of [
    currentPilotReadinessEvidence.facilitatorProtocolReady,
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
