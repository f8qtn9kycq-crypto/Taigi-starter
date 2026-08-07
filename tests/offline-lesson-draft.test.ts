import assert from "node:assert/strict";
import test from "node:test";
import { prototypeLesson } from "../app/data/lessons.ts";
import type {
  AiProvider,
  AiStructuredGenerationRequest,
  AiStructuredGenerationResult,
} from "../app/services/ai/ai-provider.ts";
import {
  generateOfflineLessonDraft,
} from "../app/services/ai/offline-lesson-draft.ts";
import { buildLessonConversationContext } from "../app/utils/lesson-conversation-context.ts";

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

class UnvalidatedProvider implements AiProvider {
  private readonly rawOutput: unknown;

  constructor(rawOutput: unknown) {
    this.rawOutput = rawOutput;
  }

  async generateStructured<TOutput>(
    request: AiStructuredGenerationRequest<TOutput>,
  ): Promise<AiStructuredGenerationResult<TOutput>> {
    void request;
    return { data: this.rawOutput as TOutput };
  }
}

const context = buildLessonConversationContext(prototypeLesson, {
  lessonVersion: "catalog-71377c3",
  sourceKind: "runtime-catalog",
  sourceRef: "github/main@71377c3",
});

const validCandidate = {
  lessonId: context.lessonId,
  lessonVersion: context.lessonVersion,
  objective: { zh: "練習自然問候", en: "Practise a natural greeting" },
  stagePlan: [
    { zh: "先聽目標句", en: "Hear the target phrase" },
    { zh: "看漢字和台羅", en: "See Hanji and Tâi-lô" },
    { zh: "開口跟著講", en: "Say it aloud" },
    { zh: "遮住文字回想", en: "Recall without the text" },
    { zh: "在情境中使用", en: "Use it in context" },
  ],
};

test("offline consumer returns only a gated unpublished draft", async () => {
  const provider = new FakeProvider(validCandidate);

  const draft = await generateOfflineLessonDraft(provider, context);

  assert.equal(draft.status, "draft");
  assert.equal(draft.candidate.lessonId, context.lessonId);
  assert.deepEqual(draft.gates, {
    schemaValidation: "passed",
    sourceVerification: "pending",
    teacherReview: "required",
  });
  assert.equal(JSON.stringify(draft).includes("published"), false);
});

test("offline consumer rejects provider output for another lesson or version", async () => {
  await assert.rejects(
    generateOfflineLessonDraft(
      new UnvalidatedProvider({ ...validCandidate, lessonId: "lesson-from-another-context" }),
      context,
    ),
    /lessonId mismatch/,
  );
  await assert.rejects(
    generateOfflineLessonDraft(
      new UnvalidatedProvider({ ...validCandidate, lessonVersion: "stale-version" }),
      context,
    ),
    /lessonVersion mismatch/,
  );
});

test("offline consumer rejects incomplete bilingual or stage output", async () => {
  await assert.rejects(
    generateOfflineLessonDraft(
      new UnvalidatedProvider({ ...validCandidate, objective: { zh: "", en: "Missing Chinese" } }),
      context,
    ),
    /objective must contain non-empty zh and en text/,
  );
  await assert.rejects(
    generateOfflineLessonDraft(
      new UnvalidatedProvider({ ...validCandidate, stagePlan: validCandidate.stagePlan.slice(0, 4) }),
      context,
    ),
    /stagePlan must contain exactly five stages/,
  );
});
