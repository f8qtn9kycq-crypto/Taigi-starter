export const PILOT_READINESS_BLOCKER_IDS = [
  "content-handoff-authorization",
  "audio-attribution",
  "mobile-flow-evidence",
  "facilitator-protocol",
  "participant-consent",
  "privacy-review",
] as const;

export type PilotReadinessBlocker = typeof PILOT_READINESS_BLOCKER_IDS[number];

export type PilotReadinessGateEvidence =
  | Readonly<{
    status: "pending";
    evidenceRef: null;
    checkedAt: null;
  }>
  | Readonly<{
    status: "verified";
    evidenceRef: string;
    checkedAt: string;
  }>;

export type PilotReadinessEvidence = Readonly<{
  contentHandoffAuthorized: PilotReadinessGateEvidence;
  audioAttributionVerified: PilotReadinessGateEvidence;
  mobileFlowEvidenceVerified: PilotReadinessGateEvidence;
  facilitatorProtocolReady: PilotReadinessGateEvidence;
  participantConsentReady: PilotReadinessGateEvidence;
  privacyReviewPassed: PilotReadinessGateEvidence;
}>;

export type PilotReadinessResult = Readonly<{
  ready: boolean;
  blockers: readonly PilotReadinessBlocker[];
}>;
