"use client";

import { useEffect, useRef, useState } from "react";
import BottomNav from "./components/BottomNav";
import LandingHero from "./components/LandingHero";
import LearningWorkspace from "./components/LearningWorkspace";
import FeedbackForm from "./FeedbackForm";
import ReviewModal from "./components/ReviewModal";
import { lessonCatalog, prototypeLesson } from "./data/lessons";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useLearningProgress } from "./hooks/useLearningProgress";
import { useReviewNow } from "./hooks/useReviewNow";
import { copy } from "./taigi-content";
import type { PlayableLesson } from "./types/lesson";
import { dueReviewCards, orderedReviewCards } from "./utils/learning-progress";

const playableLessons = lessonCatalog.filter(
  (lesson): lesson is PlayableLesson => lesson.status === "prototype",
);
const progressDefinitions = playableLessons.map((lesson) => ({
  id: lesson.id,
  phraseIds: lesson.phrases.map((phrase) => phrase.id),
  stageCount: lesson.stages.length,
}));
const phraseById = new Map(
  playableLessons.flatMap((lesson) => lesson.phrases.map((phrase) => [phrase.id, phrase] as const)),
);

export default function TaigiStartPage() {
  const {
    progress,
    isHydrated,
    setLocale,
    setLessonId,
    setStage,
    setPhraseIndex,
    setHasStarted,
    addReview,
    rateReview,
  } = useLearningProgress(progressDefinitions, prototypeLesson.id);
  const activeLesson = playableLessons.find((lesson) => lesson.id === progress.lessonId) ?? prototypeLesson;
  const [reviewOpen, setReviewOpen] = useState(false);
  const [startPending, setStartPending] = useState(false);
  const [lessonViewOpen, setLessonViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"learn" | "review" | "progress">("learn");
  const lessonRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<HTMLElement | null>(null);
  const reviewTriggerRef = useRef<HTMLButtonElement | null>(null);
  const heroAudio = useAudioPlayer(activeLesson.phrases[0].audioUrl);
  const text = copy[progress.locale];
  const activeLessonProgress = progress.lessons[activeLesson.id];
  const activeStage = activeLessonProgress?.stage ?? 0;
  const activePhraseIndex = activeLesson.phrases[activeLessonProgress?.phraseIndex ?? 0]
    ? activeLessonProgress?.phraseIndex ?? 0
    : 0;
  const activePhrase = activeLesson.phrases[activePhraseIndex];
  const completedPhraseIds = new Set(activeLessonProgress?.completedPhraseIds ?? []);
  const reviewNow = useReviewNow(progress.reviewCards);
  const reviewCards = orderedReviewCards(progress.reviewCards);
  const reviewsDue = dueReviewCards(progress.reviewCards, reviewNow);
  const reviewCard = reviewsDue[0] ?? reviewCards[0] ?? null;
  const reviewPhrase = reviewCard ? phraseById.get(reviewCard.id) ?? activePhrase : activePhrase;
  const dueCount = reviewsDue.length;

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
      window.requestAnimationFrame(() => reviewTriggerRef.current?.focus());
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [reviewOpen]);

  const focusView = (view: "learn" | "progress") => {
    window.requestAnimationFrame(() => {
      (view === "learn" ? lessonRef.current : pathRef.current)?.focus();
    });
  };
  const showLearn = () => {
    setActiveTab("learn");
    if (progress.hasStarted) {
      setLessonViewOpen(true);
      focusView("learn");
    }
  };
  const showPath = () => {
    setActiveTab("progress");
    focusView("progress");
  };
  const closeReview = () => {
    setReviewOpen(false);
    setActiveTab("learn");
    window.requestAnimationFrame(() => reviewTriggerRef.current?.focus());
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
    setLessonViewOpen(true);
    setActiveTab("learn");
    window.requestAnimationFrame(() => {
      lessonRef.current?.focus();
      window.setTimeout(() => setStartPending(false), 450);
    });
  };
  const selectLesson = (lessonNumber: number) => {
    const lesson = playableLessons.find((candidate) => candidate.number === lessonNumber);
    if (!lesson) return;
    setLessonId(lesson.id);
    setHasStarted(true);
    setLessonViewOpen(true);
    setActiveTab("learn");
    focusView("learn");
  };
  const completePhrase = (phraseId: string) => {
    addReview(phraseId);
  };

  return (
    <main className={`site-shell${progress.hasStarted ? " app-active" : ""}`} id="learn">
      {activeTab === "learn" && !lessonViewOpen ? (
        <LandingHero
          text={text}
          locale={progress.locale}
          hasStarted={progress.hasStarted}
          dueCount={dueCount}
          stage={activeStage}
          totalStages={activeLesson.stages.length}
          isPlaying={heroAudio.isPlaying}
          audioError={heroAudio.hasError}
          startPending={startPending}
          onLocaleChange={() => setLocale(progress.locale === "zh" ? "en" : "zh")}
          onAudioToggle={() => void heroAudio.toggle()}
          onStart={startLearning}
          onPeek={startLearning}
        />
      ) : (
        <LearningWorkspace
          activeTab={activeTab}
          text={text}
          locale={progress.locale}
          lesson={activeLesson}
          stage={activeStage}
          phraseIndex={activePhraseIndex}
          dueCount={dueCount}
          hasStarted={progress.hasStarted}
          progressReady={isHydrated}
          lessonProgress={progress.lessons}
          reviewScheduled={Boolean(progress.reviewCards[activePhrase.id])}
          completedPhraseIds={completedPhraseIds}
          lessonRef={lessonRef}
          pathRef={pathRef}
          onHome={showLearn}
          onLocaleChange={() => setLocale(progress.locale === "zh" ? "en" : "zh")}
          onStageChange={setStage}
          onReviewAdded={completePhrase}
          onPhraseChange={setPhraseIndex}
          onLessonSelect={selectLesson}
        />
      )}

      <BottomNav
        text={text}
        dueCount={dueCount}
        activeTab={activeTab}
        reviewButtonRef={reviewTriggerRef}
        onLearn={showLearn}
        onReview={openReview}
        onPath={showPath}
      />

      <FeedbackForm locale={progress.locale} />

      {reviewOpen && (
        <ReviewModal
          text={text}
          phrase={reviewPhrase}
          card={reviewCard}
          dueCount={dueCount}
          isDue={dueCount > 0}
          locale={progress.locale}
          onClose={closeReview}
          onRate={(rating) => { if (reviewCard) rateReview(reviewCard.id, rating); closeReview(); }}
        />
      )}
    </main>
  );
}
