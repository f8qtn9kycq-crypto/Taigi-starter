import type { LessonPackageHandoff } from "../types/lesson-package.ts";
import {
  LESSON_STAGE_IDS,
  type LessonAudioAttribution,
  type LessonPhrase,
  type PlayableLesson,
} from "../types/lesson.ts";

export const adaptLessonPackageHandoff = (
  handoff: LessonPackageHandoff,
): PlayableLesson | null => {
  const attributionByPhraseId = new Map(
    handoff.audioAttribution.map((attribution) => [attribution.phraseId, attribution]),
  );
  const phrases = handoff.package.phrases.map((phrase) => {
    const attribution = attributionByPhraseId.get(phrase.id);
    if (!attribution) return null;

    const audioAttribution: LessonAudioAttribution = {
      audioUrl: attribution.audioUrl,
      contentHanji: attribution.contentHanji,
      sourceUrl: attribution.sourceUrl,
      originalUrl: attribution.originalUrl,
      license: attribution.license,
      licenseUrl: attribution.licenseUrl,
      speaker: attribution.speaker,
      isUnmodifiedOriginal: true,
    };

    return {
      id: phrase.id,
      hanji: phrase.hanji,
      tailo: phrase.tailo,
      poj: phrase.poj,
      meaning: phrase.meaning,
      cultureNote: phrase.cultureNote,
      ...(phrase.useCombination ? { useCombination: phrase.useCombination } : {}),
      ...(phrase.useScenario ? { useScenario: phrase.useScenario } : {}),
      audioUrl: attribution.audioUrl,
      source: phrase.source,
      audioAttribution,
    };
  }).filter((phrase): phrase is LessonPhrase => phrase !== null);

  if (phrases.length !== handoff.package.phrases.length) return null;

  return {
    id: handoff.package.id,
    number: handoff.package.number,
    pathOrder: handoff.package.pathOrder,
    title: handoff.package.title,
    secondaryTitle: handoff.package.secondaryTitle,
    summary: handoff.package.summary,
    mission: handoff.package.mission,
    status: "prototype",
    durationMinutes: LESSON_STAGE_IDS.length,
    stages: LESSON_STAGE_IDS.map((id) => ({ id, estimatedMinutes: 1 })),
    phrases,
  };
};
