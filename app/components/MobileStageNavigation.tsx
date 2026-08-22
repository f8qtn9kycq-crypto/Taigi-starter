import type { LessonCopy } from "../taigi-content";
import type { LessonStage } from "../types/lesson";

type MobileStageNavigationProps = {
  text: LessonCopy;
  stages: readonly LessonStage[];
  unlockedStage: number;
  viewedStage: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function MobileStageNavigation({
  text,
  stages,
  unlockedStage,
  viewedStage,
  onPrevious,
  onNext,
}: MobileStageNavigationProps) {
  const previousStageLabel = viewedStage > 0 ? text.stageLabels[stages[viewedStage - 1].id] : null;
  const nextStageLabel = viewedStage < unlockedStage ? text.stageLabels[stages[viewedStage + 1].id] : null;

  return (
    <nav className="mobile-stage-navigation" aria-label={text.learningStages}>
      <button type="button" onClick={onPrevious} disabled={viewedStage === 0}>
        <span aria-hidden="true">←</span>{previousStageLabel ? text.previousStageTo(previousStageLabel) : text.previousStage}
      </button>
      <span aria-live="polite">{text.stageCount(viewedStage, stages.length)}</span>
      <button type="button" onClick={onNext} disabled={viewedStage >= unlockedStage}>
        {nextStageLabel ? text.nextStageTo(nextStageLabel) : text.nextUnlockedStage}<span aria-hidden="true">→</span>
      </button>
      {nextStageLabel && viewedStage === 0 ? (
        <p className="stage-unlocked-hint" role="status">
          {text.unlockedStageHint(text.stageLabels[stages[viewedStage].id], nextStageLabel)}
          <i aria-hidden="true">→</i>
        </p>
      ) : (viewedStage > 0 || nextStageLabel) ? (
        <p>
          {viewedStage > 0 && <span><i aria-hidden="true">←</i>{text.swipeLeftPrevious}</span>}
          {nextStageLabel && <span>{text.swipeRightNext}<i aria-hidden="true">→</i></span>}
        </p>
      ) : null}
    </nav>
  );
}
