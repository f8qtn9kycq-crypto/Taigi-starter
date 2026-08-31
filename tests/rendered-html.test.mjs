import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the first-time Taigi landing content and Vercel feedback path", async () => {
  const [layout, landing, siteHeader, page, bottomNav, coursePath, lesson, mobileStageNavigation, stagePanel, completionActions, useStageActions, useScenarioExercise, stageContent, stagePager, reviewModal, recording, recorder, copy, content, feedbackConfig, feedbackForm, feedbackService, css] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LandingHero.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/TaigiStartPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BottomNav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CoursePath.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonAccordion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/MobileStageNavigation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonStagePanel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonCompletionActions.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/UseStageActions.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/UseScenarioExercise.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonStageContent.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useMobileStagePager.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ReviewModal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/RecordingPractice.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useRecorder.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/taigi-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/lessons.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/feedback-config/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/FeedbackForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/services/feedback.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /台語起步 Tâi-gí Start/);
  assert.match(layout, /og\.png/);
  assert.match(landing, /aria-pressed=\{isPlaying\}/);
  assert.match(siteHeader, /locale === "zh" \? "EN" : "繁"/);
  assert.doesNotMatch(siteHeader, /locale === "zh" \? "EN" : "中"/);
  assert.match(lesson, /stage-accordion/);
  assert.match(bottomNav, /aria-label=\{text\.primaryNavigation\}/);
  assert.match(bottomNav, /reviewButtonRef: RefObject<HTMLButtonElement \| null>/);
  assert.match(bottomNav, /feedbackButtonRef: RefObject<HTMLButtonElement \| null>/);
  assert.match(bottomNav, /ref=\{reviewButtonRef\}[\s\S]*onClick=\{onReview\}/);
  assert.match(bottomNav, /ref=\{feedbackButtonRef\}[\s\S]*onClick=\{onFeedback\}/);
  assert.match(bottomNav, /text\.navProgress[\s\S]*text\.navFeedback/);
  assert.match(coursePath, /aria-current=\{isActive \? "page" : undefined\}/);
  assert.doesNotMatch(coursePath, /aria-pressed/);
  assert.match(coursePath, /text\.startLesson/);
  assert.match(coursePath, /text\.continueLesson\(completedSteps, totalSteps\)/);
  assert.match(coursePath, /completedStepCount\(storedProgress, phraseIds, stageCount\)/);
  assert.match(coursePath, /text\.lessonCompleted/);
  assert.match(coursePath, /onLessonSelect\(lesson\.number\)/);
  assert.match(coursePath, /disabled=\{!progressReady\}/);
  assert.match(coursePath, /aria-busy=\{!progressReady\}/);
  assert.match(coursePath, /text\.lessonNumber\(lesson\.pathOrder\)/);
  assert.doesNotMatch(coursePath, /text\.lessonNumber\(lesson\.number\)/);
  assert.match(coursePath, /role="progressbar"/);
  assert.match(coursePath, /text\.lessonDuration\(lesson\.durationMinutes\)/);
  assert.match(coursePath, /lesson\.status === "planned"[\s\S]*\? "locked"/);
  assert.match(coursePath, /: "available"/);
  assert.doesNotMatch(coursePath, /CurriculumCoverage/);
  assert.doesNotMatch(copy, /課綱參考|官方課綱|curriculum reference|official curriculum/i);
  assert.doesNotMatch(css, /curriculum-coverage|curriculum-groups|curriculum-disclaimer/);
  assert.match(copy, /lessonLocked: "尚未開放"/);
  assert.match(copy, /lessonLocked: "Locked"/);
  assert.match(copy, /今天要複習 \$\{count\} 句/);
  assert.match(copy, /先想怎麼說，再顯示答案/);
  assert.match(copy, /今天沒有要複習的句子/);
  assert.match(copy, /Review today/);
  assert.match(copy, /按右方「下一步：\$\{next\}」或向左滑/);
  assert.match(copy, /Use “Next: \$\{next\}” on the right or swipe left/);
  assert.match(stagePanel, /<MobileStageNavigation/);
  assert.match(mobileStageNavigation, /text\.nextStageTo\(nextStageLabel\)/);
  assert.match(mobileStageNavigation, /className="stage-unlocked-hint" role="status"/);
  assert.match(copy, /Recall it first, then reveal the answer/);
  assert.match(copy, /No phrases to review today/);
  assert.match(reviewModal, /aria-describedby="review-explanation"/);
  assert.doesNotMatch(reviewModal, /SRS/);
  assert.match(reviewModal, /text\.reviewDueTitle\(dueCount\)/);
  assert.match(reviewModal, /text\.reviewExplanation/);
  assert.match(reviewModal, /text\.reviewEmptyExplanation/);
  assert.match(copy, /今仔日，講一句台語。/);
  assert.match(copy, /每天五分鐘，慢慢培養台語耳。/);
  assert.match(copy, /每天 5 分鐘，從聽懂到開口。/);
  assert.match(copy, /previewDuration: "約 5 分鐘"/);
  assert.match(copy, /Five focused minutes at a time\./);
  assert.match(copy, /Five minutes a day, from understanding to speaking\./);
  assert.match(copy, /previewDuration: "About 5 minutes"/);
  assert.doesNotMatch(copy, /三分鐘|3 分鐘|Three (?:focused )?minutes|About 3 minutes/);
  assert.match(copy, /startPhrase: "開始今日一句"/);
  assert.match(copy, /resumeLearning: "繼續學習"/);
  assert.match(copy, /startPhrase: "Start Today’s Phrase"/);
  assert.match(copy, /resumeLearning: "Resume learning"/);
  assert.match(copy, /viewAllLessons: \(count\) => `查看全部 \$\{count\} 課`/);
  assert.match(copy, /先聽發音/);
  assert.match(copy, /音檔無法播放，先看文字/);
  assert.match(copy, /聽 → 看 → 說 → 想 → 用/);
  assert.match(copy, /第 1 課 · 相借問/);
  assert.match(copy, /lessonRhythm: "先聽 → 看文字 → 開口講 → 回想 → 生活運用"/);
  assert.match(copy, /lessonTime: "約 5 分鐘"/);
  assert.match(lesson, /lesson-rhythm/);
  assert.match(lesson, /aria-pressed=\{index === phraseIndex\}/);
  assert.match(lesson, /text\.locale === "en" && <small className="phrase-meaning">\{phrase\.meaning\.en\}<\/small>/);
  assert.match(lesson, /phrase\.meaning\[text\.locale\]/);
  assert.match(lesson, /className="phrase-romanization"/);
  assert.match(lesson, /onPhraseChange\(index\)/);
  assert.match(lesson, /completedPhraseIds\.has\(phrase\.id\)/);
  assert.match(copy, /選擇要練習的詞語/);
  assert.match(copy, /下一個詞：/);
  assert.match(lesson, /lesson.stages.map/);
  assert.match(lesson, /text\.stageLabels\[lessonStage\.id\]/);
  assert.match(lesson, /disabled=\{index > stage\}/);
  assert.match(lesson, /pendingFocusStageRef\.current = nextStage/);
  assert.match(lesson, /lesson\.phrases\.every\(\(phrase\) => completedPhraseIds\.has\(phrase\.id\)\)/);
  assert.match(lesson, /findIndex\(\(phrase\) => !completedPhraseIds\.has\(phrase\.id\)\)/);
  assert.match(lesson, /pendingFocusStageRef\.current = 0;[\s\S]*onPhraseAdvance\(nextIncompletePhraseIndex\)/);
  assert.match(lesson, /stageTriggerRefs\.current\[viewedStage\]\?\.focus\(\)/);
  assert.match(lesson, /useMobileStagePager/);
  assert.match(lesson, /onTouchStart=\{handleTouchStart\}/);
  assert.match(mobileStageNavigation, /viewedStage < unlockedStage/);
  assert.match(mobileStageNavigation, /className="mobile-stage-navigation"/);
  assert.match(mobileStageNavigation, /const nextAction = nextStageLabel/);
  assert.match(mobileStageNavigation, /currentAction \?\?/);
  assert.match(mobileStageNavigation, /disabled=\{nextAction\.disabled\}/);
  assert.match(lesson, /index <= stage && showStage\(index\)/);
  assert.match(stagePanel, /text\.stageProgress\(stage, lesson\.stages\.length/);
  assert.match(stagePanel, /text\.hearCompletionHint/);
  assert.match(stagePanel, /audioPlays === 0\) onUnlock\(\)/);
  assert.match(stagePanel, /onCompletionChange=\{completeSay\}/);
  assert.match(stagePanel, /const revealAnswer = \(\) => \{[\s\S]*onUnlock\(\)/);
  assert.match(stagePanel, /lessonStage\.id === "see"[\s\S]*text\.nextSay/);
  assert.match(stageContent, /className="mobile-culture-note"/);
  assert.match(stageContent, /text\.contextNote/);
  assert.match(stagePager, /setPager\(\{ phraseIndex, furthestStage: nextStage, viewedStage \}\)/);
  assert.match(stagePager, /matchMedia\("\(max-width: 639px\)"\)/);
  assert.match(stagePager, /onStageChange\(nextStage\)/);
  assert.match(stagePanel, /disabled=\{audioPlays < 1 && !hasError\}/);
  assert.match(stagePanel, /lessonStage\.id === "recall" && !showAnswer/);
  assert.match(stagePanel, /recallAttempted/);
  assert.match(stagePanel, /text\.recallAttempt/);
  assert.match(stagePanel, /lessonStage\.id === "recall" && showAnswer/);
  assert.match(stagePanel, /reviewScheduled/);
  assert.match(stagePanel, /nextPhraseIndex >= 0/);
  assert.match(stagePanel, /lessonComplete && hasUseResponse/);
  assert.match(stagePanel, /: lessonComplete[\s\S]*text\.nextLesson/);
  assert.match(useStageActions, /\) : lessonComplete && \(/);
  assert.match(stagePanel, /completionRef\.current\?\.focus\(\)/);
  assert.match(stagePanel, /nextLesson[\s\S]*text\.nextLesson/);
  assert.match(stagePanel, /onLessonComplete/);
  assert.match(completionActions, /tabIndex=\{-1\}[\s\S]*className="lesson-complete"/);
  assert.match(completionActions, /nextLesson \? text\.lessonComplete : text\.courseComplete/);
  assert.match(completionActions, /text\.viewProgress/);
  assert.match(page, /nextPlayableLesson\(playableLessons, activeLesson\.id\)/);
  assert.match(page, /nextLesson \? selectLesson\(nextLesson\.number\) : showPath\(\)/);
  assert.match(stagePanel, /phrase\.useScenario[\s\S]*selectedUseChoice\?\.isCorrect === true/);
  assert.match(stagePanel, /<UseStageActions/);
  assert.match(stagePanel, /className="stage-panel-scroll"/);
  assert.match(useStageActions, /<UseScenarioExercise/);
  assert.match(useStageActions, /!hasUseResponse && !lessonComplete && !phrase\.useScenario/);
  assert.match(useStageActions, /disabled=\{!hasUseResponse\}/);
  assert.match(useScenarioExercise, /<fieldset className="use-scenario">/);
  assert.match(useScenarioExercise, /aria-pressed=\{selectedChoiceId === choice\.id\}/);
  assert.match(useScenarioExercise, /selectedChoice\.isCorrect \? correctLabel : tryAgainLabel/);
  assert.match(useScenarioExercise, /role="status"/);
  assert.match(useScenarioExercise, /selectedChoice\.sourceUrl/);
  assert.doesNotMatch(stagePanel, /fetch\(|localStorage|sessionStorage/);
  assert.match(stagePanel, /sayCompleted/);
  assert.match(stagePanel, /disabled=\{!sayCompleted\}/);
  assert.match(stageContent, /stage === "recall"/);
  assert.match(stageContent, /phrase\.useCombination/);
  assert.match(stageContent, /text\.useCombination/);
  assert.match(stageContent, /phrase\.source\.canonicalUrl/);
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
  assert.match(siteHeader, /text\.stageCount\(stage, totalStages\)/);
  assert.match(landing, /startPending \? text\.startingPhrase : primaryActionLabel/);
  assert.match(landing, /onClick=\{onSecondaryAction\}/);
  assert.match(landing, /\{secondaryActionLabel\}/);
  assert.doesNotMatch(copy, /stageCount: \(stage\) => .*\/ 5/);
  assert.match(content, /教育部《臺灣台語常用詞辭典》/);
  assert.match(copy, /20 課已開放/);
  assert.doesNotMatch(copy, /可體驗/);
  assert.match(copy, /先完成一次跟讀/);
  assert.match(copy, /我已經跟讀/);
  assert.doesNotMatch(feedbackForm, /fetch\(["']\/api\/feedback["']/);
  assert.match(feedbackService, /process\.env\.FEEDBACK_EXTERNAL_FORM_URL/);
  assert.match(feedbackService, /url\.protocol === "https:"/);
  assert.match(feedbackConfig, /getExternalFormUrl\(\)/);
  assert.doesNotMatch(`${feedbackService}\n${feedbackConfig}`, /docs\.google\.com\/forms\/d\//);
  assert.match(feedbackForm, /api\/feedback-config/);
  assert.doesNotMatch(feedbackForm, /feedback-fab/);
  assert.match(feedbackForm, /open: boolean/);
  assert.match(page, /open=\{activeTab === "feedback"\}/);
  assert.doesNotMatch(`${feedbackForm}\n${page}`, /GitHub\s*·\s*Technical feedback|GitHub feedback/i);
  assert.match(feedbackForm, /target="_blank"/);
  assert.doesNotMatch(`${feedbackConfig}\n${feedbackForm}`, /cloudflare:workers|codex-preview|_sites-preview|react-loading-skeleton/);
});

test("landing interaction and responsive contracts remain explicit", async () => {
  const [page, workspace, landing, siteHeader, lesson, coursePath, audioHook, reviewNowHook, copy, css, audio] = await Promise.all([
    readFile(new URL("../app/TaigiStartPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LearningWorkspace.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LandingHero.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LessonAccordion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/CoursePath.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useAudioPlayer.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useReviewNow.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/taigi-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/audio/li-tsiah-pa-bue.mp3", import.meta.url)),
  ]);

  assert.match(page, /<BottomNav/);
  assert.match(page, /useReviewNow\(progress\.reviewCards\)/);
  assert.match(page, /dueReviewCards\(progress\.reviewCards, reviewNow\)/);
  assert.match(reviewNowHook, /nextReviewRefreshDelay\(reviewCards, now\)/);
  assert.match(reviewNowHook, /window\.setTimeout\(\(\) => setNow\(new Date\(\)\), 0\)/);
  assert.match(reviewNowHook, /window\.setTimeout\(\(\) => \{[\s\S]*setNow\(new Date\(\)\);[\s\S]*\}, delay\)/);
  assert.match(page, /reviewTriggerRef = useRef<HTMLButtonElement \| null>\(null\)/);
  assert.match(page, /reviewButtonRef=\{reviewTriggerRef\}/);
  assert.match(page, /feedbackButtonRef=\{feedbackTriggerRef\}/);
  assert.match(page, /requestAnimationFrame\(\(\) => feedbackTriggerRef\.current\?\.focus\(\)\)/);
  assert.equal(page.match(/requestAnimationFrame\(\(\) => reviewTriggerRef\.current\?\.focus\(\)\)/g)?.length, 2);
  assert.match(page, /progress\.lessons\[activeLesson\.id\]/);
  assert.match(page, /activeLesson\.phrases\[activeLessonProgress\?\.phraseIndex \?\? 0\]/);
  assert.match(page, /onStart=\{startLearning\}/);
  assert.match(page, /onSecondaryAction=\{showPath\}/);
  assert.match(page, /resolveLandingAction/);
  assert.match(page, /landingAction\.kind === "next"/);
  assert.match(page, /const landingActionLabel = progress\.hasStarted \? text\.resumeLearning : text\.startPhrase/);
  assert.match(page, /text\.viewAllLessons\(playableLessons\.length\)/);
  assert.match(page, /lessonViewOpen, setLessonViewOpen/);
  assert.match(page, /activeTab === "learn" && !lessonViewOpen/);
  assert.match(page, /hasStarted=\{progress\.hasStarted\}/);
  assert.match(page, /setHasStarted\(true\);[\s\S]*setLessonViewOpen\(true\)/);
  assert.match(workspace, /activeTab === "learn" \|\| activeTab === "progress"/);
  assert.match(workspace, /activeTab === "learn" && \([\s\S]*<LessonAccordion/);
  assert.match(workspace, /activeTab === "learn" \? "learning-column stage-page" : "learning-column"/);
  assert.match(workspace, /activeTab === "progress" && \([\s\S]*<CoursePath/);
  assert.doesNotMatch(page, /scrollIntoView/);
  assert.match(page, /view === "learn" \? lessonRef\.current : pathRef\.current/);
  assert.match(page, /onLearn=\{showLearn\}/);
  assert.match(page, /onPath=\{showPath\}/);
  assert.match(lesson, /ref=\{ref\} tabIndex=\{-1\}/);
  assert.match(coursePath, /ref=\{ref\}[\s\S]*tabIndex=\{-1\}/);
  assert.match(siteHeader, /onClick=\{onHome\}/);
  assert.match(page, /document\.documentElement\.lang = progress\.locale === "zh" \? "zh-Hant-TW" : "en"/);
  assert.match(landing, /onClick=\{onAudioToggle\}/);
  assert.match(landing, /aria-pressed=\{isPlaying\}/);
  assert.match(audioHook, /let activeAudio: HTMLAudioElement \| null = null/);
  assert.match(audioHook, /activeAudio\.pause\(\)/);
  assert.match(copy, /startPhrase: string/);
  assert.match(copy, /resumeLearning: string/);
  assert.match(copy, /viewAllLessons: \(count\)/);
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
  assert.match(css, /\.lesson-targets button \{[\s\S]*border: 1px solid var\(--line\)[\s\S]*border-radius: 12px[\s\S]*background: white/);
  assert.match(css, /\.lesson-targets button\.active \{[\s\S]*border-color: var\(--jade\)[\s\S]*background: #e7f5ef/);
  assert.match(css, /\.lesson-targets button:hover,[\s\S]*\.lesson-targets button:focus-visible \{[\s\S]*border-color: var\(--jade\)/);
  assert.match(css, /\.lesson-list-button \{[\s\S]*grid-column: 1 \/ -1/);
  assert.match(css, /\.lesson-list article\.active \{[\s\S]*border-color: var\(--jade\)/);
  assert.match(css, /\.media-attribution a \{[\s\S]*min-height: 44px/);
  assert.match(css, /\.use-response textarea \{[\s\S]*min-height: 72px/);
  assert.match(css, /\.use-combination \{[\s\S]*border-radius: 20px/);
  assert.match(css, /\.progress-line i \{[\s\S]*width: 100%/);
  assert.doesNotMatch(css, /\.progress-line i \{[\s\S]*width: 62%/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /--surface-lesson-frame: var\(--cream\)/);
  assert.match(css, /--surface-learning-canvas: var\(--paper\)/);
  assert.match(css, /--surface-current-stage: #f2f8f5/);
  assert.match(css, /\.stage-accordion \.displayed \.stage-trigger \{[\s\S]*background: var\(--surface-current-stage\)/);
  assert.match(css, /\.stage-panel \{[\s\S]*background: var\(--surface-learning-canvas\)/);
  assert.doesNotMatch(css, /linear-gradient\(180deg, #fffdf7 0%, #fffdf7 78%/);
  assert.match(css, /\.bottom-nav \{[\s\S]*position: fixed/);
  assert.match(css, /@media \(max-width: 639px\) \{[\s\S]*\.site-header \{[\s\S]*min-height: 52px/);
  assert.match(css, /@media \(max-width: 639px\) \{[\s\S]*\.learning-column\.stage-page \{[\s\S]*height: calc\(100dvh - 52px - var\(--nav-height\)/);
  assert.match(css, /@media \(max-width: 639px\) \{[\s\S]*\.lesson-heading \{[\s\S]*background: var\(--surface-lesson-frame\)/);
  assert.match(css, /@media \(max-width: 639px\) \{[\s\S]*\.mobile-stage-navigation \{[\s\S]*background: var\(--surface-lesson-frame\)/);
  assert.match(css, /@media \(max-width: 639px\) \{[\s\S]*\.stage-panel \{[\s\S]*overflow: hidden/);
  assert.match(css, /@media \(max-width: 639px\) \{[\s\S]*\.stage-panel-scroll \{[\s\S]*overflow-y: auto/);
  assert.match(css, /@media \(max-width: 639px\) \{[\s\S]*\.lesson-action-zone \{[\s\S]*position: static[\s\S]*background: none/);
  assert.doesNotMatch(css, /@media \(max-width: 639px\) and \(max-height: 760px\) \{[\s\S]*\.mobile-culture-note\[open\]/);
  assert.match(css, /\.desktop-stage-action \{[\s\S]*display: none/);
  assert.doesNotMatch(css, /\.mobile-stage-complete \{[\s\S]*display: flex/);
  assert.equal(audio.subarray(0, 3).toString(), "ID3");
  assert.ok(audio.length > 10_000);
});

test("saved progress and lesson content stay explicit and truthful", async () => {
  const [storage, progressHook, types, content, copy] = await Promise.all([
    readFile(new URL("../app/services/progress-storage.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useLearningProgress.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/types/learning.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/lessons.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/taigi-content.ts", import.meta.url), "utf8"),
  ]);

  assert.match(types, /hasStarted: false/);
  assert.match(types, /version: 5/);
  assert.match(types, /reviewCards: Readonly<Record<string, ReviewCard>>/);
  assert.match(types, /completedPhraseIds: readonly string\[\]/);
  assert.match(storage, /hasStarted: parsed\.hasStarted === true/);
  assert.match(storage, /migrateLegacyProgress/);
  assert.match(storage, /parseVersionFive/);
  assert.match(progressHook, /hydratedRef\.current = true/);
  assert.match(progressHook, /if \(!hydratedRef\.current\) pendingUpdatesRef\.current\.push\(applyUpdate\)/);
  assert.match(content, /status: "prototype"/);
  assert.match(content, /CC BY-ND 3\.0 TW/);
  assert.match(copy, /20 課已開放/);
  assert.doesNotMatch(copy, /7 \/ 12/);
});
