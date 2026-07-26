import {
  GENERATED_CONTENT_STATUSES,
  GENERATED_LESSON_LEVELS,
  LESSON_FACTORY_STEP_TYPES,
  type GeneratedContentStatus,
  type LessonFactoryStepType,
} from "../types/generated-lesson.ts";

export type LessonFactoryValidationIssue = { path: string; message: string };
type UnknownRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is UnknownRecord => typeof value === "object" && value !== null && !Array.isArray(value);
const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isLocalizedText = (value: unknown): boolean => isRecord(value) && isNonEmptyString(value.zh) && isNonEmptyString(value.en);
const isHttpsUrl = (value: unknown): value is string => isNonEmptyString(value) && value.startsWith("https://");
const isContentStatus = (value: unknown): value is GeneratedContentStatus => GENERATED_CONTENT_STATUSES.some((status) => status === value);
const isStepType = (value: unknown): value is LessonFactoryStepType => LESSON_FACTORY_STEP_TYPES.some((stepType) => stepType === value);

const addIssue = (issues: LessonFactoryValidationIssue[], path: string, message: string): void => {
  issues.push({ path, message });
};

function validateSources(value: unknown, path: string, issues: LessonFactoryValidationIssue[]): void {
  if (!Array.isArray(value) || value.length === 0) {
    addIssue(issues, path, "must include at least one source metadata URL");
    return;
  }
  value.forEach((source, index) => {
    if (!isHttpsUrl(source)) addIssue(issues, `${path}[${index}]`, "must be an HTTPS canonical URL");
  });
}

function validateStatus(value: unknown, path: string, issues: LessonFactoryValidationIssue[]): void {
  if (!isContentStatus(value)) addIssue(issues, path, "must be verified, provisional, or blocked");
  else if (value === "blocked") addIssue(issues, path, "blocked content cannot be generated or published");
}

function validateLocalizedField(value: unknown, path: string, issues: LessonFactoryValidationIssue[]): void {
  if (!isLocalizedText(value)) addIssue(issues, path, "must include non-empty zh and en text");
}

function validateTargetPhrase(value: unknown, path: string, phraseIds: Set<string>, issues: LessonFactoryValidationIssue[]): void {
  if (!isRecord(value)) {
    addIssue(issues, path, "must be an object");
    return;
  }
  if (!isNonEmptyString(value.id)) addIssue(issues, `${path}.id`, "must be a non-empty string");
  else if (phraseIds.has(value.id)) addIssue(issues, `${path}.id`, "must be unique within the lesson");
  else phraseIds.add(value.id);
  for (const field of ["hanji", "tailo"] as const) if (!isNonEmptyString(value[field])) addIssue(issues, `${path}.${field}`, "must be a non-empty string");
  if (value.poj !== null && !isNonEmptyString(value.poj)) addIssue(issues, `${path}.poj`, "must be a string or null");
  validateLocalizedField(value.meaning, `${path}.meaning`, issues);
  validateLocalizedField(value.cultureNote, `${path}.cultureNote`, issues);
  validateSources(value.sources, `${path}.sources`, issues);
  validateStatus(value.contentStatus, `${path}.contentStatus`, issues);
  if (!isRecord(value.source)) addIssue(issues, `${path}.source`, "must include source metadata");
  else {
    validateLocalizedField(value.source.title, `${path}.source.title`, issues);
    if (!isHttpsUrl(value.source.canonicalUrl)) addIssue(issues, `${path}.source.canonicalUrl`, "must be an HTTPS canonical URL");
    if (!isNonEmptyString(value.source.license)) addIssue(issues, `${path}.source.license`, "must identify the licence");
    if (!isHttpsUrl(value.source.licenseUrl)) addIssue(issues, `${path}.source.licenseUrl`, "must link to a licence");
    if (value.source.speaker !== null && !isNonEmptyString(value.source.speaker)) addIssue(issues, `${path}.source.speaker`, "must be a name or null");
  }
  if (!isRecord(value.audio)) addIssue(issues, `${path}.audio`, "must include audio provenance");
  else {
    for (const field of ["audioUrl", "originalUrl", "sourceUrl", "license", "licenseUrl"] as const) if (!isNonEmptyString(value.audio[field])) addIssue(issues, `${path}.audio.${field}`, "must be a non-empty string");
    if (isNonEmptyString(value.audio.audioUrl) && !/^\/audio\/.+\.mp3$/i.test(value.audio.audioUrl)) addIssue(issues, `${path}.audio.audioUrl`, "must be a local MP3 asset, not a fake or placeholder URL");
    if (value.audio.originalUrl && !isHttpsUrl(value.audio.originalUrl)) addIssue(issues, `${path}.audio.originalUrl`, "must be an HTTPS original URL");
    if (value.audio.sourceUrl && !isHttpsUrl(value.audio.sourceUrl)) addIssue(issues, `${path}.audio.sourceUrl`, "must be an HTTPS source URL");
    if (value.audio.licenseUrl && !isHttpsUrl(value.audio.licenseUrl)) addIssue(issues, `${path}.audio.licenseUrl`, "must be an HTTPS licence URL");
    if (value.audio.speaker !== null && !isNonEmptyString(value.audio.speaker)) addIssue(issues, `${path}.audio.speaker`, "must be a name or null");
    if (value.audio.isUnmodifiedOriginal !== true) addIssue(issues, `${path}.audio.isUnmodifiedOriginal`, "must be true for CC BY-ND source audio");
  }
}

function validateVocabulary(value: unknown, path: string, issues: LessonFactoryValidationIssue[]): void {
  if (!Array.isArray(value) || value.length === 0) {
    addIssue(issues, path, "must include at least one vocabulary item");
    return;
  }
  const ids = new Set<string>();
  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(item)) {
      addIssue(issues, itemPath, "must be an object");
      return;
    }
    if (!isNonEmptyString(item.id)) addIssue(issues, `${itemPath}.id`, "must be a non-empty string");
    else if (ids.has(item.id)) addIssue(issues, `${itemPath}.id`, "must be unique");
    else ids.add(item.id);
    for (const field of ["hanji", "tailo"] as const) if (!isNonEmptyString(item[field])) addIssue(issues, `${itemPath}.${field}`, "must be a non-empty string");
    if (item.poj !== null && !isNonEmptyString(item.poj)) addIssue(issues, `${itemPath}.poj`, "must be a string or null");
    validateLocalizedField(item.meaning, `${itemPath}.meaning`, issues);
    validateSources(item.sources, `${itemPath}.sources`, issues);
    validateStatus(item.contentStatus, `${itemPath}.contentStatus`, issues);
  });
}

function validateSteps(value: unknown, path: string, issues: LessonFactoryValidationIssue[]): void {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "must include the lesson factory steps");
    return;
  }
  if (value.length !== LESSON_FACTORY_STEP_TYPES.length) addIssue(issues, path, `must contain exactly ${LESSON_FACTORY_STEP_TYPES.length} steps`);
  value.forEach((step, index) => {
    const stepPath = `${path}[${index}]`;
    if (!isRecord(step)) {
      addIssue(issues, stepPath, "must be an object");
      return;
    }
    if (!isStepType(step.type)) addIssue(issues, `${stepPath}.type`, "is not a supported lesson factory step type");
    else if (step.type !== LESSON_FACTORY_STEP_TYPES[index]) addIssue(issues, `${stepPath}.type`, `must be ${LESSON_FACTORY_STEP_TYPES[index]} at this position`);
    validateLocalizedField(step.title, `${stepPath}.title`, issues);
    validateLocalizedField(step.prompt, `${stepPath}.prompt`, issues);
  });
}

function validateReviewItems(value: unknown, path: string, phraseIds: ReadonlySet<string>, issues: LessonFactoryValidationIssue[]): void {
  if (!Array.isArray(value) || value.length === 0) {
    addIssue(issues, path, "must include at least one review item");
    return;
  }
  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(item)) {
      addIssue(issues, itemPath, "must be an object");
      return;
    }
    if (!isNonEmptyString(item.id)) addIssue(issues, `${itemPath}.id`, "must be a non-empty string");
    if (!isNonEmptyString(item.targetPhraseId) || !phraseIds.has(item.targetPhraseId)) addIssue(issues, `${itemPath}.targetPhraseId`, "must reference a target phrase");
    validateLocalizedField(item.prompt, `${itemPath}.prompt`, issues);
  });
}

export function validateLesson(value: unknown): readonly LessonFactoryValidationIssue[] {
  if (!isRecord(value)) return [{ path: "lesson", message: "must be an object" }];
  const issues: LessonFactoryValidationIssue[] = [];
  for (const field of ["id", "generatedFrom"] as const) if (!isNonEmptyString(value[field])) addIssue(issues, field, "must be a non-empty string");
  if (value.version !== 1) addIssue(issues, "version", "must be 1");
  validateLocalizedField(value.title, "title", issues);
  if (!GENERATED_LESSON_LEVELS.some((level) => level === value.level)) addIssue(issues, "level", "is not a supported level");
  validateLocalizedField(value.scenario, "scenario", issues);
  validateLocalizedField(value.goal, "goal", issues);
  validateSources(value.sources, "sources", issues);
  validateStatus(value.contentStatus, "contentStatus", issues);
  const phraseIds = new Set<string>();
  if (!Array.isArray(value.targetPhrases) || value.targetPhrases.length === 0) addIssue(issues, "targetPhrases", "must include at least one target phrase");
  else {
    if (value.targetPhrases.length > 5) addIssue(issues, "targetPhrases", "must contain no more than 5 target phrases");
    value.targetPhrases.forEach((phrase, index) => validateTargetPhrase(phrase, `targetPhrases[${index}]`, phraseIds, issues));
  }
  validateVocabulary(value.vocabulary, "vocabulary", issues);
  validateSteps(value.steps, "steps", issues);
  validateReviewItems(value.reviewItems, "reviewItems", phraseIds, issues);
  return issues;
}

export function validateLessonCollection(values: readonly unknown[]): readonly LessonFactoryValidationIssue[] {
  const issues: LessonFactoryValidationIssue[] = [];
  const ids = new Set<string>();
  values.forEach((value, index) => {
    validateLesson(value).forEach((issue) => addIssue(issues, `lessons[${index}].${issue.path}`, issue.message));
    if (isRecord(value) && isNonEmptyString(value.id)) {
      if (ids.has(value.id)) addIssue(issues, `lessons[${index}].id`, "duplicate lesson ID");
      ids.add(value.id);
    }
  });
  return issues;
}
