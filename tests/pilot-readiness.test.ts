import assert from "node:assert/strict";
import test from "node:test";
import {
  PILOT_READINESS_BLOCKER_IDS,
  type PilotReadinessEvidence,
  type PilotReadinessGateEvidence,
} from "../app/types/pilot.ts";
import { evaluatePilotReadiness } from "../app/utils/pilot-readiness.ts";

const pendingEvidence = (): PilotReadinessGateEvidence => ({
  status: "pending",
  evidenceRef: null,
  checkedAt: null,
});

const verifiedEvidence = (evidenceRef: string): PilotReadinessGateEvidence => ({
  status: "verified",
  evidenceRef,
  checkedAt: "2026-08-12T16:00:00.000Z",
});

test("pilot readiness remains blocked when evidence is absent", () => {
  const result = evaluatePilotReadiness(undefined);

  assert.equal(result.ready, false);
  assert.deepEqual(result.blockers, PILOT_READINESS_BLOCKER_IDS);
});

test("pilot readiness reports only the missing evidence", () => {
  const evidence: PilotReadinessEvidence = {
    contentHandoffAuthorized: verifiedEvidence("owner-risk/lesson-1"),
    audioAttributionVerified: verifiedEvidence("docs/audio-attribution.md"),
    mobileFlowEvidenceVerified: pendingEvidence(),
    facilitatorProtocolReady: verifiedEvidence("docs/beginner-pilot-plan.md"),
    participantConsentReady: verifiedEvidence("owner-controlled/consent-script"),
    privacyReviewPassed: verifiedEvidence("owner-controlled/privacy-review"),
  };

  assert.deepEqual(evaluatePilotReadiness(evidence), {
    ready: false,
    blockers: ["mobile-flow-evidence"],
  });
});

test("verified labels without traceable evidence remain blocked", () => {
  const malformed = {
    status: "verified",
    evidenceRef: "   ",
    checkedAt: "2026-08-12",
  } as unknown as PilotReadinessGateEvidence;

  const evidence: PilotReadinessEvidence = {
    contentHandoffAuthorized: malformed,
    audioAttributionVerified: verifiedEvidence("docs/audio-attribution.md"),
    mobileFlowEvidenceVerified: verifiedEvidence("docs/qa/lesson-2-20-390x844.md"),
    facilitatorProtocolReady: verifiedEvidence("docs/beginner-pilot-plan.md"),
    participantConsentReady: verifiedEvidence("owner-controlled/consent-script"),
    privacyReviewPassed: verifiedEvidence("owner-controlled/privacy-review"),
  };

  assert.deepEqual(evaluatePilotReadiness(evidence), {
    ready: false,
    blockers: ["content-handoff-authorization"],
  });
});

test("pilot readiness is ready only when every evidence gate is explicit", () => {
  const evidence: PilotReadinessEvidence = {
    contentHandoffAuthorized: verifiedEvidence("owner-risk/lesson-1"),
    audioAttributionVerified: verifiedEvidence("docs/audio-attribution.md"),
    mobileFlowEvidenceVerified: verifiedEvidence("docs/qa/lesson-2-20-390x844.md"),
    facilitatorProtocolReady: verifiedEvidence("docs/beginner-pilot-plan.md"),
    participantConsentReady: verifiedEvidence("owner-controlled/consent-script"),
    privacyReviewPassed: verifiedEvidence("owner-controlled/privacy-review"),
  };

  assert.deepEqual(evaluatePilotReadiness(evidence), {
    ready: true,
    blockers: [],
  });
});
