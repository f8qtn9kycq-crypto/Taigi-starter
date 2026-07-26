import introLessonJson from "../content/generated/intro-001.json" with { type: "json" };
import marketLessonJson from "../content/generated/market-001.json" with { type: "json" };
import { LESSON_STAGE_IDS, type LessonPhrase, type PlayableLesson } from "../types/lesson.ts";
import type { GeneratedLesson } from "../types/generated-lesson.ts";

const factoryLessons = [marketLessonJson, introLessonJson] as const satisfies readonly GeneratedLesson[];

function toPhrase(phrase: GeneratedLesson["targetPhrases"][number]): LessonPhrase {
  return {
    id: phrase.id,
    hanji: phrase.hanji,
    tailo: phrase.tailo,
    poj: phrase.poj,
    meaning: phrase.meaning,
    cultureNote: phrase.cultureNote,
    audioUrl: phrase.audio.audioUrl,
    source: phrase.source,
    audioAttribution: {
      audioUrl: phrase.audio.audioUrl,
      sourceUrl: phrase.audio.sourceUrl,
      license: phrase.audio.license,
      licenseUrl: phrase.audio.licenseUrl,
      speaker: phrase.audio.speaker,
      isUnmodifiedOriginal: true,
    },
  };
}

export function generatedLessonToPlayableLesson(lesson: GeneratedLesson, number: number): PlayableLesson {
  return {
    id: lesson.id,
    number,
    title: lesson.title,
    secondaryTitle: { zh: lesson.title.en, en: lesson.title.zh },
    summary: lesson.scenario,
    goal: lesson.goal,
    contentStatus: lesson.contentStatus,
    status: "prototype",
    durationMinutes: 5,
    stages: LESSON_STAGE_IDS.map((id) => ({ id, estimatedMinutes: 1 })),
    phrases: lesson.targetPhrases.map(toPhrase),
  };
}

export const generatedLessons: readonly PlayableLesson[] = factoryLessons
  .filter((lesson) => lesson.contentStatus !== "blocked")
  .map((lesson, index) => generatedLessonToPlayableLesson(lesson, index + 2));
