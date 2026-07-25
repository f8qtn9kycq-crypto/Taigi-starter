import type {
  PilotReadinessBlocker,
  PilotReadinessEvidence,
  PilotReadinessResult,
} from "../types/pilot.ts";

const readinessChecks: readonly Readonly<{
  key: keyof PilotReadinessEvidence;
  blocker: PilotReadinessBlocker;
}>[] = [
  { key: "approvedTeacherHandoff", blocker: "approved-teacher-handoff" },
  { key: "audioAttributionVerified", blocker: "audio-attribution" },
  { key: "mobileFlowEvidenceVerified", blocker: "mobile-flow-evidence" },
  { key: "facilitatorProtocolReady", blocker: "facilitator-protocol" },
  { key: "participantConsentReady", blocker: "participant-consent" },
  { key: "privacyReviewPassed", blocker: "privacy-review" },
];

export const evaluatePilotReadiness = (
  evidence: Partial<PilotReadinessEvidence> | null | undefined,
): PilotReadinessResult => {
  const blockers = readinessChecks
    .filter(({ key }) => evidence?.[key] !== true)
    .map(({ blocker }) => blocker);

  return {
    ready: blockers.length === 0,
    blockers,
  };
};
