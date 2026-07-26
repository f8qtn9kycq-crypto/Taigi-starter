import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { lessonPackageHandoffs } from "../app/data/lesson-package-handoffs.ts";
import { lessonCatalog } from "../app/data/lessons.ts";
import { validateLessonPackageHandoff } from "../app/utils/lesson-package-handoff.ts";

test("every lesson package has a valid source-backed handoff and local original audio", async () => {
  assert.deepEqual(
    lessonPackageHandoffs.map((handoff) => handoff.package.number),
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  );

  for (const handoff of lessonPackageHandoffs) {
    assert.deepEqual(validateLessonPackageHandoff(handoff), []);
    assert.equal(handoff.mobileFlowEvidence[0]?.evidenceRef, "docs/qa/lesson-2-18-390x844.md");

    for (const attribution of handoff.audioAttribution) {
      assert.match(attribution.sourceUrl, /^https:\/\/sutian\.moe\.edu\.tw\//);
      assert.match(attribution.originalUrl, /^https:\/\/sutian\.moe\.edu\.tw\/media\/senn\/mp3\/imtong\/subak\//);
      assert.equal(attribution.license, "CC BY-ND 3.0 TW");
      assert.equal(attribution.isUnmodifiedOriginal, true);

      const audio = await readFile(new URL(`../public${attribution.audioUrl}`, import.meta.url));
      assert.equal(audio.subarray(0, 3).toString(), "ID3", attribution.audioUrl);
      assert.ok(audio.length > 1_000, attribution.audioUrl);
    }
  }
});

test("the runtime catalog exposes exactly Lessons 1–18 as playable", () => {
  assert.deepEqual(
    lessonCatalog.filter((lesson) => lesson.status === "prototype").map((lesson) => lesson.number),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  );
});
