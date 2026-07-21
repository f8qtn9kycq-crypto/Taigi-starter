"use client";

import { useState } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { LessonCopy } from "../taigi-content";
import type { Lesson } from "../types/lesson";
import LessonStageContent from "./LessonStageContent";
import RecordingPractice from "./RecordingPractice";

type LessonStagePanelProps = {
  stage: number;
  text: LessonCopy;
  lesson: Lesson;
  reviewScheduled: boolean;
  onAdvance: () => void;
  onReviewAdded: () => void;
};

export default function LessonStagePanel({
  stage,
  text,
  lesson,
  reviewScheduled,
  onAdvance,
  onReviewAdded,
}: LessonStagePanelProps) {
  const [audioPlays, setAudioPlays] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const phrase = lesson.phrases[0];
  const lessonStage = lesson.stages[stage];
  const { isPlaying, hasError, toggle } = useAudioPlayer(phrase.audioUrl);

  const playAudio = async () => {
    const started = await toggle();
    if (started) setAudioPlays((count) => count + 1);
  };

  return (
    <div className="stage-panel" aria-live="polite">
      <div className="stage-copy">
        <span>{text.stageCount(stage)} · {text.stageTime(lessonStage.estimatedMinutes)}</span>
        <h3>{text.stageHeadings[stage]}</h3>
        <p>{text.stageBodies[stage]}</p>
      </div>

      <LessonStageContent
        stage={stage}
        text={text}
        phrase={phrase}
        showAnswer={showAnswer}
        onPlay={() => void playAudio()}
      />

      {stage === 0 && (
        <p className="media-attribution">
          {text.audioSourcePrefix}{" "}
          <a href={phrase.source.canonicalUrl} target="_blank" rel="noreferrer">
            {phrase.source.title[text.locale]}
          </a>{" · "}
          <a href={phrase.source.licenseUrl} target="_blank" rel="noreferrer">
            {phrase.source.license}
          </a>
        </p>
      )}

      <div className="lesson-action-zone">
        {stage === 0 && (
          <>
            <button type="button" className="action-button listen-button" onClick={() => void playAudio()}>
              <span className={isPlaying ? "sound-mark playing" : "sound-mark"}>{isPlaying ? "Ⅱ" : "▶"}</span>
              <span><b>{isPlaying ? text.listening : text.listen}</b><small>{text.listened(audioPlays)}</small></span>
            </button>
            {hasError && <p className="media-error" role="alert">{text.audioUnavailable}</p>}
            <button type="button" className="action-button primary-action" onClick={onAdvance} disabled={audioPlays < 1 && !hasError}>
              {hasError ? text.continueWithoutAudio : text.nextSee}<span>→</span>
            </button>
          </>
        )}
        {stage === 1 && <button type="button" className="action-button primary-action" onClick={onAdvance}>{text.nextSay}<span>→</span></button>}
        {stage === 2 && (
          <>
            <RecordingPractice text={text} />
            <button type="button" className="action-button primary-action" onClick={onAdvance}>{text.nextRecall}<span>→</span></button>
          </>
        )}
        {stage === 3 && !showAnswer && <button type="button" className="action-button primary-action" onClick={() => setShowAnswer(true)}>{text.showAnswer}<span>↓</span></button>}
        {stage === 3 && showAnswer && <button type="button" className="action-button primary-action" onClick={onAdvance}>{text.nextUse}<span>→</span></button>}
        {stage === 4 && (
          <button type="button" className="action-button primary-action" onClick={onReviewAdded} disabled={reviewScheduled}>
            {reviewScheduled ? text.reviewAdded : text.addReview}<span>{reviewScheduled ? "✓" : "+"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
