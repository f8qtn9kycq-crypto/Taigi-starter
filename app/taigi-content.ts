import type { Locale } from "./types/learning";
import type { LessonStageId } from "./types/lesson";

export type { Locale } from "./types/learning";

export type LessonCopy = {
  locale: Locale;
  homeLabel: string;
  switchLanguage: string;
  eyebrow: string;
  brandTitle: string;
  brandRomanized: string;
  heroTitle: string;
  heroSub: string;
  heroSlogan: string;
  heroSupport: string;
  startPhrase: string;
  startingPhrase: string;
  listenFirst: string;
  pausePreview: string;
  previewPlaying: string;
  previewPaused: string;
  previewLabel: string;
  previewTitle: string;
  previewDuration: string;
  resumeLearning: string;
  currentProgress: string;
  reviewPending: (count: number) => string;
  reviewComplete: string;
  reviewStatus: (count: number) => string;
  progressStatus: (progress: string) => string;
  day: string;
  streak: string;
  currentLesson: string;
  lessonNumber: (number: number) => string;
  lesson: string;
  lessonSummary: string;
  lessonMission: string;
  useCombination: string;
  useCombinationMeaning: string;
  verifySource: string;
  contextNote: string;
  lessonTargets: string;
  phraseSelectorLabel: (current: number, total: number) => string;
  phraseSelectorOption: (phrase: string, meaning: string, current: number, total: number) => string;
  completedPhrase: string;
  lessonRhythm: string;
  lessonTime: string;
  stageTime: (minutes: number) => string;
  lessonProgress: string;
  phraseProgress: (current: number, total: number) => string;
  stageLabels: Record<LessonStageId, string>;
  learningStages: string;
  currentStep: string;
  completedStep: string;
  lockedStep: string;
  previousStage: string;
  nextUnlockedStage: string;
  previousStageTo: (stage: string) => string;
  nextStageTo: (stage: string) => string;
  unlockedStageHint: (current: string, next: string) => string;
  swipeRightPrevious: string;
  swipeLeftNext: string;
  stageCount: (stage: number, total: number) => string;
  stageProgress: (stage: number, total: number, label: string) => string;
  hearCompletionHint: string;
  stageHeadings: Record<LessonStageId, string>;
  stageBodies: Record<LessonStageId, string>;
  listen: string;
  listening: string;
  listened: (count: number) => string;
  nextSee: string;
  nextSay: string;
  completeSee: string;
  nextRecall: string;
  nextUse: string;
  usePrompt: string;
  usePlaceholder: string;
  useCompletionRequired: string;
  tailoLabel: string;
  pojLabel: string;
  romanizationSystem: string;
  audioSourcePrefix: string;
  audioUnavailable: string;
  continueWithoutAudio: string;
  record: string;
  recording: string;
  microphoneRequest: string;
  microphoneChecking: string;
  microphoneEnable: string;
  microphoneEnableHint: string;
  stopRecording: string;
  confirmSay: string;
  sayCompleted: string;
  sayCompletionRequired: string;
  recordAgain: string;
  retryMicrophone: string;
  recordingPrivacy: string;
  microphoneDenied: string;
  microphoneUnsupported: string;
  yourRecording: string;
  recordingLocalOnly: string;
  showAnswer: string;
  recallAttempt: string;
  addReview: string;
  reviewAdded: string;
  nextPhrase: (phrase: string) => string;
  lessonComplete: string;
  path: string;
  pathSummary: string;
  curriculumEyebrow: string;
  curriculumTitle: string;
  curriculumSummary: string;
  curriculumLessonCount: (count: number) => string;
  curriculumDisclaimer: string;
  curriculumSource: string;
  cardsLeft: string;
  reviewPrompt: string;
  reviewExplanation: string;
  rate: string;
  again: string;
  hard: string;
  easy: string;
  againHint: string;
  hardHint: string;
  easyHint: string;
  nextReview: (date: string) => string;
  allDone: string;
  close: string;
  prototype: string;
  navLearn: string;
  navReview: string;
  navPath: string;
  navProgress: string;
  navFeedback: string;
  primaryNavigation: string;
  startLesson: string;
  continueLesson: (stage: number, total: number) => string;
  lessonCompleted: string;
  lessonDuration: (minutes: number) => string;
  lessonProgressLabel: (completed: number, total: number) => string;
  lessonLocked: string;
  planned: string;
};

export const copy: Record<Locale, LessonCopy> = {
  zh: {
    locale: "zh",
    homeLabel: "台語起步首頁",
    switchLanguage: "切換為英文",
    eyebrow: "LÍ-HÓ · 你好",
    brandTitle: "台語起步",
    brandRomanized: "Tâi-gí Start",
    heroTitle: "今仔日，講一句台語。",
    heroSub: "先聽、再看、最後講出口。每天五分鐘，慢慢培養台語耳。",
    heroSlogan: "今仔日，講一句台語。",
    heroSupport: "每天 5 分鐘，從聽懂到開口。",
    startPhrase: "開始今日一句",
    startingPhrase: "正在開啟…",
    listenFirst: "先聽發音",
    pausePreview: "暫停發音",
    previewPlaying: "發音播放中",
    previewPaused: "發音已暫停",
    previewLabel: "下一步",
    previewTitle: "聽 → 看 → 說 → 想 → 用",
    previewDuration: "約 5 分鐘",
    resumeLearning: "繼續學習",
    currentProgress: "第 1 課 · 原型體驗",
    reviewPending: (count) => `${count} 張待複習`,
    reviewComplete: "今日複習完成",
    reviewStatus: (count) => `待複習 ${count}`,
    progressStatus: (progress) => `進度 ${progress}`,
    day: "第 3 天",
    streak: "連續學習",
    currentLesson: "目前課程",
    lessonNumber: (number) => `第 ${number} 課`,
    lesson: "第 1 課 · 相借問",
    lessonSummary: "從日常招呼開始，把聲音、文字和開口練習連起來。",
    lessonMission: "生活任務",
    useCombination: "用：詞組組合",
    useCombinationMeaning: "這個組合的意思",
    verifySource: "查看教育部來源",
    contextNote: "語境補充",
    lessonTargets: "本課目標詞",
    phraseSelectorLabel: (current, total) => `選擇要練習的詞語（${current}/${total}）`,
    phraseSelectorOption: (phrase, _meaning, current, total) => `${phrase}，第 ${current} 個，共 ${total} 個`,
    completedPhrase: "本次已完成",
    lessonRhythm: "先聽 → 看文字 → 開口講 → 回想 → 生活運用",
    lessonTime: "約 5 分鐘",
    stageTime: (minutes) => `約 ${minutes} 分鐘`,
    lessonProgress: "1 個目標詞",
    phraseProgress: (current, total) => `第 ${current} / ${total} 個詞語`,
    stageLabels: {
      hear: "聽",
      see: "看",
      say: "講",
      recall: "記",
      use: "用",
    },
    learningStages: "學習步驟",
    currentStep: "目前步驟",
    completedStep: "已完成",
    lockedStep: "稍後開放",
    previousStage: "上一步",
    nextUnlockedStage: "下一步",
    previousStageTo: (stage) => `上一步：${stage}`,
    nextStageTo: (stage) => `下一步：${stage}`,
    unlockedStageHint: (current, next) => `「${current}」完成。按右方「下一步：${next}」或向左滑，進入「${next}」。`,
    swipeRightPrevious: "向右滑回上一步",
    swipeLeftNext: "向左滑到下一步",
    stageCount: (stage, total) => `步驟 ${stage + 1} / ${total}`,
    stageProgress: (stage, total, label) => `${stage + 1} / ${total} · ${label}`,
    hearCompletionHint: "請先播放一次示範音檔，才可以進入看文字。",
    stageHeadings: {
      hear: "先用耳朵記住這句話",
      see: "把聲音和文字連起來",
      say: "換你講一次",
      recall: "先想一想，再看答案",
      use: "把這句話用在生活裡",
    },
    stageBodies: {
      hear: "毋免急著看文字，先聽兩遍。",
      see: "先讀漢字，再讀台羅或白話字。",
      say: "放慢速度，跟著剛才的節奏講。",
      recall: "看到中文意思時，試著在心裡講出台語。",
      use: "記住語境，比逐字翻譯更自然。",
    },
    listen: "聽示範",
    listening: "播放中…",
    listened: (count) => `已聽 ${count} 次`,
    nextSee: "下一步：看文字",
    nextSay: "下一步：跟著講",
    completeSee: "我看完了，解鎖下一頁",
    nextRecall: "下一步：想一想",
    nextUse: "下一步：生活用法",
    usePrompt: "你會在什麼情境用這句？",
    usePlaceholder: "寫一個自己的生活情境…",
    useCompletionRequired: "先寫下一個自己的情境，再完成這一步。",
    tailoLabel: "台羅",
    pojLabel: "白話字",
    romanizationSystem: "羅馬字系統",
    audioSourcePrefix: "原音來源：",
    audioUnavailable: "音檔暫時無法播放，請檢查網路後再試一次。",
    continueWithoutAudio: "音檔無法播放，先看文字",
    record: "開始錄音",
    recording: "錄音中，再按一次完成",
    microphoneRequest: "正在請求麥克風權限…",
    microphoneChecking: "正在檢查錄音功能…",
    microphoneEnable: "檢查麥克風並開始錄音",
    microphoneEnableHint: "確認瀏覽器可用後才會開始錄音；若不支援，會引導你改用 Safari。",
    stopRecording: "停止錄音",
    confirmSay: "我已經跟讀",
    sayCompleted: "已完成一次跟讀，可以進下一步。",
    sayCompletionRequired: "先完成一次跟讀，才可以進入回想。",
    recordAgain: "重新錄音",
    retryMicrophone: "再試一次錄音",
    recordingPrivacy: "正在此裝置錄音；按停止後可以立即回放。",
    microphoneDenied: "無法使用麥克風。你仍可直接跟著示範音檔練習。",
    microphoneUnsupported: "此瀏覽器不支援錄音。你仍可直接開口跟讀。",
    yourRecording: "你的錄音",
    recordingLocalOnly: "錄音只留在這個頁面，不會上傳或保存。",
    showAnswer: "顯示答案",
    recallAttempt: "我已先回想",
    addReview: "加入今日複習",
    reviewAdded: "已加入複習",
    nextPhrase: (phrase) => `下一個詞：${phrase}`,
    lessonComplete: "這課完成了！",
    path: "初學者路徑",
    pathSummary: "20 課已開放",
    curriculumEyebrow: "國小台語課綱參考",
    curriculumTitle: "生活主題涵蓋",
    curriculumSummary: "看看目前 20 課練到哪些生活溝通主題。點開主題可查看相關課程。",
    curriculumLessonCount: (count) => `${count} 課`,
    curriculumDisclaimer: "依國家教育研究院閩南語文課綱整理，供學習方向參考；不是教育部認證教材。",
    curriculumSource: "查看官方課綱",
    cardsLeft: "張待複習",
    reviewPrompt: "看到這句，你會怎麼說？",
    reviewExplanation: "複習會在適合的時間重新出題。選擇「忘了／有點難／很熟」，系統就會安排下次練習時間。",
    rate: "這次記得多熟？",
    again: "忘了",
    hard: "有點難",
    easy: "很熟",
    againHint: "10 分鐘後",
    hardHint: "明天",
    easyHint: "4 天後",
    nextReview: (date) => `下次複習：${date}`,
    allDone: "今日複習完成",
    close: "關閉",
    prototype: "第 1–20 課已開放 · 學習紀錄儲存在此裝置",
    navLearn: "學習",
    navReview: "複習",
    navPath: "課程",
    navProgress: "進度",
    navFeedback: "回饋",
    primaryNavigation: "主要導覽",
    startLesson: "開始",
    continueLesson: (stage, total) => `繼續 · ${stage}/${total}`,
    lessonCompleted: "✓ 已完成",
    lessonDuration: (minutes) => `約 ${minutes} 分鐘`,
    lessonProgressLabel: (completed, total) => `課程進度：${completed}/${total}`,
    lessonLocked: "尚未開放",
    planned: "規劃中",
  },
  en: {
    locale: "en",
    homeLabel: "Tâi-gí Start home",
    switchLanguage: "Switch to Traditional Chinese",
    eyebrow: "TAIGI START",
    brandTitle: "台語起步",
    brandRomanized: "Tâi-gí Start",
    heroTitle: "Speak one Tâi-gí sentence today.",
    heroSub: "Hear it, see it, then say it. Five focused minutes at a time.",
    heroSlogan: "Speak one Tâi-gí sentence today.",
    heroSupport: "Five minutes a day, from understanding to speaking.",
    startPhrase: "Start Today’s Phrase",
    startingPhrase: "Opening…",
    listenFirst: "Listen First",
    pausePreview: "Pause Preview",
    previewPlaying: "Pronunciation preview playing",
    previewPaused: "Pronunciation preview paused",
    previewLabel: "Up next",
    previewTitle: "Hear → See → Say → Recall → Use",
    previewDuration: "About 5 minutes",
    resumeLearning: "Resume learning",
    currentProgress: "Lesson 1 · Prototype",
    reviewPending: (count) => `${count} reviews pending`,
    reviewComplete: "Review complete",
    reviewStatus: (count) => `${count} reviews due`,
    progressStatus: (progress) => `Progress ${progress}`,
    day: "Day 3",
    streak: "learning streak",
    currentLesson: "CURRENT LESSON",
    lessonNumber: (number) => `Lesson ${number}`,
    lesson: "Lesson 1 · Greetings",
    lessonSummary: "Connect the sound, script, and speaking practice of an everyday greeting.",
    lessonMission: "Real-life task",
    useCombination: "Use: build a phrase",
    useCombinationMeaning: "Meaning of this combination",
    verifySource: "Verify with the MOE source",
    contextNote: "Context note",
    lessonTargets: "Target phrases",
    phraseSelectorLabel: (current, total) => `Choose a phrase to practise (${current}/${total})`,
    phraseSelectorOption: (phrase, meaning, current, total) => `${phrase}, ${meaning}, ${current} of ${total}`,
    completedPhrase: "Completed this session",
    lessonRhythm: "Hear → see → say → recall → use",
    lessonTime: "About 5 minutes",
    stageTime: (minutes) => `About ${minutes} minute${minutes === 1 ? "" : "s"}`,
    lessonProgress: "1 target phrase",
    phraseProgress: (current, total) => `Phrase ${current} of ${total}`,
    stageLabels: {
      hear: "Hear",
      see: "See",
      say: "Say",
      recall: "Recall",
      use: "Use",
    },
    learningStages: "Learning stages",
    currentStep: "Current step",
    completedStep: "Completed",
    lockedStep: "Up next",
    previousStage: "Previous",
    nextUnlockedStage: "Next",
    previousStageTo: (stage) => `Previous: ${stage}`,
    nextStageTo: (stage) => `Next: ${stage}`,
    unlockedStageHint: (current, next) => `${current} complete. Use “Next: ${next}” on the right or swipe left to open ${next}.`,
    swipeRightPrevious: "Swipe right for the previous step",
    swipeLeftNext: "Swipe left for the next step",
    stageCount: (stage, total) => `Step ${stage + 1} of ${total}`,
    stageProgress: (stage, total, label) => `${stage + 1} / ${total} · ${label}`,
    hearCompletionHint: "Play the example once before moving on to see the script.",
    stageHeadings: {
      hear: "Let your ears learn it first",
      see: "Connect the sound and script",
      say: "Now say it once",
      recall: "Recall it before checking",
      use: "Use it in real life",
    },
    stageBodies: {
      hear: "Listen twice before looking at the words.",
      see: "Read the Han characters, then the romanization.",
      say: "Slow down and follow the rhythm you just heard.",
      recall: "See the meaning and try to say the phrase in your head.",
      use: "Remembering the context is more natural than translating word by word.",
    },
    listen: "Listen",
    listening: "Playing…",
    listened: (count) => `Listened ${count} time${count === 1 ? "" : "s"}`,
    nextSee: "Next: see the script",
    nextSay: "Next: say it",
    completeSee: "I’ve read it — unlock the next page",
    nextRecall: "Next: recall it",
    nextUse: "Next: use it",
    usePrompt: "When would you use this phrase?",
    usePlaceholder: "Write one everyday situation…",
    useCompletionRequired: "Add one personal situation before completing this step.",
    tailoLabel: "Tâi-lô",
    pojLabel: "POJ",
    romanizationSystem: "Romanization system",
    audioSourcePrefix: "Original audio:",
    audioUnavailable: "The audio could not play. Check your connection and try again.",
    continueWithoutAudio: "Audio unavailable, continue to the script",
    record: "Start recording",
    recording: "Recording, tap again to finish",
    microphoneRequest: "Requesting microphone access…",
    microphoneChecking: "Checking recording support…",
    microphoneEnable: "Check microphone and start recording",
    microphoneEnableHint: "Recording starts only after this browser confirms support. If unavailable, open the lesson in Safari.",
    stopRecording: "Stop recording",
    confirmSay: "I said it aloud",
    sayCompleted: "Speaking practice complete. You can continue.",
    sayCompletionRequired: "Complete one speaking attempt before continuing to Recall.",
    recordAgain: "Record again",
    retryMicrophone: "Try recording again",
    recordingPrivacy: "Recording on this device. Stop when you are ready to play it back.",
    microphoneDenied: "Microphone access is unavailable. You can still speak along with the example.",
    microphoneUnsupported: "This browser cannot record audio. You can still practice aloud.",
    yourRecording: "Your recording",
    recordingLocalOnly: "This recording stays on this page and is never uploaded or saved.",
    showAnswer: "Show answer",
    recallAttempt: "I tried to recall it",
    addReview: "Add to today’s review",
    reviewAdded: "Added to review",
    nextPhrase: (phrase) => `Next phrase: ${phrase}`,
    lessonComplete: "Lesson complete!",
    path: "Beginner path",
    pathSummary: "20 lessons available",
    curriculumEyebrow: "ELEMENTARY CURRICULUM REFERENCE",
    curriculumTitle: "Everyday topic coverage",
    curriculumSummary: "See which everyday communication themes the current 20 lessons practise. Open a theme to view its lessons.",
    curriculumLessonCount: (count) => `${count} ${count === 1 ? "lesson" : "lessons"}`,
    curriculumDisclaimer: "Mapped with reference to the NAER Taiwanese-language curriculum. This is not MOE-certified teaching material.",
    curriculumSource: "View the official curriculum",
    cardsLeft: "cards left",
    reviewPrompt: "How would you say this?",
    reviewExplanation: "Review brings phrases back when they are due. Choose Again, Hard, or Easy to schedule when you practise each phrase next.",
    rate: "How well did you remember?",
    again: "Again",
    hard: "Hard",
    easy: "Easy",
    againHint: "10 minutes",
    hardHint: "Tomorrow",
    easyHint: "4 days",
    nextReview: (date) => `Next review: ${date}`,
    allDone: "Today’s review is complete",
    close: "Close",
    prototype: "Lessons 1–20 working release · progress stays on this device",
    navLearn: "Learn",
    navReview: "Review",
    navPath: "Course",
    navProgress: "Progress",
    navFeedback: "Feedback",
    primaryNavigation: "Primary navigation",
    startLesson: "Start",
    continueLesson: (stage, total) => `Continue · ${stage}/${total}`,
    lessonCompleted: "✓ Completed",
    lessonDuration: (minutes) => `About ${minutes} min`,
    lessonProgressLabel: (completed, total) => `Lesson progress: ${completed} of ${total}`,
    lessonLocked: "Locked",
    planned: "Planned",
  },
};
