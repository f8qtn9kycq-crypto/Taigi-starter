"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "ready"
  | "denied"
  | "unsupported";

export function useRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
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
    } catch {
      releaseStream();
      setStatus("denied");
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
