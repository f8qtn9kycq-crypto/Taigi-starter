import type { Locale } from "./learning.ts";

export type LocalizedText = Record<Locale, string>;

export type LessonContentStatus = "prototype" | "planned";

export type LessonSource = {
  title: LocalizedText;
  canonicalUrl: string;
  license: string;
  licenseUrl: string;
  speaker: string | null;
};

export type LessonAudioAsset = {
  contentHanji: string;
  audioUrl: string;
  originalUrl: string;
  license: string;
  licenseUrl: string;
  isUnmodifiedOriginal: true;
};

export type LessonAudioAttribution = LessonAudioAsset & {
  sourceUrl: string;
  speaker: string | null;
};

export type LessonUseScenarioChoice = {
  id: string;
  hanji: string;
  tailo: string;
  meaning: LocalizedText;
  feedback: LocalizedText;
  sourceUrl: string;
  isCorrect: boolean;
};

export type LessonUseScenario = {
  prompt: LocalizedText;
  explanation: LocalizedText;
  choices: readonly LessonUseScenarioChoice[];
};

export const LESSON_FACTORY_STEP_IDS = ["hear", "see", "say", "recall", "use"] as const;

export type LessonFactoryStepId = (typeof LESSON_FACTORY_STEP_IDS)[number];
