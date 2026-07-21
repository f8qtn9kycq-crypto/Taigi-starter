import assert from "node:assert/strict";
import test from "node:test";
import { lessonPackages } from "../app/data/lesson-packages.ts";

test("planned lesson packages are complete content records without runtime audio claims", () => {
  assert.deepEqual(
    lessonPackages.map((lesson) => lesson.number),
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  );

  const phraseIds = new Set<string>();
  for (const lesson of lessonPackages) {
    assert.equal(lesson.status, "planned");
    assert.equal(lesson.teacherReview.status, "required");
    assert.ok(lesson.phrases.length > 0);

    for (const phrase of lesson.phrases) {
      assert.equal(phraseIds.has(phrase.id), false, `duplicate phrase id: ${phrase.id}`);
      phraseIds.add(phrase.id);
      assert.ok(phrase.hanji.trim());
      assert.ok(phrase.tailo.trim());
      assert.ok(phrase.meaning.zh.trim());
      assert.ok(phrase.meaning.en.trim());
      assert.ok(phrase.cultureNote.zh.trim());
      assert.ok(phrase.cultureNote.en.trim());
      assert.match(phrase.source.canonicalUrl, /^https:\/\/sutian\.moe\.edu\.tw\//);
      assert.equal(phrase.source.license, "CC BY-ND 3.0 TW");
      assert.equal(phrase.audio.status, "not-yet-added");
      assert.equal("audioUrl" in phrase, false);
    }
  }
});
