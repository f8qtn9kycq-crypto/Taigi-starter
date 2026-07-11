import type { LessonCopy } from "../taigi-content";

type BottomNavProps = {
  text: LessonCopy;
  dueCount: number;
  activeTab: "learn" | "review" | "progress";
  onLearn: () => void;
  onReview: () => void;
  onPath: () => void;
};

export default function BottomNav({
  text,
  dueCount,
  activeTab,
  onLearn,
  onReview,
  onPath,
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
    </nav>
  );
}
