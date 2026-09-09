"use client";

import { useEffect, useState } from "react";
import { useRecorder } from "../hooks/useRecorder";
import type { LessonCopy } from "../taigi-content";

type RecordingPracticeProps = {
  text: LessonCopy;
  isModelPlaying: boolean;
  modelAudioError: boolean;
  clarification: string | null;
  onModelPlay: () => void;
  onCompletionChange: (completed: boolean) => void;
};

export default function RecordingPractice({
  text,
  isModelPlaying,
  modelAudioError,
  clarification,
  onModelPlay,
  onCompletionChange,
}: RecordingPracticeProps) {
  const { status, recordingUrl, start, stop, reset } = useRecorder();
  const [fallbackConfirmed, setFallbackConfirmed] = useState(false);
  const sayCompleted = status === "ready" || fallbackConfirmed;

  useEffect(() => {
    onCompletionChange(sayCompleted);
  }, [onCompletionChange, sayCompleted]);

  const buttonLabel = status === "requesting"
    ? text.microphoneRequest
    : status === "checking"
      ? text.microphoneChecking
    : status === "unverified"
      ? text.microphoneEnable
    : status === "recording"
      ? text.stopRecording
      : status === "ready"
        ? text.recordAgain
        : status === "denied" || status === "unsupported"
          ? text.retryMicrophone
        : text.record;

  const handleClick = () => {
    if (status === "recording") {
      stop();
      return;
    }
    if (status === "ready") reset();
    setFallbackConfirmed(false);
    void start();
  };

  return (
    <div className="recording-practice" role="group" aria-label={text.sayLoopLabel}>
      {clarification && <p className="say-clarification">{clarification}</p>}

      <div className="say-loop-step">
        <span className="say-step-index" aria-hidden="true">1</span>
        <button
          type="button"
          className="action-button listen-button"
          onClick={onModelPlay}
          aria-pressed={isModelPlaying}
        >
          <span className={isModelPlaying ? "sound-mark playing" : "sound-mark"} aria-hidden="true">
            {isModelPlaying ? "Ⅱ" : "▶"}
          </span>
          <b>{text.sayModelFirst}</b>
        </button>
      </div>
      {modelAudioError && <p className="media-error" role="alert">{text.audioUnavailable}</p>}

      <div className="say-loop-step">
        <span className="say-step-index" aria-hidden="true">2</span>
        <div className="say-record-step">
          {status === "unverified" && <p role="status">{text.microphoneEnableHint}</p>}
          {status === "denied" && <p role="alert">{text.microphoneDenied}</p>}
          {status === "unsupported" && <p role="alert">{text.microphoneUnsupported}</p>}

          <button
            type="button"
            className={status === "recording" ? "action-button record-action live" : "action-button record-action"}
            onClick={handleClick}
            disabled={status === "checking" || status === "requesting"}
          >
            <span aria-hidden="true" />
            {buttonLabel}
          </button>

          {status === "recording" && <p role="status">{text.recordingPrivacy}</p>}
          {(status === "denied" || status === "unsupported") && !fallbackConfirmed && (
            <button type="button" className="action-button" onClick={() => setFallbackConfirmed(true)}>
              {text.confirmSay}
            </button>
          )}
        </div>
      </div>
      {sayCompleted && <p role="status">{text.sayCompleted}</p>}
      {recordingUrl && (
        <div className="say-loop-step">
          <span className="say-step-index" aria-hidden="true">3</span>
          <div className="recording-playback">
            <span>{text.sayListenSelf}</span>
            <audio controls src={recordingUrl} aria-label={text.yourRecording} />
            <small>{text.recordingLocalOnly}</small>
          </div>
        </div>
      )}
      {sayCompleted && (
        <div className="say-loop-step">
          <span className="say-step-index" aria-hidden="true">{recordingUrl ? "4" : "3"}</span>
          <button
            type="button"
            className="action-button listen-button"
            onClick={onModelPlay}
            aria-pressed={isModelPlaying}
          >
            <span className={isModelPlaying ? "sound-mark playing" : "sound-mark"} aria-hidden="true">
              {isModelPlaying ? "Ⅱ" : "▶"}
            </span>
            <b>{text.sayModelAgain}</b>
          </button>
        </div>
      )}
    </div>
  );
}
