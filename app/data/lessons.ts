import {
  LESSON_STAGE_IDS,
  type Lesson,
  type PlayableLesson,
} from "../types/lesson.ts";

const lessonOneStages = LESSON_STAGE_IDS.map((id) => ({
  id,
  estimatedMinutes: 1,
}));

export const prototypeLesson: PlayableLesson = {
  id: "lesson-1-greetings",
  number: 1,
  title: { zh: "相借問", en: "Greetings" },
  secondaryTitle: { zh: "Greetings", en: "相借問" },
  summary: {
    zh: "從一句日常關心開始，把聲音、文字和開口練習連起來。",
    en: "Connect sound, script, and speaking through one caring everyday greeting.",
  },
  status: "prototype",
  durationMinutes: 5,
  stages: lessonOneStages,
  phrases: [
    {
      id: "li-tsiah-pa-bue",
      hanji: "你食飽未？",
      tailo: "Lí tsia̍h-pá--buē?",
      poj: "Lí chia̍h-pá--bōe?",
      meaning: {
        zh: "你吃飽了嗎？／日常關心人的問候",
        en: "Have you eaten? / A warm, caring greeting",
      },
      cultureNote: {
        zh: "「你食飽未？」常是關心人的招呼，不一定真的在問用餐狀況。",
        en: "“Lí tsia̍h-pá--buē?” is often a caring hello, not a literal question about your meal.",
      },
      audioUrl: "/audio/li-tsiah-pa-bue.mp3",
      source: {
        title: {
          zh: "教育部《臺灣台語常用詞辭典》",
          en: "MOE Dictionary of Frequently-Used Taiwan Taigi",
        },
        canonicalUrl: "https://sutian.moe.edu.tw/und-hani/su/1653/",
        license: "CC BY-ND 3.0 TW",
        licenseUrl: "https://creativecommons.org/licenses/by-nd/3.0/tw/",
        speaker: null,
      },
    },
  ],
};

export const lessonCatalog: readonly Lesson[] = [
  prototypeLesson,
  {
    id: "lesson-2-family",
    number: 2,
    title: { zh: "阮兜的人", en: "My family" },
    secondaryTitle: { zh: "My family", en: "阮兜的人" },
    summary: { zh: "規劃中", en: "Planned" },
    status: "planned",
    phrases: [],
  },
  {
    id: "lesson-3-numbers",
    number: 3,
    title: { zh: "一二三", en: "Numbers" },
    secondaryTitle: { zh: "Numbers", en: "一二三" },
    summary: { zh: "規劃中", en: "Planned" },
    status: "planned",
    phrases: [],
  },
] as const;
