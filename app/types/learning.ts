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
  version: 4;
  locale: Locale;
  lessonId: string;
  stage: number;
  phraseIndex: number;
  hasStarted: boolean;
  reviewCard: ReviewCard | null;
};

export const DEFAULT_PROGRESS: LearningProgress = {
  version: 4,
  locale: "zh",
  lessonId: "lesson-1-greetings",
  stage: 0,
  phraseIndex: 0,
  hasStarted: false,
  reviewCard: null,
};
