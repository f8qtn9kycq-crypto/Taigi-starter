import type { CurriculumCoverageGroup } from "../types/curriculum";

export const elementaryTaiwaneseCurriculumUrl =
  "https://www.naer.edu.tw/upload/1/16/doc/1278/%E5%8D%81%E4%BA%8C%E5%B9%B4%E5%9C%8B%E6%B0%91%E5%9F%BA%E6%9C%AC%E6%95%99%E8%82%B2%E8%AA%B2%E7%A8%8B%E7%B6%B1%E8%A6%81%E8%AA%9E%E6%96%87%E9%A0%98%E5%9F%9F-%E6%9C%AC%E5%9C%9F%E8%AA%9E%E6%96%87%28%E9%96%A9%E5%8D%97%E8%AA%9E%E6%96%87%29-%E7%99%BC%E5%B8%83%E7%89%88.pdf";

export const curriculumCoverageGroups: readonly CurriculumCoverageGroup[] = [
  {
    id: "self-family",
    title: { zh: "自我與家庭", en: "Self and family" },
    curriculumReferences: ["Ba-Ⅰ-1", "Ba-Ⅰ-2", "Ba-Ⅲ-3", "Bb-Ⅰ-1"],
    lessonNumbers: [2, 6, 13, 15],
  },
  {
    id: "daily-life",
    title: { zh: "日常生活", en: "Daily life" },
    curriculumReferences: ["Bb-Ⅰ-2", "Bb-Ⅰ-3", "Bb-Ⅱ-1", "Bb-Ⅱ-2"],
    lessonNumbers: [3, 4, 5, 7, 8, 11, 14, 16, 17, 18],
  },
  {
    id: "community",
    title: { zh: "社區生活", en: "Community life" },
    curriculumReferences: ["Bc-Ⅱ-1", "Bc-Ⅲ-1"],
    lessonNumbers: [9],
  },
  {
    id: "communication",
    title: { zh: "人際溝通", en: "Interpersonal communication" },
    curriculumReferences: ["Bg-Ⅰ-1", "Bg-Ⅰ-2", "Bg-Ⅱ-1", "Bg-Ⅱ-2"],
    lessonNumbers: [1, 10, 12, 19, 20],
  },
] as const;
