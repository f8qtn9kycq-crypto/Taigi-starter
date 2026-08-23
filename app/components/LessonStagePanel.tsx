"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { LessonCopy } from "../taigi-content";
import type { PlayableLesson } from "../types/lesson";
import LessonCompletionActions from "./LessonCompletionActions";
import LessonStageContent from "./LessonStageContent";
import MobileStageNavigation from "./MobileStageNavigation";
import RecordingPractice from "./RecordingPractice";

type LessonStagePanelProps = {
  stage: number;
  text: LessonCopy;
  lesson: PlayableLesson;
  phraseIndex: number;
  nextPhraseIndex: number;
  lessonComplete: boolean;
  nextLesson: PlayableLesson | null;
  reviewScheduled: boolean;
  completed?: boolean;
  onAdvance: () => void;
  onUnlock: () => void;
  onReviewAdded: (phraseId: string) => void;
  onPhraseAdvance: () => void;
  onLessonComplete: () => void;
  unlockedStage: number;
  viewedStage: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function LessonStagePanel({
  stage,
  text,
  lesson,
  phraseIndex,
  nextPhraseIndex,
  lessonComplete,
  nextLesson,
  reviewScheduled,
  completed = false,
  onAdvance,
  onUnlock,
  onReviewAdded,
  onPhraseAdvance,
  onLessonComplete,
  unlockedStage,
  viewedStage,
  onPrevious,
  onNext,
}: LessonStagePanelProps) {
  const [audioPlays, setAudioPlays] = useState(completed ? 1 : 0);
  const [showAnswer, setShowAnswer] = useState(completed);
  const [recallAttempted, setRecallAttempted] = useState(completed);
  const [sayCompleted, setSayCompleted] = useState(completed);
  const [useResponse, setUseResponse] = useState("");
  const completionRef = useRef<HTMLParagraphElement | null>(null);
  const previousReviewScheduledRef = useRef(reviewScheduled);
  const hasUseResponse = useResponse.trim().length > 0;
  const phrase = lesson.phrases[phraseIndex];
  const lessonStage = lesson.stages[stage];
  const { isPlaying, hasError, toggle } = useAudioPlayer(phrase.audioUrl);

  useEffect(() => {
    const justCompleted = !previousReviewScheduledRef.current && reviewScheduled;
    previousReviewScheduledRef.current = reviewScheduled;
    if (justCompleted && lessonComplete && hasUseResponse) completionRef.current?.focus();
  }, [hasUseResponse, lessonComplete, reviewScheduled]);

  const playAudio = async () => {
    const started = await toggle();
    if (started) {
      if (!completed && audioPlays === 0) onUnlock();
      setAudioPlays((count) => count + 1);
    }
  };
  const completeSay = (nextCompleted: boolean) => {
    if (nextCompleted && !sayCompleted && !completed) onUnlock();
    setSayCompleted(nextCompleted);
  };
  const revealAnswer = () => {
    setShowAnswer(true);
    if (!completed) onUnlock();
  };
  const mobileAction = lessonStage.id === "hear"
    ? {
        label: hasError ? text.continueWithoutAudio : text.nextSee,
        disabled: audioPlays < 1 && !hasError,
        onClick: onAdvance,
      }
    : lessonStage.id === "see"
      ? { label: text.nextSay, onClick: onAdvance }
      : lessonStage.id === "say"
        ? { label: text.nextRecall, disabled: !sayCompleted, onClick: onAdvance }
        : lessonStage.id === "recall"
          ? !recallAttempted
            ? { label: text.recallAttempt, onClick: () => setRecallAttempted(true) }
            : !showAnswer
              ? { label: text.showAnswer, onClick: revealAnswer }
              : { label: text.nextUse, onClick: onAdvance }
          : reviewScheduled
            ? nextPhraseIndex >= 0
              ? { label: text.nextPhrase(lesson.phrases[nextPhraseIndex].hanji), disabled: !hasUseResponse, onClick: onPhraseAdvance }
              : lessonComplete
                ? {
                    label: nextLesson
                      ? text.nextLesson(nextLesson.pathOrder, nextLesson.title[text.locale])
                      : text.viewProgress,
                    onClick: onLessonComplete,
                  }
                : undefined
            : { label: text.addReview, disabled: !hasUseResponse, onClick: () => onReviewAdded(phrase.id) };

  return (
    <div className="stage-panel" aria-live="polite">
      <div className="stage-copy">
        <span>{text.stageProgress(stage, lesson.stages.length, text.stageLabels[lessonStage.id])} · {text.stageTime(lessonStage.estimatedMinutes)}</span>
        <h3>{text.stageHeadings[lessonStage.id]}</h3>
        <p>{text.stageBodies[lessonStage.id]}</p>
      </div>

      <LessonStageContent
        stage={lessonStage.id}
        text={text}
        phrase={phrase}
        mission={lesson.mission}
        showAnswer={showAnswer}
        onPlay={() => void playAudio()}
      />

      {lessonStage.id === "hear" && (
        <p className="media-attribution">
          {text.audioSourcePrefix}{" "}
          <a href={phrase.audioAttribution.sourceUrl} target="_blank" rel="noreferrer">
            {phrase.source.title[text.locale]}
          </a>{" · "}
          <a href={phrase.audioAttribution.licenseUrl} target="_blank" rel="noreferrer">
            {phrase.audioAttribution.license}
          </a>
        </p>
      )}

      <div className="lesson-action-zone">
        {lessonStage.id === "hear" && (
          <>
            <button type="button" className="action-button listen-button" onClick={() => void playAudio()}>
              <span className={isPlaying ? "sound-mark playing" : "sound-mark"}>{isPlaying ? "Ⅱ" : "▶"}</span>
              <span><b>{isPlaying ? text.listening : text.listen}</b><small>{text.listened(audioPlays)}</small></span>
            </button>
            {hasError && <p className="media-error" role="alert">{text.audioUnavailable}</p>}
            {audioPlays < 1 && !hasError && <p className="stage-completion-hint" role="status">{text.hearCompletionHint}</p>}
            <button type="button" className="action-button primary-action desktop-stage-action" onClick={onAdvance} disabled={audioPlays < 1 && !hasError}>
              {hasError ? text.continueWithoutAudio : text.nextSee}<span>→</span>
            </button>
          </>
        )}
        {lessonStage.id === "see" && (
          <>
            <button type="button" className="action-button primary-action desktop-stage-action" onClick={onAdvance}>{text.nextSay}<span>→</span></button>
          </>
        )}
        {lessonStage.id === "say" && (
          <>
            <RecordingPractice text={text} onCompletionChange={completeSay} />
            {!sayCompleted && <p className="stage-gate-hint" role="status">{text.sayCompletionRequired}</p>}
            <button type="button" className="action-button primary-action desktop-stage-action" onClick={onAdvance} disabled={!sayCompleted}>{text.nextRecall}<span>→</span></button>
          </>
        )}
        {lessonStage.id === "recall" && !showAnswer && !recallAttempted && <button type="button" className="action-button primary-action desktop-stage-action" onClick={() => setRecallAttempted(true)}>{text.recallAttempt}<span>✓</span></button>}
        {lessonStage.id === "recall" && !showAnswer && recallAttempted && <button type="button" className="action-button primary-action desktop-stage-action" onClick={revealAnswer}>{text.showAnswer}<span>↓</span></button>}
        {lessonStage.id === "recall" && showAnswer && <button type="button" className="action-button primary-action desktop-stage-action" onClick={onAdvance}>{text.nextUse}<span>→</span></button>}
        {lessonStage.id === "use" && (
          <>
            <label className="use-response">
              <span>{text.usePrompt}</span>
              <textarea
                value={useResponse}
                onChange={(event) => setUseResponse(event.target.value)}
                placeholder={text.usePlaceholder}
                maxLength={120}
                rows={2}
              />
            </label>
            {!hasUseResponse && !lessonComplete && <p className="stage-gate-hint" role="status">{text.useCompletionRequired}</p>}
            {reviewScheduled ? (
              nextPhraseIndex >= 0 ? (
                <button type="button" className="action-button primary-action desktop-stage-action" onClick={onPhraseAdvance} disabled={!hasUseResponse}>
                  {text.nextPhrase(lesson.phrases[nextPhraseIndex].hanji)}<span>→</span>
                </button>
              ) : lessonComplete && (
                <LessonCompletionActions
                  ref={completionRef}
                  text={text}
                  nextLesson={nextLesson}
                  onContinue={onLessonComplete}
                />
              )
            ) : (
              <button type="button" className="action-button primary-action desktop-stage-action" onClick={() => onReviewAdded(phrase.id)} disabled={!hasUseResponse}>
                {text.addReview}<span>+</span>
              </button>
            )}
          </>
        )}
      </div>
      <MobileStageNavigation
        text={text}
        stages={lesson.stages}
        unlockedStage={unlockedStage}
        viewedStage={viewedStage}
        onPrevious={onPrevious}
        onNext={onNext}
        currentAction={mobileAction}
      />
    </div>
  );
}
