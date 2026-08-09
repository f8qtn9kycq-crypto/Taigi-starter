import {
  DEFAULT_LESSON_PROGRESS,
  type LearningProgress,
  type LessonProgress,
  type ReviewCard,
  type ReviewRating,
} from "../types/learning.ts";
import { createReviewCard, isReviewDue, scheduleReview } from "./srs.ts";

export function updateActiveLesson(
  progress: LearningProgress,
  changes: Partial<LessonProgress>,
): LearningProgress {
  return {
    ...progress,
    lessons: {
      ...progress.lessons,
      [progress.lessonId]: {
        ...(progress.lessons[progress.lessonId] ?? DEFAULT_LESSON_PROGRESS),
        ...changes,
      },
    },
  };
}

export function selectLesson(progress: LearningProgress, lessonId: string): LearningProgress {
  return {
    ...progress,
    lessonId,
    lessons: {
      ...progress.lessons,
      [lessonId]: progress.lessons[lessonId] ?? { ...DEFAULT_LESSON_PROGRESS },
    },
  };
}

export function completePhrase(
  progress: LearningProgress,
  phraseId: string,
  now = new Date(),
): LearningProgress {
  const activeLesson = progress.lessons[progress.lessonId] ?? DEFAULT_LESSON_PROGRESS;
  return {
    ...updateActiveLesson(progress, {
      completedPhraseIds: activeLesson.completedPhraseIds.includes(phraseId)
        ? activeLesson.completedPhraseIds
        : [...activeLesson.completedPhraseIds, phraseId],
    }),
    reviewCards: {
      ...progress.reviewCards,
      [phraseId]: progress.reviewCards[phraseId] ?? createReviewCard(phraseId, now),
    },
  };
}

export function rateReviewCard(
  progress: LearningProgress,
  phraseId: string,
  rating: ReviewRating,
  now = new Date(),
): LearningProgress {
  const card = progress.reviewCards[phraseId];
  if (!card) return progress;
  return {
    ...progress,
    reviewCards: {
      ...progress.reviewCards,
      [phraseId]: scheduleReview(card, rating, now),
    },
  };
}

export function completedStepCount(
  progress: LessonProgress | undefined,
  phraseIds: readonly string[],
  stageCount: number,
): number {
  if (!progress) return 0;
  const completedPhraseIds = new Set(progress.completedPhraseIds);
  const completedPhrases = phraseIds.filter((phraseId) => completedPhraseIds.has(phraseId)).length;
  const currentPhraseId = phraseIds[progress.phraseIndex];
  const currentPhraseSteps = currentPhraseId && !completedPhraseIds.has(currentPhraseId)
    ? Math.min(progress.stage, Math.max(0, stageCount - 1))
    : 0;
  return Math.min(completedPhrases * stageCount + currentPhraseSteps, phraseIds.length * stageCount);
}

export function hasLessonProgress(progress: LessonProgress | undefined): boolean {
  return Boolean(progress && (progress.stage > 0 || progress.completedPhraseIds.length > 0));
}

export function orderedReviewCards(
  reviewCards: Readonly<Record<string, ReviewCard>>,
): readonly ReviewCard[] {
  return Object.values(reviewCards).sort((left, right) =>
    left.dueAt.localeCompare(right.dueAt) || left.id.localeCompare(right.id));
}

export function dueReviewCards(
  reviewCards: Readonly<Record<string, ReviewCard>>,
  now = new Date(),
): readonly ReviewCard[] {
  return orderedReviewCards(reviewCards).filter((card) => isReviewDue(card, now));
}
