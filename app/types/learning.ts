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
  hasStarted: boolean;
  reviewCards: Record<string, ReviewCard>;
};

export const DEFAULT_PROGRESS: LearningProgress = {
  version: 3,
  locale: "zh",
  stage: 0,
  hasStarted: false,
  reviewCards: {},
};
