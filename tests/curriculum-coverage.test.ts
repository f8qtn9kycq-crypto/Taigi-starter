import assert from "node:assert/strict";
import test from "node:test";
import {
  curriculumCoverageGroups,
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

test("internal curriculum groups stay bilingual, coded, and decision-ready", () => {
  assert.equal(curriculumCoverageGroups.length, 4);

  for (const group of curriculumCoverageGroups) {
    assert.ok(group.title.zh.trim());
    assert.ok(group.title.en.trim());
    assert.ok(group.capabilities.length > 0);
    assert.ok(group.knownGaps.length > 0);
    for (const item of [...group.capabilities, ...group.knownGaps]) {
      assert.ok(item.zh.trim());
      assert.ok(item.en.trim());
    }
    assert.ok(group.curriculumReferences.length > 0);
    assert.ok(group.curriculumReferences.every((reference) => /^[A-Z][a-z]-[ⅠⅡⅢ]-\d$/.test(reference)));
    assert.ok(group.lessonNumbers.length > 0);
  }
});

test("curriculum governance data does not export a learner-facing government URL", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) => (
    readFile(new URL("../app/data/curriculum-coverage.ts", import.meta.url), "utf8")
  ));

  assert.doesNotMatch(source, /https?:\/\//);
  assert.doesNotMatch(source, /elementaryTaiwaneseCurriculumUrl/);
});
