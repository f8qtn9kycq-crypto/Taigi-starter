import assert from "node:assert/strict";
import test from "node:test";
import { lessonCatalog, prototypeLesson } from "../app/data/lessons.ts";
import { LESSON_STAGE_IDS } from "../app/types/lesson.ts";

test("Lesson 1 uses a short, ordered teaching rhythm", () => {
  assert.equal(prototypeLesson.durationMinutes, 5);
  assert.equal(prototypeLesson.stages.length, LESSON_STAGE_IDS.length);
  assert.deepEqual(
    prototypeLesson.stages.map((stage) => stage.id),
    LESSON_STAGE_IDS,
  );
  assert.equal(
    prototypeLesson.stages.reduce((total, stage) => total + stage.estimatedMinutes, 0),
    prototypeLesson.durationMinutes,
  );
});

test("planned lessons remain truthful content placeholders", () => {
  for (const lesson of lessonCatalog.filter((item) => item.status === "planned")) {
    assert.equal("durationMinutes" in lesson, false);
    assert.equal("stages" in lesson, false);
  }
});
