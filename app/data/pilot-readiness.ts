import type {
  PilotReadinessEvidence,
  PilotReadinessGateEvidence,
} from "../types/pilot.ts";
import { evaluatePilotReadiness } from "../utils/pilot-readiness.ts";

const pendingEvidence: PilotReadinessGateEvidence = {
  status: "pending",
  evidenceRef: null,
  checkedAt: null,
};

const verifiedEvidence = (
  evidenceRef: string,
  checkedAt: string,
): PilotReadinessGateEvidence => ({
  status: "verified",
  evidenceRef,
  checkedAt,
});

export const pilotCandidateLessonId = "lesson-19-polite-exchanges-package";

export const currentPilotReadinessEvidence: PilotReadinessEvidence = {
  contentHandoffAuthorized: verifiedEvidence(
    "https://github.com/f8qtn9kycq-crypto/Taigi-starter/pull/206#issuecomment-5463466207",
    "2026-08-29T16:12:17.000Z",
  ),
  audioAttributionVerified: verifiedEvidence(
    "docs/qa/lesson-2-20-390x844.md",
    "2026-07-26T03:23:27.000Z",
  ),
  mobileFlowEvidenceVerified: verifiedEvidence(
    "docs/qa/lesson-2-20-390x844.md",
    "2026-07-26T03:23:27.000Z",
  ),
  facilitatorProtocolReady: verifiedEvidence(
    "owner-controlled:m2.5-facilitator-rehearsal-2026-08-30T163038Z.yaml#sha256=e5c93f265e5733b51bb912054646e6ed09adf90f8f6dba181a12c6142241ba56",
    "2026-08-30T16:30:38.000Z",
  ),
  participantConsentReady: pendingEvidence,
  privacyReviewPassed: pendingEvidence,
};

export const currentPilotReadiness = evaluatePilotReadiness(
  currentPilotReadinessEvidence,
);
