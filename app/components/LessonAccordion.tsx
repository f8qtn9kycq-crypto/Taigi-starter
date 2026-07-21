"use client";

import { forwardRef } from "react";
import type { LessonCopy } from "../taigi-content";
import type { PlayableLesson } from "../types/lesson";
import LessonStagePanel from "./LessonStagePanel";

type LessonAccordionProps = {
  text: LessonCopy;
  lesson: PlayableLesson;
  stage: number;
  reviewScheduled: boolean;
  onStageChange: (stage: number) => void;
  onReviewAdded: () => void;
};

const LessonAccordion = forwardRef<HTMLElement, LessonAccordionProps>(
  function LessonAccordion(
    { text, lesson, stage, reviewScheduled, onStageChange, onReviewAdded },
    ref,
  ) {
    const lastStage = lesson.stages.length - 1;
    const advance = () => onStageChange(Math.min(stage + 1, lastStage));

    return (
      <section className="lesson-card" aria-labelledby="lesson-title" ref={ref}>
        <div className="lesson-heading">
          <span className="section-label">{text.currentLesson}</span>
          <h2 id="lesson-title">{text.lessonNumber(lesson.number)} · {lesson.title[text.locale]}</h2>
          <p>{lesson.summary[text.locale]}</p>
          <div className="lesson-rhythm" aria-label={text.lessonTime}>
            <span className="rhythm-mark" aria-hidden="true">{lesson.durationMinutes}′</span>
            <span><b>{text.lessonTime}</b><small>{text.lessonRhythm}</small></span>
          </div>
          <div className="progress-line" aria-label={text.phraseProgress(1, lesson.phrases.length)}>
            <span><i /></span><b>{text.phraseProgress(1, lesson.phrases.length)}</b>
          </div>
        </div>

        <ol className="stage-accordion" aria-label={text.learningStages}>
          {lesson.stages.map((lessonStage, index) => {
            const label = text.stageLabels[lessonStage.id];
            const isCurrent = index === stage;
            const isComplete = index < stage;

            return (
              <li key={lessonStage.id} className={isCurrent ? "current" : isComplete ? "complete" : "locked"}>
                <button
                  type="button"
                  className="stage-trigger"
                  onClick={() => isComplete && onStageChange(index)}
                  disabled={!isCurrent && !isComplete}
                  aria-expanded={isCurrent}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className="stage-number">{isComplete ? "✓" : index + 1}</span>
                  <span className="stage-name">
                    <b>{label}</b>
                    <small>{isCurrent ? text.currentStep : isComplete ? text.completedStep : text.lockedStep}</small>
                  </span>
                  <span className="stage-chevron" aria-hidden="true">{isCurrent ? "−" : "+"}</span>
                </button>

                {isCurrent && (
                  <LessonStagePanel
                    key={lessonStage.id}
                    stage={stage}
                    text={text}
                    lesson={lesson}
                    reviewScheduled={reviewScheduled}
                    onAdvance={advance}
                    onReviewAdded={onReviewAdded}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </section>
    );
  },
);

export default LessonAccordion;
