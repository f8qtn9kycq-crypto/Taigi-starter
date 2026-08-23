import { forwardRef } from "react";
import type { LessonCopy } from "../taigi-content";
import type { PlayableLesson } from "../types/lesson";

type LessonCompletionActionsProps = {
  text: LessonCopy;
  nextLesson: PlayableLesson | null;
  onContinue: () => void;
};

const LessonCompletionActions = forwardRef<HTMLParagraphElement, LessonCompletionActionsProps>(
  function LessonCompletionActions({ text, nextLesson, onContinue }, ref) {
    return (
      <div className="lesson-completion-actions">
        <p ref={ref} tabIndex={-1} className="lesson-complete" role="status">
          ✓ {nextLesson ? text.lessonComplete : text.courseComplete}
        </p>
        <button type="button" className="action-button primary-action desktop-stage-action" onClick={onContinue}>
          {nextLesson
            ? text.nextLesson(nextLesson.pathOrder, nextLesson.title[text.locale])
            : text.viewProgress}
          <span>→</span>
        </button>
      </div>
    );
  },
);

export default LessonCompletionActions;
