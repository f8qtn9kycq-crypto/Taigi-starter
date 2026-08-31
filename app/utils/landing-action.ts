import type { PlayableLesson } from "../types/lesson";

export type LandingAction =
  | { kind: "start"; lesson: PlayableLesson }
  | { kind: "resume"; lesson: PlayableLesson; stage: number }
  | { kind: "next"; lesson: PlayableLesson }
  | { kind: "progress" };

type LandingActionInput = {
  hasStarted: boolean;
  activeLesson: PlayableLesson;
  nextLesson: PlayableLesson | null;
  completedPhraseIds: ReadonlySet<string>;
  stage: number;
};

export function resolveLandingAction({
  hasStarted,
  activeLesson,
  nextLesson,
  completedPhraseIds,
  stage,
}: LandingActionInput): LandingAction {
  if (!hasStarted) return { kind: "start", lesson: activeLesson };

  const lessonComplete = activeLesson.phrases.every(({ id }) => completedPhraseIds.has(id));
  if (lessonComplete) {
    return nextLesson ? { kind: "next", lesson: nextLesson } : { kind: "progress" };
  }

  return {
    kind: "resume",
    lesson: activeLesson,
    stage: Math.min(Math.max(stage, 0), activeLesson.stages.length - 1),
  };
}
