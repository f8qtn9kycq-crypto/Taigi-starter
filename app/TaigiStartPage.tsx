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
  const phraseIds = useMemo(
    () => playableLessons.flatMap((lesson) => lesson.phrases.map((phrase) => phrase.id)),
    [playableLessons],
  );
  const {
    progress,
    setLocale,
    setLessonId,
    setStage,
    setPhraseIndex,
    setHasStarted,
    addReview,
    rateReview,
  } = useLearningProgress(prototypeLesson.id, phraseIds, prototypeLesson.stages.length);
  const activeLesson = playableLessons.find((lesson) => lesson.id === progress.lessonId) ?? prototypeLesson;
  const [reviewOpen, setReviewOpen] = useState(false);
  const [completedPhraseIds, setCompletedPhraseIds] = useState<ReadonlySet<string>>(new Set());
  const [startPending, setStartPending] = useState(false);
  const [activeTab, setActiveTab] = useState<"learn" | "review" | "progress">("learn");
  const lessonRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<HTMLElement | null>(null);
  const heroAudio = useAudioPlayer(activeLesson.phrases[0].audioUrl);
  const text = copy[progress.locale];
  const activePhraseIndex = activeLesson.phrases[progress.phraseIndex] ? progress.phraseIndex : 0;
  const activePhrase = activeLesson.phrases[activePhraseIndex];
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
    const lesson = playableLessons.find((candidate) => candidate.number === lessonNumber);
    if (!lesson) return;
    setLessonId(lesson.id);
    setPhraseIndex(0);
    setHasStarted(true);
    setActiveTab("learn");
    window.requestAnimationFrame(scrollToLesson);
  };
  const completePhrase = (phraseId: string) => {
    addReview(phraseId);
    setCompletedPhraseIds((current) => new Set(current).add(phraseId));
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
          phraseIndex={activePhraseIndex}
          reviewScheduled={progress.reviewCard?.id === activePhrase.id}
          completedPhraseIds={completedPhraseIds}
          onStageChange={setStage}
          onReviewAdded={completePhrase}
          onPhraseChange={setPhraseIndex}
          onPhraseAdvance={() => setPhraseIndex(activePhraseIndex + 1)}
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
        </footer>
      </div>

      <BottomNav
        text={text}
        dueCount={dueCount}
        activeTab={activeTab}
        onLearn={() => { setActiveTab("learn"); scrollToLesson(); }}
        onReview={openReview}
        onPath={() => { setActiveTab("progress"); scrollToPath(); }}
      />

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
