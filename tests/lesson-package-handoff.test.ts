import assert from "node:assert/strict";
import test from "node:test";
import { lessonPackages } from "../app/data/lesson-packages.ts";
import {
  isLessonPackageHandoff,
  validateLessonPackageHandoff,
} from "../app/utils/lesson-package-handoff.ts";

type MutableRecord = Record<string, unknown>;
type MutableHandoff = {
  package: MutableRecord;
  audioAttribution: MutableRecord[];
  mobileFlowEvidence: MutableRecord[];
  ownerRiskAcceptance: MutableRecord;
};

const createApprovedPackage = (): MutableRecord => {
  const packages = JSON.parse(JSON.stringify(lessonPackages)) as MutableRecord[];
  const lessonPackage = packages[0];
  const review = lessonPackage.teacherReview as MutableRecord;
  review.status = "approved";
  review.reviewer = "teacher@example.test";
  review.reviewedAt = "2026-07-25T00:00:00.000Z";
  for (const check of review.checks as MutableRecord[]) check.status = "passed";
  return lessonPackage;
};

const createCompleteHandoff = (): MutableHandoff => {
  const lessonPackage = createApprovedPackage();
  const phrases = lessonPackage.phrases as MutableRecord[];
  return {
    package: lessonPackage,
    audioAttribution: phrases.map((phrase) => ({
      phraseId: phrase.id,
      contentHanji: phrase.hanji,
      audioUrl: `/audio/${phrase.id}.mp3`,
      sourceUrl: "https://audio.example.test/lesson-2",
      originalUrl: "https://audio.example.test/lesson-2.mp3",
      license: "CC BY-ND 3.0 TW",
      licenseUrl: "https://creativecommons.org/licenses/by-nd/3.0/tw/",
      speaker: "Test speaker",
      isUnmodifiedOriginal: true,
    })),
    mobileFlowEvidence: [
      {
        viewport: "390x844",
        checkedAt: "2026-07-25T00:00:00.000Z",
        evidenceRef: "test://mobile/lesson-2-390x844",
      },
    ],
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

test("complete approved handoff passes without changing the planned package status", () => {
  const handoff = createCompleteHandoff();

  assert.deepEqual(validateLessonPackageHandoff(handoff), []);
  assert.equal(isLessonPackageHandoff(handoff), true);
  assert.equal(handoff.package.status, "planned");
  const phrases = handoff.package.phrases as MutableRecord[];
  const audio = phrases[0].audio as MutableRecord;
  assert.equal(audio.status, "added");
});

test("owner risk acceptance can authorize a package without teacher approval", () => {
  const handoff = createCompleteHandoff();
  const review = handoff.package.teacherReview as MutableRecord;
  review.status = "required";
  review.reviewer = null;
  review.reviewedAt = null;
  for (const check of review.checks as MutableRecord[]) check.status = "pending";

  assert.deepEqual(validateLessonPackageHandoff(handoff), []);
  assert.equal(isLessonPackageHandoff(handoff), true);
});

test("handoff rejects an unapproved package without owner risk acceptance", () => {
  const handoff = createCompleteHandoff();
  const review = handoff.package.teacherReview as MutableRecord;
  review.status = "required";
  review.reviewer = null;
  review.reviewedAt = null;
  for (const check of review.checks as MutableRecord[]) check.status = "pending";
  delete (handoff as MutableRecord).ownerRiskAcceptance;

  const paths = validateLessonPackageHandoff(handoff).map((issue) => issue.path);
  assert.ok(paths.includes("ownerRiskAcceptance"));
  assert.equal(isLessonPackageHandoff(handoff), false);
});

test("handoff rejects incomplete audio attribution and mobile evidence", () => {
  const handoff = createCompleteHandoff();
  handoff.audioAttribution.pop();
  handoff.audioAttribution[0].isUnmodifiedOriginal = false;
  handoff.audioAttribution[0].contentHanji = "只有部分詞目";
  handoff.mobileFlowEvidence[0].viewport = "phone";
  handoff.mobileFlowEvidence[0].checkedAt = "2026-02-30T00:00:00.000Z";
  handoff.mobileFlowEvidence[0].evidenceRef = "";

  const paths = validateLessonPackageHandoff(handoff).map((issue) => issue.path);
  assert.ok(paths.includes("audioAttribution"));
  assert.ok(paths.includes("audioAttribution[0].isUnmodifiedOriginal"));
  assert.ok(paths.includes("audioAttribution[0].contentHanji"));
  assert.ok(paths.includes("mobileFlowEvidence[0].viewport"));
  assert.ok(paths.includes("mobileFlowEvidence[0].checkedAt"));
  assert.ok(paths.includes("mobileFlowEvidence[0].evidenceRef"));
});
