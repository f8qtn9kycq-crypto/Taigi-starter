import type { RefObject } from "react";
import type { LessonCopy } from "../taigi-content";
import type { LessonPhrase, PlayableLesson } from "../types/lesson";
import LessonCompletionActions from "./LessonCompletionActions";
import UseScenarioExercise from "./UseScenarioExercise";

type UseStageActionsProps = {
  text: LessonCopy;
  lesson: PlayableLesson;
  phrase: LessonPhrase;
  nextLesson: PlayableLesson | null;
  nextPhraseIndex: number;
  lessonComplete: boolean;
  reviewScheduled: boolean;
  hasUseResponse: boolean;
  useResponse: string;
  selectedChoiceId: string | null;
  completionRef: RefObject<HTMLParagraphElement | null>;
  onUseResponseChange: (response: string) => void;
  onChoiceSelect: (choiceId: string) => void;
  onPhraseAdvance: () => void;
  onReviewAdded: (phraseId: string) => void;
  onLessonComplete: () => void;
};

export default function UseStageActions(props: UseStageActionsProps) {
  const {
    text, lesson, phrase, nextLesson, nextPhraseIndex, lessonComplete,
    reviewScheduled, hasUseResponse, useResponse, selectedChoiceId,
    completionRef, onUseResponseChange, onChoiceSelect, onPhraseAdvance,
    onReviewAdded, onLessonComplete,
  } = props;

  return (
    <>
      {phrase.useScenario ? (
        <UseScenarioExercise
          scenario={phrase.useScenario}
          locale={text.locale}
          selectedChoiceId={selectedChoiceId}
          chooseResponseLabel={text.useChooseResponse}
          correctLabel={text.useCorrect}
          tryAgainLabel={text.useTryAgain}
          sourceLabel={text.verifySource}
          onSelect={onChoiceSelect}
        />
      ) : (
        <label className="use-response">
          <span>{text.usePrompt}</span>
          <textarea value={useResponse} onChange={(event) => onUseResponseChange(event.target.value)}
            placeholder={text.usePlaceholder} maxLength={120} rows={2} />
        </label>
      )}
      {!hasUseResponse && !lessonComplete && !phrase.useScenario && (
        <p className="stage-gate-hint" role="status">{text.useCompletionRequired}</p>
      )}
      {reviewScheduled ? (
        nextPhraseIndex >= 0 ? (
          <button type="button" className="action-button primary-action desktop-stage-action" onClick={onPhraseAdvance} disabled={!hasUseResponse}>
            {text.nextPhrase(lesson.phrases[nextPhraseIndex].hanji)}<span>→</span>
          </button>
        ) : lessonComplete && (
          <LessonCompletionActions ref={completionRef} text={text} nextLesson={nextLesson} onContinue={onLessonComplete} />
        )
      ) : (
        <button type="button" className="action-button primary-action desktop-stage-action" onClick={() => onReviewAdded(phrase.id)} disabled={!hasUseResponse}>
          {text.addReview}<span>+</span>
        </button>
      )}
    </>
  );
}
