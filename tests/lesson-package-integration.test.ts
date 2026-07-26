import assert from "node:assert/strict";
import test from "node:test";
import { lessonPackages } from "../app/data/lesson-packages.ts";
import { createLessonCatalog } from "../app/data/lessons.ts";
import {
  lessonPackageHandoffToPlayableLesson,
} from "../app/utils/lesson-package-handoff.ts";

const createHandoff = (poj: string | null = null): Record<string, unknown> => {
  const lessonPackage = structuredClone(lessonPackages[0]);
  lessonPackage.teacherReview = {
    ...lessonPackage.teacherReview,
    status: "approved",
    reviewer: "teacher@example.test",
    reviewedAt: "2026-07-25T00:00:00.000Z",
    checks: lessonPackage.teacherReview.checks.map((check) => ({ ...check, status: "passed" })),
  };
  lessonPackage.phrases = lessonPackage.phrases.map((phrase, index) => ({
    ...phrase,
    poj: index === 0 ? poj : phrase.poj,
  }));

  return {
    package: lessonPackage,
    audioAttribution: lessonPackage.phrases.map((phrase) => ({
      phraseId: phrase.id,
      audioUrl: `/audio/${phrase.id}.mp3`,
      sourceUrl: phrase.source.canonicalUrl,
      originalUrl: "https://audio.example.test/lesson-2.mp3",
      license: "CC BY-ND 3.0 TW",
      licenseUrl: "https://creativecommons.org/licenses/by-nd/3.0/tw/",
      speaker: null,
      isUnmodifiedOriginal: true,
    })),
    mobileFlowEvidence: [{
      viewport: "390x844",
      checkedAt: "2026-07-25T00:00:00.000Z",
      evidenceRef: "test://mobile/lesson-2",
    }],
    ownerRiskAcceptance: {
      acceptedBy: "product-owner",
      acceptedAt: "2026-07-25T00:00:00.000Z",
      reason: {
        zh: "本次發布接受教師審核尚未完成的風險，保留審核欄位供後續追蹤。",
        en: "This release accepts the risk of incomplete teacher review while retaining the review fields for follow-up.",
      },
    },
  };
};

test("approved handoff maps to a playable lesson without changing the source package", () => {
  const handoff = createHandoff("Lí chia̍h-pá--bōe?");
  const lesson = lessonPackageHandoffToPlayableLesson(handoff);

  assert.ok(lesson);
  assert.equal(lesson.status, "prototype");
  assert.equal(lesson.number, 2);
  assert.equal(lesson.stages.length, 5);
  assert.equal(lesson.phrases[0].audioUrl, "/audio/lesson-2-family-home.mp3");
  assert.equal(lesson.phrases[0].audioAttribution.isUnmodifiedOriginal, true);
  assert.equal(lesson.phrases[0].poj, "Lí chia̍h-pá--bōe?");
  assert.equal((handoff.package as { status: string }).status, "planned");
});

test("handoff with missing POJ is rejected instead of inventing a value", () => {
  const lesson = lessonPackageHandoffToPlayableLesson(createHandoff());

  assert.equal(lesson, null);
});

test("incomplete handoff cannot produce a playable lesson", () => {
  const handoff = createHandoff();
  (handoff.package as { teacherReview: { status: string } }).teacherReview.status = "required";
  delete handoff.ownerRiskAcceptance;

  assert.equal(lessonPackageHandoffToPlayableLesson(handoff), null);
  assert.equal(lessonPackageHandoffToPlayableLesson({}), null);
});

test("catalog replaces a matching planned placeholder only for a valid handoff", () => {
  const catalog = createLessonCatalog([createHandoff("Lí chia̍h-pá--bōe?")]);
  const lessonTwo = catalog.filter((lesson) => lesson.number === 2);

  assert.equal(lessonTwo.length, 1);
  assert.equal(lessonTwo[0].status, "prototype");
  assert.equal(catalog.find((lesson) => lesson.number === 3)?.status, "planned");

  const unchanged = createLessonCatalog([{}]);
  assert.equal(unchanged.find((lesson) => lesson.number === 2)?.status, "planned");
});
