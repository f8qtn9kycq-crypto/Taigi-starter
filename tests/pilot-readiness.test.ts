import assert from "node:assert/strict";
import test from "node:test";
import {
  PILOT_READINESS_BLOCKER_IDS,
  type PilotReadinessEvidence,
} from "../app/types/pilot.ts";
import { evaluatePilotReadiness } from "../app/utils/pilot-readiness.ts";

test("pilot readiness remains blocked when evidence is absent", () => {
  const result = evaluatePilotReadiness(undefined);

  assert.equal(result.ready, false);
  assert.deepEqual(result.blockers, PILOT_READINESS_BLOCKER_IDS);
});

test("pilot readiness reports only the missing evidence", () => {
  const evidence: PilotReadinessEvidence = {
    approvedTeacherHandoff: true,
    audioAttributionVerified: true,
    mobileFlowEvidenceVerified: false,
    facilitatorProtocolReady: true,
    participantConsentReady: true,
    privacyReviewPassed: true,
  };

  assert.deepEqual(evaluatePilotReadiness(evidence), {
    ready: false,
    blockers: ["mobile-flow-evidence"],
  });
});

test("pilot readiness is ready only when every evidence gate is explicit", () => {
  const evidence: PilotReadinessEvidence = {
    approvedTeacherHandoff: true,
    audioAttributionVerified: true,
    mobileFlowEvidenceVerified: true,
    facilitatorProtocolReady: true,
    participantConsentReady: true,
    privacyReviewPassed: true,
  };

  assert.deepEqual(evaluatePilotReadiness(evidence), {
    ready: true,
    blockers: [],
  });
});
