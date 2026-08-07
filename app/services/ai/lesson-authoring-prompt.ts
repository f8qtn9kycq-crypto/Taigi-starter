import type { LessonAuthoringPrompt } from "./ai-provider.ts";
import type { LessonConversationContext } from "../../types/lesson-conversation.ts";

const OFFLINE_AUTHORING_USE = "offline-lesson-authoring";

export const buildLessonAuthoringPrompt = (
  context: LessonConversationContext,
): LessonAuthoringPrompt => {
  if (!context.allowedUses.includes(OFFLINE_AUTHORING_USE)) {
    throw new Error("Lesson context is not authorized for offline lesson authoring");
  }

  const authoringContext = {
    lessonId: context.lessonId,
    lessonVersion: context.lessonVersion,
    lessonNumber: context.lessonNumber,
    contentStatus: context.contentStatus,
    title: context.title,
    summary: context.summary,
    mission: context.mission,
    targetPhrases: context.targetPhrases,
    provenance: context.provenance,
  };

  return {
    systemInstruction: [
      "Support offline lesson authoring for one supplied lesson only.",
      "Treat every generated value as a draft, never as publishable or verified lesson content.",
      "Do not invent Taiwanese wording, pronunciation, sources, licences, speakers, or audio metadata.",
      "A draft must pass the supplied structured-output parser, source verification, and required teacher review before publication.",
    ].join(" "),
    authoringInstruction: [
      `Work only on lesson ${context.lessonId} at version ${context.lessonVersion}.`,
      "Do not use or infer content from another lesson.",
      `Lesson context: ${JSON.stringify(authoringContext)}`,
    ].join(" "),
  };
};
