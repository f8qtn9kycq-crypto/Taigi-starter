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

export type LessonProgress = {
  stage: number;
  phraseIndex: number;
  completedPhraseIds: readonly string[];
};

export type LearningProgress = {
  version: 5;
  locale: Locale;
  lessonId: string;
  hasStarted: boolean;
  lessons: Readonly<Record<string, LessonProgress>>;
  reviewCards: Readonly<Record<string, ReviewCard>>;
};

export const DEFAULT_LESSON_PROGRESS: LessonProgress = {
  stage: 0,
  phraseIndex: 0,
  completedPhraseIds: [],
};

export const DEFAULT_PROGRESS: LearningProgress = {
  version: 5,
  locale: "zh",
  lessonId: "lesson-1-greetings",
  hasStarted: false,
  lessons: {
    "lesson-1-greetings": DEFAULT_LESSON_PROGRESS,
  },
  reviewCards: {},
};
