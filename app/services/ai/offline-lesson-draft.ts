import type { LocalizedText } from "../../types/lesson-domain.ts";
import type { LessonConversationContext } from "../../types/lesson-conversation.ts";
import type {
  AiProvider,
  StructuredOutputContract,
} from "./ai-provider.ts";
import { buildLessonAuthoringPrompt } from "./lesson-authoring-prompt.ts";

export type LessonDraftCandidate = {
  readonly lessonId: string;
  readonly lessonVersion: string;
  readonly objective: Readonly<LocalizedText>;
  readonly stagePlan: readonly Readonly<LocalizedText>[];
};

export type OfflineLessonDraft = {
  readonly status: "draft";
  readonly candidate: LessonDraftCandidate;
  readonly gates: {
    readonly schemaValidation: "passed";
    readonly sourceVerification: "pending";
    readonly teacherReview: "required";
  };
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => (
  typeof value === "object" && value !== null && !Array.isArray(value)
);

const parseLocalizedText = (value: unknown, path: string): LocalizedText => {
  if (
    !isRecord(value)
    || typeof value.zh !== "string"
    || value.zh.trim().length === 0
    || typeof value.en !== "string"
    || value.en.trim().length === 0
  ) {
    throw new Error(`${path} must contain non-empty zh and en text`);
  }

  return { zh: value.zh, en: value.en };
};

export const createLessonDraftOutputContract = (
  context: LessonConversationContext,
): StructuredOutputContract<LessonDraftCandidate> => ({
  name: "offline-lesson-authoring-draft",
  jsonSchema: {
    type: "object",
    additionalProperties: false,
    required: ["lessonId", "lessonVersion", "objective", "stagePlan"],
    properties: {
      lessonId: { const: context.lessonId },
      lessonVersion: { const: context.lessonVersion },
      objective: { $ref: "#/$defs/localizedText" },
      stagePlan: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: { $ref: "#/$defs/localizedText" },
      },
    },
    $defs: {
      localizedText: {
        type: "object",
        additionalProperties: false,
        required: ["zh", "en"],
        properties: {
          zh: { type: "string", minLength: 1 },
          en: { type: "string", minLength: 1 },
        },
      },
    },
  },
  parse: (value: unknown): LessonDraftCandidate => {
    if (!isRecord(value)) throw new Error("Lesson draft candidate must be an object");
    if (value.lessonId !== context.lessonId) throw new Error("Lesson draft candidate lessonId mismatch");
    if (value.lessonVersion !== context.lessonVersion) {
      throw new Error("Lesson draft candidate lessonVersion mismatch");
    }
    if (!Array.isArray(value.stagePlan) || value.stagePlan.length !== 5) {
      throw new Error("Lesson draft candidate stagePlan must contain exactly five stages");
    }

    return {
      lessonId: context.lessonId,
      lessonVersion: context.lessonVersion,
      objective: parseLocalizedText(value.objective, "objective"),
      stagePlan: value.stagePlan.map((stage, index) => (
        parseLocalizedText(stage, `stagePlan[${index}]`)
      )),
    };
  },
});

export const generateOfflineLessonDraft = async (
  provider: AiProvider,
  context: LessonConversationContext,
): Promise<OfflineLessonDraft> => {
  const prompt = buildLessonAuthoringPrompt(context);
  const output = createLessonDraftOutputContract(context);
  const generated = await provider.generateStructured({ context, prompt, output });
  const candidate = output.parse(generated.data);

  return {
    status: "draft",
    candidate,
    gates: {
      schemaValidation: "passed",
      sourceVerification: "pending",
      teacherReview: "required",
    },
  };
};
