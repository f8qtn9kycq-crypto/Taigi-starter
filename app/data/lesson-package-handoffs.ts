import { lessonPackages } from "./lesson-packages.ts";
import type {
  LessonPackage,
  LessonPackageHandoff,
} from "../types/lesson-package.ts";
const LICENSE = "CC BY-ND 3.0 TW";
const LICENSE_URL = "https://creativecommons.org/licenses/by-nd/3.0/tw/";
export { officialMoeAudioUrl } from "../utils/lesson-audio.ts";

const ownerRiskAcceptance = {
  acceptedBy: "product-owner",
  acceptedAt: "2026-07-26T00:00:00.000Z",
  reason: {
    zh: "本次發布接受教師審核尚未完成的風險；內容仍保留完整 teacher review 欄位，後續可補上審核結果。",
    en: "This release accepts the risk of incomplete teacher review; the full teacher review fields remain for follow-up.",
  },
} as const;

const createHandoff = (lessonPackage: LessonPackage): LessonPackageHandoff => ({
  package: lessonPackage,
  audioAttribution: lessonPackage.phrases.map((phrase) => ({
    phraseId: phrase.id,
    audioUrl: phrase.audio.audioUrl,
    sourceUrl: phrase.source.canonicalUrl,
    license: LICENSE,
    licenseUrl: LICENSE_URL,
    speaker: phrase.source.speaker,
    isUnmodifiedOriginal: true,
    originalUrl: phrase.audio.originalUrl,
  })),
  mobileFlowEvidence: [{
    viewport: "390x844",
    checkedAt: "2026-07-26T10:10:35+08:00",
    evidenceRef: "docs/qa/lesson-2-18-390x844.md",
  }],
  ownerRiskAcceptance,
});

export const lessonPackageHandoffs: readonly LessonPackageHandoff[] = lessonPackages
  .filter((lessonPackage) => lessonPackage.number >= 2 && lessonPackage.number <= 18)
  .map(createHandoff);
