"use client";

import { FormEvent, useEffect, useState } from "react";

type Props = { locale: "zh" | "en"; learningStage: number };

const labels = {
  zh: {
    button: "提供回饋",
    title: "60 秒回饋",
    intro: "請先完成第一句學習，再告訴我們哪裡最需要改善。",
    usefulness: "這個原型對初學者有多實用？",
    complete: "你有完成第一句學習並開始複習嗎？",
    yes: "有",
    partly: "一部分",
    no: "沒有",
    blocker: "最大的阻礙是什麼？",
    blockers: ["沒有", "音訊", "操作說明", "導覽", "語言", "SRS 複習", "其他"],
    comment: "最希望我們改善的一件事",
    placeholder: "一句話即可",
    submit: "送出回饋",
    sending: "送出中…",
    thanks: "收到，謝謝你幫忙讓台語更好學。",
    error: "目前無法送出，請稍後再試。",
    close: "關閉",
  },
  en: {
    button: "Give feedback",
    title: "60-second feedback",
    intro: "Try the first phrase, then tell us what needs the most work.",
    usefulness: "How useful is this prototype for a beginner?",
    complete: "Did you finish the first phrase and start a review?",
    yes: "Yes",
    partly: "Partly",
    no: "No",
    blocker: "What was the biggest blocker?",
    blockers: ["None", "Audio", "Instructions", "Navigation", "Language", "SRS review", "Other"],
    comment: "One thing you want us to improve",
    placeholder: "One sentence is enough",
    submit: "Send feedback",
    sending: "Sending…",
    thanks: "Thank you — your feedback will make Tâi-gí easier to learn.",
    error: "Feedback could not be sent. Please try again later.",
    close: "Close",
  },
} as const;

const blockerValues = ["none", "audio", "instructions", "navigation", "language", "srs", "other"];

export default function FeedbackForm({ locale, learningStage }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [usefulness, setUsefulness] = useState(0);
  const [completedTask, setCompletedTask] = useState("");
  const [blocker, setBlocker] = useState("");
  const text = labels[locale];

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!usefulness || !completedTask || !blocker) return;
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    let visitorId = window.localStorage.getItem("taigi-feedback-visitor");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      window.localStorage.setItem("taigi-feedback-visitor", visitorId);
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          usefulness,
          completedTask,
          blocker,
          comment: form.get("comment"),
          website: form.get("website"),
          visitorId,
          locale,
          learningStage,
          screenWidth: window.innerWidth,
        }),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button type="button" className="feedback-fab" onClick={() => setOpen(true)}>
        <span>✦</span>{text.button}
      </button>
      {open && (
        <div className="feedback-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label={text.close}>×</button>
            {status === "sent" ? (
              <div className="feedback-success"><span>✓</span><h2>{text.thanks}</h2><button type="button" className="primary" onClick={() => setOpen(false)}>{text.close}</button></div>
            ) : (
              <form onSubmit={submit}>
                <span className="section-label">FEEDBACK</span>
                <h2 id="feedback-title">{text.title}</h2>
                <p className="feedback-intro">{text.intro}</p>
                <fieldset><legend>{text.usefulness}</legend><div className="rating-row">{[1,2,3,4,5].map((value) => <button key={value} type="button" className={usefulness === value ? "selected" : ""} onClick={() => setUsefulness(value)} aria-label={`${value} / 5`}>{value}</button>)}</div></fieldset>
                <fieldset><legend>{text.complete}</legend><div className="choice-row">{[["yes",text.yes],["partly",text.partly],["no",text.no]].map(([value,label]) => <button key={value} type="button" className={completedTask === value ? "selected" : ""} onClick={() => setCompletedTask(value)}>{label}</button>)}</div></fieldset>
                <fieldset><legend>{text.blocker}</legend><div className="blocker-grid">{blockerValues.map((value,index) => <button key={value} type="button" className={blocker === value ? "selected" : ""} onClick={() => setBlocker(value)}>{text.blockers[index]}</button>)}</div></fieldset>
                <label className="feedback-comment">{text.comment}<textarea name="comment" maxLength={800} placeholder={text.placeholder} /></label>
                <input className="feedback-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                {status === "error" && <p className="feedback-error">{text.error}</p>}
                <button className="primary feedback-submit" type="submit" disabled={!usefulness || !completedTask || !blocker || status === "sending"}>{status === "sending" ? text.sending : text.submit}<span>→</span></button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
