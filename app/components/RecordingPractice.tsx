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
    void start();
  };

  return (
    <div className="recording-practice">
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
      {status === "unverified" && <p role="status">{text.microphoneEnableHint}</p>}
      {status === "denied" && <p role="alert">{text.microphoneDenied}</p>}
      {status === "unsupported" && <p role="alert">{text.microphoneUnsupported} {text.openSafariHint}</p>}
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
