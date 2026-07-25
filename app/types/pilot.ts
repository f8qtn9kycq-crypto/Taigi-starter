export const PILOT_READINESS_BLOCKER_IDS = [
  "approved-teacher-handoff",
  "audio-attribution",
  "mobile-flow-evidence",
  "facilitator-protocol",
  "participant-consent",
  "privacy-review",
] as const;

export type PilotReadinessBlocker = typeof PILOT_READINESS_BLOCKER_IDS[number];

export type PilotReadinessEvidence = Readonly<{
  approvedTeacherHandoff: boolean;
  audioAttributionVerified: boolean;
  mobileFlowEvidenceVerified: boolean;
  facilitatorProtocolReady: boolean;
  participantConsentReady: boolean;
  privacyReviewPassed: boolean;
}>;

export type PilotReadinessResult = Readonly<{
  ready: boolean;
  blockers: readonly PilotReadinessBlocker[];
}>;
