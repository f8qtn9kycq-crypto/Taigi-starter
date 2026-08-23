"use client";

import { forwardRef, useEffect, useRef } from "react";
import { useMobileStagePager } from "../hooks/useMobileStagePager";
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
  nextLesson: PlayableLesson | null;
  onStageChange: (stage: number) => void;
  onReviewAdded: (phraseId: string) => void;
  onPhraseChange: (phraseIndex: number) => void;
  onPhraseAdvance: (phraseIndex: number) => void;
  onLessonComplete: () => void;
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
      nextLesson,
      onStageChange,
      onReviewAdded,
      onPhraseChange,
      onPhraseAdvance,
      onLessonComplete,
    },
    ref,
  ) {
    const lastStage = lesson.stages.length - 1;
    const lessonComplete = lesson.phrases.every((phrase) => completedPhraseIds.has(phrase.id));
    const nextIncompletePhraseIndex = lessonComplete
      ? -1
      : lesson.phrases.findIndex((phrase) => !completedPhraseIds.has(phrase.id));
    const stageTriggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const pendingFocusStageRef = useRef<number | null>(null);
    const {
      viewedStage,
      showStage,
      advance,
      unlockNext,
      navigatePrevious,
      navigateNext,
      handleTouchStart,
      handleTouchEnd,
    } = useMobileStagePager({
      stage,
      phraseIndex,
      lastStage,
      onStageChange,
      onViewChange: (nextStage) => { pendingFocusStageRef.current = nextStage; },
    });
    const advancePhrase = () => {
      if (nextIncompletePhraseIndex < 0) return;
      pendingFocusStageRef.current = 0;
      onPhraseAdvance(nextIncompletePhraseIndex);
    };
    useEffect(() => {
      if (pendingFocusStageRef.current !== viewedStage) return;
      stageTriggerRefs.current[viewedStage]?.focus();
      pendingFocusStageRef.current = null;
    }, [viewedStage]);

    return (
      <section className="lesson-card" aria-labelledby="lesson-title" ref={ref} tabIndex={-1}>
        <div className="lesson-heading">
          <span className="section-label">{text.currentLesson}</span>
          <h2 id="lesson-title">{text.lessonNumber(lesson.pathOrder)} · {lesson.title[text.locale]}</h2>
          <p>{lesson.summary[text.locale]}</p>
          <div className="lesson-mission">
            <span>{text.lessonMission}</span>
            <p>{lesson.mission[text.locale]}</p>
          </div>
          <div className={text.locale === "en" ? "lesson-targets english-phrases" : "lesson-targets"}>
            <span id="phrase-selector-label">{text.phraseSelectorLabel(phraseIndex + 1, lesson.phrases.length)}</span>
            <ul aria-labelledby="phrase-selector-label">
              {lesson.phrases.map((phrase, index) => (
                <li key={phrase.id}>
                  <button
                    type="button"
                    className={index === phraseIndex ? "active" : ""}
                    onClick={() => onPhraseChange(index)}
                    aria-pressed={index === phraseIndex}
                    aria-label={text.phraseSelectorOption(
                      phrase.hanji,
                      phrase.meaning[text.locale],
                      index + 1,
                      lesson.phrases.length,
                    )}
                  >
                    <span>
                      <b>{phrase.hanji}</b>
                      {text.locale === "en" && <small className="phrase-meaning">{phrase.meaning.en}</small>}
                      <small className="phrase-romanization">{phrase.tailo}</small>
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

        <ol
          className="stage-accordion"
          aria-label={text.learningStages}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {lesson.stages.map((lessonStage, index) => {
            const label = text.stageLabels[lessonStage.id];
            const isDisplayed = index === viewedStage;
            const isCurrent = index === stage;
            const isComplete = index < stage;

            return (
              <li key={lessonStage.id} className={`${isCurrent ? "current" : isComplete ? "complete" : "locked"}${isDisplayed ? " displayed" : ""}`}>
                <button
                  ref={(node) => { stageTriggerRefs.current[index] = node; }}
                  type="button"
                  className="stage-trigger"
                  onClick={() => index <= stage && showStage(index)}
                  disabled={index > stage}
                  aria-expanded={isDisplayed}
                  aria-current={isDisplayed ? "step" : undefined}
                >
                  <span className="stage-number">{isComplete ? "✓" : index + 1}</span>
                  <span className="stage-name">
                    <b>{label}</b>
                    <small>{isComplete ? text.completedStep : isDisplayed ? text.currentStep : text.lockedStep}</small>
                  </span>
                  <span className="stage-chevron" aria-hidden="true">{isDisplayed ? "−" : "+"}</span>
                </button>

                {isDisplayed && (
                  <LessonStagePanel
                    key={`${lesson.id}-${phraseIndex}-${lessonStage.id}`}
                    stage={viewedStage}
                    text={text}
                    lesson={lesson}
                    phraseIndex={phraseIndex}
                    nextPhraseIndex={nextIncompletePhraseIndex}
                    lessonComplete={lessonComplete}
                    nextLesson={nextLesson}
                    reviewScheduled={reviewScheduled}
                    completed={isComplete}
                    onAdvance={advance}
                    onUnlock={unlockNext}
                    onReviewAdded={onReviewAdded}
                    onPhraseAdvance={advancePhrase}
                    onLessonComplete={onLessonComplete}
                    unlockedStage={stage}
                    viewedStage={viewedStage}
                    onPrevious={navigatePrevious}
                    onNext={navigateNext}
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
