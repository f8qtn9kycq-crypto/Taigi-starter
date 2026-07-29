"use client";

import { useEffect, useRef, useState } from "react";
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

export function useLearningProgress(
  lessonId: string,
  phraseIds: readonly string[],
  stageCount: number,
) {
  const [progress, setProgress] = useState<LearningProgress>(DEFAULT_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);
  const pendingUpdatesRef = useRef<Partial<Omit<LearningProgress, "version">>>({});

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const storedProgress = parseStoredProgress(
        window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        { stageCount, phraseCount: phraseIds.length },
      );
      const isCurrentLesson = storedProgress.reviewCard === null || phraseIds.includes(storedProgress.reviewCard.id);
      setProgress({
        ...storedProgress,
        stage: isCurrentLesson ? storedProgress.stage : 0,
        phraseIndex: isCurrentLesson ? storedProgress.phraseIndex : 0,
        reviewCard: isCurrentLesson ? storedProgress.reviewCard : null,
        ...pendingUpdatesRef.current,
      });
      pendingUpdatesRef.current = {};
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, [lessonId, phraseIds, stageCount]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress));
  }, [isHydrated, lessonId, progress]);

  const update = (changes: Partial<Omit<LearningProgress, "version">>) => {
    if (!isHydrated) {
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...changes };
    }
    setProgress((current) => ({ ...current, ...changes }));
  };

  return {
    progress,
    setLocale: (locale: Locale) => update({ locale }),
    setLessonId: (nextLessonId: string) => update({\n      lessonId: nextLessonId,\n      stage: 0,\n      phraseIndex: 0,\n      reviewCard: null,\n    }),
    setStage: (stage: number) => update({ stage }),
    setPhraseIndex: (phraseIndex: number) => update({ phraseIndex, stage: 0 }),
    setHasStarted: (hasStarted: boolean) => update({ hasStarted }),
    addReview: (phraseId: string) => update({ reviewCard: createReviewCard(phraseId) }),
    rateReview: (rating: ReviewRating) => {
      setProgress((current) => ({
        ...current,
        reviewCard: current.reviewCard
          ? scheduleReview(current.reviewCard, rating)
          : null,
      }));
    },
  };
}
