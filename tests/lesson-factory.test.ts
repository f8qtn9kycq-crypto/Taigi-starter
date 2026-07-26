import assert from "node:assert/strict";
import test from "node:test";
import introLesson from "../app/content/generated/intro-001.json" with { type: "json" };
import marketLesson from "../app/content/generated/market-001.json" with { type: "json" };
import { generatedLessons } from "../app/data/generated-lessons.ts";
import { lessonCatalog } from "../app/data/lessons.ts";
import { generateLesson, type LessonSpec } from "../app/utils/lesson-factory.ts";
import { validateLesson, validateLessonCollection } from "../app/utils/lesson-factory-validation.ts";

function cloneLesson(value: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

test("generated lessons pass the factory validator and use the fixed flow", () => {
  assert.equal(validateLessonCollection([introLesson, marketLesson]).length, 0);
  assert.deepEqual(
    (introLesson as { steps: readonly { type: string }[] }).steps.map((step) => step.type),
    ["context", "input", "listen", "repeat", "constrained-dialogue", "feedback", "review", "completion"],
  );
});

test("factory validator rejects missing sources, duplicate IDs, invalid steps, and too many phrases", () => {
  const missingSource = cloneLesson(introLesson);
  delete missingSource.sources;
  assert.ok(validateLesson(missingSource).some((issue) => issue.path === "sources"));

  const duplicateIssues = validateLessonCollection([introLesson, introLesson]);
  assert.ok(duplicateIssues.some((issue) => issue.message === "duplicate lesson ID"));

  const invalidStep = cloneLesson(introLesson);
  const steps = invalidStep.steps as Array<Record<string, unknown>>;
  steps[0].type = "free-chat";
  assert.ok(validateLesson(invalidStep).some((issue) => issue.message.includes("supported lesson factory step")));

  const fakeAudio = cloneLesson(introLesson);
  const fakePhrase = (fakeAudio.targetPhrases as Array<Record<string, unknown>>)[0];
  (fakePhrase.audio as Record<string, unknown>).audioUrl = "https://example.invalid/fake.mp3";
  assert.ok(validateLesson(fakeAudio).some((issue) => issue.path.endsWith("audio.audioUrl")));

  const unauthorizedSource = cloneLesson(introLesson);
  const unauthorizedPhrase = (unauthorizedSource.targetPhrases as Array<Record<string, unknown>>)[0];
  (unauthorizedPhrase.source as Record<string, unknown>).canonicalUrl = "https://example.invalid/source";
  assert.ok(validateLesson(unauthorizedSource).some((issue) => issue.message.includes("MOE Dictionary canonical URL")));

  const missingPoj = cloneLesson(introLesson);
  delete (missingPoj.targetPhrases as Array<Record<string, unknown>>)[0].poj;
  assert.ok(validateLesson(missingPoj).some((issue) => issue.path.endsWith(".poj")));

  const invalidChecksum = cloneLesson(introLesson);
  (invalidChecksum.targetPhrases as Array<Record<string, unknown>>)[0].audio = { sha256: "not-a-sha256" };
  assert.ok(validateLesson(invalidChecksum).some((issue) => issue.path.endsWith("audio.sha256")));

  const tooMany = cloneLesson(introLesson);
  const phrases = tooMany.targetPhrases as unknown[];
  tooMany.targetPhrases = [...phrases, ...phrases, phrases[0]];
  assert.ok(validateLesson(tooMany).some((issue) => issue.message.includes("no more than 5")));
});

test("generator keeps missing collections recoverable for clear validator errors", () => {
  const generated = generateLesson({ id: "broken" } as unknown as LessonSpec, "lesson-specs/broken.yaml");
  const issues = validateLesson(generated);
  assert.ok(issues.some((issue) => issue.path === "targetPhrases"));
  assert.ok(issues.some((issue) => issue.path === "vocabulary"));
  assert.ok(issues.some((issue) => issue.path === "sources"));
});

test("both factory lessons use the existing reusable playable lesson path", () => {
  assert.deepEqual(generatedLessons.map((lesson) => lesson.id), ["market-001", "intro-001"]);
  assert.deepEqual(
    lessonCatalog.filter((lesson) => lesson.status === "prototype").map((lesson) => lesson.id),
    ["lesson-1-greetings", "market-001", "intro-001"],
  );
  assert.equal(generatedLessons.every((lesson) => lesson.stages.length === 5), true);
  assert.equal(generatedLessons.every((lesson) => lesson.phrases.length === 3), true);
  assert.equal(generatedLessons.every((lesson) => lesson.factorySteps?.some((step) => step.type === "completion")), true);
  assert.equal(generatedLessons.every((lesson) => lesson.phrases.every((phrase) => phrase.audioAttribution.isUnmodifiedOriginal)), true);
  const duplicateNumber = cloneLesson(introLesson);
  duplicateNumber.number = marketLesson.number;
  assert.ok(validateLessonCollection([duplicateNumber, marketLesson]).some((issue) => issue.message === "duplicate lesson number"));
});
