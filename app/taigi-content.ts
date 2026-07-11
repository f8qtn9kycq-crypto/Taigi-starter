import type { Locale } from "./types/learning";

export type { Locale } from "./types/learning";

export type LessonCopy = {
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
  lesson: string;
  lessonSummary: string;
  lessonProgress: string;
  stageLabels: readonly string[];
  learningStages: string;
  currentStep: string;
  completedStep: string;
  lockedStep: string;
  stageCount: (stage: number) => string;
  stageHeadings: readonly string[];
  stageBodies: readonly string[];
  listen: string;
  listening: string;
  listened: (count: number) => string;
  nextSee: string;
  nextSay: string;
  nextRecall: string;
  nextUse: string;
  phrase: string;
  meaning: string;
  tailoLabel: string;
  pojLabel: string;
  romanizationSystem: string;
  audioSourcePrefix: string;
  audioSource: string;
  audioUnavailable: string;
  record: string;
  recording: string;
  microphoneRequest: string;
  stopRecording: string;
  recordAgain: string;
  recordingPrivacy: string;
  microphoneDenied: string;
  microphoneUnsupported: string;
  yourRecording: string;
  recordingLocalOnly: string;
  showAnswer: string;
  cultureText: string;
  addReview: string;
  reviewAdded: string;
  path: string;
  pathSummary: string;
  cardsLeft: string;
  reviewPrompt: string;
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
  primaryNavigation: string;
};

export const copy: Record<Locale, LessonCopy> = {
  zh: {
    homeLabel: "台語起步首頁",
    switchLanguage: "切換為英文",
    eyebrow: "LÍ-HÓ · 你好",
    brandTitle: "台語起步",
    brandRomanized: "Tâi-gí Start",
    heroTitle: "今仔日，講一句台語。",
    heroSub: "先聽、再看、最後講出口。每天三分鐘，慢慢培養台語耳。",
    heroSlogan: "今仔日，講一句台語。",
    heroSupport: "每天 3 分鐘，從聽懂到開口。",
    startPhrase: "開始今日一句",
    startingPhrase: "正在開啟…",
    listenFirst: "先聽發音",
    pausePreview: "暫停發音",
    previewPlaying: "發音播放中",
    previewPaused: "發音已暫停",
    previewLabel: "下一步",
    previewTitle: "聽 → 看 → 說 → 想 → 用",
    previewDuration: "約 3 分鐘",
    resumeLearning: "繼續學習",
    currentProgress: "第 1 課 · 7 / 12 句",
    reviewPending: (count) => `${count} 張待複習`,
    reviewComplete: "今日複習完成",
    reviewStatus: (count) => `待複習 ${count}`,
    progressStatus: (progress) => `進度 ${progress}`,
    day: "第 3 天",
    streak: "連續學習",
    currentLesson: "目前課程",
    lesson: "第 1 課 · 相借問",
    lessonSummary: "從日常招呼開始，把聲音、文字和開口練習連起來。",
    lessonProgress: "7 / 12 句",
    stageLabels: ["聽", "看", "講", "記", "用"],
    learningStages: "學習步驟",
    currentStep: "目前步驟",
    completedStep: "已完成",
    lockedStep: "稍後開放",
    stageCount: (stage) => `步驟 ${stage + 1} / 5`,
    stageHeadings: [
      "先用耳朵記住這句話",
      "把聲音和文字連起來",
      "換你講一次",
      "先想一想，再看答案",
      "把這句話用在生活裡",
    ],
    stageBodies: [
      "毋免急著看文字，先聽兩遍。",
      "先讀漢字，再讀台羅或白話字。",
      "放慢速度，跟著剛才的節奏講。",
      "看到中文意思時，試著在心裡講出台語。",
      "記住語境，比逐字翻譯更自然。",
    ],
    listen: "聽示範",
    listening: "播放中…",
    listened: (count) => `已聽 ${count} 次`,
    nextSee: "下一步：看文字",
    nextSay: "下一步：跟著講",
    nextRecall: "下一步：想一想",
    nextUse: "下一步：生活用法",
    phrase: "你食飽未？",
    meaning: "你吃飽了嗎？／日常關心人的問候",
    tailoLabel: "台羅",
    pojLabel: "白話字",
    romanizationSystem: "羅馬字系統",
    audioSourcePrefix: "原音來源：",
    audioSource: "教育部《臺灣台語常用詞辭典》",
    audioUnavailable: "音檔暫時無法播放，請檢查網路後再試一次。",
    record: "開始錄音",
    recording: "錄音中，再按一次完成",
    microphoneRequest: "正在請求麥克風權限…",
    stopRecording: "停止錄音",
    recordAgain: "重新錄音",
    recordingPrivacy: "正在此裝置錄音；按停止後可以立即回放。",
    microphoneDenied: "無法使用麥克風。你仍可直接跟著示範音檔練習。",
    microphoneUnsupported: "此瀏覽器不支援錄音。你仍可直接開口跟讀。",
    yourRecording: "你的錄音",
    recordingLocalOnly: "錄音只留在這個頁面，不會上傳或保存。",
    showAnswer: "顯示答案",
    cultureText: "「你食飽未？」常是關心人的招呼，不一定真的在問用餐狀況。",
    addReview: "加入今日複習",
    reviewAdded: "已加入複習",
    path: "初學者路徑",
    pathSummary: "15 課 · 約 6 週",
    cardsLeft: "張待複習",
    reviewPrompt: "看到這句，你會怎麼說？",
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
    prototype: "第 1 課可用版本 · 學習紀錄儲存在此裝置",
    navLearn: "學習",
    navReview: "複習",
    navPath: "課程",
    navProgress: "進度",
    primaryNavigation: "主要導覽",
  },
  en: {
    homeLabel: "Tâi-gí Start home",
    switchLanguage: "Switch to Traditional Chinese",
    eyebrow: "TAIGI START",
    brandTitle: "台語起步",
    brandRomanized: "Tâi-gí Start",
    heroTitle: "Speak one Tâi-gí sentence today.",
    heroSub: "Hear it, see it, then say it. Three focused minutes at a time.",
    heroSlogan: "Speak one Tâi-gí sentence today.",
    heroSupport: "Three minutes a day, from understanding to speaking.",
    startPhrase: "Start Today’s Phrase",
    startingPhrase: "Opening…",
    listenFirst: "Listen First",
    pausePreview: "Pause Preview",
    previewPlaying: "Pronunciation preview playing",
    previewPaused: "Pronunciation preview paused",
    previewLabel: "Up next",
    previewTitle: "Hear → See → Say → Recall → Use",
    previewDuration: "About 3 minutes",
    resumeLearning: "Resume learning",
    currentProgress: "Lesson 1 · 7 / 12 phrases",
    reviewPending: (count) => `${count} reviews pending`,
    reviewComplete: "Review complete",
    reviewStatus: (count) => `${count} reviews due`,
    progressStatus: (progress) => `Progress ${progress}`,
    day: "Day 3",
    streak: "learning streak",
    currentLesson: "CURRENT LESSON",
    lesson: "Lesson 1 · Greetings",
    lessonSummary: "Connect the sound, script, and speaking practice of an everyday greeting.",
    lessonProgress: "7 / 12 phrases",
    stageLabels: ["Hear", "See", "Say", "Recall", "Use"],
    learningStages: "Learning stages",
    currentStep: "Current step",
    completedStep: "Completed",
    lockedStep: "Up next",
    stageCount: (stage) => `Step ${stage + 1} of 5`,
    stageHeadings: [
      "Let your ears learn it first",
      "Connect the sound and script",
      "Now say it once",
      "Recall it before checking",
      "Use it in real life",
    ],
    stageBodies: [
      "Listen twice before looking at the words.",
      "Read the Han characters, then the romanization.",
      "Slow down and follow the rhythm you just heard.",
      "See the meaning and try to say the phrase in your head.",
      "Remembering the context is more natural than translating word by word.",
    ],
    listen: "Listen",
    listening: "Playing…",
    listened: (count) => `Listened ${count} time${count === 1 ? "" : "s"}`,
    nextSee: "Next: see the script",
    nextSay: "Next: say it",
    nextRecall: "Next: recall it",
    nextUse: "Next: use it",
    phrase: "你食飽未？",
    meaning: "Have you eaten? / A warm, caring greeting",
    tailoLabel: "Tâi-lô",
    pojLabel: "POJ",
    romanizationSystem: "Romanization system",
    audioSourcePrefix: "Original audio:",
    audioSource: "MOE Dictionary of Frequently-Used Taiwan Taigi",
    audioUnavailable: "The audio could not play. Check your connection and try again.",
    record: "Start recording",
    recording: "Recording, tap again to finish",
    microphoneRequest: "Requesting microphone access…",
    stopRecording: "Stop recording",
    recordAgain: "Record again",
    recordingPrivacy: "Recording on this device. Stop when you are ready to play it back.",
    microphoneDenied: "Microphone access is unavailable. You can still speak along with the example.",
    microphoneUnsupported: "This browser cannot record audio. You can still practice aloud.",
    yourRecording: "Your recording",
    recordingLocalOnly: "This recording stays on this page and is never uploaded or saved.",
    showAnswer: "Show answer",
    cultureText: "“Lí tsia̍h-pá--buē?” is often a caring hello, not a literal question about your meal.",
    addReview: "Add to today’s review",
    reviewAdded: "Added to review",
    path: "Beginner path",
    pathSummary: "15 lessons · about 6 weeks",
    cardsLeft: "cards left",
    reviewPrompt: "How would you say this?",
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
    prototype: "Lesson 1 working release · progress stays on this device",
    navLearn: "Learn",
    navReview: "Review",
    navPath: "Course",
    navProgress: "Progress",
    primaryNavigation: "Primary navigation",
  },
};

export const lessons = [
  { id: 1, zh: "相借問", en: "Greetings" },
  { id: 2, zh: "阮兜的人", en: "My family" },
  { id: 3, zh: "一二三", en: "Numbers" },
  { id: 4, zh: "食飯未？", en: "Food" },
] as const;
