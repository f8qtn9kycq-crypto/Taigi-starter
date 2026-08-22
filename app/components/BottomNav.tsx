import type { RefObject } from "react";
import type { LessonCopy } from "../taigi-content";

export type AppTab = "learn" | "review" | "progress" | "feedback";

type BottomNavProps = {
  text: LessonCopy;
  dueCount: number;
  activeTab: AppTab;
  reviewButtonRef: RefObject<HTMLButtonElement | null>;
  feedbackButtonRef: RefObject<HTMLButtonElement | null>;
  onLearn: () => void;
  onReview: () => void;
  onPath: () => void;
  onFeedback: () => void;
};

export default function BottomNav({
  text,
  dueCount,
  activeTab,
  reviewButtonRef,
  feedbackButtonRef,
  onLearn,
  onReview,
  onPath,
  onFeedback,
}: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label={text.primaryNavigation}>
      <button
        type="button"
        className={activeTab === "learn" ? "active" : undefined}
        onClick={onLearn}
        aria-current={activeTab === "learn" ? "page" : undefined}
      >
        <span aria-hidden="true">◉</span>
        {text.navLearn}
      </button>
      <button
        ref={reviewButtonRef}
        type="button"
        className={activeTab === "review" ? "active" : undefined}
        onClick={onReview}
        aria-current={activeTab === "review" ? "page" : undefined}
      >
        <span className="nav-review-icon" aria-hidden="true">
          ↻<em>{dueCount}</em>
        </span>
        {text.navReview}
      </button>
      <button
        type="button"
        className={activeTab === "progress" ? "active" : undefined}
        onClick={onPath}
        aria-current={activeTab === "progress" ? "page" : undefined}
      >
        <span aria-hidden="true">☷</span>
        {text.navProgress}
      </button>
      <button
        ref={feedbackButtonRef}
        type="button"
        className={activeTab === "feedback" ? "active" : undefined}
        onClick={onFeedback}
        aria-current={activeTab === "feedback" ? "page" : undefined}
      >
        <span aria-hidden="true">✦</span>
        {text.navFeedback}
      </button>
    </nav>
  );
}
