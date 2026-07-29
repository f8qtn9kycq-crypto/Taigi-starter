"use client";

import { useEffect, useState } from "react";
import { useRecorder } from "../hooks/useRecorder";
import type { LessonCopy } from "../taigi-content";

type RecordingPracticeProps = {
  text: LessonCopy;
  onCompletionChange: (completed: boolean) => void;
};

export default function RecordingPractice({ text, onCompletionChange }: RecordingPracticeProps) {
  const { status, recordingUrl, start, stop, reset } = useRecorder();
  const [fallbackConfirmed, setFallbackConfirmed] = useState(false);
  const sayCompleted = status === "ready" || fallbackConfirmed;

  useEffect(() => {
    onCompletionChange(sayCompleted);
  }, [onCompletionChange, sayCompleted]);

  const buttonLabel = status === "requesting"
    ? text.microphoneRequest
    : status === "recording"
      ? text.stopRecording
      : status === "ready"
        ? text.recordAgain
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
    <div className="recording-practice">
      <button
        type="button"
        className={status === "recording" ? "action-button record-action live" : "action-button record-action"}
        onClick={handleClick}
        disabled={status === "requesting" || status === "unsupported"}
      >
        <span aria-hidden="true" />
        {buttonLabel}
      </button>

      {status === "recording" && <p role="status">{text.recordingPrivacy}</p>}
      {status === "denied" && <p role="alert">{text.microphoneDenied}</p>}
      {status === "unsupported" && <p role="alert">{text.microphoneUnsupported}</p>}
      {(status === "denied" || status === "unsupported") && !fallbackConfirmed && (
        <button type="button" className="action-button" onClick={() => setFallbackConfirmed(true)}>
          {text.confirmSay}
        </button>
      )}
      {sayCompleted && <p role="status">{text.sayCompleted}</p>}
      {recordingUrl && (
        <div className="recording-playback">
          <span>{text.yourRecording}</span>
          <audio controls src={recordingUrl} aria-label={text.yourRecording} />
          <small>{text.recordingLocalOnly}</small>
        </div>
      )}
    </div>
  );
}
