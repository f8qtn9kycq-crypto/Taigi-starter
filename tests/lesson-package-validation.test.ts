import assert from "node:assert/strict";
import test from "node:test";
import { lessonPackages } from "../app/data/lesson-packages.ts";
import { validateLessonPackages } from "../app/utils/lesson-package-validation.ts";

const clonePackages = (): Record<string, unknown>[] => (
  JSON.parse(JSON.stringify(lessonPackages)) as Record<string, unknown>[]
);

test("all current planned packages satisfy the Lesson Factory contract", () => {
  assert.deepEqual(validateLessonPackages(lessonPackages), []);
});

test("combination data is structured only for source-traceable use-stage notes", () => {
  const combinations = lessonPackages.flatMap((lesson) => lesson.phrases
    .filter((phrase) => phrase.useCombination)
    .map((phrase) => ({ lesson: lesson.number, phrase })));

  assert.equal(combinations.length, 8);
  for (const { phrase } of combinations) {
    assert.ok(phrase.cultureNote.zh.includes("用") || phrase.cultureNote.en.includes("Use"));
    assert.match(phrase.source.canonicalUrl, /^https:\/\/sutian\.moe\.edu\.tw\//);
    assert.ok(phrase.useCombination?.hanji);
    assert.ok(phrase.useCombination?.tailo);
    assert.ok(phrase.useCombination?.meaning.zh);
    assert.ok(phrase.useCombination?.meaning.en);
  }
});

test("invalid combination fields fail validation", () => {
  const invalid = clonePackages();
  const phrase = (invalid[0].phrases as Record<string, unknown>[])[0];
  phrase.useCombination = { hanji: "", tailo: "", meaning: { zh: "", en: "" } };

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].phrases[0].useCombination.hanji"));
  assert.ok(paths.includes("packages[0].phrases[0].useCombination.meaning.zh"));
});

test("invalid use scenarios fail the three-choice and single-answer contract", () => {
  const invalid = clonePackages();
  const phrase = (invalid[0].phrases as Record<string, unknown>[])[0];
  phrase.useScenario = {
    prompt: { zh: "", en: "Scenario" },
    explanation: { zh: "說明", en: "Explanation" },
    choices: [
      { id: "same", hanji: "甲", tailo: "A", meaning: { zh: "甲", en: "A" }, feedback: { zh: "", en: "A" }, sourceUrl: "https://example.com", isCorrect: true },
      { id: "same", hanji: "乙", tailo: "B", meaning: { zh: "乙", en: "B" }, feedback: { zh: "乙", en: "B" }, sourceUrl: "https://example.com", isCorrect: true },
    ],
  };

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].phrases[0].useScenario.prompt.zh"));
  assert.ok(paths.includes("packages[0].phrases[0].useScenario.choices"));
  assert.ok(paths.includes("packages[0].phrases[0].useScenario.choices[1].id"));
  assert.ok(paths.includes("packages[0].phrases[0].useScenario.choices[0].feedback.zh"));
  assert.ok(paths.includes("packages[0].phrases[0].useScenario.choices[0].sourceUrl"));
});

test("validator rejects missing stages, sources, review, and incomplete audio", () => {
  const invalid = clonePackages();
  const first = invalid[0];
  const phrase = (first.phrases as Record<string, unknown>[])[0];
  const source = phrase.source as Record<string, unknown>;
  const audio = phrase.audio as Record<string, unknown>;

  (first.stagePlan as unknown[]).pop();
  source.canonicalUrl = "https://example.com/lesson";
  first.teacherReview = { status: "unknown", reviewer: null, reviewedAt: null, checks: [] };
  audio.status = "available";

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].stagePlan"));
  assert.ok(paths.includes("packages[0].phrases[0].source.canonicalUrl"));
  assert.ok(paths.includes("packages[0].teacherReview.status"));
  assert.ok(paths.includes("packages[0].phrases[0].audio.status"));
});

test("validator rejects missing objective, Tâi-lô, bilingual text, licence, and fake audio", () => {
  const invalid = clonePackages();
  const first = invalid[0];
  const phrase = (first.phrases as Record<string, unknown>[])[0];
  const source = phrase.source as Record<string, unknown>;
  const audio = phrase.audio as Record<string, unknown>;

  delete first.objective;
  delete (phrase as Record<string, unknown>).tailo;
  delete (phrase.meaning as Record<string, unknown>).en;
  source.license = "CC0";
  source.canonicalUrl = "https://example.com/not-moe";
  audio.audioUrl = "/audio/placeholder-phrase.mp3";
  audio.originalUrl = "https://sutian.moe.edu.tw/media/pending-original.mp3";

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].objective"));
  assert.ok(paths.includes("packages[0].phrases[0].tailo"));
  assert.ok(paths.includes("packages[0].phrases[0].meaning.en"));
  assert.ok(paths.includes("packages[0].phrases[0].source.license"));
  assert.ok(paths.includes("packages[0].phrases[0].source.canonicalUrl"));
  assert.ok(paths.includes("packages[0].phrases[0].audio.audioUrl"));
  assert.ok(paths.includes("packages[0].phrases[0].audio.originalUrl"));
});

test("validator rejects audio whose spoken content differs from the displayed phrase", () => {
  const invalid = clonePackages();
  const phrase = (invalid[0].phrases as Record<string, unknown>[])[0];
  const audio = phrase.audio as Record<string, unknown>;

  audio.contentHanji = "只有部分詞目";

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].phrases[0].audio.contentHanji"));
});

test("validator rejects a covered package with fewer than three target phrases", () => {
  const invalid = clonePackages();
  const first = invalid[0];
  (first.phrases as unknown[]).splice(1);

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].phrases"));
});

test("validator reports empty teacher review checks once", () => {
  const invalid = clonePackages();
  const review = invalid[0].teacherReview as Record<string, unknown>;
  review.checks = [];

  const issues = validateLessonPackages(invalid).filter(
    (issue) => issue.path === "packages[0].teacherReview.checks",
  );
  assert.deepEqual(issues.map((issue) => issue.message), ["must be a non-empty array"]);
});

test("validator rejects a package phrase without POJ", () => {
  const invalid = clonePackages();
  const phrase = (invalid[0].phrases as Record<string, unknown>[])[0];
  phrase.poj = null;

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].phrases[0].poj"));
});

test("validator rejects approval without traceable reviewer evidence", () => {
  const invalid = clonePackages();
  const review = invalid[0].teacherReview as Record<string, unknown>;
  const checks = review.checks as Record<string, unknown>[];

  review.status = "approved";
  review.reviewer = null;
  review.reviewedAt = null;
  checks[0].status = "passed";

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].teacherReview.reviewer"));
  assert.ok(paths.includes("packages[0].teacherReview.reviewedAt"));
  assert.ok(paths.includes("packages[0].teacherReview.checks"));
});

test("validator accepts traceable approval while keeping the package planned", () => {
  const approved = clonePackages();
  const review = approved[0].teacherReview as Record<string, unknown>;
  const checks = review.checks as Record<string, unknown>[];

  review.status = "approved";
  review.reviewer = "teacher@example.test";
  review.reviewedAt = "2026-07-22T00:00:00.000Z";
  for (const check of checks) check.status = "passed";

  assert.deepEqual(validateLessonPackages(approved), []);
  assert.equal(approved[0].status, "planned");
});

test("validator rejects non-ISO teacher review timestamps", () => {
  for (const reviewedAt of ["July 22, 2026", "2026-07-22", "2026-02-30T00:00:00.000Z"]) {
    const invalid = clonePackages();
    const review = invalid[0].teacherReview as Record<string, unknown>;
    const checks = review.checks as Record<string, unknown>[];

    review.status = "approved";
    review.reviewer = "teacher@example.test";
    review.reviewedAt = reviewedAt;
    for (const check of checks) check.status = "passed";

    const paths = validateLessonPackages(invalid).map((issue) => issue.path);
    assert.ok(paths.includes("packages[0].teacherReview.reviewedAt"), reviewedAt);
  }
});

test("validator rejects duplicate lesson and phrase identities", () => {
  const invalid = clonePackages();
  const first = invalid[0];
  const second = invalid[1];
  const firstPhrase = (first.phrases as Record<string, unknown>[])[0];
  const secondPhrase = (second.phrases as Record<string, unknown>[])[0];

  second.id = first.id;
  second.number = first.number;
  secondPhrase.id = firstPhrase.id;

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[1].id"));
  assert.ok(paths.includes("packages[1].number"));
  assert.ok(paths.includes("packages[1].phrases[0].id"));
});

test("validator rejects incomplete bilingual metadata", () => {
  const invalid = clonePackages();
  const first = invalid[0];
  const title = first.title as Record<string, unknown>;
  const firstPhrase = (first.phrases as Record<string, unknown>[])[0];

  delete title.en;
  (firstPhrase.meaning as Record<string, unknown>).zh = "";

  const paths = validateLessonPackages(invalid).map((issue) => issue.path);
  assert.ok(paths.includes("packages[0].title.en"));
  assert.ok(paths.includes("packages[0].phrases[0].meaning.zh"));
});
