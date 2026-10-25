import assert from "node:assert/strict";
import test from "node:test";
import { register } from "node:module";
import { JSDOM } from "jsdom";
import React, { act, useState } from "react";
register(new URL("./helpers/load-tsx.mjs", import.meta.url));
const { useMobileStagePager } = await import("../app/hooks/useMobileStagePager.ts");
const { default: LessonAccordion } = await import("../app/components/LessonAccordion.tsx");
const { prototypeLesson } = await import("../app/data/lessons.ts");
const { copy } = await import("../app/taigi-content.ts");

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://taigi.test" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
window.matchMedia = () => ({ matches: true });
const { createRoot } = await import("react-dom/client");

async function render(element) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(() => root.render(element));
  return { container, close: async () => {
    await act(() => root.unmount());
    container.remove();
  } };
}
async function click(button) {
  assert.ok(button, "找不到操作按鈕");
  await act(() => button.click());
}

async function pagerAt(stage, lastVisibleStage = 3) {
  let pager;
  const views = [], stages = [];
  function Harness() {
    pager = useMobileStagePager({ stage, phraseIndex: 0, lastStage: 4, lastVisibleStage,
      onStageChange: (value) => stages.push(value), onViewChange: (value) => views.push(value) });
    return null;
  }
  const rendered = await render(React.createElement(Harness));
  return { get pager() { return pager; }, views, stages,
    close: rendered.close };
}
async function swipe(pager, forward) {
  await act(() => {
    pager.handleTouchStart({ target: null, touches: [{ clientX: 150, clientY: 100 }] });
    pager.handleTouchEnd({ target: null, changedTouches: [{ clientX: forward ? 60 : 240, clientY: 100 }] });
  });
}

test("內部 stage=4 時向前滑不會離開 Recall，向後滑仍正常", async () => {
  const h = await pagerAt(4);
  try {
    assert.equal(h.pager.viewedStage, 3);
    await swipe(h.pager, true);
    assert.equal(h.pager.viewedStage, 3);
    assert.deepEqual(h.views, []);
    await swipe(h.pager, false);
    assert.equal(h.pager.viewedStage, 2);
    await swipe(h.pager, true);
    assert.equal(h.pager.viewedStage, 3);
    assert.deepEqual(h.stages, []);
  } finally { await h.close(); }
});

test("showStage 同時限制可見上限、解鎖進度及下限", async () => {
  for (const stage of [0, 1, 2, 3, 4]) {
    const h = await pagerAt(stage);
    try {
      await act(() => h.pager.showStage(99));
      assert.equal(h.pager.viewedStage, Math.min(stage, 3));
      assert.equal(h.views.at(-1), Math.min(stage, 3));
      await act(() => h.pager.showStage(-1));
      assert.equal(h.pager.viewedStage, 0);
      assert.equal(h.views.at(-1), 0);
    } finally { await h.close(); }
  }
});

test("0–3 階段可正常滑動，且不可滑入未解鎖階段", async () => {
  for (let stage = 0; stage <= 3; stage++) {
    const h = await pagerAt(stage);
    try {
      await act(() => h.pager.showStage(0));
      for (let viewed = 1; viewed <= stage; viewed++) {
        await swipe(h.pager, true);
        assert.equal(h.pager.viewedStage, viewed);
      }
      await swipe(h.pager, true);
      assert.equal(h.pager.viewedStage, stage);
      for (let viewed = stage - 1; viewed >= 0; viewed--) {
        await swipe(h.pager, false);
        assert.equal(h.pager.viewedStage, viewed);
      }
      await swipe(h.pager, false);
      assert.equal(h.pager.viewedStage, 0);
    } finally { await h.close(); }
  }
});

test("揭曉答案保留內部 stage=4，Use 留在 Recall 並可加入複習完成", async () => {
  let internalStage, reviewed;
  const text = copy.zh;
  function Harness() {
    const [stage, setStage] = useState(3);
    const [completed, setCompleted] = useState(new Set());
    internalStage = stage;
    return React.createElement(LessonAccordion, { text, lesson: prototypeLesson, stage,
      phraseIndex: 0, reviewScheduled: completed.size > 0, completedPhraseIds: completed,
      nextLesson: null, onStageChange: setStage,
      onReviewAdded: (id) => { reviewed = id; setCompleted(new Set([id])); },
      onPhraseChange() {}, onPhraseAdvance() {}, onLessonComplete() {} });
  }
  const rendered = await render(React.createElement(Harness));
  try {
    const root = rendered.container;
    const buttons = () => [...root.querySelectorAll("button")];
    const action = (label) => buttons().find((button) => button.textContent.includes(label));
    assert.equal(root.querySelectorAll("fieldset").length, 0);
    await click(action(text.showAnswer));
    assert.equal(internalStage, 4);
    assert.equal(root.querySelectorAll(".recall-card.revealed").length, 1);
    assert.equal(root.querySelectorAll(".recall-use-reveal").length, 1);
    assert.equal(root.querySelectorAll(".stage-trigger").length, 4);
    assert.equal(root.querySelectorAll('.stage-trigger[aria-expanded="true"]').length, 1);
    const recallTrigger = root.querySelectorAll(".stage-trigger")[3];
    assert.ok(recallTrigger.textContent.includes(text.currentStep));
    assert.equal(recallTrigger.querySelector(".stage-number").textContent, "4");
    const correct = prototypeLesson.phrases[0].useScenario.choices.find((choice) => choice.isCorrect);
    assert.equal(action(text.addReview).disabled, true);
    await click(action(text.addReview));
    assert.equal(reviewed, undefined);
    const wrong = prototypeLesson.phrases[0].useScenario.choices.find((choice) => !choice.isCorrect);
    await click(buttons().find((button) => button.querySelector("b")?.textContent === wrong.hanji));
    assert.equal(action(text.addReview).disabled, true);
    await click(action(text.addReview));
    assert.equal(reviewed, undefined);
    await click(buttons().find((button) => button.querySelector("b")?.textContent === correct.hanji));
    assert.equal(action(text.addReview).disabled, false);
    await click(action(text.addReview));
    assert.equal(reviewed, prototypeLesson.phrases[0].id);
    assert.equal(internalStage, 4);
    assert.ok(recallTrigger.textContent.includes(text.completedStep));
    assert.equal(recallTrigger.querySelector(".stage-number").textContent, "✓");
    assert.ok(action(text.viewProgress));
  } finally { await rendered.close(); }
});

for (const locale of ["zh", "en"]) {
  for (const reviewScheduled of [false, true]) {
    test(`${locale}：stage=4 ${reviewScheduled ? "已完成" : "未完成"}恢復後，返回 Recall 仍可操作`, async () => {
      const text = copy[locale];
      let reviewed = 0;
      const rendered = await render(React.createElement(LessonAccordion, {
        text, lesson: prototypeLesson, stage: 4, phraseIndex: 0,
        reviewScheduled, completedPhraseIds: new Set(reviewScheduled ? [prototypeLesson.phrases[0].id] : []),
        nextLesson: null, onStageChange() {}, onReviewAdded() { reviewed++; },
        onPhraseChange() {}, onPhraseAdvance() {}, onLessonComplete() {},
      }));
      try {
        const root = rendered.container;
        const mobileAction = () => root.querySelector(".mobile-stage-navigation button:last-of-type");
        const assertRecall = () => {
          assert.equal(root.querySelectorAll(".recall-use-reveal").length, 1);
          assert.equal(root.querySelector('.stage-trigger[aria-expanded="true"] .stage-number').textContent, reviewScheduled ? "✓" : "4");
          assert.ok(root.querySelector('.stage-trigger[aria-expanded="true"]').textContent.includes(reviewScheduled ? text.completedStep : text.currentStep));
          assert.ok(mobileAction().textContent.includes(reviewScheduled ? text.viewProgress : text.addReview));
          assert.equal(mobileAction().disabled, !reviewScheduled);
        };
        assertRecall();
        // 選擇先前 See 階段，再返回已揭曉的 Recall；不必操作錄音。
        await click(root.querySelectorAll(".stage-trigger")[1]);
        await click(root.querySelectorAll(".stage-trigger")[3]);
        assertRecall();
        if (!reviewScheduled) {
          await click(mobileAction());
          assert.equal(reviewed, 0);
        }
      } finally { await rendered.close(); }
    });
  }
}

test("一般五階段 pager 可見上限為 4 時仍可導覽到 Use", async () => {
  const full = await pagerAt(4, 4);
  try {
    assert.equal(full.pager.viewedStage, 4);
    await swipe(full.pager, false);
    assert.equal(full.pager.viewedStage, 3);
    await swipe(full.pager, true);
    assert.equal(full.pager.viewedStage, 4);
  } finally { await full.close(); }
});

for (const reviewScheduled of [false, true]) {
  test(`文字 Use：${reviewScheduled ? "已完成恢復後可繼續" : "空白阻擋，填答後可完成"}`, async () => {
    // 隔離 fixture 測試元件支援的無選擇題 fallback，不更動正式課程資料。
    const lesson = { ...prototypeLesson, phrases: [{ ...prototypeLesson.phrases[0], useScenario: undefined }] };
    const phraseIndex = 0;
    const text = copy.zh;
    let reviewed;
    const rendered = await render(React.createElement(LessonAccordion, {
      text, lesson, stage: 4, phraseIndex, reviewScheduled,
      completedPhraseIds: new Set(reviewScheduled ? [lesson.phrases[phraseIndex].id] : []),
      nextLesson: null, onStageChange() {}, onReviewAdded(id) { reviewed = id; },
      onPhraseChange() {}, onPhraseAdvance() {}, onLessonComplete() {},
    }));
    try {
      const root = rendered.container;
      const action = () => root.querySelector(".mobile-stage-navigation button:last-of-type");
      if (reviewScheduled) {
        assert.equal(action().disabled, false);
      } else {
        assert.equal(action().disabled, true);
        const input = root.querySelector("textarea");
        const setValue = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        const fill = async (value) => act(() => {
          setValue.call(input, value);
          input.dispatchEvent(new window.Event("input", { bubbles: true }));
        });
        await fill("   ");
        assert.equal(action().disabled, true);
        await fill("我會用這句話。");
        assert.equal(action().disabled, false);
        await click(action());
        assert.equal(reviewed, lesson.phrases[phraseIndex].id);
      }
    } finally { await rendered.close(); }
  });
}
