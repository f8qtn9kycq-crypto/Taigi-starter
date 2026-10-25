import assert from "node:assert/strict";
import test from "node:test";
import { register } from "node:module";
import { JSDOM } from "jsdom";
import React, { act } from "react";

register(new URL("./helpers/load-tsx.mjs", import.meta.url));
const { default: TaigiStartPage } = await import("../app/TaigiStartPage.tsx");
const { prototypeLesson } = await import("../app/data/lessons.ts");
const { PROGRESS_STORAGE_KEY } = await import("../app/services/progress-storage.ts");

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://taigi.test",
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
window.matchMedia = () => ({ matches: true });
const { createRoot } = await import("react-dom/client");

test("重新載入首頁時，內部 stage=4 應顯示四階段進度且保留原始儲存值", async () => {
  window.localStorage.clear();
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    version: 5,
    locale: "zh",
    lessonId: prototypeLesson.id,
    hasStarted: true,
    lessons: {
      [prototypeLesson.id]: { stage: 4, phraseIndex: 0, completedPhraseIds: [] },
    },
    reviewCards: {},
  }));

  // Avoid network requests from the unrelated feedback dialog setup.
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false });
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => {
      root.render(React.createElement(TaigiStartPage));
    });
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 20));
    });
    assert.ok(container.querySelector(".landing-viewport"), "重新載入應先顯示首頁");
    const header = container.querySelector(".site-header .status-chip");
    assert.ok(header, "已開始課程時首頁應顯示進度");
    assert.match(header.textContent, /4\s*\/\s*4/);
    assert.doesNotMatch(header.textContent, /5\s*\/\s*5/);
    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY));
    assert.equal(saved.lessons[prototypeLesson.id].stage, 4, "內部五階段進度不得被改寫");
    assert.deepEqual(saved.reviewCards, {}, "不可建立額外的複習卡");
  } finally {
    await act(async () => root.unmount());
    container.remove();
    window.localStorage.clear();
    globalThis.fetch = previousFetch;
  }
});
