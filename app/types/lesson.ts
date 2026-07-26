import type { Locale } from "./learning";

export type LocalizedText = Record<Locale, string>;

export type LessonSource = {
  title: LocalizedText;
  canonicalUrl: string;
  license: string;
  licenseUrl: string;
  speaker: string | null;
};

export type LessonAudioAttribution = {
  audioUrl: string;
  sourceUrl: string;
  originalUrl: string;
  license: string;
  licenseUrl: string;
  speaker: string | null;
  isUnmodifiedOriginal: true;
};

export type LessonPhrase = {
  id: string;
  hanji: string;
  tailo: string;
  poj: string | null;
  meaning: LocalizedText;
  cultureNote: LocalizedText;
  audioUrl: string;
  source: LessonSource;
  audioAttribution: LessonAudioAttribution;
};

export const LESSON_STAGE_IDS = ["hear", "see", "say", "recall", "use"] as const;

export type LessonStageId = (typeof LESSON_STAGE_IDS)[number];

export type LessonStage = {
  id: LessonStageId;
  estimatedMinutes: number;
};

type LessonBase = {
  id: string;
  number: number;
  title: LocalizedText;
  secondaryTitle: LocalizedText;
  summary: LocalizedText;
  phrases: readonly LessonPhrase[];
};

export type PlayableLesson = LessonBase & {
  status: "prototype";
  durationMinutes: number;
  stages: readonly LessonStage[];
};

export type PlannedLesson = LessonBase & {
  status: "planned";
};

export type Lesson = PlayableLesson | PlannedLesson;
