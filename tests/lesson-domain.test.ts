import assert from "node:assert/strict";
import test from "node:test";
import { LESSON_FACTORY_STEP_IDS } from "../app/types/lesson-domain.ts";
import { LESSON_STAGE_IDS } from "../app/types/lesson.ts";

test("lesson factory steps preserve the runtime lesson stage contract", () => {
  assert.strictEqual(LESSON_STAGE_IDS, LESSON_FACTORY_STEP_IDS);
  assert.deepEqual(LESSON_FACTORY_STEP_IDS, ["hear", "see", "say", "recall", "use"]);
});
