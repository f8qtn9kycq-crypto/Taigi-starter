import assert from "node:assert/strict";
import test from "node:test";
import { lessonCatalog } from "../app/data/lessons.ts";
import type { PlayableLesson } from "../app/types/lesson.ts";
import { resolveLandingAction } from "../app/utils/landing-action.ts";

const lessons = lessonCatalog.filter(
  (lesson): lesson is PlayableLesson => lesson.status === "prototype",
);
const first = lessons[0];
const second = lessons[1];

test("fresh progress starts the active lesson", () => {
  assert.deepEqual(resolveLandingAction({
    hasStarted: false,
    activeLesson: first,
    nextLesson: second,
    completedPhraseIds: new Set(),
    stage: 0,
  }), { kind: "start", lesson: first });
});

test("existing progress resumes the exact bounded stage", () => {
  assert.deepEqual(resolveLandingAction({
    hasStarted: true,
    activeLesson: first,
    nextLesson: second,
    completedPhraseIds: new Set(),
    stage: 2,
  }), { kind: "resume", lesson: first, stage: 2 });
});

test("a completed lesson advances to the next playable lesson", () => {
  assert.deepEqual(resolveLandingAction({
    hasStarted: true,
    activeLesson: first,
    nextLesson: second,
    completedPhraseIds: new Set(first.phrases.map(({ id }) => id)),
    stage: first.stages.length - 1,
  }), { kind: "next", lesson: second });
});

test("a completed final lesson routes to progress", () => {
  const final = lessons.at(-1)!;
  assert.deepEqual(resolveLandingAction({
    hasStarted: true,
    activeLesson: final,
    nextLesson: null,
    completedPhraseIds: new Set(final.phrases.map(({ id }) => id)),
    stage: final.stages.length - 1,
  }), { kind: "progress" });
});
