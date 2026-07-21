import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the first-time Taigi landing content and production worker", async () => {
  const [layout, landing, lesson, copy, content, worker] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LandingHero.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonAccordion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/taigi-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/lessons.ts", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/index.js", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /台語起步 Tâi-gí Start/);
  assert.match(layout, /og\.png/);
  assert.match(landing, /aria-pressed=\{isPlaying\}/);
  assert.match(lesson, /stage-accordion/);
  assert.match(copy, /今仔日，講一句台語。/);
  assert.match(copy, /每天 3 分鐘，從聽懂到開口。/);
  assert.match(copy, /開始今日一句/);
  assert.match(copy, /先聽發音/);
  assert.match(copy, /音檔無法播放，先看文字/);
  assert.match(copy, /聽 → 看 → 說 → 想 → 用/);
  assert.match(copy, /第 1 課 · 相借問/);
  assert.match(content, /教育部《臺灣台語常用詞辭典》/);
  assert.match(copy, /第 1 課可用版本 · 學習紀錄儲存在此裝置/);
  assert.match(worker, /api\/feedback/);
  assert.doesNotMatch(worker, /codex-preview|_sites-preview|react-loading-skeleton/);
});

test("landing interaction and responsive contracts remain explicit", async () => {
  const [page, landing, audioHook, copy, css, audio] = await Promise.all([
    readFile(new URL("../app/TaigiStartPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LandingHero.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useAudioPlayer.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/taigi-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/audio/li-tsiah-pa-bue.mp3", import.meta.url)),
  ]);

  assert.match(page, /progress\.hasStarted && \([\s\S]*<BottomNav/);
  assert.match(page, /onStart=\{startLearning\}/);
  assert.match(page, /document\.documentElement\.lang = progress\.locale === "zh" \? "zh-Hant-TW" : "en"/);
  assert.match(landing, /onClick=\{onAudioToggle\}/);
  assert.match(landing, /aria-pressed=\{isPlaying\}/);
  assert.match(audioHook, /let activeAudio: HTMLAudioElement \| null = null/);
  assert.match(audioHook, /activeAudio\.pause\(\)/);
  assert.match(copy, /startPhrase: "開始今日一句"/);
  assert.match(copy, /startPhrase: "Start Today’s Phrase"/);
  assert.match(copy, /listenFirst: "先聽發音"/);
  assert.match(copy, /listenFirst: "Listen First"/);
  assert.match(copy, /continueWithoutAudio: "Audio unavailable, continue to the script"/);
  assert.doesNotMatch(copy, /台语|听|说|发音|学习|进度|复习/);
  assert.match(css, /overflow-x: clip/);
  assert.match(css, /\.hero-brush[\s\S]*pointer-events: none/);
  assert.match(css, /\.hero-primary-action,[\s\S]*min-height: 56px/);
  assert.match(css, /\.brand \{[\s\S]*min-height: 44px/);
  assert.match(css, /\.locale \{[\s\S]*min-height: 44px/);
  assert.match(css, /\.script-tabs button \{[\s\S]*min-height: 44px/);
  assert.match(css, /\.media-attribution a \{[\s\S]*min-height: 44px/);
  assert.match(css, /footer a \{[\s\S]*min-height: 44px/);
  assert.match(css, /\.progress-line i \{[\s\S]*width: 100%/);
  assert.doesNotMatch(css, /\.progress-line i \{[\s\S]*width: 62%/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.equal(audio.subarray(0, 3).toString(), "ID3");
  assert.ok(audio.length > 10_000);
});

test("saved progress and lesson content stay explicit and truthful", async () => {
  const [storage, types, content, copy] = await Promise.all([
    readFile(new URL("../app/services/progress-storage.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/types/learning.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/lessons.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/taigi-content.ts", import.meta.url), "utf8"),
  ]);

  assert.match(types, /hasStarted: false/);
  assert.match(types, /lessonOneReview: null/);
  assert.match(storage, /hasStarted: parsed\.hasStarted === true/);
  assert.match(storage, /parsed\.hasStarted === true &&[\s\S]*parsed\.dueCount/);
  assert.match(content, /status: "prototype"/);
  assert.match(content, /CC BY-ND 3\.0 TW/);
  assert.match(copy, /1 \/ 1 句可體驗/);
  assert.doesNotMatch(copy, /7 \/ 12/);
});
