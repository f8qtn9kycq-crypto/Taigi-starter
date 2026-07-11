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

export type Lesson = {
  id: string;
  number: number;
  title: LocalizedText;
  secondaryTitle: LocalizedText;
  summary: LocalizedText;
  status: "prototype" | "planned";
  phrases: readonly LessonPhrase[];
};
