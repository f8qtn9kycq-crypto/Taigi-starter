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
});

test("current pilot readiness stays blocked on human evidence", () => {
  assert.deepEqual(currentPilotReadiness, {
    ready: false,
    blockers: [
      "approved-teacher-handoff",
      "facilitator-protocol",
      "participant-consent",
      "privacy-review",
    ],
  });

  for (const gate of [
    currentPilotReadinessEvidence.approvedTeacherHandoff,
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
