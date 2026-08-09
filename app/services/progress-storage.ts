import {
  DEFAULT_LESSON_PROGRESS,
  DEFAULT_PROGRESS,
  type LearningProgress,
  type LessonProgress,
  type Locale,
  type ReviewCard,
} from "../types/learning.ts";
import { createReviewCard } from "../utils/srs.ts";

export const PROGRESS_STORAGE_KEY = "taigi-start-state";

export type LessonProgressDefinition = {
  id: string;
  phraseIds: readonly string[];
  stageCount: number;
};

type ParseProgressOptions = {
  lessons: readonly LessonProgressDefinition[];
  defaultLessonId: string;
  now?: Date;
};

type LegacyProgress = {
  version?: unknown;
  locale?: unknown;
  lessonId?: unknown;
  stage?: unknown;
  phraseIndex?: unknown;
  hasStarted?: unknown;
  reviewCard?: unknown;
  lessonOneReview?: unknown;
  dueCount?: unknown;
  lessons?: unknown;
  reviewCards?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isLocale = (value: unknown): value is Locale => value === "zh" || value === "en";

const validIndex = (value: unknown, limit: number): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0 && value < limit;

const validNumber = (value: unknown, minimum: number): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= minimum;

function parseReviewCard(value: unknown, phraseId: string): ReviewCard | null {
  if (!isRecord(value) || value.id !== phraseId || typeof value.dueAt !== "string") return null;
  if (Number.isNaN(Date.parse(value.dueAt))) return null;
  if (!validNumber(value.intervalDays, 0) || !validNumber(value.repetitions, 0)) return null;
  if (!validNumber(value.easeFactor, 1.3)) return null;
  if (value.lastReviewedAt !== null && (
    typeof value.lastReviewedAt !== "string" || Number.isNaN(Date.parse(value.lastReviewedAt))
  )) return null;

  return {
    id: phraseId,
    dueAt: value.dueAt,
    intervalDays: value.intervalDays,
    repetitions: value.repetitions,
    easeFactor: value.easeFactor,
    lastReviewedAt: value.lastReviewedAt,
  };
}

function parseLessonProgress(
  value: unknown,
  definition: LessonProgressDefinition,
): LessonProgress {
  if (!isRecord(value)) return { ...DEFAULT_LESSON_PROGRESS };
  const completedPhraseIds = Array.isArray(value.completedPhraseIds)
    ? [...new Set(value.completedPhraseIds.filter(
        (phraseId): phraseId is string =>
          typeof phraseId === "string" && definition.phraseIds.includes(phraseId),
      ))]
    : [];

  return {
    stage: validIndex(value.stage, definition.stageCount) ? value.stage : 0,
    phraseIndex: validIndex(value.phraseIndex, definition.phraseIds.length) ? value.phraseIndex : 0,
    completedPhraseIds,
  };
}

function createDefaultProgress(defaultLessonId: string): LearningProgress {
  return {
    ...DEFAULT_PROGRESS,
    lessonId: defaultLessonId,
    lessons: { [defaultLessonId]: { ...DEFAULT_LESSON_PROGRESS } },
    reviewCards: {},
  };
}

function parseVersionFive(
  parsed: LegacyProgress,
  options: ParseProgressOptions,
): LearningProgress {
  const definitionById = new Map(options.lessons.map((lesson) => [lesson.id, lesson]));
  const phraseIds = new Set(options.lessons.flatMap((lesson) => lesson.phraseIds));
  const lessonId = typeof parsed.lessonId === "string" && definitionById.has(parsed.lessonId)
    ? parsed.lessonId
    : options.defaultLessonId;
  const storedLessons = isRecord(parsed.lessons) ? parsed.lessons : {};
  const lessons = Object.fromEntries(
    options.lessons
      .filter((definition) => definition.id === lessonId || definition.id in storedLessons)
      .map((definition) => [
        definition.id,
        parseLessonProgress(storedLessons[definition.id], definition),
      ]),
  );
  const storedReviewCards = isRecord(parsed.reviewCards) ? parsed.reviewCards : {};
  const reviewCards = Object.fromEntries(
    Object.entries(storedReviewCards).flatMap(([phraseId, value]) => {
      if (!phraseIds.has(phraseId)) return [];
      const card = parseReviewCard(value, phraseId);
      return card ? [[phraseId, card]] : [];
    }),
  );

  return {
    version: 5,
    locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
    lessonId,
    hasStarted: parsed.hasStarted === true,
    lessons: {
      ...lessons,
      [lessonId]: lessons[lessonId] ?? { ...DEFAULT_LESSON_PROGRESS },
    },
    reviewCards,
  };
}

function migrateLegacyProgress(
  parsed: LegacyProgress,
  options: ParseProgressOptions,
): LearningProgress {
  const definitionById = new Map(options.lessons.map((lesson) => [lesson.id, lesson]));
  const lessonId = typeof parsed.lessonId === "string" && definitionById.has(parsed.lessonId)
    ? parsed.lessonId
    : options.defaultLessonId;
  const definition = definitionById.get(lessonId) ?? options.lessons[0];
  if (!definition) return createDefaultProgress(options.defaultLessonId);

  const stage = parsed.hasStarted === true && validIndex(parsed.stage, definition.stageCount)
    ? parsed.stage
    : 0;
  const phraseIndex = validIndex(parsed.phraseIndex, definition.phraseIds.length)
    ? parsed.phraseIndex
    : 0;
  const legacyReview = parsed.reviewCard ?? parsed.lessonOneReview;
  const reviewPhraseId = isRecord(legacyReview) && typeof legacyReview.id === "string"
    ? legacyReview.id
    : definition.phraseIds[phraseIndex];
  const parsedReview = reviewPhraseId && definition.phraseIds.includes(reviewPhraseId)
    ? parseReviewCard(legacyReview, reviewPhraseId)
    : null;
  const dueReview = !parsedReview && parsed.hasStarted === true
    && typeof parsed.dueCount === "number" && parsed.dueCount > 0
    && definition.phraseIds[phraseIndex]
      ? createReviewCard(definition.phraseIds[phraseIndex], options.now)
      : null;
  const reviewCard = parsedReview ?? dueReview;

  return {
    version: 5,
    locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_PROGRESS.locale,
    lessonId,
    hasStarted: parsed.hasStarted === true,
    lessons: {
      [lessonId]: {
        stage,
        phraseIndex,
        completedPhraseIds: reviewCard ? [reviewCard.id] : [],
      },
    },
    reviewCards: reviewCard ? { [reviewCard.id]: reviewCard } : {},
  };
}

export function parseStoredProgress(
  raw: string | null,
  options: ParseProgressOptions,
): LearningProgress {
  if (!raw) return createDefaultProgress(options.defaultLessonId);

  try {
    const parsed = JSON.parse(raw) as LegacyProgress;
    return parsed.version === 5
      ? parseVersionFive(parsed, options)
      : migrateLegacyProgress(parsed, options);
  } catch {
    return createDefaultProgress(options.defaultLessonId);
  }
}

export function serializeProgress(progress: LearningProgress): string {
  return JSON.stringify(progress);
}
