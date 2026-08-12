import {
  TEACHER_REVIEW_CHECK_IDS,
  type TeacherReviewCheckId,
  type TeacherReviewCheckStatus,
  type TeacherReviewStatus,
} from "../types/lesson-package.ts";

export const LESSON_PACKAGE_STAGE_COUNT = 5;

const EXPECTED_STAGE_PREFIXES = [
  { zh: "聽：", en: "Hear:" },
  { zh: "看：", en: "See:" },
  { zh: "講：", en: "Say:" },
  { zh: "記：", en: "Recall:" },
  { zh: "用：", en: "Use:" },
] as const;

const MOE_DICTIONARY_URL = /^https:\/\/sutian\.moe\.edu\.tw\/(?:zh-hant|und-hani)\/su\/\d+\/$/;
const MOE_LICENSE = "CC BY-ND 3.0 TW";
const MOE_LICENSE_URL = "https://creativecommons.org/licenses/by-nd/3.0/tw/";
const FAKE_AUDIO_MARKER = /(fake|placeholder|pending|todo|example|not[-_ ]yet[-_ ]added)/i;

export type LessonPackageValidationIssue = {
  path: string;
  message: string;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => (
  typeof value === "object" && value !== null && !Array.isArray(value)
);

const isNonEmptyString = (value: unknown): value is string => (
  typeof value === "string" && value.trim().length > 0
);

const ISO_TIMESTAMP = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export const isValidIsoTimestamp = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) return false;

  const match = ISO_TIMESTAMP.exec(value);
  if (!match || Number.isNaN(Date.parse(value))) return false;

  const month = Number(match[2]);
  const day = Number(match[3]);
  const daysInMonth = new Date(Date.UTC(Number(match[1]), month, 0)).getUTCDate();
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth;
};

const isTeacherReviewStatus = (value: unknown): value is TeacherReviewStatus => (
  value === "required" || value === "approved" || value === "changes-requested"
);

const isTeacherReviewCheckId = (value: unknown): value is TeacherReviewCheckId => (
  TEACHER_REVIEW_CHECK_IDS.some((id) => id === value)
);

const isTeacherReviewCheckStatus = (value: unknown): value is TeacherReviewCheckStatus => (
  value === "pending" || value === "passed" || value === "needs-changes"
);

const addIssue = (
  issues: LessonPackageValidationIssue[],
  path: string,
  message: string,
): void => {
  issues.push({ path, message });
};

const validateLocalizedText = (
  value: unknown,
  path: string,
  issues: LessonPackageValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, path, "must include zh and en text");
    return;
  }

  if (!isNonEmptyString(value.zh)) addIssue(issues, `${path}.zh`, "must be a non-empty string");
  if (!isNonEmptyString(value.en)) addIssue(issues, `${path}.en`, "must be a non-empty string");
};

const validateStagePlan = (
  value: unknown,
  path: string,
  issues: LessonPackageValidationIssue[],
): void => {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "must be an array");
    return;
  }

  if (value.length !== LESSON_PACKAGE_STAGE_COUNT) {
    addIssue(issues, path, `must contain exactly ${LESSON_PACKAGE_STAGE_COUNT} stages`);
  }

  for (const [index, stage] of value.entries()) {
    const stagePath = `${path}[${index}]`;
    validateLocalizedText(stage, stagePath, issues);
    const expected = EXPECTED_STAGE_PREFIXES[index];
    if (!expected || !isRecord(stage)) continue;

    if (isNonEmptyString(stage.zh) && !stage.zh.startsWith(expected.zh)) {
      addIssue(issues, `${stagePath}.zh`, `must start with ${expected.zh}`);
    }
    if (isNonEmptyString(stage.en) && !stage.en.startsWith(expected.en)) {
      addIssue(issues, `${stagePath}.en`, `must start with ${expected.en}`);
    }
  }
};

const validateSource = (
  value: unknown,
  path: string,
  issues: LessonPackageValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, path, "must include source metadata");
    return;
  }

  validateLocalizedText(value.title, `${path}.title`, issues);
  if (!isNonEmptyString(value.canonicalUrl) || !MOE_DICTIONARY_URL.test(value.canonicalUrl)) {
    addIssue(issues, `${path}.canonicalUrl`, "must be an MOE Dictionary URL");
  }
  if (value.license !== MOE_LICENSE) addIssue(issues, `${path}.license`, `must be ${MOE_LICENSE}`);
  if (value.licenseUrl !== MOE_LICENSE_URL) {
    addIssue(issues, `${path}.licenseUrl`, "must link to the CC BY-ND 3.0 TW license");
  }
  if (value.speaker !== null && !isNonEmptyString(value.speaker)) {
    addIssue(issues, `${path}.speaker`, "must be a name or null");
  }
};

const validateAudio = (
  value: unknown,
  path: string,
  phrase: UnknownRecord,
  issues: LessonPackageValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, path, "must include complete original audio metadata and note");
    return;
  }

  if (value.status !== "added") addIssue(issues, `${path}.status`, "must be added before a package can enter the release candidate");
  if (value.contentHanji !== phrase.hanji) {
    addIssue(issues, `${path}.contentHanji`, "must exactly match the Hanji shown for the audio button");
  }
  if (!isNonEmptyString(value.audioUrl) || !value.audioUrl.startsWith("/audio/")) {
    addIssue(issues, `${path}.audioUrl`, "must reference a local audio asset");
  }
  if (typeof value.audioUrl === "string" && FAKE_AUDIO_MARKER.test(value.audioUrl)) {
    addIssue(issues, `${path}.audioUrl`, "planned lessons must not use a fake or placeholder audio URL");
  }
  if (!isNonEmptyString(value.originalUrl) || !value.originalUrl.startsWith("https://sutian.moe.edu.tw/media/")) {
    addIssue(issues, `${path}.originalUrl`, "must reference the official MOE original audio URL");
  }
  if (typeof value.originalUrl === "string" && FAKE_AUDIO_MARKER.test(value.originalUrl)) {
    addIssue(issues, `${path}.originalUrl`, "planned lessons must not use a fake or placeholder original audio URL");
  }
  if (value.license !== "CC BY-ND 3.0 TW") addIssue(issues, `${path}.license`, "must be CC BY-ND 3.0 TW");
  if (value.licenseUrl !== "https://creativecommons.org/licenses/by-nd/3.0/tw/") {
    addIssue(issues, `${path}.licenseUrl`, "must link to the CC BY-ND 3.0 TW license");
  }
  if (value.isUnmodifiedOriginal !== true) addIssue(issues, `${path}.isUnmodifiedOriginal`, "must remain true");
  validateLocalizedText(value.note, `${path}.note`, issues);
};

const validatePhrase = (
  value: unknown,
  path: string,
  phraseIds: Set<string>,
  issues: LessonPackageValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, path, "must be a phrase record");
    return;
  }

  if (isNonEmptyString(value.id)) {
    if (phraseIds.has(value.id)) addIssue(issues, `${path}.id`, "must be unique");
    phraseIds.add(value.id);
  } else {
    addIssue(issues, `${path}.id`, "must be a non-empty string");
  }

  for (const field of ["hanji", "tailo"] as const) {
    if (!isNonEmptyString(value[field])) addIssue(issues, `${path}.${field}`, "must be a non-empty string");
  }
  if (!isNonEmptyString(value.poj)) addIssue(issues, `${path}.poj`, "must include the source-traceable POJ comparison");
  validateLocalizedText(value.meaning, `${path}.meaning`, issues);
  validateLocalizedText(value.cultureNote, `${path}.cultureNote`, issues);
  validateSource(value.source, `${path}.source`, issues);
  validateAudio(value.audio, `${path}.audio`, value, issues);
};

const validateTeacherReview = (
  value: unknown,
  path: string,
  issues: LessonPackageValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, path, "must include review status and checks");
    return;
  }

  if (!isTeacherReviewStatus(value.status)) {
    addIssue(issues, `${path}.status`, "must be required, approved, or changes-requested");
  }

  if (value.status === "required") {
    if (value.reviewer !== null) addIssue(issues, `${path}.reviewer`, "must be null before review");
    if (value.reviewedAt !== null) addIssue(issues, `${path}.reviewedAt`, "must be null before review");
  } else {
    if (!isNonEmptyString(value.reviewer)) addIssue(issues, `${path}.reviewer`, "must identify the reviewer");
    if (!isValidIsoTimestamp(value.reviewedAt)) addIssue(issues, `${path}.reviewedAt`, "must be an ISO timestamp");
  }

  if (!Array.isArray(value.checks)) {
    addIssue(issues, `${path}.checks`, "must be a non-empty array");
    return;
  }
  if (value.checks.length === 0) {
    addIssue(issues, `${path}.checks`, "must be a non-empty array");
    return;
  }

  const seenCheckIds = new Set<TeacherReviewCheckId>();
  const checkStatuses: TeacherReviewCheckStatus[] = [];
  for (const [index, check] of value.checks.entries()) {
    const checkPath = `${path}.checks[${index}]`;
    if (!isRecord(check)) {
      addIssue(issues, checkPath, "must include id, label, and status");
      continue;
    }

    if (!isTeacherReviewCheckId(check.id)) {
      addIssue(issues, `${checkPath}.id`, "must be a known teacher review check");
    } else if (seenCheckIds.has(check.id)) {
      addIssue(issues, `${checkPath}.id`, "must be unique");
    } else {
      seenCheckIds.add(check.id);
    }

    validateLocalizedText(check.label, `${checkPath}.label`, issues);
    if (!isTeacherReviewCheckStatus(check.status)) {
      addIssue(issues, `${checkPath}.status`, "must be pending, passed, or needs-changes");
    } else {
      checkStatuses.push(check.status);
    }
  }

  for (const checkId of TEACHER_REVIEW_CHECK_IDS) {
    if (!seenCheckIds.has(checkId)) addIssue(issues, `${path}.checks`, `must include ${checkId}`);
  }

  if (value.status === "required" && checkStatuses.some((status) => status !== "pending")) {
    addIssue(issues, `${path}.checks`, "must remain pending before teacher review");
  }
  if (value.status === "approved" && checkStatuses.some((status) => status !== "passed")) {
    addIssue(issues, `${path}.checks`, "must all be passed before approval");
  }
  if (value.status === "changes-requested" && !checkStatuses.includes("needs-changes")) {
    addIssue(issues, `${path}.checks`, "must include a needs-changes item");
  }
};

const validatePackage = (
  value: unknown,
  path: string,
  lessonIds: Set<string>,
  lessonNumbers: Set<number>,
  pathOrders: Set<number>,
  phraseIds: Set<string>,
  issues: LessonPackageValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, path, "must be a lesson package record");
    return;
  }

  if (isNonEmptyString(value.id)) {
    if (lessonIds.has(value.id)) addIssue(issues, `${path}.id`, "must be unique");
    lessonIds.add(value.id);
  } else {
    addIssue(issues, `${path}.id`, "must be a non-empty string");
  }

  if (typeof value.number !== "number" || !Number.isInteger(value.number) || value.number < 1) {
    addIssue(issues, `${path}.number`, "must be a positive integer");
  } else {
    if (lessonNumbers.has(value.number)) addIssue(issues, `${path}.number`, "must be unique");
    lessonNumbers.add(value.number);
  }

  if (typeof value.pathOrder !== "number" || !Number.isInteger(value.pathOrder) || value.pathOrder < 2 || value.pathOrder > 20) {
    addIssue(issues, `${path}.pathOrder`, "must be a unique learner path position from 2 through 20");
  } else if (pathOrders.has(value.pathOrder)) {
    addIssue(issues, `${path}.pathOrder`, "must be unique");
  } else {
    pathOrders.add(value.pathOrder);
  }

  for (const field of ["title", "secondaryTitle", "summary", "objective", "mission"] as const) {
    validateLocalizedText(value[field], `${path}.${field}`, issues);
  }
  if (value.status !== "planned") addIssue(issues, `${path}.status`, "must remain planned");
  validateStagePlan(value.stagePlan, `${path}.stagePlan`, issues);

  if (!Array.isArray(value.phrases) || value.phrases.length < 3) {
    addIssue(issues, `${path}.phrases`, "must contain at least three target phrases for a covered lesson");
  } else {
    for (const [index, phrase] of value.phrases.entries()) {
      validatePhrase(phrase, `${path}.phrases[${index}]`, phraseIds, issues);
    }
  }
  validateTeacherReview(value.teacherReview, `${path}.teacherReview`, issues);
};

export function validateLessonPackages(value: unknown): readonly LessonPackageValidationIssue[] {
  if (!Array.isArray(value)) return [{ path: "packages", message: "must be an array" }];

  const issues: LessonPackageValidationIssue[] = [];
  const lessonIds = new Set<string>();
  const lessonNumbers = new Set<number>();
  const pathOrders = new Set<number>();
  const phraseIds = new Set<string>();

  for (const [index, lessonPackage] of value.entries()) {
    validatePackage(
      lessonPackage,
      `packages[${index}]`,
      lessonIds,
      lessonNumbers,
      pathOrders,
      phraseIds,
      issues,
    );
  }
  return issues;
}
