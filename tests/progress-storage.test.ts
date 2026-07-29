import assert from "node:assert/strict";
import test from "node:test";
import { prototypeLesson } from "../app/data/lessons.ts";
import {
  mergePendingProgress,
  parseStoredProgress,
  serializeProgress,
} from "../app/services/progress-storage.ts";
import { DEFAULT_PROGRESS } from "../app/types/learning.ts";

const now = new Date("2026-07-11T00:00:00.000Z");
const parseOptions = { stageCount: prototypeLesson.stages.length, now };

test("invalid local state falls back safely", () => {
  assert.deepEqual(parseStoredProgress("not json", parseOptions), DEFAULT_PROGRESS);
  assert.deepEqual(parseStoredProgress(null, parseOptions), DEFAULT_PROGRESS);
});

test("legacy progress migrates to version 4", () => {
  const migrated = parseStoredProgress(
    JSON.stringify({ locale: "en", stage: 3, hasStarted: true, dueCount: 1 }),
    parseOptions,
  );

  assert.equal(migrated.version, 4);
  assert.equal(migrated.lessonId, DEFAULT_PROGRESS.lessonId);
  assert.equal(migrated.locale, "en");
  assert.equal(migrated.stage, 3);
  assert.equal(migrated.hasStarted, true);
  assert.equal(migrated.reviewCard?.id, "li-tsiah-pa-bue");
  assert.equal(migrated.reviewCard?.dueAt, now.toISOString());
});

test("version 4 progress round trips", () => {
  const progress = { ...DEFAULT_PROGRESS, hasStarted: true, stage: 2 };
  assert.deepEqual(parseStoredProgress(serializeProgress(progress), parseOptions), progress);
});

test("version 3 progress keeps its stage while adding the default lesson", () => {
  const migrated = parseStoredProgress(JSON.stringify({
    version: 3,
    locale: "zh",
    stage: 2,
    phraseIndex: 0,
    hasStarted: true,
    reviewCard: null,
  }), parseOptions);

  assert.equal(migrated.version, 4);
  assert.equal(migrated.lessonId, DEFAULT_PROGRESS.lessonId);
  assert.equal(migrated.stage, 2);
});

test("stored stage validation follows lesson metadata", () => {
  const stored = serializeProgress({ ...DEFAULT_PROGRESS, hasStarted: true, stage: 4 });

  assert.equal(parseStoredProgress(stored, { stageCount: 3, now }).stage, DEFAULT_PROGRESS.stage);
  assert.equal(parseStoredProgress(stored, parseOptions).stage, 4);
});

test("hydration preserves progress updates made before storage is ready", () => {
  const stored = { ...DEFAULT_PROGRESS };

  assert.deepEqual(
    mergePendingProgress(stored, { hasStarted: true, stage: 1 }),
    { ...stored, hasStarted: true, stage: 1 },
  );
});


test("lesson switching clears the previous lesson review card", () => {
  const previous = {
    ...DEFAULT_PROGRESS,
    lessonId: "lesson-1-greetings",
    reviewCard: {
      id: "li-tsiah-pa-bue",
      dueAt: now.toISOString(),
      intervalDays: 0,
      repetitions: 0,
      easeFactor: 2.3,
      lastReviewedAt: null,
    },
  };

  const switched = mergePendingProgress(previous, {
    lessonId: "lesson-2-family",
    stage: 0,
    phraseIndex: 0,
    reviewCard: null,
  });

  assert.equal(switched.lessonId, "lesson-2-family");
  assert.equal(switched.reviewCard, null);
});