import type {
  LessonAudioAsset,
  LessonAudioAttribution,
  LessonContentStatus,
  LessonSource,
  LocalizedText,
} from "./lesson-domain.ts";

export const TEACHER_REVIEW_CHECK_IDS = [
  "orthography",
  "pronunciation",
  "context",
  "audio",
] as const;

export type TeacherReviewCheckId = (typeof TEACHER_REVIEW_CHECK_IDS)[number];
export type TeacherReviewStatus = "required" | "approved" | "changes-requested";
export type TeacherReviewCheckStatus = "pending" | "passed" | "needs-changes";

export type TeacherReviewCheck = {
  id: TeacherReviewCheckId;
  label: LocalizedText;
  status: TeacherReviewCheckStatus;
};

export type TeacherReview = {
  status: TeacherReviewStatus;
  reviewer: string | null;
  reviewedAt: string | null;
  checks: readonly TeacherReviewCheck[];
};

export type LessonPackagePhrase = {
  id: string;
  hanji: string;
  tailo: string;
  poj: string | null;
  meaning: LocalizedText;
  cultureNote: LocalizedText;
  useCombination?: LessonUseCombination;
  source: LessonSource;
  audio: LessonAudioAsset & {
    status: "added";
    note: LocalizedText;
  };
};

export type LessonUseCombination = {
  hanji: string;
  tailo: string;
  meaning: LocalizedText;
};

export type LessonPackage = {
  id: string;
  number: number;
  pathOrder: number;
  title: LocalizedText;
  secondaryTitle: LocalizedText;
  summary: LocalizedText;
  objective: LocalizedText;
  mission: LocalizedText;
  status: Extract<LessonContentStatus, "planned">;
  stagePlan: readonly LocalizedText[];
  phrases: readonly LessonPackagePhrase[];
  teacherReview: TeacherReview;
};

export type LessonPackageAudioAttribution = LessonAudioAttribution & {
  phraseId: string;
};

export type LessonPackageMobileFlowEvidence = {
  viewport: string;
  checkedAt: string;
  evidenceRef: string;
};

export type LessonPackageOwnerRiskAcceptance = {
  acceptedBy: string;
  acceptedAt: string;
  reason: LocalizedText;
};

export type LessonPackageHandoff = {
  package: LessonPackage;
  audioAttribution: readonly LessonPackageAudioAttribution[];
  mobileFlowEvidence: readonly LessonPackageMobileFlowEvidence[];
  ownerRiskAcceptance: LessonPackageOwnerRiskAcceptance;
};
