import assert from "node:assert/strict";
import test from "node:test";
import { lessonCatalog, prototypeLesson } from "../app/data/lessons.ts";
import { LESSON_STAGE_IDS } from "../app/types/lesson.ts";

test("Lesson 1 uses a short, ordered teaching rhythm", () => {
  assert.equal(prototypeLesson.durationMinutes, 5);
  assert.equal(prototypeLesson.phrases.length, 1);
  assert.equal(prototypeLesson.stages.length, LESSON_STAGE_IDS.length);
  assert.equal(new Set(prototypeLesson.stages.map((stage) => stage.id)).size, LESSON_STAGE_IDS.length);
  assert.deepEqual(
    prototypeLesson.stages.map((stage) => stage.id),
    LESSON_STAGE_IDS,
  );
  assert.equal(
    prototypeLesson.stages.reduce((total, stage) => total + stage.estimatedMinutes, 0),
    prototypeLesson.durationMinutes,
  );
});

test("Lesson 1 keeps the Busuu-style timebox within a beginner-sized session", () => {
  assert.ok(prototypeLesson.durationMinutes >= 3);
  assert.ok(prototypeLesson.durationMinutes <= 8);
  assert.ok(prototypeLesson.stages.every((stage) => stage.estimatedMinutes <= 2));
});

test("planned lessons remain truthful content placeholders", () => {
  for (const lesson of lessonCatalog.filter((item) => item.status === "planned")) {
    assert.equal("durationMinutes" in lesson, false);
    assert.equal("stages" in lesson, false);
  }
});

test("every package lesson is playable only through a complete source-backed handoff", () => {
  const playableNumbers = lessonCatalog
    .filter((lesson) => lesson.status === "prototype")
    .map((lesson) => lesson.number)
    .sort((left, right) => left - right);

  assert.deepEqual(playableNumbers, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  assert.deepEqual(
    lessonCatalog.map((lesson) => lesson.pathOrder),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  );

  for (const lesson of lessonCatalog.filter((item) => item.number >= 2 && item.number <= 20)) {
    assert.equal(lesson.status, "prototype");
    assert.ok(lesson.phrases.length >= 3);
    assert.ok(lesson.mission.zh.length > 0);
    assert.ok(lesson.phrases.every((phrase) => phrase.audioAttribution?.isUnmodifiedOriginal));
    assert.ok(lesson.phrases.every((phrase) => phrase.audioAttribution?.license === "CC BY-ND 3.0 TW"));
    assert.ok(lesson.phrases.every((phrase) => phrase.audioAttribution?.originalUrl.startsWith("https://sutian.moe.edu.tw/")));
  }

});

test("every playable phrase has an English meaning for the English phrase picker", () => {
  const playableLessons = lessonCatalog.filter((lesson) => lesson.status === "prototype");
  const phrases = playableLessons.flatMap((lesson) => lesson.phrases);

  assert.equal(playableLessons.length, 20);
  assert.equal(phrases.length, 59);
  for (const phrase of phrases) {
    assert.ok(phrase.meaning.en.trim(), `missing English meaning: ${phrase.id}`);
  }
});
