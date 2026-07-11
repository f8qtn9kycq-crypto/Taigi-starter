import assert from "node:assert/strict";
import test from "node:test";
import { parseStoredProgress, serializeProgress } from "../app/services/progress-storage.ts";
import { DEFAULT_PROGRESS } from "../app/types/learning.ts";

const now = new Date("2026-07-11T00:00:00.000Z");

test("invalid local state falls back safely", () => {
  assert.deepEqual(parseStoredProgress("not json", now), DEFAULT_PROGRESS);
  assert.deepEqual(parseStoredProgress(null, now), DEFAULT_PROGRESS);
});

test("legacy progress migrates to version 2", () => {
  const migrated = parseStoredProgress(
    JSON.stringify({ locale: "en", stage: 3, hasStarted: true, dueCount: 1 }),
    now,
  );

  assert.equal(migrated.version, 2);
  assert.equal(migrated.locale, "en");
  assert.equal(migrated.stage, 3);
  assert.equal(migrated.hasStarted, true);
  assert.equal(migrated.lessonOneReview?.dueAt, now.toISOString());
});

test("version 2 progress round trips", () => {
  const progress = { ...DEFAULT_PROGRESS, hasStarted: true, stage: 2 };
  assert.deepEqual(parseStoredProgress(serializeProgress(progress), now), progress);
});
