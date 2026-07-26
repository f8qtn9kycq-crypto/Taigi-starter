export type Locale = "zh" | "en";

export type ReviewRating = "again" | "hard" | "easy";

export type ReviewCard = {
  id: string;
  dueAt: string;
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  lastReviewedAt: string | null;
};

export type LearningProgress = {
  version: 3;
  locale: Locale;
  stage: number;
  phraseIndex: number;
  hasStarted: boolean;
  reviewCard: ReviewCard | null;
};

export const DEFAULT_PROGRESS: LearningProgress = {
  version: 3,
  locale: "zh",
  stage: 0,
  phraseIndex: 0,
  hasStarted: false,
  reviewCard: null,
};
