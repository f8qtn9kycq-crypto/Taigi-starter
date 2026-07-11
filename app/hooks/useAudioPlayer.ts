"use client";

import { useCallback, useEffect, useRef, useState } from "react";

let activeAudio: HTMLAudioElement | null = null;

export function useAudioPlayer(source: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(source);
      audio.preload = "metadata";
      audio.addEventListener("ended", () => setIsPlaying(false));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("error", () => {
        setIsPlaying(false);
        setHasError(true);
      });
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [source]);

  const toggle = useCallback(async () => {
    const audio = ensureAudio();
    setHasError(false);

    if (!audio.paused) {
      audio.pause();
      return false;
    }

    try {
      if (activeAudio && activeAudio !== audio) {
        activeAudio.pause();
      }
      activeAudio = audio;
      audio.currentTime = 0;
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      setHasError(true);
      setIsPlaying(false);
      return false;
    }
  }, [ensureAudio]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    if (activeAudio === audio) activeAudio = null;
  }, []);

  useEffect(
    () => () => {
      const audio = audioRef.current;
      audio?.pause();
      if (activeAudio === audio) activeAudio = null;
      audioRef.current = null;
    },
    [],
  );

  return { isPlaying, hasError, toggle, stop };
}
