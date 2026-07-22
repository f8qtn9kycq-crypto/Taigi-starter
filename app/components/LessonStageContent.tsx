"use client";

import { useState } from "react";
import type { LessonCopy } from "../taigi-content";
import type { LessonPhrase, LessonStageId } from "../types/lesson";

type LessonStageContentProps = {
  stage: LessonStageId;
  text: LessonCopy;
  phrase: LessonPhrase;
  showAnswer: boolean;
  onPlay: () => void;
};

export default function LessonStageContent({
  stage,
  text,
  phrase,
  showAnswer,
  onPlay,
}: LessonStageContentProps) {
  const [script, setScript] = useState<"tailo" | "poj">("tailo");

  if (stage === "hear") {
    return <div className="sound-visual" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>;
  }

  if (stage === "see") {
    return (
      <div className="phrase-card">
        <span className="script-label">繁體中文</span>
        <div className="han-row">
          <strong>{phrase.hanji}</strong>
          <button type="button" onClick={onPlay} aria-label={text.listen}>▶</button>
        </div>
        <p className="meaning">{phrase.meaning[text.locale]}</p>
        <div className="script-tabs" role="group" aria-label={text.romanizationSystem}>
          <button type="button" className={script === "tailo" ? "active" : ""} onClick={() => setScript("tailo")}>{text.tailoLabel}</button>
          <button type="button" className={script === "poj" ? "active" : ""} onClick={() => setScript("poj")}>{text.pojLabel}</button>
        </div>
        <span className="script-label roman-label">ROMANIZATION</span>
        <p className="romanization">{script === "tailo" ? phrase.tailo : phrase.poj}</p>
      </div>
    );
  }

  if (stage === "say") {
    return (
      <div className="speaking-cue">
        <button type="button" onClick={onPlay} aria-label={text.listen}>▶</button>
        <div><strong>{phrase.hanji}</strong><span>{phrase.tailo}</span></div>
      </div>
    );
  }

  if (stage === "recall") {
    return (
      <div className={showAnswer ? "recall-card revealed" : "recall-card"}>
        <span>{phrase.meaning[text.locale]}</span>
        {showAnswer && (
          <div>
            <strong>{phrase.hanji}</strong>
            <div className="script-tabs" role="group" aria-label={text.romanizationSystem}>
              <button type="button" className={script === "tailo" ? "active" : ""} onClick={() => setScript("tailo")}>{text.tailoLabel}</button>
              <button type="button" className={script === "poj" ? "active" : ""} onClick={() => setScript("poj")}>{text.pojLabel}</button>
            </div>
            <p className="romanization">{script === "tailo" ? phrase.tailo : phrase.poj}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="culture-note">
      <span aria-hidden="true">語</span>
      <p>{phrase.cultureNote[text.locale]}</p>
    </div>
  );
}
