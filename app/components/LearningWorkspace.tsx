import type { RefObject } from "react";
import type { LessonCopy, Locale } from "../taigi-content";
import type { LearningProgress } from "../types/learning";
import type { PlayableLesson } from "../types/lesson";
import CoursePath from "./CoursePath";
import LessonAccordion from "./LessonAccordion";
import SiteHeader from "./SiteHeader";

type LearningWorkspaceProps = {
  activeTab: "learn" | "review" | "progress";
  text: LessonCopy;
  locale: Locale;
  lesson: PlayableLesson;
  stage: number;
  phraseIndex: number;
  dueCount: number;
  hasStarted: boolean;
  progressReady: boolean;
  lessonProgress: LearningProgress["lessons"];
  reviewScheduled: boolean;
  completedPhraseIds: ReadonlySet<string>;
  lessonRef: RefObject<HTMLElement | null>;
  pathRef: RefObject<HTMLElement | null>;
  onHome: () => void;
  onLocaleChange: () => void;
  onStageChange: (stage: number) => void;
  onReviewAdded: (phraseId: string) => void;
  onPhraseChange: (phraseIndex: number) => void;
  onLessonSelect: (lessonNumber: number) => void;
};

export default function LearningWorkspace({
  activeTab,
  text,
  locale,
  lesson,
  stage,
  phraseIndex,
  dueCount,
  hasStarted,
  progressReady,
  lessonProgress,
  reviewScheduled,
  completedPhraseIds,
  lessonRef,
  pathRef,
  onHome,
  onLocaleChange,
  onStageChange,
  onReviewAdded,
  onPhraseChange,
  onLessonSelect,
}: LearningWorkspaceProps) {
  return (
    <>
      <SiteHeader
        text={text}
        locale={locale}
        hasStarted={hasStarted}
        dueCount={dueCount}
        stage={stage}
        totalStages={lesson.stages.length}
        onLocaleChange={onLocaleChange}
        onHome={onHome}
      />
      {activeTab !== "review" && (
        <div className="learning-column">
          {activeTab === "learn" && (
            <LessonAccordion
              ref={lessonRef}
              lesson={lesson}
              text={text}
              stage={stage}
              phraseIndex={phraseIndex}
              reviewScheduled={reviewScheduled}
              completedPhraseIds={completedPhraseIds}
              onStageChange={onStageChange}
              onReviewAdded={onReviewAdded}
              onPhraseChange={onPhraseChange}
              onPhraseAdvance={onPhraseChange}
            />
          )}
          {activeTab === "progress" && (
            <>
              <CoursePath
                ref={pathRef}
                text={text}
                locale={locale}
                activeLessonNumber={lesson.number}
                stageCount={lesson.stages.length}
                hasStarted={hasStarted}
                progressReady={progressReady}
                lessonProgress={lessonProgress}
                onLessonSelect={onLessonSelect}
              />
              <footer><span>{text.prototype}</span></footer>
            </>
          )}
        </div>
      )}
    </>
  );
}
