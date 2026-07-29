"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus =
  | "checking"
  | "idle"
  | "requesting"
  | "recording"
  | "ready"
  | "denied"
  | "unsupported";

export function detectRecorderSupport(
  mediaDevices: Pick<MediaDevices, "getUserMedia"> | undefined,
  mediaRecorderAvailable: boolean,
): boolean {
  return typeof mediaDevices?.getUserMedia === "function" && mediaRecorderAvailable;
}

export function getRecorderInitialStatus(
  mediaDevices: Pick<MediaDevices, "getUserMedia"> | undefined,
  mediaRecorderAvailable: boolean,
): "idle" | "unsupported" {
  return detectRecorderSupport(mediaDevices, mediaRecorderAvailable) ? "idle" : "unsupported";
}

export function classifyRecorderError(error: unknown): "denied" | "unsupported" {
  return typeof error === "object" && error !== null
    && ((error as { name?: unknown }).name === "NotAllowedError"
      || (error as { name?: unknown }).name === "PermissionDeniedError")
    ? "denied"
    : "unsupported";
}

export function useRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const [status, setStatus] = useState<RecorderStatus>("checking");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  useEffect(() => {
    setStatus(getRecorderInitialStatus(navigator.mediaDevices, typeof MediaRecorder !== "undefined"));
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (!detectRecorderSupport(navigator.mediaDevices, typeof MediaRecorder !== "undefined")) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream);
      } catch {
        releaseStream();
        setStatus("unsupported");
        return;
      }
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        urlRef.current = URL.createObjectURL(blob);
        setRecordingUrl(urlRef.current);
        setStatus("ready");
        releaseStream();
      });

      recorder.start();
      setStatus("recording");
    } catch (error) {
      releaseStream();
      setStatus(classifyRecorderError(error) === "denied" ? "denied" : "unsupported");
    }
  }, [releaseStream]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, []);

  const reset = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setRecordingUrl(null);
    setStatus("idle");
  }, []);

  useEffect(
    () => () => {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      releaseStream();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [releaseStream],
  );

  return { status, recordingUrl, start, stop, reset };
}
