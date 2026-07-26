"use client";

import { forwardRef } from "react";
import type { LessonCopy } from "../taigi-content";
import type { PlayableLesson } from "../types/lesson";
import LessonStagePanel from "./LessonStagePanel";

type LessonAccordionProps = {
  text: LessonCopy;
  lesson: PlayableLesson;
  stage: number;
  activePhraseId: string;
  reviewedPhraseId: string | null;
  onStageChange: (stage: number) => void;
  onPhraseChange: (phraseId: string) => void;
  onReviewAdded: (phraseId: string) => void;
};

const LessonAccordion = forwardRef<HTMLElement, LessonAccordionProps>(
  function LessonAccordion(
    { text, lesson, stage, activePhraseId, reviewedPhraseId, onStageChange, onPhraseChange, onReviewAdded },
    ref,
  ) {
    const lastStage = lesson.stages.length - 1;
    const activePhraseIndex = Math.max(0, lesson.phrases.findIndex((phrase) => phrase.id === activePhraseId));
    const activePhrase = lesson.phrases[activePhraseIndex];
    const advance = () => onStageChange(Math.min(stage + 1, lastStage));
    const selectPhrase = (phraseId: string) => {
      onPhraseChange(phraseId);
      onStageChange(0);
    };

    return (
      <section className="lesson-card" aria-labelledby="lesson-title" ref={ref}>
        <div className="lesson-heading">
          <span className="section-label">{text.currentLesson}</span>
          <h2 id="lesson-title">{text.lessonNumber(lesson.number)} · {lesson.title[text.locale]}</h2>
          <p>{lesson.summary[text.locale]}</p>
          <p className="lesson-goal"><b>{text.lessonGoalLabel}</b> {lesson.goal[text.locale]}</p>
          <ul className="lesson-target-phrases" aria-label={text.targetPhrasesLabel}>
            {lesson.phrases.map((phrase, index) => (
              <li key={phrase.id}>
                <button type="button" className={index === activePhraseIndex ? "active" : ""} onClick={() => selectPhrase(phrase.id)} aria-current={index === activePhraseIndex ? "true" : undefined}>
                  <b>{phrase.hanji}</b><span>{phrase.tailo}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="lesson-rhythm" aria-label={text.lessonTime}>
            <span className="rhythm-mark" aria-hidden="true">{lesson.durationMinutes}′</span>
            <span><b>{text.lessonTime}</b><small>{text.lessonRhythm}</small></span>
          </div>
          <div className="progress-line" aria-label={text.phraseProgress(1, lesson.phrases.length)}>
            <span><i data-total={lesson.phrases.length} data-index={activePhraseIndex + 1} /></span><b>{text.phraseProgress(activePhraseIndex + 1, lesson.phrases.length)}</b>
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
                    phraseIndex={activePhraseIndex}
                    reviewScheduled={reviewedPhraseId === activePhrase?.id}
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
