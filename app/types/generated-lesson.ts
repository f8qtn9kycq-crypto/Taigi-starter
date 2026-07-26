import type { LocalizedText } from "./lesson.ts";

export const GENERATED_LESSON_LEVELS = ["A0", "A1", "A2", "B1", "B2"] as const;
export type GeneratedLessonLevel = (typeof GENERATED_LESSON_LEVELS)[number];

export const GENERATED_CONTENT_STATUSES = ["verified", "provisional", "blocked"] as const;
export type GeneratedContentStatus = (typeof GENERATED_CONTENT_STATUSES)[number];

export const LESSON_FACTORY_STEP_TYPES = [
  "context",
  "input",
  "listen",
  "repeat",
  "constrained-dialogue",
  "feedback",
  "review",
  "completion",
] as const;
export type LessonFactoryStepType = (typeof LESSON_FACTORY_STEP_TYPES)[number];

export type GeneratedSource = { title: LocalizedText; canonicalUrl: string; license: string; licenseUrl: string; speaker: string | null };
export type GeneratedAudio = { audioUrl: string; originalUrl: string; sourceUrl: string; license: string; licenseUrl: string; speaker: string | null; isUnmodifiedOriginal: true };
export type GeneratedTargetPhrase = { id: string; hanji: string; tailo: string; poj: string | null; meaning: LocalizedText; cultureNote: LocalizedText; sources: readonly string[]; contentStatus: GeneratedContentStatus; source: GeneratedSource; audio: GeneratedAudio };
export type GeneratedVocabularyItem = { id: string; hanji: string; tailo: string; poj: string | null; meaning: LocalizedText; sources: readonly string[]; contentStatus: GeneratedContentStatus };
export type GeneratedLessonStep = { type: LessonFactoryStepType; title: LocalizedText; prompt: LocalizedText };
export type GeneratedReviewItem = { id: string; targetPhraseId: string; prompt: LocalizedText };
export type GeneratedLesson = {
  version: 1;
  generatedFrom: string;
  id: string;
  title: LocalizedText;
  level: GeneratedLessonLevel;
  scenario: LocalizedText;
  goal: LocalizedText;
  targetPhrases: readonly GeneratedTargetPhrase[];
  vocabulary: readonly GeneratedVocabularyItem[];
  steps: readonly GeneratedLessonStep[];
  reviewItems: readonly GeneratedReviewItem[];
  sources: readonly string[];
  contentStatus: GeneratedContentStatus;
};
