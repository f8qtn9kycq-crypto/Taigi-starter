import type { ReviewCard, ReviewRating } from "../types/learning.ts";

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

export function createReviewCard(now = new Date()): ReviewCard {
  return {
    id: "lesson-1-greeting",
    dueAt: now.toISOString(),
    intervalDays: 0,
    repetitions: 0,
    easeFactor: 2.3,
    lastReviewedAt: null,
  };
}

export function isReviewDue(card: ReviewCard | null, now = new Date()): boolean {
  if (!card) return false;
  return Date.parse(card.dueAt) <= now.getTime();
}

export function scheduleReview(
  card: ReviewCard,
  rating: ReviewRating,
  now = new Date(),
): ReviewCard {
  if (rating === "again") {
    return {
      ...card,
      dueAt: new Date(now.getTime() + 10 * MINUTE_MS).toISOString(),
      intervalDays: 0,
      repetitions: 0,
      easeFactor: Math.max(1.3, card.easeFactor - 0.2),
      lastReviewedAt: now.toISOString(),
    };
  }

  const isFirstReview = card.repetitions === 0;
  const intervalDays = rating === "hard"
    ? isFirstReview
      ? 1
      : Math.max(1, Math.round(card.intervalDays * 1.2))
    : isFirstReview
      ? 4
      : Math.max(4, Math.round(card.intervalDays * card.easeFactor));

  return {
    ...card,
    dueAt: new Date(now.getTime() + intervalDays * DAY_MS).toISOString(),
    intervalDays,
    repetitions: card.repetitions + 1,
    easeFactor: rating === "easy"
      ? Math.min(2.8, card.easeFactor + 0.15)
      : Math.max(1.3, card.easeFactor - 0.05),
    lastReviewedAt: now.toISOString(),
  };
}
