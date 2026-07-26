import type { LessonPackagePhrase } from "../types/lesson-package.ts";

const MOE_AUDIO_ROOT = "https://sutian.moe.edu.tw/media/senn/mp3/imtong/subak";
const LICENSE = "CC BY-ND 3.0 TW";
const LICENSE_URL = "https://creativecommons.org/licenses/by-nd/3.0/tw/";

export const officialMoeAudioUrl = (canonicalUrl: string): string => {
  const match = canonicalUrl.match(/\/su\/(\d+)\/$/);
  if (!match) throw new Error(`Unsupported MOE source URL: ${canonicalUrl}`);

  const entryId = match[1];
  const directory = entryId.length > 3 ? entryId.slice(0, -3) : "0";
  return `${MOE_AUDIO_ROOT}/${directory}/${entryId}.mp3`;
};

export const lessonAudioUrl = (lessonNumber: number, phraseId: string): string => (
  `/audio/lesson-${lessonNumber <= 15 ? "2-15" : "16-18"}/${phraseId}.mp3`
);

export const createLessonPackageAudio = (
  lessonNumber: number,
  phraseId: string,
  canonicalUrl: string,
  audioUrlOverride?: string,
): LessonPackagePhrase["audio"] => ({
  status: "added",
  audioUrl: audioUrlOverride ?? lessonAudioUrl(lessonNumber, phraseId),
  originalUrl: officialMoeAudioUrl(canonicalUrl),
  license: LICENSE,
  licenseUrl: LICENSE_URL,
  isUnmodifiedOriginal: true,
  note: {
    zh: "教育部原始 MP3 已加入，保留原檔、來源、授權與 attribution；未剪輯或重新編碼。",
    en: "The original MOE MP3 is included with its source, licence, and attribution; it is not edited or re-encoded.",
  },
});
