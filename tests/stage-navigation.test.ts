import assert from "node:assert/strict";
import test from "node:test";
import { resolveStageSwipe } from "../app/utils/stage-navigation.ts";

test("right swipe advances only to an unlocked mobile stage", () => {
  assert.equal(resolveStageSwipe({ x: 40, y: 100 }, { x: 130, y: 104 }, 0, 1), 1);
  assert.equal(resolveStageSwipe({ x: 40, y: 100 }, { x: 130, y: 104 }, 1, 1), null);
});

test("left swipe returns to a previous stage without changing the unlock ceiling", () => {
  assert.equal(resolveStageSwipe({ x: 150, y: 100 }, { x: 70, y: 96 }, 2, 4), 1);
  assert.equal(resolveStageSwipe({ x: 150, y: 100 }, { x: 70, y: 96 }, 0, 4), null);
});

test("short or vertical gestures do not change stages", () => {
  assert.equal(resolveStageSwipe({ x: 40, y: 100 }, { x: 75, y: 102 }, 0, 1), null);
  assert.equal(resolveStageSwipe({ x: 40, y: 100 }, { x: 100, y: 180 }, 0, 1), null);
});
