import type { Locale } from "./learning";

export type LocalizedText = Record<Locale, string>;

export type LessonSource = {
  title: LocalizedText;
  canonicalUrl: string;
  license: string;
  licenseUrl: string;
  speaker: string | null;
};

export type LessonPhrase = {
  id: string;
  hanji: string;
  tailo: string;
  poj: string;
  meaning: LocalizedText;
  cultureNote: LocalizedText;
  audioUrl: string;
  source: LessonSource;
};

export const LESSON_STAGE_IDS = ["hear", "see", "say", "recall", "use"] as const;

export type LessonStageId = (typeof LESSON_STAGE_IDS)[number];

export type LessonStage = {
  id: LessonStageId;
  estimatedMinutes: number;
};

export const LESSON_STAGE_COUNT = LESSON_STAGE_IDS.length;

export type Lesson = {
  id: string;
  number: number;
  title: LocalizedText;
  secondaryTitle: LocalizedText;
  summary: LocalizedText;
  status: "prototype" | "planned";
  durationMinutes: number;
  stages: readonly LessonStage[];
  phrases: readonly LessonPhrase[];
};
