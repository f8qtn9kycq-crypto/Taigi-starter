import { forwardRef } from "react";
import { lessonCatalog } from "../data/lessons";
import type { LessonCopy, Locale } from "../taigi-content";

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
  activeStage: number;
  stageCount: number;
  hasStarted: boolean;
  completedPhraseIds: ReadonlySet<string>;
  onLessonSelect: (lessonNumber: number) => void;
};

const CoursePath = forwardRef<HTMLElement, CoursePathProps>(
  function CoursePath(
    {
      text,
      locale,
      activeLessonNumber,
      activeStage,
      stageCount,
      hasStarted,
      completedPhraseIds,
      onLessonSelect,
    },
    ref,
  ) {
    return (
      <section className="path-card" id="path" ref={ref}>
        <div className="path-heading">
          <div><span className="section-label">{text.navPath}</span><h2>{text.path}</h2></div>
          <small>{text.pathSummary}</small>
        </div>
        <div className="lesson-list">
          {lessonCatalog.map((lesson) => {
            const isActive = lesson.number === activeLessonNumber;
            const isComplete = lesson.status === "prototype"
              && lesson.phrases.every((phrase) => completedPhraseIds.has(phrase.id));
            const completedStages = isComplete
              ? stageCount
              : isActive && hasStarted
                ? Math.min(activeStage + 1, stageCount)
                : 0;
            const action = isComplete
              ? text.lessonCompleted
              : isActive && hasStarted
                ? text.continueLesson(activeStage + 1, stageCount)
                : text.startLesson;

            return (
              <article
                key={lesson.id}
                className={isComplete ? "complete" : isActive ? "active" : "locked"}
              >
                {lesson.status === "prototype" ? (
                  <button
                    type="button"
                    className="lesson-list-button"
                    onClick={() => onLessonSelect(lesson.number)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="lesson-icon" aria-hidden="true">{lessonIcons[lesson.number] ?? "•"}</span>
                    <div className="lesson-card-copy">
                      <span className="lesson-kicker">{text.lessonNumber(lesson.number)}</span>
                      <b>{lesson.title[locale]}</b>
                      <small>{lesson.secondaryTitle[locale]} · {text.lessonDuration(lesson.durationMinutes)}</small>
                      {(isActive || isComplete) && (
                        <span className="lesson-progress">
                          <progress
                            role="progressbar"
                            aria-label={text.lessonProgressLabel(completedStages, stageCount)}
                            max={stageCount}
                            value={completedStages}
                          >
                            {completedStages}/{stageCount}
                          </progress>
                          <small>{completedStages}/{stageCount}</small>
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
                      <span className="lesson-kicker">{text.lessonNumber(lesson.number)}</span>
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
