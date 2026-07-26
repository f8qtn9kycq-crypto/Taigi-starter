"use client";

import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "./hooks/useFocusTrap";

type Props = { locale: "zh" | "en" };

const labels = {
  zh: {
    button: "提供回饋",
    title: "60 秒回饋",
    intro: "請先完成第一句學習，再告訴我們哪裡最需要改善。",
    externalIntro: "回饋會在安全的外部表單中提交，不會寫入本網站。",
    openExternal: "開啟外部回饋表單",
    externalPrivacy: "請不要填寫姓名、聯絡方式或其他敏感個人資料。",
    externalUnavailable: "外部回饋表單尚未設定。",
    loading: "回饋表單載入中…",
    close: "關閉",
  },
  en: {
    button: "Give feedback",
    title: "60-second feedback",
    intro: "Try the first phrase, then tell us what needs the most work.",
    externalIntro: "Your feedback will be submitted through a secure external form and will not be stored here.",
    openExternal: "Open external feedback form",
    externalPrivacy: "Please do not include your name, contact details, or other sensitive personal data.",
    externalUnavailable: "The external feedback form is not configured yet.",
    loading: "Loading feedback form…",
    close: "Close",
  },
} as const;

export default function FeedbackForm({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const [externalFormUrl, setExternalFormUrl] = useState<string | null>(null);
  const [feedbackDestinationReady, setFeedbackDestinationReady] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const text = labels[locale];

  useEffect(() => {
    let active = true;
    fetch("/api/feedback-config")
      .then(async (response) => {
        if (!response.ok) return null;
        const data = (await response.json()) as { externalFormUrl?: unknown };
        return typeof data.externalFormUrl === "string" && data.externalFormUrl.startsWith("https://")
          ? data.externalFormUrl
          : null;
      })
      .then((url) => {
        if (!active) return;
        setExternalFormUrl(url);
        setFeedbackDestinationReady(true);
      })
      .catch(() => {
        if (active) setFeedbackDestinationReady(true);
      });
    return () => { active = false; };
  }, []);

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
            {!feedbackDestinationReady ? (
              <div className="feedback-external"><h2 id="feedback-title">{text.title}</h2><p className="feedback-intro">{text.loading}</p></div>
            ) : externalFormUrl ? (
              <div className="feedback-external">
                <span className="section-label">FEEDBACK</span>
                <h2 id="feedback-title">{text.title}</h2>
                <p className="feedback-intro">{text.externalIntro}</p>
                <a className="primary feedback-submit" href={externalFormUrl} target="_blank" rel="noreferrer">
                  {text.openExternal}<span>↗</span>
                </a>
                <p className="feedback-privacy">{text.externalPrivacy}</p>
              </div>
            ) : (
              <div className="feedback-external">
                <span className="section-label">FEEDBACK</span>
                <h2 id="feedback-title">{text.title}</h2>
                <p className="feedback-intro">{text.externalUnavailable}</p>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
