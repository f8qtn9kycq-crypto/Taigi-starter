import type { LessonSource, LocalizedText } from "../types/lesson-domain.ts";
import {
  LESSON_CONVERSATION_ALLOWED_USES,
  type LessonConversationContext,
  type LessonConversationProvenanceInput,
} from "../types/lesson-conversation.ts";
import type { Lesson } from "../types/lesson.ts";

const snapshotLocalizedText = (text: LocalizedText): LocalizedText => ({
  zh: text.zh,
  en: text.en,
});

const snapshotSource = (source: LessonSource): LessonSource => ({
  title: snapshotLocalizedText(source.title),
  canonicalUrl: source.canonicalUrl,
  license: source.license,
  licenseUrl: source.licenseUrl,
  speaker: source.speaker,
});

export const buildLessonConversationContext = (
  lesson: Lesson,
  provenance: LessonConversationProvenanceInput,
): LessonConversationContext => ({
  lessonId: lesson.id,
  lessonVersion: provenance.lessonVersion,
  lessonNumber: lesson.number,
  contentStatus: lesson.status,
  title: snapshotLocalizedText(lesson.title),
  summary: snapshotLocalizedText(lesson.summary),
  mission: snapshotLocalizedText(lesson.mission),
  targetPhrases: lesson.phrases.map((phrase) => ({
    id: phrase.id,
    hanji: phrase.hanji,
    tailo: phrase.tailo,
    poj: phrase.poj,
    meaning: snapshotLocalizedText(phrase.meaning),
    cultureNote: snapshotLocalizedText(phrase.cultureNote),
    source: snapshotSource(phrase.source),
  })),
  allowedUses: LESSON_CONVERSATION_ALLOWED_USES,
  provenance: {
    lessonId: lesson.id,
    lessonVersion: provenance.lessonVersion,
    sourceKind: provenance.sourceKind,
    sourceRef: provenance.sourceRef,
  },
});
