import type {
  LessonContentStatus,
  LocalizedText,
} from "./lesson-domain.ts";

export const LESSON_CONVERSATION_ALLOWED_USES = ["offline-lesson-authoring"] as const;

export type LessonConversationAllowedUse = (typeof LESSON_CONVERSATION_ALLOWED_USES)[number];

export type LessonConversationProvenance = {
  readonly lessonId: string;
  readonly lessonVersion: string;
  readonly sourceKind: "runtime-catalog";
  readonly sourceRef: string;
};

export type LessonConversationSource = {
  readonly title: Readonly<LocalizedText>;
  readonly canonicalUrl: string;
  readonly license: string;
  readonly licenseUrl: string;
  readonly speaker: string | null;
};

export type LessonConversationTargetPhrase = {
  readonly id: string;
  readonly hanji: string;
  readonly tailo: string;
  readonly poj: string | null;
  readonly meaning: Readonly<LocalizedText>;
  readonly cultureNote: Readonly<LocalizedText>;
  readonly source: LessonConversationSource;
};

export type LessonConversationContext = {
  readonly lessonId: string;
  readonly lessonVersion: string;
  readonly lessonNumber: number;
  readonly contentStatus: LessonContentStatus;
  readonly title: Readonly<LocalizedText>;
  readonly summary: Readonly<LocalizedText>;
  readonly mission: Readonly<LocalizedText>;
  readonly targetPhrases: readonly LessonConversationTargetPhrase[];
  readonly allowedUses: readonly LessonConversationAllowedUse[];
  readonly provenance: LessonConversationProvenance;
};

export type LessonConversationProvenanceInput = Omit<LessonConversationProvenance, "lessonId">;
