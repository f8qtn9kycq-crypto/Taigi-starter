import type {
  LessonPackage,
  LessonPackagePhrase,
  TeacherReview,
  TeacherReviewCheck,
  LessonUseCombination,
} from "../../types/lesson-package.ts";
import type { LessonSource, LocalizedText } from "../../types/lesson-domain.ts";

export const moeSource = (canonicalUrl: string): LessonSource => ({
  title: {
    zh: "教育部《臺灣台語常用詞辭典》",
    en: "MOE Dictionary of Frequently-Used Taiwan Taigi",
  },
  canonicalUrl,
  license: "CC BY-ND 3.0 TW",
  licenseUrl: "https://creativecommons.org/licenses/by-nd/3.0/tw/",
  speaker: null,
});

export const makePhrase = (
  phrase: Omit<LessonPackagePhrase, "audio">,
): Omit<LessonPackagePhrase, "audio"> => phrase;

export const stagePlan: readonly LocalizedText[] = [
  { zh: "聽：先辨認關鍵詞的聲音", en: "Hear: recognize the key words by sound" },
  { zh: "看：連結漢字與台羅", en: "See: connect Han characters and Tâi-lô" },
  { zh: "講：用短詞組跟讀", en: "Say: repeat a short phrase" },
  { zh: "記：不看答案回想意思", en: "Recall: remember the meaning before checking" },
  { zh: "用：放進自己的生活情境", en: "Use: place it in an everyday context" },
];

const teacherChecks: readonly TeacherReviewCheck[] = [
  {
    id: "orthography",
    label: { zh: "確認漢字、台羅與可接受讀音變體", en: "Confirm Han characters, Tâi-lô, and acceptable pronunciation variants" },
    status: "pending",
  },
  {
    id: "pronunciation",
    label: { zh: "確認示範音與地區讀音呈現順序", en: "Confirm the model pronunciation and regional variant order" },
    status: "pending",
  },
  {
    id: "context",
    label: { zh: "確認初學者語境自然，避免只背孤立字詞", en: "Confirm the beginner context is natural rather than isolated memorization" },
    status: "pending",
  },
  {
    id: "audio",
    label: { zh: "確認音檔為未修改原檔，並保留完整 attribution", en: "Confirm audio remains an unmodified original with complete attribution" },
    status: "pending",
  },
];

export const requiredTeacherReview: TeacherReview = {
  status: "required",
  reviewer: null,
  reviewedAt: null,
  checks: teacherChecks,
};

export type RawLessonPackage = Omit<LessonPackage, "pathOrder" | "phrases"> & {
  phrases: readonly (Omit<LessonPackagePhrase, "audio"> & {
    useCombination?: LessonUseCombination;
  })[];
};
