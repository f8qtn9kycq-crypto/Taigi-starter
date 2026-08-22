import assert from "node:assert/strict";
import test from "node:test";
import { copy } from "../app/taigi-content.ts";

test("mobile stage navigation names its destination in both locales", () => {
  assert.equal(copy.zh.nextStageTo("看"), "下一步：看");
  assert.equal(copy.zh.previousStageTo("聽"), "上一步：聽");
  assert.equal(copy.en.nextStageTo("See"), "Next: See");
  assert.equal(copy.en.previousStageTo("Hear"), "Previous: Hear");
});

test("the unlocked-stage hint explains both the right action and right swipe", () => {
  assert.match(copy.zh.unlockedStageHint("聽", "看"), /聽.*完成.*下一步：看.*向右滑.*看/);
  assert.match(copy.en.unlockedStageHint("Hear", "See"), /Hear complete.*Next: See.*swipe right.*See/);
});
