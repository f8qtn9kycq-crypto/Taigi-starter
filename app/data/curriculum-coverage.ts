import type { CurriculumCoverageGroup } from "../types/curriculum";

// Internal content-governance data only. Curriculum references support planning
// and auditing; they are not learner-facing copy or a certification claim.
export const curriculumCoverageGroups: readonly CurriculumCoverageGroup[] = [
  {
    id: "self-family",
    title: { zh: "自我與家庭", en: "Self and family" },
    capabilities: [
      { zh: "介紹自己、家人與居住關係", en: "Introduce oneself, family members, and home relationships" },
      { zh: "用簡短詞句表達個人狀況", en: "Express a personal condition with short phrases" },
    ],
    knownGaps: [
      { zh: "年齡、年級與較完整的親屬關係", en: "Age, school grade, and extended family relationships" },
    ],
    curriculumReferences: ["Ba-Ⅰ-1", "Ba-Ⅰ-2", "Ba-Ⅲ-3", "Bb-Ⅰ-1"],
    lessonNumbers: [2, 6, 13, 15],
  },
  {
    id: "daily-life",
    title: { zh: "日常生活", en: "Daily life" },
    capabilities: [
      { zh: "談數量、飲食、天氣、移動與日常活動", en: "Talk about quantities, food, weather, movement, and routines" },
      { zh: "在餐廳與商店完成基本需求", en: "Handle basic needs in restaurants and shops" },
    ],
    knownGaps: [
      { zh: "日期細節、衣著與較長的生活流程敘述", en: "Detailed dates, clothing, and longer descriptions of routines" },
    ],
    curriculumReferences: ["Bb-Ⅰ-2", "Bb-Ⅰ-3", "Bb-Ⅱ-1", "Bb-Ⅱ-2"],
    lessonNumbers: [3, 4, 5, 7, 8, 11, 14, 16, 17, 18],
  },
  {
    id: "community",
    title: { zh: "社區生活", en: "Community life" },
    capabilities: [
      { zh: "辨認厝邊、朋友與身邊的人", en: "Identify neighbors, friends, and people nearby" },
    ],
    knownGaps: [
      { zh: "公共場所、社區服務與完整指路", en: "Public places, community services, and complete directions" },
    ],
    curriculumReferences: ["Bc-Ⅱ-1", "Bc-Ⅲ-1"],
    lessonNumbers: [9],
  },
  {
    id: "communication",
    title: { zh: "人際溝通", en: "Interpersonal communication" },
    capabilities: [
      { zh: "打招呼、禮貌詢問、邀請與求助", en: "Greet, ask politely, invite, and request help" },
      { zh: "用短句回應並修補基本溝通", en: "Respond with short phrases and repair basic communication" },
    ],
    knownGaps: [
      { zh: "多輪對話、意見表達與較複雜的澄清策略", en: "Multi-turn conversation, opinions, and more complex clarification strategies" },
    ],
    curriculumReferences: ["Bg-Ⅰ-1", "Bg-Ⅰ-2", "Bg-Ⅱ-1", "Bg-Ⅱ-2"],
    lessonNumbers: [1, 10, 12, 19, 20],
  },
] as const;
