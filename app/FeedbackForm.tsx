"use client";

import { useRef, useState } from "react";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { LEARNER_FEEDBACK_URL } from "./services/feedback";

type Props = { locale: "zh" | "en" };

const labels = {
  zh: {
    button: "回報問題／提供建議",
    title: "回報問題／提供建議",
    intro: "你的回饋能幫助我們修正問題、改善課程。請使用回饋表單；不需要懂 GitHub。",
    openExternal: "開啟回饋表單",
    externalPrivacy: "請不要填寫姓名、聯絡方式或其他敏感個人資料。",
    close: "關閉",
  },
  en: {
    button: "Report a problem / Suggest an improvement",
    title: "Report a problem / Suggest an improvement",
    intro: "Your feedback helps us fix problems and improve lessons. Use the feedback form; you do not need to know GitHub.",
    openExternal: "Open feedback form",
    externalPrivacy: "Please do not include your name, contact details, or other sensitive personal data.",
    close: "Close",
  },
} as const;

export default function FeedbackForm({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const text = labels[locale];

  const dialogRef = useFocusTrap({
    initialFocus: closeRef,
    onClose: () => setOpen(false),
    open,
    returnFocus: triggerRef,
  });

  return (
    <>
      <button ref={triggerRef} type="button" className="feedback-fab" onClick={() => setOpen(true)}>
        <span>✦</span>{text.button}
      </button>
      {open && (
        <div className="feedback-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section ref={dialogRef} className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <button ref={closeRef} autoFocus type="button" className="modal-close" onClick={() => setOpen(false)} aria-label={text.close}>×</button>
            <div className="feedback-external">
              <span className="section-label">FEEDBACK</span>
              <h2 id="feedback-title">{text.title}</h2>
              <p className="feedback-intro">{text.intro}</p>
              <a className="primary feedback-submit" href={LEARNER_FEEDBACK_URL} target="_blank" rel="noreferrer">
                {text.openExternal}<span>↗</span>
              </a>
              <p className="feedback-privacy">{text.externalPrivacy}</p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
