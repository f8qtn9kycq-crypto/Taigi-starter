import type { LessonConversationContext } from "../../types/lesson-conversation.ts";

export type LessonAuthoringPrompt = {
  readonly systemInstruction: string;
  readonly authoringInstruction: string;
};

export type StructuredOutputContract<TOutput> = {
  readonly name: string;
  readonly jsonSchema: Readonly<Record<string, unknown>>;
  readonly parse: (value: unknown) => TOutput;
};

export type AiStructuredGenerationRequest<TOutput> = {
  readonly context: LessonConversationContext;
  readonly prompt: LessonAuthoringPrompt;
  readonly output: StructuredOutputContract<TOutput>;
};

export type AiStructuredGenerationResult<TOutput> = {
  readonly data: TOutput;
};

export interface AiProvider {
  generateStructured<TOutput>(
    request: AiStructuredGenerationRequest<TOutput>,
  ): Promise<AiStructuredGenerationResult<TOutput>>;
}
