import type { LessonSource, LocalizedText } from "./lesson";

export type LessonPackagePhrase = {
  id: string;
  hanji: string;
  tailo: string;
  poj: string | null;
  meaning: LocalizedText;
  cultureNote: LocalizedText;
  source: LessonSource;
  audio: {
    status: "not-yet-added";
    note: LocalizedText;
  };
};

export type LessonPackage = {
  id: string;
  number: number;
  title: LocalizedText;
  secondaryTitle: LocalizedText;
  summary: LocalizedText;
  objective: LocalizedText;
  status: "planned";
  stagePlan: readonly LocalizedText[];
  phrases: readonly LessonPackagePhrase[];
  teacherReview: {
    status: "required";
    checks: readonly LocalizedText[];
  };
};
