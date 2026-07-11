"use client";

import { useState } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { LessonCopy } from "../taigi-content";
import LessonStageContent from "./LessonStageContent";
import RecordingPractice from "./RecordingPractice";

const LESSON_AUDIO = "/audio/li-tsiah-pa-bue.mp3";

type LessonStagePanelProps = {
  stage: number;
  text: LessonCopy;
  reviewScheduled: boolean;
  onAdvance: () => void;
  onReviewAdded: () => void;
};

export default function LessonStagePanel({
  stage,
  text,
  reviewScheduled,
  onAdvance,
  onReviewAdded,
}: LessonStagePanelProps) {
  const [audioPlays, setAudioPlays] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const { isPlaying, hasError, toggle } = useAudioPlayer(LESSON_AUDIO);

  const playAudio = async () => {
    const started = await toggle();
    if (started) setAudioPlays((count) => count + 1);
  };

  return (
    <div className="stage-panel" aria-live="polite">
      <div className="stage-copy">
        <span>{text.stageCount(stage)}</span>
        <h3>{text.stageHeadings[stage]}</h3>
        <p>{text.stageBodies[stage]}</p>
      </div>

      <LessonStageContent
        stage={stage}
        text={text}
        showAnswer={showAnswer}
        onPlay={() => void playAudio()}
      />

      {stage === 0 && (
        <p className="media-attribution">
          {text.audioSourcePrefix}{" "}
          <a href="https://sutian.moe.edu.tw/und-hani/su/1653/" target="_blank" rel="noreferrer">
            {text.audioSource}
          </a>{" · "}
          <a href="https://creativecommons.org/licenses/by-nd/3.0/tw/" target="_blank" rel="noreferrer">
            CC BY-ND 3.0 TW
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
            <button type="button" className="action-button primary-action" onClick={onAdvance} disabled={audioPlays < 1}>
              {text.nextSee}<span>→</span>
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
