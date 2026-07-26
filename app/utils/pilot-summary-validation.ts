import { LESSON_STAGE_IDS, type LessonStageId } from "../types/lesson.ts";
import {
  PILOT_SUMMARY_NOT_RUN,
  type PilotAggregateSummary,
} from "../types/pilot-summary.ts";

const PILOT_SUMMARY_KEYS = [
  "pilotStatus",
  "participantCount",
  "startedCount",
  "completedCount",
  "completionRate",
  "completionTimeMedianMinutes",
  "immediateRecallRate",
  "delayedRecallRate",
  "confidenceChangeMedian",
  "topAbandonmentStages",
  "privacyOrSafetyIncidents",
  "metadata",
] as const;

const METRIC_KEYS = [
  "participantCount",
  "startedCount",
  "completedCount",
  "completionRate",
  "completionTimeMedianMinutes",
  "immediateRecallRate",
  "delayedRecallRate",
  "confidenceChangeMedian",
  "privacyOrSafetyIncidents",
] as const;

const METADATA_KEYS = [
  "testCommit",
  "lesson",
  "viewport",
  "executedAt",
  "evidenceLocation",
] as const;

const PARTICIPANT_LEVEL_KEYS = new Set([
  "participantId",
  "participantIds",
  "participants",
  "observationSheet",
  "facilitatorNote",
  "rawNotes",
  "recordings",
]);

const STAGE_IDS = new Set<string>(LESSON_STAGE_IDS);

export type PilotSummaryValidationCode =
  | "invalid-record"
  | "unknown-field"
  | "participant-data"
  | "missing-field"
  | "invalid-status"
  | "not-run-must-be-sentinel"
  | "invalid-metric"
  | "invalid-count"
  | "inconsistent-counts"
  | "out-of-range"
  | "invalid-stage"
  | "invalid-metadata"
  | "invalid-timestamp";

export type PilotSummaryValidationIssue = Readonly<{
  path: string;
  code: PilotSummaryValidationCode;
  message: string;
}>;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => (
  typeof value === "object" && value !== null && !Array.isArray(value)
);

const isNonEmptyString = (value: unknown): value is string => (
  typeof value === "string" && value.trim().length > 0
);

const addIssue = (
  issues: PilotSummaryValidationIssue[],
  path: string,
  code: PilotSummaryValidationCode,
  message: string,
): void => {
  issues.push({ path, code, message });
};

const checkUnknownFields = (
  value: UnknownRecord,
  allowedKeys: readonly string[],
  path: string,
  issues: PilotSummaryValidationIssue[],
): void => {
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(value)) {
    if (allowed.has(key)) continue;
    addIssue(
      issues,
      `${path}.${key}`,
      PARTICIPANT_LEVEL_KEYS.has(key) ? "participant-data" : "unknown-field",
      PARTICIPANT_LEVEL_KEYS.has(key)
        ? "participant-level data must not be included in an aggregate summary"
        : "field is not part of the aggregate summary contract",
    );
  }
};

const requireFields = (
  value: UnknownRecord,
  fields: readonly string[],
  path: string,
  issues: PilotSummaryValidationIssue[],
): void => {
  for (const field of fields) {
    if (!(field in value)) {
      addIssue(issues, `${path}.${field}`, "missing-field", "required field is missing");
    }
  }
};

const isFiniteNumber = (value: unknown): value is number => (
  typeof value === "number" && Number.isFinite(value)
);

const isNonNegativeInteger = (value: unknown): value is number => (
  isFiniteNumber(value) && Number.isInteger(value) && value >= 0
);

const validateMetadata = (
  value: unknown,
  status: unknown,
  issues: PilotSummaryValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, "metadata", "invalid-metadata", "must be a metadata record");
    return;
  }

  checkUnknownFields(value, METADATA_KEYS, "metadata", issues);
  requireFields(value, METADATA_KEYS, "metadata", issues);

  for (const field of ["testCommit", "lesson", "viewport", "evidenceLocation"] as const) {
    if (!isNonEmptyString(value[field])) {
      addIssue(issues, `metadata.${field}`, "invalid-metadata", "must be a non-empty string");
    }
  }

  if (!isNonEmptyString(value.executedAt)) {
    addIssue(issues, "metadata.executedAt", "invalid-metadata", "must be a non-empty string");
  } else if (status === PILOT_SUMMARY_NOT_RUN && value.executedAt !== PILOT_SUMMARY_NOT_RUN) {
    addIssue(
      issues,
      "metadata.executedAt",
      "invalid-timestamp",
      "must remain not-run before pilot execution",
    );
  } else if (status === "complete") {
    const parsed = Date.parse(value.executedAt);
    if (!Number.isFinite(parsed) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value.executedAt)) {
      addIssue(issues, "metadata.executedAt", "invalid-timestamp", "must be an ISO-8601 UTC timestamp");
    }
  }
};

const validateNotRun = (
  value: UnknownRecord,
  issues: PilotSummaryValidationIssue[],
): void => {
  for (const field of METRIC_KEYS) {
    if (value[field] !== PILOT_SUMMARY_NOT_RUN) {
      addIssue(
        issues,
        `summary.${field}`,
        "not-run-must-be-sentinel",
        "must be not-run until participant evidence exists",
      );
    }
  }

  if (value.topAbandonmentStages !== PILOT_SUMMARY_NOT_RUN) {
    addIssue(
      issues,
      "summary.topAbandonmentStages",
      "not-run-must-be-sentinel",
      "must be not-run until participant evidence exists",
    );
  }
};

const validateComplete = (
  value: UnknownRecord,
  issues: PilotSummaryValidationIssue[],
): void => {
  for (const field of METRIC_KEYS) {
    if (!isFiniteNumber(value[field])) {
      addIssue(issues, field, "invalid-metric", "must be a finite number when pilot is complete");
    }
  }

  const participantCount = value.participantCount;
  const startedCount = value.startedCount;
  const completedCount = value.completedCount;
  const completionRate = value.completionRate;

  if (!isNonNegativeInteger(participantCount) || participantCount < 10 || participantCount > 20) {
    addIssue(issues, "participantCount", "invalid-count", "must be an integer from 10 through 20");
  }
  if (!isNonNegativeInteger(startedCount) || startedCount < 1 || (isNonNegativeInteger(participantCount) && startedCount > participantCount)) {
    addIssue(issues, "startedCount", "invalid-count", "must be at least 1 and no greater than participantCount");
  }
  if (!isNonNegativeInteger(completedCount) || (isNonNegativeInteger(startedCount) && completedCount > startedCount)) {
    addIssue(issues, "completedCount", "invalid-count", "must be no greater than startedCount");
  }

  if (isFiniteNumber(completionRate) && (completionRate < 0 || completionRate > 1)) {
    addIssue(issues, "completionRate", "out-of-range", "must be between 0 and 1");
  }
  if (
    isFiniteNumber(completionRate)
    && isNonNegativeInteger(startedCount)
    && isNonNegativeInteger(completedCount)
    && startedCount > 0
    && Math.abs(completionRate - completedCount / startedCount) > 0.000001
  ) {
    addIssue(issues, "completionRate", "inconsistent-counts", "must equal completedCount divided by startedCount");
  }

  const completionTime = value.completionTimeMedianMinutes;
  if (isFiniteNumber(completionTime) && completionTime <= 0) {
    addIssue(issues, "completionTimeMedianMinutes", "out-of-range", "must be greater than 0");
  }

  for (const field of ["immediateRecallRate", "delayedRecallRate"] as const) {
    const rate = value[field];
    if (isFiniteNumber(rate) && (rate < 0 || rate > 1)) {
      addIssue(issues, field, "out-of-range", "must be between 0 and 1");
    }
  }

  const confidenceChange = value.confidenceChangeMedian;
  if (isFiniteNumber(confidenceChange) && (confidenceChange < -4 || confidenceChange > 4)) {
    addIssue(issues, "confidenceChangeMedian", "out-of-range", "must be between -4 and 4");
  }

  const incidents = value.privacyOrSafetyIncidents;
  if (!isNonNegativeInteger(incidents)) {
    addIssue(issues, "privacyOrSafetyIncidents", "invalid-count", "must be a non-negative integer");
  }

  const stages = value.topAbandonmentStages;
  if (!Array.isArray(stages)) {
    addIssue(issues, "topAbandonmentStages", "invalid-stage", "must be an array of stage IDs");
    return;
  }

  const seenStages = new Set<LessonStageId>();
  for (const [index, stage] of stages.entries()) {
    if (typeof stage !== "string" || !STAGE_IDS.has(stage)) {
      addIssue(issues, `topAbandonmentStages[${index}]`, "invalid-stage", "must be a valid lesson stage ID");
      continue;
    }
    if (seenStages.has(stage as LessonStageId)) {
      addIssue(issues, `topAbandonmentStages[${index}]`, "invalid-stage", "stage IDs must be unique");
    }
    seenStages.add(stage as LessonStageId);
  }
};

export function validatePilotAggregateSummary(value: unknown): readonly PilotSummaryValidationIssue[] {
  if (!isRecord(value)) {
    return [{ path: "summary", code: "invalid-record", message: "must be an aggregate summary record" }];
  }

  const issues: PilotSummaryValidationIssue[] = [];
  checkUnknownFields(value, PILOT_SUMMARY_KEYS, "summary", issues);
  requireFields(value, PILOT_SUMMARY_KEYS, "summary", issues);

  if (value.pilotStatus !== "not-run" && value.pilotStatus !== "complete") {
    addIssue(issues, "pilotStatus", "invalid-status", "must be not-run or complete");
  }

  validateMetadata(value.metadata, value.pilotStatus, issues);
  if (value.pilotStatus === PILOT_SUMMARY_NOT_RUN) validateNotRun(value, issues);
  if (value.pilotStatus === "complete") validateComplete(value, issues);

  return issues;
}

export const isValidPilotAggregateSummary = (value: unknown): value is PilotAggregateSummary => (
  validatePilotAggregateSummary(value).length === 0
);
