"use client";

import { useRecorder } from "../hooks/useRecorder";
import type { LessonCopy } from "../taigi-content";

type RecordingPracticeProps = {
  text: LessonCopy;
};

export default function RecordingPractice({ text }: RecordingPracticeProps) {
  const { status, recordingUrl, start, stop, reset } = useRecorder();

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
