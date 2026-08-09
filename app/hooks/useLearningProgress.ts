"use client";

import { useEffect, useRef, useState } from "react";
import {
  PROGRESS_STORAGE_KEY,
  parseStoredProgress,
  serializeProgress,
  type LessonProgressDefinition,
} from "../services/progress-storage";
import {
  DEFAULT_LESSON_PROGRESS,
  DEFAULT_PROGRESS,
  type LearningProgress,
  type Locale,
  type ReviewRating,
} from "../types/learning";
import {
  completePhrase,
  rateReviewCard,
  selectLesson,
  updateActiveLesson,
} from "../utils/learning-progress";

type ProgressUpdate = (progress: LearningProgress) => LearningProgress;

export function useLearningProgress(
  lessons: readonly LessonProgressDefinition[],
  defaultLessonId: string,
) {
  const [progress, setProgress] = useState<LearningProgress>({
    ...DEFAULT_PROGRESS,
    lessonId: defaultLessonId,
    lessons: { [defaultLessonId]: { ...DEFAULT_LESSON_PROGRESS } },
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedRef = useRef(false);
  const pendingUpdatesRef = useRef<ProgressUpdate[]>([]);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const storedProgress = parseStoredProgress(
        window.localStorage.getItem(PROGRESS_STORAGE_KEY),
        { lessons, defaultLessonId },
      );
      const hydratedProgress = pendingUpdatesRef.current.reduce(
        (current, applyUpdate) => applyUpdate(current),
        storedProgress,
      );
      pendingUpdatesRef.current = [];
      hydratedRef.current = true;
      setProgress(hydratedProgress);
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, [defaultLessonId, lessons]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress));
  }, [isHydrated, progress]);

  const update = (applyUpdate: ProgressUpdate) => {
    if (!hydratedRef.current) pendingUpdatesRef.current.push(applyUpdate);
    setProgress(applyUpdate);
  };

  return {
    progress,
    isHydrated,
    setLocale: (locale: Locale) => update((current) => ({ ...current, locale })),
    setLessonId: (lessonId: string) => update((current) => selectLesson(current, lessonId)),
    setStage: (stage: number) => update((current) => updateActiveLesson(current, { stage })),
    setPhraseIndex: (phraseIndex: number) => update((current) =>
      updateActiveLesson(current, { phraseIndex, stage: 0 })),
    setHasStarted: (hasStarted: boolean) => update((current) => ({ ...current, hasStarted })),
    addReview: (phraseId: string) => {
      const now = new Date();
      update((current) => completePhrase(current, phraseId, now));
    },
    rateReview: (phraseId: string, rating: ReviewRating) => {
      const now = new Date();
      update((current) => rateReviewCard(current, phraseId, rating, now));
    },
  };
}
