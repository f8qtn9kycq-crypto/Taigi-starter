import { forwardRef } from "react";
import { lessons, type LessonCopy, type Locale } from "../taigi-content";

type CoursePathProps = {
  text: LessonCopy;
  locale: Locale;
};

const CoursePath = forwardRef<HTMLElement, CoursePathProps>(
  function CoursePath({ text, locale }, ref) {
    return (
      <section className="path-card" id="path" ref={ref}>
        <div className="path-heading">
          <div><span className="section-label">{text.navPath}</span><h2>{text.path}</h2></div>
          <small>{text.pathSummary}</small>
        </div>
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <article key={lesson.id} className={lesson.id === 1 ? "active" : ""}>
              <span>{String(lesson.id).padStart(2, "0")}</span>
              <div><b>{locale === "zh" ? lesson.zh : lesson.en}</b><small>{locale === "zh" ? lesson.en : lesson.zh}</small></div>
              <em>{lesson.id === 1 ? "1 / 1" : lesson.id === 2 ? "→" : "·"}</em>
            </article>
          ))}
        </div>
      </section>
    );
  },
);

export default CoursePath;
