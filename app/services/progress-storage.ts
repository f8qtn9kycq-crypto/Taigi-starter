import {
  DEFAULT_PROGRESS,
  type LearningProgress,
  type Locale,
} from "../types/learning.ts";
import { createReviewCard } from "../utils/srs.ts";

export const PROGRESS_STORAGE_KEY = "taigi-start-state";

type LegacyProgress = {
  locale?: unknown;
  dueCount?: unknown;
  stage?: unknown;
  hasStarted?: unknown;
};

function isLocale(value: unknown): value is Locale {
  return value === "zh" || value === "en";
}

function isValidStage(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 4;
}

export function parseStoredProgress(
  raw: string | null,
  now = new Date(),
): LearningProgress {
  if (!raw) return { ...DEFAULT_PROGRESS };

  try {
    const parsed = JSON.parse(raw) as Partial<LearningProgress> & LegacyProgress;

    if (parsed.version === 2) {
      return {
        version: 2,
        locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
        stage: isValidStage(parsed.stage) ? parsed.stage : DEFAULT_PROGRESS.stage,
        hasStarted: parsed.hasStarted === true,
        lessonOneReview:
          parsed.lessonOneReview &&
          parsed.lessonOneReview.id === "lesson-1-greeting" &&
          typeof parsed.lessonOneReview.dueAt === "string"
            ? parsed.lessonOneReview
            : null,
      };
    }

    return {
      version: 2,
      locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
      stage:
        parsed.hasStarted === true && isValidStage(parsed.stage)
          ? parsed.stage
          : DEFAULT_PROGRESS.stage,
      hasStarted: parsed.hasStarted === true,
      lessonOneReview:
        parsed.hasStarted === true &&
        typeof parsed.dueCount === "number" &&
        parsed.dueCount > 0
          ? createReviewCard(now)
          : null,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function serializeProgress(progress: LearningProgress): string {
  return JSON.stringify(progress);
}
