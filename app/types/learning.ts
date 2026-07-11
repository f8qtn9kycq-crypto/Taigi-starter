export type Locale = "zh" | "en";

export type ReviewRating = "again" | "hard" | "easy";

export type ReviewCard = {
  id: "lesson-1-greeting";
  dueAt: string;
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  lastReviewedAt: string | null;
};

export type LearningProgress = {
  version: 2;
  locale: Locale;
  stage: number;
  hasStarted: boolean;
  lessonOneReview: ReviewCard | null;
};

export const DEFAULT_PROGRESS: LearningProgress = {
  version: 2,
  locale: "zh",
  stage: 0,
  hasStarted: false,
  lessonOneReview: null,
};
