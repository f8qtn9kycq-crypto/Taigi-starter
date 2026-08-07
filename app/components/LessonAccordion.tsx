"use client";

import { forwardRef } from "react";
import type { LessonCopy } from "../taigi-content";
import type { PlayableLesson } from "../types/lesson";
import LessonStagePanel from "./LessonStagePanel";

type LessonAccordionProps = {
  text: LessonCopy;
  lesson: PlayableLesson;
  stage: number;
  phraseIndex: number;
  reviewScheduled: boolean;
  completedPhraseIds: ReadonlySet<string>;
  onStageChange: (stage: number) => void;
  onReviewAdded: (phraseId: string) => void;
  onPhraseChange: (phraseIndex: number) => void;
  onPhraseAdvance: () => void;
};

const LessonAccordion = forwardRef<HTMLElement, LessonAccordionProps>(
  function LessonAccordion(
    {
      text,
      lesson,
      stage,
      phraseIndex,
      reviewScheduled,
      completedPhraseIds,
      onStageChange,
      onReviewAdded,
      onPhraseChange,
      onPhraseAdvance,
    },
    ref,
  ) {
    const lastStage = lesson.stages.length - 1;
    const advance = () => onStageChange(Math.min(stage + 1, lastStage));

    return (
      <section className="lesson-card" aria-labelledby="lesson-title" ref={ref}>
        <div className="lesson-heading">
          <span className="section-label">{text.currentLesson}</span>
          <h2 id="lesson-title">{text.lessonNumber(lesson.pathOrder)} · {lesson.title[text.locale]}</h2>
          <p>{lesson.summary[text.locale]}</p>
          <div className="lesson-mission">
            <span>{text.lessonMission}</span>
            <p>{lesson.mission[text.locale]}</p>
          </div>
          <div className="lesson-targets">
            <span id="phrase-selector-label">{text.phraseSelectorLabel(phraseIndex + 1, lesson.phrases.length)}</span>
            <ul aria-labelledby="phrase-selector-label">
              {lesson.phrases.map((phrase, index) => (
                <li key={phrase.id}>
                  <button
                    type="button"
                    className={index === phraseIndex ? "active" : ""}
                    onClick={() => onPhraseChange(index)}
                    aria-pressed={index === phraseIndex}
                    aria-label={text.phraseSelectorOption(phrase.hanji, index + 1, lesson.phrases.length)}
                  >
                    <span>
                      <b>{phrase.hanji}</b>
                      <small>{phrase.tailo}</small>
                    </span>
                    {completedPhraseIds.has(phrase.id) && <i aria-label={text.completedPhrase}>✓</i>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="lesson-rhythm" aria-label={text.lessonTime}>
            <span className="rhythm-mark" aria-hidden="true">{lesson.durationMinutes}′</span>
            <span><b>{text.lessonTime}</b><small>{text.lessonRhythm}</small></span>
          </div>
          <div className="progress-line" aria-label={text.phraseProgress(phraseIndex + 1, lesson.phrases.length)}>
            <span><i className={`progress-fill progress-fill-${lesson.phrases.length}-${phraseIndex + 1}`} /></span><b>{text.phraseProgress(phraseIndex + 1, lesson.phrases.length)}</b>
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
                    key={`${lesson.id}-${phraseIndex}-${lessonStage.id}`}
                    stage={stage}
                    text={text}
                    lesson={lesson}
                    phraseIndex={phraseIndex}
                    reviewScheduled={reviewScheduled}
                    onAdvance={advance}
                    onReviewAdded={onReviewAdded}
                    onPhraseAdvance={onPhraseAdvance}
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
