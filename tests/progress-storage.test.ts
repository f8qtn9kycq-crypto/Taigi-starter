import assert from "node:assert/strict";
import test from "node:test";
import { lessonCatalog, prototypeLesson } from "../app/data/lessons.ts";
import {
  parseStoredProgress,
  serializeProgress,
  type LessonProgressDefinition,
} from "../app/services/progress-storage.ts";
import { DEFAULT_PROGRESS, type LearningProgress, type ReviewCard } from "../app/types/learning.ts";
import {
  completedStepCount,
  completePhrase,
  dueReviewCards,
  hasLessonProgress,
  nextReviewRefreshDelay,
  orderedReviewCards,
  rateReviewCard,
  selectLesson,
  updateActiveLesson,
} from "../app/utils/learning-progress.ts";

const now = new Date("2026-07-11T00:00:00.000Z");
const definitions: readonly LessonProgressDefinition[] = lessonCatalog.flatMap((lesson) =>
  lesson.status === "prototype"
    ? [{
        id: lesson.id,
        phraseIds: lesson.phrases.map((phrase) => phrase.id),
        stageCount: lesson.stages.length,
      }]
    : []);
const parseOptions = { lessons: definitions, defaultLessonId: prototypeLesson.id, now };
const lessonTwo = definitions.find((lesson) => lesson.id !== prototypeLesson.id)!;

const reviewCard = (id: string, dueAt = now.toISOString()): ReviewCard => ({
  id,
  dueAt,
  intervalDays: 0,
  repetitions: 0,
  easeFactor: 2.3,
  lastReviewedAt: null,
});

test("invalid local state falls back safely to version 5", () => {
  const expected = {
    ...DEFAULT_PROGRESS,
    lessons: { [prototypeLesson.id]: { stage: 0, phraseIndex: 0, completedPhraseIds: [] } },
  };

  assert.deepEqual(parseStoredProgress("not json", parseOptions), expected);
  assert.deepEqual(parseStoredProgress(null, parseOptions), expected);
});

test("legacy progress migrates into the default lesson", () => {
  const migrated = parseStoredProgress(
    JSON.stringify({ locale: "en", stage: 3, hasStarted: true, dueCount: 1 }),
    parseOptions,
  );
  const phraseId = prototypeLesson.phrases[0].id;

  assert.equal(migrated.version, 5);
  assert.equal(migrated.lessonId, prototypeLesson.id);
  assert.equal(migrated.locale, "en");
  assert.equal(migrated.lessons[prototypeLesson.id].stage, 3);
  assert.deepEqual(migrated.lessons[prototypeLesson.id].completedPhraseIds, [phraseId]);
  assert.equal(migrated.reviewCards[phraseId].dueAt, now.toISOString());
});

test("version 4 preserves its active lesson, phrase, stage, and review card", () => {
  const phraseId = lessonTwo.phraseIds[1];
  const migrated = parseStoredProgress(JSON.stringify({
    version: 4,
    locale: "zh",
    lessonId: lessonTwo.id,
    stage: 2,
    phraseIndex: 1,
    hasStarted: true,
    reviewCard: reviewCard(phraseId),
  }), parseOptions);

  assert.equal(migrated.lessonId, lessonTwo.id);
  assert.deepEqual(migrated.lessons[lessonTwo.id], {
    stage: 2,
    phraseIndex: 1,
    completedPhraseIds: [phraseId],
  });
  assert.deepEqual(migrated.reviewCards[phraseId], reviewCard(phraseId));
});

test("version 5 round trips multiple lesson states and review cards", () => {
  const firstPhraseId = prototypeLesson.phrases[0].id;
  const secondPhraseId = lessonTwo.phraseIds[0];
  const progress: LearningProgress = {
    version: 5,
    locale: "en",
    lessonId: lessonTwo.id,
    hasStarted: true,
    lessons: {
      [prototypeLesson.id]: { stage: 4, phraseIndex: 0, completedPhraseIds: [firstPhraseId] },
      [lessonTwo.id]: { stage: 2, phraseIndex: 1, completedPhraseIds: [secondPhraseId] },
    },
    reviewCards: {
      [firstPhraseId]: reviewCard(firstPhraseId),
      [secondPhraseId]: reviewCard(secondPhraseId, "2026-07-12T00:00:00.000Z"),
    },
  };

  assert.deepEqual(parseStoredProgress(serializeProgress(progress), parseOptions), progress);
});

test("version 5 rejects unknown identities and invalid per-lesson positions", () => {
  const parsed = parseStoredProgress(JSON.stringify({
    version: 5,
    locale: "zh",
    lessonId: lessonTwo.id,
    hasStarted: true,
    lessons: {
      [lessonTwo.id]: {
        stage: 99,
        phraseIndex: 99,
        completedPhraseIds: [lessonTwo.phraseIds[0], lessonTwo.phraseIds[0], "unknown-phrase"],
      },
      "unknown-lesson": { stage: 2, phraseIndex: 0, completedPhraseIds: [] },
    },
    reviewCards: {
      "unknown-phrase": reviewCard("unknown-phrase"),
    },
  }), parseOptions);

  assert.deepEqual(parsed.lessons[lessonTwo.id], {
    stage: 0,
    phraseIndex: 0,
    completedPhraseIds: [lessonTwo.phraseIds[0]],
  });
  assert.equal("unknown-lesson" in parsed.lessons, false);
  assert.deepEqual(parsed.reviewCards, {});
});

test("selecting a lesson does not count the current stage as completed", () => {
  const selected = { stage: 0, phraseIndex: 0, completedPhraseIds: [] };
  assert.equal(completedStepCount(selected, lessonTwo.phraseIds, 5), 0);
  assert.equal(hasLessonProgress(selected), false);

  const afterHear = { ...selected, stage: 1 };
  assert.equal(completedStepCount(afterHear, lessonTwo.phraseIds, 5), 1);
  assert.equal(hasLessonProgress(afterHear), true);
});

test("a lesson is complete only after every target phrase is complete", () => {
  const partial = { stage: 4, phraseIndex: 1, completedPhraseIds: lessonTwo.phraseIds.slice(0, -1) };
  const complete = { ...partial, completedPhraseIds: lessonTwo.phraseIds };

  assert.equal(completedStepCount(partial, lessonTwo.phraseIds, 5), 10);
  assert.equal(completedStepCount(complete, lessonTwo.phraseIds, 5), 15);
});

test("review queue orders all cards and returns every card currently due", () => {
  const firstPhraseId = prototypeLesson.phrases[0].id;
  const secondPhraseId = lessonTwo.phraseIds[0];
  const cards = {
    [secondPhraseId]: reviewCard(secondPhraseId, "2026-07-12T00:00:00.000Z"),
    [firstPhraseId]: reviewCard(firstPhraseId, "2026-07-10T00:00:00.000Z"),
  };

  assert.deepEqual(orderedReviewCards(cards).map((card) => card.id), [firstPhraseId, secondPhraseId]);
  assert.deepEqual(dueReviewCards(cards, now).map((card) => card.id), [firstPhraseId]);
});

test("review queue refreshes at the nearest future due time", () => {
  const firstPhraseId = prototypeLesson.phrases[0].id;
  const secondPhraseId = lessonTwo.phraseIds[0];
  const cards = {
    [firstPhraseId]: reviewCard(firstPhraseId, "2026-07-11T00:10:00.000Z"),
    [secondPhraseId]: reviewCard(secondPhraseId, "2026-07-11T00:02:00.000Z"),
  };

  assert.equal(nextReviewRefreshDelay(cards, now), 120_001);
  assert.deepEqual(dueReviewCards(cards, new Date(now.getTime() + 120_001)).map((card) => card.id), [secondPhraseId]);
});

test("review refresh delay is bounded and omitted without a future card", () => {
  const phraseId = prototypeLesson.phrases[0].id;
  const future = { [phraseId]: reviewCard(phraseId, "2026-09-01T00:00:00.000Z") };
  const due = { [phraseId]: reviewCard(phraseId, "2026-07-10T00:00:00.000Z") };

  assert.equal(nextReviewRefreshDelay(future, now, 5_000), 5_000);
  assert.equal(nextReviewRefreshDelay(due, now), null);
  assert.equal(nextReviewRefreshDelay({}, now), null);
});

test("switching lessons preserves independent positions, completion, and review cards", () => {
  const firstPhraseId = prototypeLesson.phrases[0].id;
  const secondPhraseId = lessonTwo.phraseIds[0];
  const initial = parseStoredProgress(null, parseOptions);
  const lessonOneProgress = completePhrase(updateActiveLesson(initial, { stage: 4 }), firstPhraseId, now);
  const onLessonTwo = updateActiveLesson(
    selectLesson(lessonOneProgress, lessonTwo.id),
    { stage: 2, phraseIndex: 1 },
  );
  const lessonTwoProgress = completePhrase(onLessonTwo, secondPhraseId, now);
  const restoredLessonOne = selectLesson(lessonTwoProgress, prototypeLesson.id);

  assert.equal(restoredLessonOne.lessons[prototypeLesson.id].stage, 4);
  assert.equal(restoredLessonOne.lessons[lessonTwo.id].stage, 2);
  assert.deepEqual(restoredLessonOne.lessons[lessonTwo.id].completedPhraseIds, [secondPhraseId]);
  assert.deepEqual(Object.keys(restoredLessonOne.reviewCards).sort(), [firstPhraseId, secondPhraseId].sort());
});

test("rating one review card does not replace another lesson review", () => {
  const firstPhraseId = prototypeLesson.phrases[0].id;
  const secondPhraseId = lessonTwo.phraseIds[0];
  const progress = {
    ...parseStoredProgress(null, parseOptions),
    reviewCards: {
      [firstPhraseId]: reviewCard(firstPhraseId),
      [secondPhraseId]: reviewCard(secondPhraseId),
    },
  };
  const rated = rateReviewCard(progress, firstPhraseId, "easy", now);

  assert.equal(rated.reviewCards[firstPhraseId].intervalDays, 4);
  assert.deepEqual(rated.reviewCards[secondPhraseId], progress.reviewCards[secondPhraseId]);
});
