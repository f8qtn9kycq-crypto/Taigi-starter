import { curriculumCoverageGroups, elementaryTaiwaneseCurriculumUrl } from "../data/curriculum-coverage";
import { lessonCatalog } from "../data/lessons";
import type { LessonCopy, Locale } from "../taigi-content";

type CurriculumCoverageProps = {
  text: LessonCopy;
  locale: Locale;
};

export default function CurriculumCoverage({ text, locale }: CurriculumCoverageProps) {
  return (
    <section className="curriculum-coverage" aria-labelledby="curriculum-coverage-title">
      <div className="curriculum-coverage-heading">
        <div>
          <span className="section-label">{text.curriculumEyebrow}</span>
          <h3 id="curriculum-coverage-title">{text.curriculumTitle}</h3>
        </div>
        <p>{text.curriculumSummary}</p>
      </div>
      <div className="curriculum-groups">
        {curriculumCoverageGroups.map((group) => (
          <details key={group.id}>
            <summary>
              <span><b>{group.title[locale]}</b><small>{group.curriculumReferences.join(" · ")}</small></span>
              <em>{text.curriculumLessonCount(group.lessonNumbers.length)}</em>
            </summary>
            <ul>
              {group.lessonNumbers.map((lessonNumber) => {
                const lesson = lessonCatalog.find((entry) => entry.number === lessonNumber);
                return lesson ? <li key={lessonNumber}>{text.lessonNumber(lesson.pathOrder)} · {lesson.title[locale]}</li> : null;
              })}
            </ul>
          </details>
        ))}
      </div>
      <p className="curriculum-disclaimer">{text.curriculumDisclaimer}</p>
      <a href={elementaryTaiwaneseCurriculumUrl} target="_blank" rel="noreferrer">
        {text.curriculumSource}<span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
