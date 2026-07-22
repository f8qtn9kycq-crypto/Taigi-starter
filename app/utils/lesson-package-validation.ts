export const LESSON_PACKAGE_STAGE_COUNT = 5;

const EXPECTED_STAGE_PREFIXES = [
  { zh: "聽：", en: "Hear:" },
  { zh: "看：", en: "See:" },
  { zh: "講：", en: "Say:" },
  { zh: "記：", en: "Recall:" },
  { zh: "用：", en: "Use:" },
] as const;

const MOE_DICTIONARY_URL = /^https:\/\/sutian\.moe\.edu\.tw\//;
const MOE_LICENSE = "CC BY-ND 3.0 TW";
const MOE_LICENSE_URL = "https://creativecommons.org/licenses/by-nd/3.0/tw/";

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
  issues: LessonPackageValidationIssue[],
): void => {
  if (!isRecord(value)) {
    addIssue(issues, path, "must include audio status and note");
    return;
  }

  if (value.status !== "not-yet-added") {
    addIssue(issues, `${path}.status`, "must remain not-yet-added until review and attribution are complete");
  }
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
  if (value.poj !== null && !isNonEmptyString(value.poj)) {
    addIssue(issues, `${path}.poj`, "must be a string or null");
  }
  validateLocalizedText(value.meaning, `${path}.meaning`, issues);
  validateLocalizedText(value.cultureNote, `${path}.cultureNote`, issues);
  validateSource(value.source, `${path}.source`, issues);
  validateAudio(value.audio, `${path}.audio`, issues);
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

  if (value.status !== "required") addIssue(issues, `${path}.status`, "must remain required");
  if (!Array.isArray(value.checks)) {
    addIssue(issues, `${path}.checks`, "must be a non-empty array");
    return;
  }
  if (value.checks.length === 0) addIssue(issues, `${path}.checks`, "must be a non-empty array");
  for (const [index, check] of value.checks.entries()) {
    validateLocalizedText(check, `${path}.checks[${index}]`, issues);
  }
};

const validatePackage = (
  value: unknown,
  path: string,
  lessonIds: Set<string>,
  lessonNumbers: Set<number>,
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

  for (const field of ["title", "secondaryTitle", "summary", "objective"] as const) {
    validateLocalizedText(value[field], `${path}.${field}`, issues);
  }
  if (value.status !== "planned") addIssue(issues, `${path}.status`, "must remain planned");
  validateStagePlan(value.stagePlan, `${path}.stagePlan`, issues);

  if (!Array.isArray(value.phrases) || value.phrases.length === 0) {
    addIssue(issues, `${path}.phrases`, "must be a non-empty array");
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
  const phraseIds = new Set<string>();

  for (const [index, lessonPackage] of value.entries()) {
    validatePackage(
      lessonPackage,
      `packages[${index}]`,
      lessonIds,
      lessonNumbers,
      phraseIds,
      issues,
    );
  }
  return issues;
}
