import { forwardRef } from "react";
import { lessonCatalog } from "../data/lessons";
import type { LessonCopy, Locale } from "../taigi-content";
import type { LessonProgress } from "../types/learning";
import { completedStepCount, hasLessonProgress } from "../utils/learning-progress";

const lessonIcons: Readonly<Record<number, string>> = {
  1: "👋", 2: "🏠", 3: "123", 4: "🍚", 5: "☀️",
  6: "☁️", 7: "🧭", 8: "🛍️", 9: "🏘️", 10: "🙌",
  11: "📅", 12: "💬", 13: "🙋", 14: "📚", 15: "🩺",
  16: "🚌", 17: "🍽️", 18: "💰", 19: "🙏", 20: "🆘",
};

type CoursePathProps = {
  text: LessonCopy;
  locale: Locale;
  activeLessonNumber: number;
  stageCount: number;
  hasStarted: boolean;
  progressReady: boolean;
  lessonProgress: Readonly<Record<string, LessonProgress>>;
  onLessonSelect: (lessonNumber: number) => void;
};

const CoursePath = forwardRef<HTMLElement, CoursePathProps>(
  function CoursePath(
    {
      text,
      locale,
      activeLessonNumber,
      stageCount,
      hasStarted,
      progressReady,
      lessonProgress,
      onLessonSelect,
    },
    ref,
  ) {
    return (
      <section className="path-card" id="path" ref={ref} aria-busy={!progressReady}>
        <div className="path-heading">
          <div><span className="section-label">{text.navPath}</span><h2>{text.path}</h2></div>
          <small>{text.pathSummary}</small>
        </div>
        <div className="lesson-list">
          {lessonCatalog.map((lesson) => {
            const isActive = lesson.number === activeLessonNumber;
            const storedProgress = lessonProgress[lesson.id];
            const phraseIds = lesson.status === "prototype"
              ? lesson.phrases.map((phrase) => phrase.id)
              : [];
            const totalSteps = phraseIds.length * stageCount;
            const completedSteps = completedStepCount(storedProgress, phraseIds, stageCount);
            const isComplete = lesson.status === "prototype" && totalSteps > 0
              && completedSteps === totalSteps;
            const hasProgress = hasLessonProgress(storedProgress);
            const action = isComplete
              ? text.lessonCompleted
              : hasProgress
                ? text.continueLesson(completedSteps, totalSteps)
                : text.startLesson;
            const cardState = lesson.status === "planned"
              ? "locked"
              : isComplete
                ? "complete"
                : isActive
                  ? "active"
                  : "available";

            return (
              <article key={lesson.id} className={cardState}>
                {lesson.status === "prototype" ? (
                  <button
                    type="button"
                    className="lesson-list-button"
                    onClick={() => onLessonSelect(lesson.number)}
                    disabled={!progressReady}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="lesson-icon" aria-hidden="true">{lessonIcons[lesson.number] ?? "•"}</span>
                    <div className="lesson-card-copy">
                      <span className="lesson-kicker">{text.lessonNumber(lesson.pathOrder)}</span>
                      <b>{lesson.title[locale]}</b>
                      <small>{lesson.secondaryTitle[locale]} · {text.lessonDuration(lesson.durationMinutes)}</small>
                      {(isActive && hasStarted || hasProgress || isComplete) && (
                        <span className="lesson-progress">
                          <progress
                            role="progressbar"
                            aria-label={text.lessonProgressLabel(completedSteps, totalSteps)}
                            max={totalSteps}
                            value={completedSteps}
                          >
                            {completedSteps}/{totalSteps}
                          </progress>
                          <small>{completedSteps}/{totalSteps}</small>
                        </span>
                      )}
                    </div>
                    <em className={isComplete ? "complete" : ""}>
                      {action}{!isComplete && <i aria-hidden="true">→</i>}
                    </em>
                  </button>
                ) : (
                  <>
                    <span className="lesson-icon" aria-hidden="true">{lessonIcons[lesson.number] ?? "•"}</span>
                    <div className="lesson-card-copy">
                      <span className="lesson-kicker">{text.lessonNumber(lesson.pathOrder)}</span>
                      <b>{lesson.title[locale]}</b>
                      <small>{lesson.secondaryTitle[locale]} · {text.planned}</small>
                    </div>
                    <em><i aria-hidden="true">🔒</i>{text.lessonLocked}</em>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  },
);

export default CoursePath;
