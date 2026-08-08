import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the first-time Taigi landing content and Vercel feedback path", async () => {
  const [layout, landing, page, bottomNav, coursePath, lesson, stagePanel, stageContent, recording, recorder, copy, content, feedbackConfig, feedbackForm] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LandingHero.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/TaigiStartPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BottomNav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CoursePath.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonAccordion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonStagePanel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonStageContent.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/RecordingPractice.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useRecorder.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/taigi-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/lessons.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/feedback-config/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/FeedbackForm.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /台語起步 Tâi-gí Start/);
  assert.match(layout, /og\.png/);
  assert.match(landing, /aria-pressed=\{isPlaying\}/);
  assert.match(landing, /locale === "zh" \? "EN" : "繁"/);
  assert.doesNotMatch(landing, /locale === "zh" \? "EN" : "中"/);
  assert.match(lesson, /stage-accordion/);
  assert.match(bottomNav, /aria-label=\{text\.primaryNavigation\}/);
  assert.match(coursePath, /aria-current=\{isActive \? "page" : undefined\}/);
  assert.match(coursePath, /text\.startLesson/);
  assert.match(coursePath, /text\.continueLesson\(activeStage \+ 1, stageCount\)/);
  assert.match(coursePath, /text\.lessonCompleted/);
  assert.match(coursePath, /onLessonSelect\(lesson\.number\)/);
  assert.match(copy, /今仔日，講一句台語。/);
  assert.match(copy, /每天 3 分鐘，從聽懂到開口。/);
  assert.match(copy, /開始今日一句/);
  assert.match(copy, /先聽發音/);
  assert.match(copy, /音檔無法播放，先看文字/);
  assert.match(copy, /聽 → 看 → 說 → 想 → 用/);
  assert.match(copy, /第 1 課 · 相借問/);
  assert.match(copy, /lessonRhythm: "先聽 → 看文字 → 開口講 → 回想 → 生活運用"/);
  assert.match(copy, /lessonTime: "約 5 分鐘"/);
  assert.match(lesson, /lesson-rhythm/);
  assert.match(lesson, /aria-pressed=\{index === phraseIndex\}/);
  assert.match(lesson, /onPhraseChange\(index\)/);
  assert.match(lesson, /completedPhraseIds\.has\(phrase\.id\)/);
  assert.match(copy, /選擇要練習的詞語/);
  assert.match(copy, /下一個詞：/);
  assert.match(lesson, /lesson.stages.map/);
  assert.match(lesson, /text\.stageLabels\[lessonStage\.id\]/);
  assert.match(lesson, /disabled=\{!isCurrent && !isComplete\}/);
  assert.match(lesson, /isComplete && onStageChange\(index\)/);
  assert.match(stagePanel, /text\.stageProgress\(stage, lesson\.stages\.length/);
  assert.match(stagePanel, /text\.hearCompletionHint/);
  assert.match(stagePanel, /disabled=\{audioPlays < 1 && !hasError\}/);
  assert.match(stagePanel, /lessonStage\.id === "recall" && !showAnswer/);
  assert.match(stagePanel, /recallAttempted/);
  assert.match(stagePanel, /text\.recallAttempt/);
  assert.match(stagePanel, /lessonStage\.id === "recall" && showAnswer/);
  assert.match(stagePanel, /reviewScheduled/);
  assert.match(stagePanel, /hasUseResponse = useResponse\.trim\(\)\.length > 0/);
  assert.match(stagePanel, /disabled=\{!hasUseResponse\}/);
  assert.doesNotMatch(stagePanel, /fetch\(|localStorage|sessionStorage/);
  assert.match(stagePanel, /sayCompleted/);
  assert.match(stagePanel, /disabled=\{!sayCompleted\}/);
  assert.match(stageContent, /stage === "recall"/);
  assert.match(stageContent, /showAnswer &&/);
  assert.match(stageContent, /text\.tailoLabel/);
  assert.match(stageContent, /text\.pojLabel/);
  assert.match(stageContent, /phrase\.poj !== null/);
  assert.match(stageContent, /script === "poj" && phrase\.poj \? phrase\.poj : phrase\.tailo/);
  assert.match(recording, /text\.recordingLocalOnly/);
  assert.match(recording, /onCompletionChange/);
  assert.match(recording, /fallbackConfirmed/);
  assert.doesNotMatch(recording, /openSafariHint/);
  assert.match(recording, /text\.microphoneEnableHint[\s\S]*<button/);
  assert.doesNotMatch(copy, /若目前不是 Safari|open this lesson in Safari/);
  assert.doesNotMatch(`${recording}\n${recorder}`, /fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
  assert.match(landing, /text\.stageCount\(stage, totalStages\)/);
  assert.doesNotMatch(copy, /stageCount: \(stage\) => .*\/ 5/);
  assert.match(content, /教育部《臺灣台語常用詞辭典》/);
  assert.match(copy, /20 課已開放/);
  assert.doesNotMatch(copy, /可體驗/);
  assert.match(copy, /先完成一次跟讀/);
  assert.match(copy, /我已經跟讀/);
  assert.doesNotMatch(feedbackForm, /fetch\(["']\/api\/feedback["']/);
  assert.match(feedbackConfig, /process\.env\.FEEDBACK_EXTERNAL_FORM_URL/);
  assert.match(feedbackConfig, /url\.protocol === "https:"/);
  assert.match(feedbackForm, /api\/feedback-config/);
  assert.doesNotMatch(`${feedbackForm}\n${page}`, /GitHub\s*·\s*Technical feedback|GitHub feedback/i);
  assert.match(feedbackForm, /target="_blank"/);
  assert.doesNotMatch(`${feedbackConfig}\n${feedbackForm}`, /cloudflare:workers|codex-preview|_sites-preview|react-loading-skeleton/);
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

  assert.match(page, /<BottomNav/);
  assert.match(page, /activeLesson\.phrases\[progress\.phraseIndex\] \? progress\.phraseIndex : 0/);
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
  assert.match(css, /\.lesson-targets button \{[\s\S]*min-height: 44px/);
  assert.match(css, /\.media-attribution a \{[\s\S]*min-height: 44px/);
  assert.match(css, /\.use-response textarea \{[\s\S]*min-height: 72px/);
  assert.match(css, /\.progress-line i \{[\s\S]*width: 100%/);
  assert.doesNotMatch(css, /\.progress-line i \{[\s\S]*width: 62%/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /\.bottom-nav \{[\s\S]*position: fixed/);
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
  assert.match(types, /reviewCard: null/);
  assert.match(storage, /hasStarted: parsed\.hasStarted === true/);
  assert.match(storage, /parsed\.hasStarted === true &&[\s\S]*parsed\.dueCount/);
  assert.match(content, /status: "prototype"/);
  assert.match(content, /CC BY-ND 3\.0 TW/);
  assert.match(copy, /20 課已開放/);
  assert.doesNotMatch(copy, /7 \/ 12/);
});
