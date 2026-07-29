import type { LessonStageId } from "./lesson.ts";

export const PILOT_SUMMARY_NOT_RUN = "not-run" as const;
export type PilotSummaryNotRun = typeof PILOT_SUMMARY_NOT_RUN;
export const PILOT_SUMMARY_PENDING = "pending" as const;
export type PilotSummaryPending = typeof PILOT_SUMMARY_PENDING;
export type PilotSummaryMetric = number | PilotSummaryNotRun;
export type PilotSummaryDelayedRecallMetric = PilotSummaryMetric | PilotSummaryPending;

export type PilotSummaryMetadata = Readonly<{
  testCommit: string;
  lesson: string;
  viewport: string;
  executedAt: string;
  evidenceLocation: string;
}>;

export type PilotAggregateSummary = Readonly<{
  pilotStatus: "not-run" | "complete";
  participantCount: PilotSummaryMetric;
  startedCount: PilotSummaryMetric;
  completedCount: PilotSummaryMetric;
  completionRate: PilotSummaryMetric;
  completionTimeMedianMinutes: PilotSummaryMetric;
  immediateRecallRate: PilotSummaryMetric;
  delayedRecallRate: PilotSummaryDelayedRecallMetric;
  confidenceChangeMedian: PilotSummaryMetric;
  topAbandonmentStages: readonly LessonStageId[] | PilotSummaryNotRun;
  privacyOrSafetyIncidents: PilotSummaryMetric;
  metadata: PilotSummaryMetadata;
}>;
