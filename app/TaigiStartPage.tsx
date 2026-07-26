"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import type { PlayableLesson } from "./types/lesson";
import { isReviewDue } from "./utils/srs";

export default function TaigiStartPage() {
  const playableLessons = lessonCatalog.filter(
    (lesson): lesson is PlayableLesson => lesson.status === "prototype",
  );
  const [activeLessonNumber, setActiveLessonNumber] = useState(prototypeLesson.number);
  const activeLesson = playableLessons.find((lesson) => lesson.number === activeLessonNumber) ?? prototypeLesson;
  const phraseIds = useMemo(() => activeLesson.phrases.map((phrase) => phrase.id), [activeLesson]);
  const {
    progress,
    setLocale,
    setStage,
    setPhraseIndex,
    setHasStarted,
    addReview,
    rateReview,
  } = useLearningProgress(activeLesson.id, phraseIds, activeLesson.stages.length);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [startPending, setStartPending] = useState(false);
  const [activeTab, setActiveTab] = useState<"learn" | "review" | "progress">("learn");
  const lessonRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<HTMLElement | null>(null);
  const heroAudio = useAudioPlayer(activeLesson.phrases[0].audioUrl);
  const text = copy[progress.locale];
  const activePhrase = activeLesson.phrases[progress.phraseIndex] ?? activeLesson.phrases[0];
  const dueCount = isReviewDue(progress.reviewCard) ? 1 : 0;

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
  const selectLesson = (lessonNumber: number) => {
    setActiveLessonNumber(lessonNumber);
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
          phraseIndex={progress.phraseIndex}
          reviewScheduled={progress.reviewCard?.id === activePhrase.id}
          onStageChange={setStage}
          onReviewAdded={addReview}
          onPhraseAdvance={() => setPhraseIndex(progress.phraseIndex + 1)}
        />
        <CoursePath
          ref={pathRef}
          text={text}
          locale={progress.locale}
          activeLessonNumber={activeLesson.number}
          onLessonSelect={selectLesson}
        />
        <footer>
          <span>{text.prototype}</span>
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

      <FeedbackForm locale={progress.locale} />

      {reviewOpen && (
        <ReviewModal
          text={text}
          phrase={activePhrase}
          card={progress.reviewCard}
          isDue={dueCount > 0}
          locale={progress.locale}
          onClose={closeReview}
          onRate={(rating) => { rateReview(rating); closeReview(); }}
        />
      )}
    </main>
  );
}
