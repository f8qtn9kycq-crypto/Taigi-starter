import type { LocalizedText } from "./lesson-domain";

export type CurriculumCoverageGroup = {
  id: "self-family" | "daily-life" | "community" | "communication";
  title: LocalizedText;
  capabilities: readonly LocalizedText[];
  knownGaps: readonly LocalizedText[];
  curriculumReferences: readonly string[];
  lessonNumbers: readonly number[];
};
