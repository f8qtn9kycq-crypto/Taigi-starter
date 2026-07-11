import assert from "node:assert/strict";
import test from "node:test";
import { createReviewCard, isReviewDue, scheduleReview } from "../app/utils/srs.ts";

const now = new Date("2026-07-11T00:00:00.000Z");

test("new lesson cards are due immediately", () => {
  const card = createReviewCard(now);
  assert.equal(isReviewDue(card, now), true);
  assert.equal(card.repetitions, 0);
});

test("review ratings produce distinct and explainable intervals", () => {
  const card = createReviewCard(now);
  const again = scheduleReview(card, "again", now);
  const hard = scheduleReview(card, "hard", now);
  const easy = scheduleReview(card, "easy", now);

  assert.equal(again.dueAt, "2026-07-11T00:10:00.000Z");
  assert.equal(hard.dueAt, "2026-07-12T00:00:00.000Z");
  assert.equal(easy.dueAt, "2026-07-15T00:00:00.000Z");
  assert.equal(again.intervalDays, 0);
  assert.equal(hard.intervalDays, 1);
  assert.equal(easy.intervalDays, 4);
});

test("later easy reviews expand from the current interval", () => {
  const first = scheduleReview(createReviewCard(now), "easy", now);
  const next = scheduleReview(first, "easy", new Date(first.dueAt));
  assert.equal(next.intervalDays, 10);
  assert.equal(next.repetitions, 2);
});
