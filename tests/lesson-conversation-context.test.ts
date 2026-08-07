import assert from "node:assert/strict";
import test from "node:test";
import { lessonCatalog, prototypeLesson } from "../app/data/lessons.ts";
import type { PlayableLesson } from "../app/types/lesson.ts";
import { buildLessonConversationContext } from "../app/utils/lesson-conversation-context.ts";

const provenance = {
  lessonVersion: "catalog-f70a38f",
  sourceKind: "runtime-catalog",
  sourceRef: "github/main@f70a38f",
} as const;

test("context keeps explicit lesson version and provenance", () => {
  const context = buildLessonConversationContext(prototypeLesson, provenance);

  assert.equal(context.lessonId, prototypeLesson.id);
  assert.equal(context.lessonVersion, provenance.lessonVersion);
  assert.deepEqual(context.provenance, {
    lessonId: prototypeLesson.id,
    ...provenance,
  });
  assert.deepEqual(context.allowedUses, ["offline-lesson-authoring"]);
});

test("contexts contain target phrases from exactly one lesson", () => {
  const lessonOne = lessonCatalog[0];
  const lessonTwo = lessonCatalog[1];
  const firstContext = buildLessonConversationContext(lessonOne, provenance);
  const secondContext = buildLessonConversationContext(lessonTwo, {
    ...provenance,
    lessonVersion: "catalog-f70a38f-lesson-2",
  });

  assert.deepEqual(
    firstContext.targetPhrases.map((phrase) => phrase.id),
    lessonOne.phrases.map((phrase) => phrase.id),
  );
  assert.deepEqual(
    secondContext.targetPhrases.map((phrase) => phrase.id),
    lessonTwo.phrases.map((phrase) => phrase.id),
  );
  assert.equal(
    firstContext.targetPhrases.some((phrase) => secondContext.targetPhrases.some((other) => other.id === phrase.id)),
    false,
  );
});

test("context remains a detached snapshot when lesson data changes later", () => {
  const lesson = structuredClone(prototypeLesson) as PlayableLesson;
  const context = buildLessonConversationContext(lesson, provenance);

  lesson.title.zh = "已修改標題";
  lesson.phrases[0].meaning.zh = "已修改意思";
  lesson.phrases[0].source.title.zh = "已修改來源";

  assert.equal(context.title.zh, prototypeLesson.title.zh);
  assert.equal(context.targetPhrases[0].meaning.zh, prototypeLesson.phrases[0].meaning.zh);
  assert.equal(context.targetPhrases[0].source.title.zh, prototypeLesson.phrases[0].source.title.zh);
});
