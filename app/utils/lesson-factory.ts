import type { GeneratedLesson, GeneratedLessonStep, GeneratedSource, GeneratedTargetPhrase, GeneratedVocabularyItem } from "../types/generated-lesson.ts";
import type { LocalizedText } from "../types/lesson.ts";

export type LessonSpecPhrase = { id: string; hanji: string; tailo: string; poj: string | null; meaning: LocalizedText; cultureNote: LocalizedText; sources: readonly string[]; audioUrl: string };
export type LessonSpecVocabulary = Omit<LessonSpecPhrase, "cultureNote" | "audioUrl">;
export type LessonSpec = { id: string; title: LocalizedText; level: GeneratedLesson["level"]; scenario: LocalizedText; goal: LocalizedText; targetPhrases: readonly LessonSpecPhrase[]; vocabulary: readonly LessonSpecVocabulary[]; sources: readonly string[]; contentStatus: GeneratedLesson["contentStatus"] };

const MOE_LICENSE = "CC BY-ND 3.0 TW";
const MOE_LICENSE_URL = "https://creativecommons.org/licenses/by-nd/3.0/tw/";
const MOE_TITLE: LocalizedText = { zh: "教育部《臺灣台語常用詞辭典》", en: "MOE Dictionary of Frequently-Used Taiwan Taigi" };

function entryIdFromUrl(url: string): string {
  const match = /\/su\/(\d+)\/?$/.exec(url);
  if (!match) throw new Error(`Cannot derive MOE audio entry ID from ${url}`);
  return match[1];
}

export function officialMoeAudioUrl(sourceUrl: string): string {
  const entryId = entryIdFromUrl(sourceUrl);
  const directory = entryId.length > 3 ? entryId.slice(0, -3) : "0";
  return `https://sutian.moe.edu.tw/media/senn/mp3/imtong/subak/${directory}/${entryId}.mp3`;
}

function sourceMetadata(canonicalUrl: string): GeneratedSource { return { title: MOE_TITLE, canonicalUrl, license: MOE_LICENSE, licenseUrl: MOE_LICENSE_URL, speaker: null }; }
function step(type: GeneratedLessonStep["type"], title: LocalizedText, prompt: LocalizedText): GeneratedLessonStep { return { type, title, prompt }; }
function createSteps(spec: LessonSpec): readonly GeneratedLessonStep[] {
  return [
    step("context", { zh: "進入情境", en: "Set the context" }, spec.scenario),
    step("input", { zh: "先看目標句", en: "See the target" }, spec.goal),
    step("listen", { zh: "聽原音", en: "Listen to the source audio" }, { zh: "先聽，再看羅馬字。", en: "Listen before looking at romanization." }),
    step("repeat", { zh: "跟著說", en: "Repeat" }, { zh: "跟著原音慢慢說。", en: "Repeat the phrase at a comfortable pace." }),
    step("constrained-dialogue", { zh: "受限對話", en: "Constrained dialogue" }, spec.goal),
    step("feedback", { zh: "確認意思", en: "Check meaning" }, { zh: "確認你說的是目標意思。", en: "Check that your phrase matches the intended meaning." }),
    step("review", { zh: "回想", en: "Review" }, { zh: "遮住答案，試著自己說。", en: "Hide the answer and try to say it from memory." }),
    step("completion", { zh: "完成口說任務", en: "Complete the speaking task" }, spec.goal),
  ];
}

function createTargetPhrase(phrase: LessonSpecPhrase, contentStatus: LessonSpec["contentStatus"]): GeneratedTargetPhrase {
  const sourceUrl = Array.isArray(phrase.sources) && typeof phrase.sources[0] === "string" ? phrase.sources[0] : "";
  const audioUrl = typeof phrase.audioUrl === "string" ? phrase.audioUrl : "";
  let originalUrl = "";
  try {
    originalUrl = officialMoeAudioUrl(sourceUrl);
  } catch {
    // Keep the generated record deterministic so validation can report the missing or invalid source field.
  }
  return {
    id: phrase.id,
    hanji: phrase.hanji,
    tailo: phrase.tailo,
    poj: phrase.poj,
    meaning: phrase.meaning,
    cultureNote: phrase.cultureNote,
    sources: Array.isArray(phrase.sources) ? phrase.sources : [],
    contentStatus,
    source: sourceMetadata(sourceUrl),
    audio: { audioUrl, originalUrl, sourceUrl, license: MOE_LICENSE, licenseUrl: MOE_LICENSE_URL, speaker: null, isUnmodifiedOriginal: true },
  };
}

function createVocabularyItem(item: LessonSpecVocabulary, contentStatus: LessonSpec["contentStatus"]): GeneratedVocabularyItem { return { ...item, contentStatus }; }

export function generateLesson(spec: LessonSpec, generatedFrom: string): GeneratedLesson {
  const targetPhrases = (Array.isArray(spec.targetPhrases) ? spec.targetPhrases : []).map((phrase) => createTargetPhrase(phrase, spec.contentStatus));
  return {
    version: 1,
    generatedFrom,
    id: spec.id,
    title: spec.title,
    level: spec.level,
    scenario: spec.scenario,
    goal: spec.goal,
    targetPhrases,
    vocabulary: (Array.isArray(spec.vocabulary) ? spec.vocabulary : []).map((item) => createVocabularyItem(item, spec.contentStatus)),
    steps: createSteps(spec),
    reviewItems: targetPhrases.map((phrase) => ({ id: `${spec.id}-review-${phrase.id}`, targetPhraseId: phrase.id, prompt: { zh: `看到意思時，試著說出「${phrase.hanji}」。`, en: `When you see the meaning, try to say “${phrase.hanji}.”` } })),
    sources: Array.isArray(spec.sources) ? [...new Set(spec.sources)] : [],
    contentStatus: spec.contentStatus,
  };
}
