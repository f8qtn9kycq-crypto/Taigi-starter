"use client";

import { useRef, useState } from "react";
import type { TouchEvent } from "react";
import { resolveStageSwipe } from "../utils/stage-navigation";

type PagerOptions = {
  stage: number;
  phraseIndex: number;
  lastStage: number;
  onStageChange: (stage: number) => void;
  onViewChange: (stage: number) => void;
};

export function useMobileStagePager({
  stage,
  phraseIndex,
  lastStage,
  onStageChange,
  onViewChange,
}: PagerOptions) {
  const [pager, setPager] = useState({ phraseIndex, furthestStage: stage, viewedStage: stage });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const progressChanged = pager.phraseIndex !== phraseIndex || pager.furthestStage !== stage;
  const viewedStage = progressChanged ? stage : pager.viewedStage;
  if (progressChanged) setPager({ phraseIndex, furthestStage: stage, viewedStage: stage });

  const showStage = (nextStage: number) => {
    onViewChange(nextStage);
    setPager({ phraseIndex, furthestStage: stage, viewedStage: nextStage });
  };
  const advance = () => {
    if (viewedStage < stage) return showStage(viewedStage + 1);
    const nextStage = Math.min(stage + 1, lastStage);
    onViewChange(nextStage);
    onStageChange(nextStage);
  };
  const unlockNext = () => {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    if (viewedStage < stage || stage >= lastStage) return;
    const nextStage = stage + 1;
    setPager({ phraseIndex, furthestStage: nextStage, viewedStage });
    onStageChange(nextStage);
  };
  const navigatePrevious = () => {
    if (viewedStage > 0) showStage(viewedStage - 1);
  };
  const navigateNext = () => {
    if (viewedStage < stage) showStage(viewedStage + 1);
  };
  const isInteractiveTarget = (target: EventTarget | null) => (
    target instanceof Element && Boolean(target.closest("button, a, input, textarea, select, audio"))
  );
  const handleTouchStart = (event: TouchEvent<HTMLOListElement>) => {
    if (!window.matchMedia("(max-width: 639px)").matches || isInteractiveTarget(event.target)) return;
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (event: TouchEvent<HTMLOListElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || isInteractiveTarget(event.target)) return;
    const touch = event.changedTouches[0];
    const nextStage = resolveStageSwipe(
      start,
      { x: touch.clientX, y: touch.clientY },
      viewedStage,
      stage,
    );
    if (nextStage !== null) showStage(nextStage);
  };

  return { viewedStage, showStage, advance, unlockNext, navigatePrevious, navigateNext, handleTouchStart, handleTouchEnd };
}
