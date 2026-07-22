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

test("validator rejects missing stages, sources, review, and pending audio", () => {
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
