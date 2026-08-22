import assert from "node:assert/strict";
import test from "node:test";
import { copy } from "../app/taigi-content.ts";

test("mobile stage navigation names its destination in both locales", () => {
  assert.equal(copy.zh.nextStageTo("看"), "下一步：看");
  assert.equal(copy.zh.previousStageTo("聽"), "上一步：聽");
  assert.equal(copy.en.nextStageTo("See"), "Next: See");
  assert.equal(copy.en.previousStageTo("Hear"), "Previous: Hear");
});

test("the unlocked-stage hint explains both the right action and left swipe", () => {
  assert.match(copy.zh.unlockedStageHint("聽", "看"), /聽.*完成.*下一步：看.*向左滑.*看/);
  assert.match(copy.en.unlockedStageHint("Hear", "See"), /Hear complete.*Next: See.*swipe left.*See/);
  assert.equal(copy.zh.swipeLeftNext, "向左滑到下一步");
  assert.equal(copy.zh.swipeRightPrevious, "向右滑回上一步");
  assert.equal(copy.en.swipeLeftNext, "Swipe left for the next step");
  assert.equal(copy.en.swipeRightPrevious, "Swipe right for the previous step");
});
