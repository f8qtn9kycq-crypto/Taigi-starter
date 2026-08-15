import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { lessonPackageHandoffs } from "../app/data/lesson-package-handoffs.ts";
import { renderTeacherReviewPacket } from "../app/utils/teacher-review-packet.ts";

const handoff = lessonPackageHandoffs.find(
  (item) => item.package.id === "lesson-19-polite-exchanges-package",
);

test("Lesson 19 teacher packet stays source-derived, complete, and pending", async () => {
  assert.ok(handoff);
  const rendered = renderTeacherReviewPacket(handoff);
  const checkedIn = await readFile(
    new URL("../docs/teacher-review/lesson-19-polite-exchanges.md", import.meta.url),
    "utf8",
  );

  assert.equal(checkedIn, rendered);
  assert.match(rendered, /空白教師審核表／尚未審核／不是核准證據/);
  assert.match(rendered, /teacher review required \/ not approval evidence/);
  assert.match(rendered, /reviewer: ""/);
  assert.match(rendered, /reviewedAt: "" # ISO 8601/);
  assert.match(rendered, /exactCommit: ""/);
  assert.match(rendered, /decision: "" # approved or changes-requested/);
  assert.match(rendered, /evidenceRef: "" # immutable review record/);
  assert.doesNotMatch(rendered, /^decision: approved$/m);

  for (const check of handoff.package.teacherReview.checks) {
    assert.match(rendered, new RegExp(`id: ${check.id}`));
  }
  for (const phrase of handoff.package.phrases) {
    const attribution = handoff.audioAttribution.find((item) => item.phraseId === phrase.id);
    assert.ok(attribution);
    for (const value of [
      phrase.id,
      phrase.hanji,
      phrase.tailo,
      phrase.poj,
      phrase.meaning.zh,
      phrase.meaning.en,
      phrase.cultureNote.zh,
      phrase.cultureNote.en,
      phrase.source.canonicalUrl,
      attribution.originalUrl,
      attribution.audioUrl,
      attribution.licenseUrl,
    ]) {
      assert.match(rendered, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  }
});

test("teacher packet renderer rejects a package that is no longer fully pending", () => {
  assert.ok(handoff);
  const approved = {
    ...handoff,
    package: {
      ...handoff.package,
      teacherReview: { ...handoff.package.teacherReview, status: "approved" as const },
    },
  };
  assert.throws(
    () => renderTeacherReviewPacket(approved),
    /only be generated from a fully pending review/,
  );
});
