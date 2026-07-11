"use client";

import { useState } from "react";
import type { LessonCopy } from "../taigi-content";

type LessonStageContentProps = {
  stage: number;
  text: LessonCopy;
  showAnswer: boolean;
  onPlay: () => void;
};

export default function LessonStageContent({
  stage,
  text,
  showAnswer,
  onPlay,
}: LessonStageContentProps) {
  const [script, setScript] = useState<"tailo" | "poj">("tailo");

  if (stage === 0) {
    return <div className="sound-visual" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>;
  }

  if (stage === 1) {
    return (
      <div className="phrase-card">
        <span className="script-label">繁體中文</span>
        <div className="han-row">
          <strong>{text.phrase}</strong>
          <button type="button" onClick={onPlay} aria-label={text.listen}>▶</button>
        </div>
        <p className="meaning">{text.meaning}</p>
        <div className="script-tabs" role="group" aria-label={text.romanizationSystem}>
          <button type="button" className={script === "tailo" ? "active" : ""} onClick={() => setScript("tailo")}>{text.tailoLabel}</button>
          <button type="button" className={script === "poj" ? "active" : ""} onClick={() => setScript("poj")}>{text.pojLabel}</button>
        </div>
        <span className="script-label roman-label">ROMANIZATION</span>
        <p className="romanization">{script === "tailo" ? "Lí tsia̍h-pá--buē?" : "Lí chia̍h-pá--bōe?"}</p>
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="speaking-cue">
        <button type="button" onClick={onPlay} aria-label={text.listen}>▶</button>
        <div><strong>{text.phrase}</strong><span>Lí tsia̍h-pá--buē?</span></div>
      </div>
    );
  }

  if (stage === 3) {
    return (
      <div className={showAnswer ? "recall-card revealed" : "recall-card"}>
        <span>{text.meaning}</span>
        {showAnswer && <div><strong>{text.phrase}</strong><p>Lí tsia̍h-pá--buē?</p></div>}
      </div>
    );
  }

  return (
    <div className="culture-note">
      <span aria-hidden="true">語</span>
      <p>{text.cultureText}</p>
    </div>
  );
}
