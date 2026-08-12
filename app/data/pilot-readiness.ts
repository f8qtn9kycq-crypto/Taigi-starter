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
  approvedTeacherHandoff: pendingEvidence,
  audioAttributionVerified: verifiedEvidence(
    "docs/qa/lesson-2-20-390x844.md",
    "2026-07-26T03:23:27.000Z",
  ),
  mobileFlowEvidenceVerified: verifiedEvidence(
    "docs/qa/lesson-2-20-390x844.md",
    "2026-07-26T03:23:27.000Z",
  ),
  facilitatorProtocolReady: pendingEvidence,
  participantConsentReady: pendingEvidence,
  privacyReviewPassed: pendingEvidence,
};

export const currentPilotReadiness = evaluatePilotReadiness(
  currentPilotReadinessEvidence,
);
