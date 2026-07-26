"use client";

import { useEffect, useRef, useState } from "react";
import BottomNav from "./components/BottomNav";
import CoursePath from "./components/CoursePath";
import LandingHero from "./components/LandingHero";
import FeedbackForm from "./FeedbackForm";
import LessonAccordion from "./components/LessonAccordion";
import ReviewModal from "./components/ReviewModal";
import { lessonCatalog, prototypeLesson } from "./data/lessons";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useLearningProgress } from "./hooks/useLearningProgress";
import { copy } from "./taigi-content";
import { isReviewDue } from "./utils/srs";
import type { PlayableLesson } from "./types/lesson";

export default function TaigiStartPage() {
  const [activeLessonId, setActiveLessonId] = useState(prototypeLesson.id);
  const activeLesson = (lessonCatalog.find((lesson) => lesson.id === activeLessonId && lesson.status === "prototype") ?? prototypeLesson) as PlayableLesson;
  const [activePhraseId, setActivePhraseId] = useState(prototypeLesson.phrases[0].id);
  const { progress, setLocale, setStage, setHasStarted, addReview, rateReview } = useLearningProgress(
    activeLesson.stages.length,
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [startPending, setStartPending] = useState(false);
  const [activeTab, setActiveTab] = useState<"learn" | "review" | "progress">("learn");
  const lessonRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<HTMLElement | null>(null);
  const heroAudio = useAudioPlayer(activeLesson.phrases[0].audioUrl);
  const text = copy[progress.locale];
  const activePhrase = activeLesson.phrases.find((phrase) => phrase.id === activePhraseId) ?? activeLesson.phrases[0];
  const activeReview = progress.reviewCards[activePhrase.id] ?? null;
  const dueCount = Object.values(progress.reviewCards).filter((card) => isReviewDue(card)).length;

  useEffect(() => {
    document.documentElement.lang = progress.locale === "zh" ? "zh-Hant-TW" : "en";
  }, [progress.locale]);

  useEffect(() => {
    if (!reviewOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setReviewOpen(false);
      setActiveTab("learn");
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [reviewOpen]);

  const scrollToLesson = () => lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToPath = () => pathRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const closeReview = () => {
    setReviewOpen(false);
    setActiveTab("learn");
  };
  const openReview = () => {
    setActiveTab("review");
    setReviewOpen(true);
  };
  const startLearning = () => {
    if (startPending) return;
    heroAudio.stop();
    setStartPending(true);
    setHasStarted(true);
    setActiveTab("learn");
    window.requestAnimationFrame(() => {
      scrollToLesson();
      window.setTimeout(() => setStartPending(false), 450);
    });
  };
  const selectLesson = (lesson: PlayableLesson) => {
    heroAudio.stop();
    setActiveLessonId(lesson.id);
    setActivePhraseId(lesson.phrases[0].id);
    setStage(0);
    setHasStarted(true);
    setActiveTab("learn");
    window.requestAnimationFrame(scrollToLesson);
  };

  return (
    <main className={`site-shell${progress.hasStarted ? " app-active" : ""}`} id="learn">
      <LandingHero
        text={text}
        locale={progress.locale}
        hasStarted={progress.hasStarted}
        dueCount={dueCount}
        stage={progress.stage}
        totalStages={activeLesson.stages.length}
        isPlaying={heroAudio.isPlaying}
        audioError={heroAudio.hasError}
        startPending={startPending}
        onLocaleChange={() => setLocale(progress.locale === "zh" ? "en" : "zh")}
        onAudioToggle={() => void heroAudio.toggle()}
        onStart={startLearning}
        onPeek={scrollToLesson}
      />

      <div className="learning-column">
        <LessonAccordion
          ref={lessonRef}
          lesson={activeLesson}
          text={text}
          stage={progress.stage}
          activePhraseId={activePhrase.id}
          reviewedPhraseId={activeReview?.id ?? null}
          onStageChange={setStage}
          onPhraseChange={setActivePhraseId}
          onReviewAdded={addReview}
        />
        <CoursePath ref={pathRef} text={text} locale={progress.locale} activeLessonId={activeLesson.id} onSelectLesson={(lesson) => lesson.status === "prototype" && selectLesson(lesson)} />
        <footer>
          <span>{text.prototype}</span>
          <small className="content-disclaimer">{text.contentDisclaimer}</small>
          <a
            href="https://github.com/f8qtn9kycq-crypto/Taigi-Starter"
            target="_blank"
            rel="noreferrer"
          >
            GitHub · Technical feedback ↗
          </a>
        </footer>
      </div>

      {progress.hasStarted && (
        <BottomNav
          text={text}
          dueCount={dueCount}
          activeTab={activeTab}
          onLearn={() => { setActiveTab("learn"); scrollToLesson(); }}
          onReview={openReview}
          onPath={() => { setActiveTab("progress"); scrollToPath(); }}
        />
      )}

      <FeedbackForm locale={progress.locale} learningStage={progress.stage} />

      {reviewOpen && (
        <ReviewModal
          text={text}
          phrase={activePhrase}
          card={activeReview}
          isDue={dueCount > 0}
          locale={progress.locale}
          onClose={closeReview}
          onRate={(rating) => { rateReview(activePhrase.id, rating); closeReview(); }}
        />
      )}
    </main>
  );
}
