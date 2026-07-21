"use client";

import { useEffect, useState } from "react";
import {
  PROGRESS_STORAGE_KEY,
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

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setProgress(parseStoredProgress(
        window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        { stageCount },
      ));
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, [stageCount]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress));
  }, [isHydrated, progress]);

  const update = (changes: Partial<Omit<LearningProgress, "version">>) => {
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
