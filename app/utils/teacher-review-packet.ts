import type { LessonPackageHandoff } from "../types/lesson-package.ts";

const blankReviewRecord = (handoff: LessonPackageHandoff): readonly string[] => [
  "```yaml",
  `packageId: ${handoff.package.id}`,
  'reviewer: ""',
  'reviewedAt: "" # ISO 8601',
  'exactCommit: ""',
  'decision: "" # approved or changes-requested',
  'evidenceRef: "" # immutable review record',
  "checks:",
  ...handoff.package.teacherReview.checks.flatMap((check) => [
    `  - id: ${check.id}`,
    '    result: "" # passed or needs-changes',
    '    notes: ""',
  ]),
  'overallNotes: ""',
  "```",
];

export function renderTeacherReviewPacket(handoff: LessonPackageHandoff): string {
  const review = handoff.package.teacherReview;
  if (
    review.status !== "required"
    || review.reviewer !== null
    || review.reviewedAt !== null
    || review.checks.some((check) => check.status !== "pending")
  ) {
    throw new Error("Teacher review packet can only be generated from a fully pending review");
  }

  const attributionByPhraseId = new Map(
    handoff.audioAttribution.map((attribution) => [attribution.phraseId, attribution]),
  );
  const lines: string[] = [
    `# Teacher Review Packet — Lesson ${handoff.package.number}: ${handoff.package.title.zh}`,
    "",
    "> 狀態：空白教師審核表／尚未審核／不是核准證據",
    "> State: blank review packet / teacher review required / not approval evidence",
    ">",
    "> This file is generated from authoritative package and handoff data. A merge,",
    "> green check, owner authorization, or blank packet does not count as teacher approval.",
    "",
    "## Review target",
    "",
    `- Package ID: \`${handoff.package.id}\``,
    `- 中文標題：${handoff.package.title.zh}`,
    `- English title: ${handoff.package.title.en}`,
    `- 目標：${handoff.package.objective.zh}`,
    `- Objective: ${handoff.package.objective.en}`,
    `- 任務：${handoff.package.mission.zh}`,
    `- Mission: ${handoff.package.mission.en}`,
    "",
    "## Required checks",
    "",
    ...review.checks.flatMap((check) => [
      `- [ ] \`${check.id}\` — ${check.label.zh}`,
      `  - ${check.label.en}`,
    ]),
    "",
    "## Phrases and evidence",
    "",
  ];

  for (const [index, phrase] of handoff.package.phrases.entries()) {
    const attribution = attributionByPhraseId.get(phrase.id);
    if (!attribution) throw new Error(`Missing audio attribution for ${phrase.id}`);

    lines.push(
      `### ${index + 1}. ${phrase.hanji} — ${phrase.tailo}`,
      "",
      `- Phrase ID: \`${phrase.id}\``,
      `- 漢字：${phrase.hanji}`,
      `- Tâi-lô：${phrase.tailo}`,
      `- POJ：${phrase.poj}`,
      `- 中文意思：${phrase.meaning.zh}`,
      `- English meaning: ${phrase.meaning.en}`,
      `- 中文語境：${phrase.cultureNote.zh}`,
      `- English context: ${phrase.cultureNote.en}`,
      `- Canonical MOE source: ${phrase.source.canonicalUrl}`,
      `- Original audio: ${attribution.originalUrl}`,
      `- Repository audio: ${attribution.audioUrl}`,
      `- Audio content: ${attribution.contentHanji}`,
      `- Licence: ${attribution.license} — ${attribution.licenseUrl}`,
      `- Speaker: ${attribution.speaker ?? "not identified by source metadata"}`,
      `- Unmodified original: ${attribution.isUnmodifiedOriginal ? "yes" : "no"}`,
      "",
    );
  }

  lines.push(
    "## Blank teacher decision record",
    "",
    "Complete this only after checking every phrase, source, and audio item above.",
    "A decision without reviewer identity, ISO timestamp, exact commit, immutable",
    "evidence reference, and all four check results is incomplete.",
    "",
    ...blankReviewRecord(handoff),
    "",
  );

  return lines.join("\n");
}
