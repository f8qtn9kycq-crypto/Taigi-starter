import {
  DEFAULT_PROGRESS,
  type LearningProgress,
  type Locale,
} from "../types/learning.ts";
import { createReviewCard } from "../utils/srs.ts";

export const PROGRESS_STORAGE_KEY = "taigi-start-state";

export type PendingProgressUpdates = Partial<Omit<LearningProgress, "version">>;

type LegacyProgress = {
  locale?: unknown;
  dueCount?: unknown;
  stage?: unknown;
  hasStarted?: unknown;
};

type StoredProgress = Partial<LearningProgress> & LegacyProgress & {
  lessonOneReview?: unknown;
};

function isLocale(value: unknown): value is Locale {
  return value === "zh" || value === "en";
}

function isValidStage(value: unknown, stageCount: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < stageCount;
}

function isValidPhraseIndex(value: unknown, phraseCount: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < phraseCount;
}

function isReviewCard(value: unknown): value is LearningProgress["reviewCard"] {
  return Boolean(
    value &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "string" &&
    "dueAt" in value &&
    typeof value.dueAt === "string",
  );
}

export function parseStoredProgress(
  raw: string | null,
  options: { stageCount: number; phraseCount?: number; now?: Date },
): LearningProgress {
  const { stageCount, phraseCount = 1, now = new Date() } = options;
  if (!raw) return { ...DEFAULT_PROGRESS };

  try {
    const parsed = JSON.parse(raw) as StoredProgress;

    if (parsed.version === 4 || parsed.version === 3) {
      const storedReview = isReviewCard(parsed.reviewCard) ? parsed.reviewCard : null;
      return {
        version: 4,
        locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
        lessonId: typeof parsed.lessonId === "string" && parsed.lessonId.length > 0
          ? parsed.lessonId
          : DEFAULT_PROGRESS.lessonId,
        stage: isValidStage(parsed.stage, stageCount) ? parsed.stage : DEFAULT_PROGRESS.stage,
        phraseIndex: isValidPhraseIndex(parsed.phraseIndex, phraseCount)
          ? parsed.phraseIndex
          : DEFAULT_PROGRESS.phraseIndex,
        hasStarted: parsed.hasStarted === true,
        reviewCard: storedReview,
      };
    }

    return {
      version: 4,
      locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
      lessonId: DEFAULT_PROGRESS.lessonId,
      stage:
        parsed.hasStarted === true && isValidStage(parsed.stage, stageCount)
          ? parsed.stage
          : DEFAULT_PROGRESS.stage,
      phraseIndex: DEFAULT_PROGRESS.phraseIndex,
      hasStarted: parsed.hasStarted === true,
      reviewCard:
        parsed.hasStarted === true &&
        typeof parsed.dueCount === "number" &&
        parsed.dueCount > 0
          ? createReviewCard("li-tsiah-pa-bue", now)
          : isReviewCard(parsed.lessonOneReview)
            ? parsed.lessonOneReview
            : null,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function serializeProgress(progress: LearningProgress): string {
  return JSON.stringify(progress);
}

export function mergePendingProgress(
  stored: LearningProgress,
  pending: PendingProgressUpdates,
): LearningProgress {
  return { ...stored, ...pending };
}
