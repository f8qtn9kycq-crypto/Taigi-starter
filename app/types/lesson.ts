import type {
  LessonAudioAttribution,
  LessonContentStatus,
  LessonFactoryStepId,
  LessonSource,
  LessonUseScenario,
  LocalizedText,
} from "./lesson-domain.ts";
import type { LessonUseCombination } from "./lesson-package.ts";

export {
  LESSON_FACTORY_STEP_IDS,
  LESSON_FACTORY_STEP_IDS as LESSON_STAGE_IDS,
} from "./lesson-domain.ts";
export type {
  LessonAudioAsset,
  LessonAudioAttribution,
  LessonContentStatus,
  LessonFactoryStepId,
  LessonSource,
  LessonUseScenario,
  LessonUseScenarioChoice,
  LocalizedText,
} from "./lesson-domain.ts";
export type { LessonUseCombination } from "./lesson-package.ts";

export type LessonPhrase = {
  id: string;
  hanji: string;
  tailo: string;
  poj: string | null;
  meaning: LocalizedText;
  cultureNote: LocalizedText;
  useCombination?: LessonUseCombination;
  useScenario?: LessonUseScenario;
  audioUrl: string;
  source: LessonSource;
  audioAttribution: LessonAudioAttribution;
};

export type LessonStageId = LessonFactoryStepId;

export type LessonStage = {
  id: LessonStageId;
  estimatedMinutes: number;
};

type LessonBase = {
  id: string;
  number: number;
  pathOrder: number;
  title: LocalizedText;
  secondaryTitle: LocalizedText;
  summary: LocalizedText;
  mission: LocalizedText;
  phrases: readonly LessonPhrase[];
};

export type PlayableLesson = LessonBase & {
  status: Extract<LessonContentStatus, "prototype">;
  durationMinutes: number;
  stages: readonly LessonStage[];
};

export type PlannedLesson = LessonBase & {
  status: Extract<LessonContentStatus, "planned">;
};

export type Lesson = PlayableLesson | PlannedLesson;
