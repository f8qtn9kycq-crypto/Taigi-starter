"use client";

import { useRef, useState } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import type { LessonCopy, Locale } from "../taigi-content";
import type { ReviewCard, ReviewRating } from "../types/learning";
import type { LessonPhrase } from "../types/lesson";

type ReviewModalProps = {
  text: LessonCopy;
  phrase: LessonPhrase;
  card: ReviewCard | null;
  dueCount: number;
  isDue: boolean;
  locale: Locale;
  onClose: () => void;
  onRate: (rating: ReviewRating) => void;
};

export default function ReviewModal({
  text,
  phrase,
  card,
  dueCount,
  isDue,
  locale,
  onClose,
  onRate,
}: ReviewModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useFocusTrap({
    initialFocus: closeRef,
    onClose,
    open: true,
  });
  const nextReview = card
    ? new Intl.DateTimeFormat(locale === "zh" ? "zh-TW" : "en", {
        dateStyle: "medium",
        timeStyle: card.intervalDays === 0 ? "short" : undefined,
      }).format(new Date(card.dueAt))
    : null;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="review-modal" role="dialog" aria-modal="true" aria-label={text.navReview} aria-describedby="review-explanation">
        <div className="modal-handle" aria-hidden="true" />
        <button ref={closeRef} autoFocus type="button" className="modal-close" onClick={onClose} aria-label={text.close}>×</button>
        <span className="section-label">{text.navReview}</span>

        {card && isDue ? (
          <>
            <h2 className="review-heading">{text.reviewDueTitle(dueCount)}</h2>
            <p id="review-explanation" className="review-explanation">{text.reviewExplanation}</p>
            <p>{text.reviewPrompt}</p>
            <h2>{phrase.meaning[locale]}</h2>
            {showAnswer ? (
              <div className="review-answer">
                <strong>{phrase.hanji}</strong>
                <small>{phrase.tailo}</small>
                <p>{text.rate}</p>
                <div>
                  <RatingButton label={text.again} hint={text.againHint} onClick={() => onRate("again")} />
                  <RatingButton label={text.hard} hint={text.hardHint} onClick={() => onRate("hard")} />
                  <RatingButton label={text.easy} hint={text.easyHint} onClick={() => onRate("easy")} primary />
                </div>
              </div>
            ) : (
              <button type="button" className="action-button primary-action" onClick={() => setShowAnswer(true)}>
                {text.showAnswer}<span>↓</span>
              </button>
            )}
          </>
        ) : (
          <div className="done-state">
            <span>✓</span>
            <h2>{text.reviewEmptyTitle}</h2>
            <p id="review-explanation">{text.reviewEmptyExplanation}</p>
            {nextReview && <p>{text.nextReview(nextReview)}</p>}
          </div>
        )}
      </section>
    </div>
  );
}

function RatingButton({
  label,
  hint,
  onClick,
  primary = false,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button type="button" className={primary ? "easy" : undefined} onClick={onClick}>
      <b>{label}</b><small>{hint}</small>
    </button>
  );
}
