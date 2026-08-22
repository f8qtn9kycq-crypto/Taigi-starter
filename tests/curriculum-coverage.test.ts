import assert from "node:assert/strict";
import test from "node:test";
import {
  curriculumCoverageGroups,
  elementaryTaiwaneseCurriculumUrl,
} from "../app/data/curriculum-coverage.ts";
import { lessonCatalog } from "../app/data/lessons.ts";

test("curriculum coverage includes every playable lesson without unknown lessons", () => {
  const playableNumbers = lessonCatalog
    .filter((lesson) => lesson.status === "prototype")
    .map((lesson) => lesson.number)
    .sort((left, right) => left - right);
  const coveredNumbers = [...new Set(curriculumCoverageGroups.flatMap((group) => group.lessonNumbers))]
    .sort((left, right) => left - right);

  assert.deepEqual(coveredNumbers, playableNumbers);
});

test("curriculum groups stay bilingual, coded, and linked to the official NAER source", () => {
  assert.match(elementaryTaiwaneseCurriculumUrl, /^https:\/\/www\.naer\.edu\.tw\//);
  assert.equal(curriculumCoverageGroups.length, 4);

  for (const group of curriculumCoverageGroups) {
    assert.ok(group.title.zh.trim());
    assert.ok(group.title.en.trim());
    assert.ok(group.curriculumReferences.length > 0);
    assert.ok(group.curriculumReferences.every((reference) => /^[A-Z][a-z]-[ⅠⅡⅢ]-\d$/.test(reference)));
    assert.ok(group.lessonNumbers.length > 0);
  }
});
