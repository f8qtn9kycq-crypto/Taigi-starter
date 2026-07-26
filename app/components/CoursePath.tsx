import { forwardRef } from "react";
import { lessonCatalog } from "../data/lessons";
import type { LessonCopy, Locale } from "../taigi-content";

type CoursePathProps = {
  text: LessonCopy;
  locale: Locale;
  activeLessonNumber: number;
  onLessonSelect: (lessonNumber: number) => void;
};

const CoursePath = forwardRef<HTMLElement, CoursePathProps>(
  function CoursePath({ text, locale, activeLessonNumber, onLessonSelect }, ref) {
    return (
      <section className="path-card" id="path" ref={ref}>
        <div className="path-heading">
          <div><span className="section-label">{text.navPath}</span><h2>{text.path}</h2></div>
          <small>{text.pathSummary}</small>
        </div>
        <div className="lesson-list">
          {lessonCatalog.map((lesson) => (
            <article key={lesson.id} className={lesson.number === activeLessonNumber ? "active" : ""}>
              {lesson.status === "prototype" ? (
                <button
                  type="button"
                  className="lesson-list-button"
                  onClick={() => onLessonSelect(lesson.number)}
                  aria-current={lesson.number === activeLessonNumber ? "page" : undefined}
                >
                  <span>{String(lesson.pathOrder).padStart(2, "0")}</span>
                  <div><b>{lesson.title[locale]}</b><small>{lesson.secondaryTitle[locale]}</small></div>
                  <em>{text.availableNow}</em>
                </button>
              ) : (
                <>
                  <span>{String(lesson.pathOrder).padStart(2, "0")}</span>
                  <div><b>{lesson.title[locale]}</b><small>{lesson.secondaryTitle[locale]}</small></div>
                  <em>{text.planned}</em>
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  },
);

export default CoursePath;
