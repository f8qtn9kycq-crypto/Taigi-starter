"use client";

import { useEffect, useState } from "react";
import type { ReviewCard } from "../types/learning";
import { nextReviewRefreshDelay } from "../utils/learning-progress";

export function useReviewNow(
  reviewCards: Readonly<Record<string, ReviewCard>>,
): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const delay = nextReviewRefreshDelay(reviewCards, now);
    if (delay === null) return;

    const refreshTimer = window.setTimeout(() => setNow(new Date()), delay);
    return () => window.clearTimeout(refreshTimer);
  }, [now, reviewCards]);

  return now;
}
