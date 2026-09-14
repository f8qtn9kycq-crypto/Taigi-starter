"use client";

import { useEffect, useRef, useState } from "react";
import { useRecorder } from "../hooks/useRecorder";
import type { LessonCopy } from "../taigi-content";

type RecordingPracticeProps = {
  text: LessonCopy;
  isModelPlaying: boolean;
  modelAudioError: boolean;
  modelAlreadyHeard: boolean;
  clarification: string | null;
  onModelPlay: () => Promise<boolean>;
  onModelStop: () => void;
  onPlaybackChange: (played: boolean) => void;
  onCompletionChange: (completed: boolean) => void;
};

export default function RecordingPractice({
  text,
  isModelPlaying,
  modelAudioError,
  modelAlreadyHeard,
  clarification,
  onModelPlay,
  onModelStop,
  onPlaybackChange,
  onCompletionChange,
}: RecordingPracticeProps) {
  const { status, recordingUrl, start, stop, reset } = useRecorder();
  const [fallbackConfirmed, setFallbackConfirmed] = useState(false);
  const [modelStarted, setModelStarted] = useState(modelAlreadyHeard);
  const [selfPlaying, setSelfPlaying] = useState(false);
  const [selfPlayed, setSelfPlayed] = useState(false);
  const [selfError, setSelfError] = useState(false);
  const selfRef = useRef<HTMLAudioElement | null>(null);
  const sayCompleted = status === "ready" || fallbackConfirmed;
  const unavailable = status === "denied" || status === "unsupported";
  const showModelFirst = !modelStarted && !modelAudioError && !unavailable
    && status !== "ready" && status !== "recording" && !fallbackConfirmed;
  const busy = status === "checking" || status === "requesting";

  useEffect(() => {
    onCompletionChange(sayCompleted);
    onPlaybackChange(selfPlayed || fallbackConfirmed);
  }, [onCompletionChange, onPlaybackChange, sayCompleted, selfPlayed, fallbackConfirmed]);

  const playModel = async () => {
    selfRef.current?.pause();
    if (await onModelPlay()) setModelStarted(true);
  };
  const playSelf = async () => {
    onModelStop();
    const audio = selfRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    setSelfError(false);
    if (audio.ended) audio.currentTime = 0;
    try { await audio.play(); } catch { setSelfError(true); }
  };

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
    onModelStop();
    selfRef.current?.pause();
    setSelfPlayed(false);
    setSelfError(false);
    if (status === "ready") reset();
    setFallbackConfirmed(false);
    void start();
  };

  const primaryClass = "action-button primary-action";
  const secondaryClass = "action-button say-secondary";
  const recordPrimary = !showModelFirst && !unavailable && status !== "ready" && !fallbackConfirmed;

  return (
    <div className="recording-practice" role="group" aria-label={text.sayLoopLabel}>
      {clarification && <p className="say-clarification">{clarification}</p>}
      {status !== "recording" && (
        <button type="button" className={showModelFirst ? primaryClass : secondaryClass}
          onClick={() => void playModel()} aria-pressed={isModelPlaying} disabled={busy}>
          {isModelPlaying ? text.listening : modelStarted ? text.sayModelAgain : text.sayModelFirst}
          <span aria-hidden="true">{isModelPlaying ? "Ⅱ" : "▶"}</span>
        </button>
      )}
      {modelAudioError && <p className="media-error" role="alert">{text.audioUnavailable}</p>}
      <div className="say-record-step">
        {status === "unverified" && !showModelFirst && <p role="status">{text.microphoneEnableHint}</p>}
        {status === "denied" && <p role="alert">{text.microphoneDenied}</p>}
        {status === "unsupported" && <p role="alert">{text.microphoneUnsupported}</p>}
        {!showModelFirst && (
          <button type="button" className={recordPrimary ? primaryClass : secondaryClass}
            onClick={handleClick} disabled={busy}>
            {buttonLabel}<span aria-hidden="true">{status === "recording" ? "■" : "●"}</span>
          </button>
        )}
        {status === "recording" && <p role="status">{text.recordingPrivacy}</p>}
        {unavailable && !fallbackConfirmed && (
          <button type="button" className={primaryClass} onClick={() => setFallbackConfirmed(true)}>
            {text.confirmSay}
          </button>
        )}
      </div>
      {recordingUrl && (
        <div className="recording-playback">
          <button type="button" className={selfPlayed ? secondaryClass : primaryClass}
            onClick={() => void playSelf()} aria-pressed={selfPlaying}>
            {selfPlaying ? text.pauseSelf : text.sayListenSelf}
            <span aria-hidden="true">{selfPlaying ? "Ⅱ" : "▶"}</span>
          </button>
          <audio ref={selfRef} src={recordingUrl} aria-label={text.yourRecording}
            onPlay={() => setSelfPlaying(true)} onPause={() => setSelfPlaying(false)}
            onEnded={() => { setSelfPlaying(false); setSelfPlayed(true); }}
            onError={() => { setSelfPlaying(false); setSelfError(true); }} />
          <small>{text.recordingLocalOnly}</small>
          {selfError && <p role="alert">{text.selfAudioError}</p>}
        </div>
      )}
      {sayCompleted && <p role="status">{recordingUrl && !selfPlayed ? text.recordingReady : text.sayCompleted}</p>}
    </div>
  );
}
