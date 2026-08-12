import assert from "node:assert/strict";
import test from "node:test";
import { lessonPackages } from "../app/data/lesson-packages.ts";
import { prototypeLesson } from "../app/data/lessons.ts";
import { TEACHER_REVIEW_CHECK_IDS } from "../app/types/lesson-package.ts";

test("planned lesson packages carry complete POJ and original-audio metadata", () => {
  assert.deepEqual(
    lessonPackages.map((lesson) => lesson.number),
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  );

  const phraseIds = new Set<string>();
  for (const lesson of lessonPackages) {
    assert.equal(lesson.status, "planned");
    assert.equal(lesson.teacherReview.status, "required");
    assert.equal(lesson.teacherReview.reviewer, null);
    assert.equal(lesson.teacherReview.reviewedAt, null);
    // Preserve the review checklist order used by teacher-facing review flows.
    assert.deepEqual(
      lesson.teacherReview.checks.map((check) => check.id),
      TEACHER_REVIEW_CHECK_IDS,
    );
    assert.ok(lesson.phrases.length >= 3);
    assert.ok(lesson.mission.zh.trim());
    assert.ok(lesson.mission.en.trim());

    for (const check of lesson.teacherReview.checks) {
      assert.equal(check.status, "pending");
      assert.ok(check.label.zh.trim());
      assert.ok(check.label.en.trim());
    }

    for (const phrase of lesson.phrases) {
      assert.equal(phraseIds.has(phrase.id), false, `duplicate phrase id: ${phrase.id}`);
      phraseIds.add(phrase.id);
      assert.ok(phrase.hanji.trim());
      assert.ok(phrase.tailo.trim());
      assert.ok(phrase.poj?.trim());
      assert.ok(phrase.meaning.zh.trim());
      assert.ok(phrase.meaning.en.trim());
      assert.ok(phrase.cultureNote.zh.trim());
      assert.ok(phrase.cultureNote.en.trim());
      assert.match(phrase.source.canonicalUrl, /^https:\/\/sutian\.moe\.edu\.tw\//);
      assert.equal(phrase.source.license, "CC BY-ND 3.0 TW");
      assert.equal(phrase.audio.status, "added");
      assert.equal(phrase.audio.contentHanji, phrase.hanji);
      assert.match(phrase.audio.audioUrl, /^\/audio\//);
      assert.match(phrase.audio.originalUrl, /^https:\/\/sutian\.moe\.edu\.tw\/media\//);
      assert.equal(phrase.audio.license, "CC BY-ND 3.0 TW");
      assert.equal(phrase.audio.isUnmodifiedOriginal, true);
    }
  }
});

test("M2.3 packages keep the source-verified lesson scope", () => {
  const m23Packages = lessonPackages.filter((lesson) => lesson.number >= 16 && lesson.number <= 18);

  assert.deepEqual(
    m23Packages.map((lesson) => lesson.title.zh),
    ["出門坐車", "餐廳點菜", "買物件佮問價"],
  );
  assert.deepEqual(
    m23Packages.flatMap((lesson) => lesson.phrases.map((phrase) => phrase.hanji)),
    ["出門", "坐", "車站", "食餐廳", "欲", "菜", "買", "物件", "偌濟", "價錢"],
  );
  assert.ok(m23Packages.every((lesson) => lesson.status === "planned"));
  assert.ok(m23Packages.every((lesson) => lesson.teacherReview.status === "required"));
  assert.ok(m23Packages.every((lesson) => lesson.phrases.every((phrase) => phrase.audio.status === "added")));
});

test("Lesson 12 does not duplicate Lesson 1's complete greeting phrase", () => {
  const lessonTwelve = lessonPackages.find((lesson) => lesson.number === 12);
  assert.ok(lessonTwelve);

  const lessonOneKeys = new Set(prototypeLesson.phrases.map((phrase) => `${phrase.hanji}\t${phrase.tailo}`));
  assert.equal(
    lessonTwelve.phrases.some((phrase) => lessonOneKeys.has(`${phrase.hanji}\t${phrase.tailo}`)),
    false,
  );
});

test("previously partial audio mappings expose only the exact MOE audio content", () => {
  const expected = new Map([
    ["lesson-2-family-home", ["兜", "6917"]],
    ["lesson-4-food-and-drink-meal", ["飯", "9222"]],
    ["lesson-4-food-and-drink-water", ["啉水", "7030"]],
    ["lesson-4-food-and-drink-tea", ["食茶", "14178"]],
    ["lesson-5-daily-work", ["代誌", "1370"]],
    ["lesson-7-directions-where", ["佗", "2863"]],
    ["lesson-12-conversation-meal", ["飯", "9222"]],
    ["lesson-12-conversation-home", ["兜", "6917"]],
    ["lesson-15-body-and-health-medicine", ["藥仔", "12843"]],
    ["lesson-16-travel-ride-vehicle", ["坐", "3022"]],
  ] as const);

  let auditedCount = 0;
  for (const lesson of lessonPackages) {
    for (const phrase of lesson.phrases) {
      const audited = expected.get(phrase.id);
      if (!audited) continue;
      auditedCount += 1;
      assert.equal(phrase.hanji, audited[0]);
      assert.equal(phrase.audio.contentHanji, audited[0]);
      assert.match(phrase.source.canonicalUrl, new RegExp(`/su/${audited[1]}/$`));
    }
  }
  assert.equal(auditedCount, expected.size);
});
