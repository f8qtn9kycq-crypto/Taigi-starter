import type {
  LessonPackageHandoff,
} from "../types/lesson-package.ts";
import {
  LESSON_STAGE_IDS,
  type LessonAudioAttribution,
  type LessonPhrase,
  type PlayableLesson,
} from "../types/lesson.ts";
import {
  isValidIsoTimestamp,
  validateLessonPackages,
  type LessonPackageValidationIssue,
} from "./lesson-package-validation.ts";

export type LessonPackageHandoffValidationIssue = LessonPackageValidationIssue;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => (
  typeof value === "object" && value !== null && !Array.isArray(value)
);

const isNonEmptyString = (value: unknown): value is string => (
  typeof value === "string" && value.trim().length > 0
);

const isHttpsUrl = (value: unknown): value is string => (
  isNonEmptyString(value) && value.startsWith("https://")
);

const addIssue = (
  issues: LessonPackageHandoffValidationIssue[],
  path: string,
  message: string,
): void => {
  issues.push({ path, message });
};

const validateAudioAttribution = (
  value: unknown,
  path: string,
  phraseIds: ReadonlySet<string>,
  issues: LessonPackageHandoffValidationIssue[],
): void => {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "must include one attribution record for every phrase");
    return;
  }

  const seenPhraseIds = new Set<string>();
  for (const [index, attribution] of value.entries()) {
    const attributionPath = `${path}[${index}]`;
    if (!isRecord(attribution)) {
      addIssue(issues, attributionPath, "must be an audio attribution record");
      continue;
    }

    const phraseId = attribution.phraseId;
    if (!isNonEmptyString(phraseId)) {
      addIssue(issues, `${attributionPath}.phraseId`, "must be a non-empty string");
    } else if (!phraseIds.has(phraseId)) {
      addIssue(issues, `${attributionPath}.phraseId`, "must match a package phrase");
    } else if (seenPhraseIds.has(phraseId)) {
      addIssue(issues, `${attributionPath}.phraseId`, "must be unique");
    } else {
      seenPhraseIds.add(phraseId);
    }

    if (!isNonEmptyString(attribution.audioUrl)) {
      addIssue(issues, `${attributionPath}.audioUrl`, "must reference an audio asset");
    }
    if (!isHttpsUrl(attribution.sourceUrl)) {
      addIssue(issues, `${attributionPath}.sourceUrl`, "must be an HTTPS attribution source");
    }
    if (!isNonEmptyString(attribution.license)) {
      addIssue(issues, `${attributionPath}.license`, "must identify the audio licence");
    }
    if (!isHttpsUrl(attribution.licenseUrl)) {
      addIssue(issues, `${attributionPath}.licenseUrl`, "must be an HTTPS licence URL");
    }
    if (attribution.speaker !== null && !isNonEmptyString(attribution.speaker)) {
      addIssue(issues, `${attributionPath}.speaker`, "must be a name or null");
    }
    if (attribution.isUnmodifiedOriginal !== true) {
      addIssue(issues, `${attributionPath}.isUnmodifiedOriginal`, "must be true");
    }
  }

  for (const phraseId of phraseIds) {
    if (!seenPhraseIds.has(phraseId)) {
      addIssue(issues, path, `must include attribution for ${phraseId}`);
    }
  }
};

const validateMobileFlowEvidence = (
  value: unknown,
  path: string,
  issues: LessonPackageHandoffValidationIssue[],
): void => {
  if (!Array.isArray(value) || value.length === 0) {
    addIssue(issues, path, "must include at least one mobile flow evidence record");
    return;
  }

  for (const [index, evidence] of value.entries()) {
    const evidencePath = `${path}[${index}]`;
    if (!isRecord(evidence)) {
      addIssue(issues, evidencePath, "must be a mobile flow evidence record");
      continue;
    }

    if (!/^\d{3,4}x\d{3,4}$/.test(String(evidence.viewport))) {
      addIssue(issues, `${evidencePath}.viewport`, "must use width x height pixels");
    }
    if (!isValidIsoTimestamp(evidence.checkedAt)) {
      addIssue(issues, `${evidencePath}.checkedAt`, "must be an ISO timestamp");
    }
    if (!isNonEmptyString(evidence.evidenceRef)) {
      addIssue(issues, `${evidencePath}.evidenceRef`, "must identify the recorded evidence");
    }
  }
};

export function validateLessonPackageHandoff(
  value: unknown,
): readonly LessonPackageHandoffValidationIssue[] {
  if (!isRecord(value)) return [{ path: "handoff", message: "must be a handoff record" }];

  const issues: LessonPackageHandoffValidationIssue[] = [];
  const packageIssues = validateLessonPackages([value.package]);
  for (const issue of packageIssues) {
    addIssue(issues, issue.path.replace(/^packages\[0\]/, "package"), issue.message);
  }

  const packageValue = value.package;
  if (isRecord(packageValue)) {
    const review = packageValue.teacherReview;
    if (isRecord(review) && review.status !== "approved") {
      addIssue(issues, "package.teacherReview.status", "must be approved before handoff");
    }

    const phrases = packageValue.phrases;
    if (Array.isArray(phrases)) {
      const phraseIds = new Set(
        phrases
          .filter(isRecord)
          .map((phrase) => phrase.id)
          .filter(isNonEmptyString),
      );
      validateAudioAttribution(value.audioAttribution, "audioAttribution", phraseIds, issues);
    }
  }

  validateMobileFlowEvidence(value.mobileFlowEvidence, "mobileFlowEvidence", issues);
  return issues;
}

export const lessonPackageHandoffToPlayableLesson = (
  value: unknown,
): PlayableLesson | null => {
  if (!isLessonPackageHandoff(value)) return null;

  const attributionByPhraseId = new Map(
    value.audioAttribution.map((attribution) => [attribution.phraseId, attribution]),
  );
  const phrases: readonly LessonPhrase[] = value.package.phrases.map((phrase) => {
    const attribution = attributionByPhraseId.get(phrase.id);
    if (!attribution) return null;

    const audioAttribution: LessonAudioAttribution = {
      audioUrl: attribution.audioUrl,
      sourceUrl: attribution.sourceUrl,
      license: attribution.license,
      licenseUrl: attribution.licenseUrl,
      speaker: attribution.speaker,
      isUnmodifiedOriginal: true,
    };

    return {
      id: phrase.id,
      hanji: phrase.hanji,
      tailo: phrase.tailo,
      poj: phrase.poj,
      meaning: phrase.meaning,
      cultureNote: phrase.cultureNote,
      audioUrl: attribution.audioUrl,
      source: phrase.source,
      audioAttribution,
    };
  }).filter((phrase): phrase is LessonPhrase => phrase !== null);

  if (phrases.length !== value.package.phrases.length) return null;

  return {
    id: value.package.id,
    number: value.package.number,
    title: value.package.title,
    secondaryTitle: value.package.secondaryTitle,
    summary: value.package.summary,
    goal: value.package.summary,
    contentStatus: "provisional",
    status: "prototype",
    durationMinutes: LESSON_STAGE_IDS.length,
    stages: LESSON_STAGE_IDS.map((id) => ({ id, estimatedMinutes: 1 })),
    phrases,
  };
};

export const isLessonPackageHandoff = (
  value: unknown,
): value is LessonPackageHandoff => validateLessonPackageHandoff(value).length === 0;
