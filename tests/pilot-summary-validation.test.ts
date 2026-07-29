import assert from "node:assert/strict";
import test from "node:test";
import { PILOT_SUMMARY_PENDING } from "../app/types/pilot-summary.ts";
import { validatePilotAggregateSummary } from "../app/utils/pilot-summary-validation.ts";

const notRunSummary = () => ({
  pilotStatus: "not-run",
  participantCount: "not-run",
  startedCount: "not-run",
  completedCount: "not-run",
  completionRate: "not-run",
  completionTimeMedianMinutes: "not-run",
  immediateRecallRate: "not-run",
  delayedRecallRate: "not-run",
  confidenceChangeMedian: "not-run",
  topAbandonmentStages: "not-run",
  privacyOrSafetyIncidents: "not-run",
  metadata: {
    testCommit: "cc96c02",
    lesson: "Lesson 1",
    viewport: "390x844",
    executedAt: "not-run",
    evidenceLocation: "owner-controlled pilot evidence",
  },
});

const completeSummary = () => ({
  ...notRunSummary(),
  pilotStatus: "complete",
  participantCount: 10,
  startedCount: 10,
  completedCount: 8,
  completionRate: 0.8,
  completionTimeMedianMinutes: 12.5,
  immediateRecallRate: 0.75,
  delayedRecallRate: 0.6,
  confidenceChangeMedian: 1,
  topAbandonmentStages: ["say", "recall"],
  privacyOrSafetyIncidents: 0,
  metadata: {
    ...notRunSummary().metadata,
    executedAt: "2026-07-26T01:00:00Z",
  },
});

test("not-run summaries remain valid without participant results", () => {
  assert.deepEqual(validatePilotAggregateSummary(notRunSummary()), []);
});

test("partial not-run summaries reject invented metrics", () => {
  const invalid = { ...notRunSummary(), completedCount: 3 };
  const issues = validatePilotAggregateSummary(invalid);

  assert.deepEqual(
    issues.filter(({ path }) => path === "summary.completedCount"),
    [{
      path: "summary.completedCount",
      code: "not-run-must-be-sentinel",
      message: "must be not-run until participant evidence exists",
    }],
  );
});

test("participant-level fields are rejected", () => {
  const invalid = { ...notRunSummary(), participantId: "P01", facilitatorNote: "raw note" };
  const issues = validatePilotAggregateSummary(invalid);

  assert.deepEqual(
    issues.filter(({ code }) => code === "participant-data").map(({ path }) => path),
    ["summary.participantId", "summary.facilitatorNote"],
  );
});

test("completed summaries require consistent bounded aggregates", () => {
  assert.deepEqual(validatePilotAggregateSummary(completeSummary()), []);

  const invalid = { ...completeSummary(), completionRate: 1.5, completedCount: 7 };
  const codes = validatePilotAggregateSummary(invalid).map(({ code }) => code);

  assert.ok(codes.includes("out-of-range"));
  assert.ok(codes.includes("inconsistent-counts"));
});

test("completed summaries allow delayed recall to remain pending", () => {
  const pendingDelayedRecall = {
    ...completeSummary(),
    delayedRecallRate: PILOT_SUMMARY_PENDING,
  };

  assert.deepEqual(validatePilotAggregateSummary(pendingDelayedRecall), []);
});

test("completed summaries reject invalid stage IDs and timestamps", () => {
  const invalid = {
    ...completeSummary(),
    topAbandonmentStages: ["say", "not-a-stage"],
    metadata: { ...completeSummary().metadata, executedAt: "yesterday" },
  };
  const paths = validatePilotAggregateSummary(invalid).map(({ path }) => path);

  assert.ok(paths.includes("topAbandonmentStages[1]"));
  assert.ok(paths.includes("metadata.executedAt"));
});
