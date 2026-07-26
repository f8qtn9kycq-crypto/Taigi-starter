import { forwardRef } from "react";
import { lessonCatalog } from "../data/lessons";
import type { LessonCopy, Locale } from "../taigi-content";
import type { Lesson } from "../types/lesson";

type CoursePathProps = {
  text: LessonCopy;
  locale: Locale;
  activeLessonId?: string;
  onSelectLesson?: (lesson: Lesson) => void;
};

const CoursePath = forwardRef<HTMLElement, CoursePathProps>(
  function CoursePath({ text, locale, activeLessonId, onSelectLesson }, ref) {
    return (
      <section className="path-card" id="path" ref={ref}>
        <div className="path-heading">
          <div><span className="section-label">{text.navPath}</span><h2>{text.path}</h2></div>
          <small>{text.pathSummary}</small>
        </div>
        <div className="lesson-list">
          {lessonCatalog.map((lesson) => (
            <article key={lesson.id} className={lesson.id === activeLessonId ? "active" : ""}>
              <span>{String(lesson.number).padStart(2, "0")}</span>
              {lesson.status === "prototype" ? (
                <button type="button" className="lesson-path-button" onClick={() => onSelectLesson?.(lesson)} aria-pressed={lesson.id === activeLessonId}>
                  <b>{lesson.title[locale]}</b><small>{lesson.secondaryTitle[locale]}</small>
                </button>
              ) : <div><b>{lesson.title[locale]}</b><small>{lesson.secondaryTitle[locale]}</small></div>}
              <em>{lesson.status === "prototype" ? text.availableNow : text.planned}</em>
            </article>
          ))}
        </div>
      </section>
    );
  },
);

export default CoursePath;
