"use client";

import { useEffect, useRef, useState } from "react";
import {
  PROGRESS_STORAGE_KEY,
  mergePendingProgress,
  parseStoredProgress,
  serializeProgress,
} from "../services/progress-storage";
import {
  DEFAULT_PROGRESS,
  type LearningProgress,
  type Locale,
  type ReviewRating,
} from "../types/learning";
import { createReviewCard, scheduleReview } from "../utils/srs";

export function useLearningProgress(stageCount: number) {
  const [progress, setProgress] = useState<LearningProgress>(DEFAULT_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);
  const pendingUpdatesRef = useRef<Partial<Omit<LearningProgress, "version">>>({});

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const storedProgress = parseStoredProgress(
        window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        { stageCount },
      );
      setProgress(mergePendingProgress(storedProgress, pendingUpdatesRef.current));
      pendingUpdatesRef.current = {};
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, [stageCount]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress));
  }, [isHydrated, progress]);

  const update = (changes: Partial<Omit<LearningProgress, "version">>) => {
    if (!isHydrated) {
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...changes };
    }
    setProgress((current) => ({ ...current, ...changes }));
  };

  return {
    progress,
    setLocale: (locale: Locale) => update({ locale }),
    setStage: (stage: number) => update({ stage }),
    setHasStarted: (hasStarted: boolean) => update({ hasStarted }),
    addReview: () => update({ lessonOneReview: createReviewCard() }),
    rateReview: (rating: ReviewRating) => {
      setProgress((current) => ({
        ...current,
        lessonOneReview: current.lessonOneReview
          ? scheduleReview(current.lessonOneReview, rating)
          : null,
      }));
    },
  };
}
