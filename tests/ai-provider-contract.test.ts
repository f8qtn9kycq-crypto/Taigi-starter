import assert from "node:assert/strict";
import test from "node:test";
import { prototypeLesson } from "../app/data/lessons.ts";
import type {
  AiProvider,
  AiStructuredGenerationRequest,
  AiStructuredGenerationResult,
} from "../app/services/ai/ai-provider.ts";
import { buildLessonAuthoringPrompt } from "../app/services/ai/lesson-authoring-prompt.ts";
import { buildLessonConversationContext } from "../app/utils/lesson-conversation-context.ts";

type DraftResult = {
  status: "draft";
  lessonId: string;
};

class FakeProvider implements AiProvider {
  private readonly rawOutput: unknown;

  constructor(rawOutput: unknown) {
    this.rawOutput = rawOutput;
  }

  async generateStructured<TOutput>(
    request: AiStructuredGenerationRequest<TOutput>,
  ): Promise<AiStructuredGenerationResult<TOutput>> {
    return { data: request.output.parse(this.rawOutput) };
  }
}

const context = buildLessonConversationContext(prototypeLesson, {
  lessonVersion: "catalog-d9288da",
  sourceKind: "runtime-catalog",
  sourceRef: "github/main@d9288da",
});

const draftOutput = {
  name: "lesson-authoring-draft",
  jsonSchema: {
    type: "object",
    required: ["status", "lessonId"],
  },
  parse: (value: unknown): DraftResult => {
    if (
      typeof value !== "object"
      || value === null
      || (value as { status?: unknown }).status !== "draft"
      || typeof (value as { lessonId?: unknown }).lessonId !== "string"
    ) {
      throw new Error("Invalid lesson authoring draft");
    }
    return value as DraftResult;
  },
} as const;

test("fake provider exercises the structured-generation contract without a network call", async () => {
  const prompt = buildLessonAuthoringPrompt(context);
  const provider = new FakeProvider({ status: "draft", lessonId: context.lessonId });

  const result = await provider.generateStructured({ context, prompt, output: draftOutput });

  assert.deepEqual(result.data, { status: "draft", lessonId: prototypeLesson.id });
});

test("authoring prompt is lesson-scoped and keeps publication gates explicit", () => {
  const prompt = buildLessonAuthoringPrompt(context);

  assert.match(prompt.authoringInstruction, new RegExp(context.lessonId));
  assert.match(prompt.authoringInstruction, new RegExp(context.lessonVersion));
  assert.match(prompt.systemInstruction, /draft/);
  assert.match(prompt.systemInstruction, /source verification/);
  assert.match(prompt.systemInstruction, /teacher review/);
  assert.match(prompt.systemInstruction, /never as publishable or verified lesson content/);
});

test("authoring prompt rejects a context without offline-authoring permission", () => {
  const unauthorizedContext = { ...context, allowedUses: [] };

  assert.throws(
    () => buildLessonAuthoringPrompt(unauthorizedContext),
    /not authorized for offline lesson authoring/,
  );
});

test("output parser rejects an invalid provider result", async () => {
  const prompt = buildLessonAuthoringPrompt(context);
  const provider = new FakeProvider({ status: "published", lessonId: context.lessonId });

  await assert.rejects(
    provider.generateStructured({ context, prompt, output: draftOutput }),
    /Invalid lesson authoring draft/,
  );
});
