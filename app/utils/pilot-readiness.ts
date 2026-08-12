import type {
  PilotReadinessBlocker,
  PilotReadinessEvidence,
  PilotReadinessGateEvidence,
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

const isNonEmptyString = (value: unknown): value is string => (
  typeof value === "string" && value.trim().length > 0
);

const isValidIsoTimestamp = (value: unknown): value is string => (
  isNonEmptyString(value)
  && !Number.isNaN(Date.parse(value))
  && new Date(value).toISOString() === value
);

const isVerifiedEvidence = (
  evidence: PilotReadinessGateEvidence | null | undefined,
): boolean => (
  evidence?.status === "verified"
  && isNonEmptyString(evidence.evidenceRef)
  && isValidIsoTimestamp(evidence.checkedAt)
);

export const evaluatePilotReadiness = (
  evidence: Partial<PilotReadinessEvidence> | null | undefined,
): PilotReadinessResult => {
  const blockers = readinessChecks
    .filter(({ key }) => !isVerifiedEvidence(evidence?.[key]))
    .map(({ blocker }) => blocker);

  return {
    ready: blockers.length === 0,
    blockers,
  };
};
