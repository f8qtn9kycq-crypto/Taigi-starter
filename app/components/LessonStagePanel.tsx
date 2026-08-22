"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { LessonCopy } from "../taigi-content";
import type { PlayableLesson } from "../types/lesson";
import LessonStageContent from "./LessonStageContent";
import RecordingPractice from "./RecordingPractice";

type LessonStagePanelProps = {
  stage: number;
  text: LessonCopy;
  lesson: PlayableLesson;
  phraseIndex: number;
  nextPhraseIndex: number;
  lessonComplete: boolean;
  reviewScheduled: boolean;
  completed?: boolean;
  onAdvance: () => void;
  onReviewAdded: (phraseId: string) => void;
  onPhraseAdvance: () => void;
};

export default function LessonStagePanel({
  stage,
  text,
  lesson,
  phraseIndex,
  nextPhraseIndex,
  lessonComplete,
  reviewScheduled,
  completed = false,
  onAdvance,
  onReviewAdded,
  onPhraseAdvance,
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
    if (started) setAudioPlays((count) => count + 1);
  };

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
            <button type="button" className="action-button primary-action" onClick={onAdvance} disabled={audioPlays < 1 && !hasError}>
              {hasError ? text.continueWithoutAudio : text.nextSee}<span>→</span>
            </button>
          </>
        )}
        {lessonStage.id === "see" && <button type="button" className="action-button primary-action" onClick={onAdvance}>{text.nextSay}<span>→</span></button>}
        {lessonStage.id === "say" && (
          <>
            <RecordingPractice text={text} onCompletionChange={setSayCompleted} />
            {!sayCompleted && <p className="stage-gate-hint" role="status">{text.sayCompletionRequired}</p>}
            <button type="button" className="action-button primary-action" onClick={onAdvance} disabled={!sayCompleted}>{text.nextRecall}<span>→</span></button>
          </>
        )}
        {lessonStage.id === "recall" && !showAnswer && !recallAttempted && <button type="button" className="action-button primary-action" onClick={() => setRecallAttempted(true)}>{text.recallAttempt}<span>✓</span></button>}
        {lessonStage.id === "recall" && !showAnswer && recallAttempted && <button type="button" className="action-button primary-action" onClick={() => setShowAnswer(true)}>{text.showAnswer}<span>↓</span></button>}
        {lessonStage.id === "recall" && showAnswer && <button type="button" className="action-button primary-action" onClick={onAdvance}>{text.nextUse}<span>→</span></button>}
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
            {!hasUseResponse && <p className="stage-gate-hint" role="status">{text.useCompletionRequired}</p>}
            {reviewScheduled ? (
              nextPhraseIndex >= 0 ? (
                <button type="button" className="action-button primary-action" onClick={onPhraseAdvance} disabled={!hasUseResponse}>
                  {text.nextPhrase(lesson.phrases[nextPhraseIndex].hanji)}<span>→</span>
                </button>
              ) : lessonComplete && hasUseResponse && <p ref={completionRef} tabIndex={-1} className="lesson-complete" role="status">✓ {text.lessonComplete}</p>
            ) : (
              <button type="button" className="action-button primary-action" onClick={() => onReviewAdded(phrase.id)} disabled={!hasUseResponse}>
                {text.addReview}<span>+</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
