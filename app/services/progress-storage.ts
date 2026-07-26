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

function isReviewCard(value: unknown): value is LearningProgress["reviewCards"][string] {
  return typeof value === "object" && value !== null
    && typeof (value as { id?: unknown }).id === "string"
    && typeof (value as { dueAt?: unknown }).dueAt === "string";
}

function parseReviewCards(value: unknown): LearningProgress["reviewCards"] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([key, card]) => key.length > 0 && isReviewCard(card)),
  ) as LearningProgress["reviewCards"];
}

function isLocale(value: unknown): value is Locale {
  return value === "zh" || value === "en";
}

function isValidStage(value: unknown, stageCount: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < stageCount;
}

export function parseStoredProgress(
  raw: string | null,
  options: { stageCount: number; now?: Date },
): LearningProgress {
  const { stageCount, now = new Date() } = options;
  if (!raw) return { ...DEFAULT_PROGRESS };

  try {
    const parsed = JSON.parse(raw) as Partial<LearningProgress> & LegacyProgress;

    if (parsed.version === 3) {
      return {
        version: 3,
        locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
        stage: isValidStage(parsed.stage, stageCount) ? parsed.stage : DEFAULT_PROGRESS.stage,
        hasStarted: parsed.hasStarted === true,
        reviewCards: parseReviewCards((parsed as { reviewCards?: unknown }).reviewCards),
      };
    }

    const legacyReview = (parsed as { lessonOneReview?: unknown }).lessonOneReview;
    return {
      version: 3,
      locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
      stage:
        parsed.hasStarted === true && isValidStage(parsed.stage, stageCount)
          ? parsed.stage
          : DEFAULT_PROGRESS.stage,
      hasStarted: parsed.hasStarted === true,
      reviewCards: isReviewCard(legacyReview)
        ? { [legacyReview.id]: legacyReview }
        : parsed.hasStarted === true && typeof parsed.dueCount === "number" && parsed.dueCount > 0
          ? { "lesson-1-greeting": createReviewCard(now) }
          : {},
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
