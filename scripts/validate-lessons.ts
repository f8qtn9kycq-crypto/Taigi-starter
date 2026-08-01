import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { lessonPackageHandoffs } from "../app/data/lesson-package-handoffs.ts";
import { lessonPackages } from "../app/data/lesson-packages.ts";
import { lessonCatalog } from "../app/data/lessons.ts";
import { validateLessonPackageHandoff } from "../app/utils/lesson-package-handoff.ts";
import { validateLessonPackages } from "../app/utils/lesson-package-validation.ts";
import { officialMoeAudioUrl } from "../app/utils/lesson-audio.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const issues: string[] = [];
const addIssues = (path: string, values: readonly { path: string; message: string }[]): void => {
  for (const issue of values) issues.push(`${path}${issue.path ? `.${issue.path}` : ""}: ${issue.message}`);
};

addIssues("lessonPackages", validateLessonPackages(lessonPackages));

const expectedPackageNumbers = Array.from({ length: 19 }, (_, index) => index + 2);
const packageNumbers = lessonPackages.map((lesson) => lesson.number);
if (JSON.stringify(packageNumbers) !== JSON.stringify(expectedPackageNumbers)) {
  issues.push(`lessonPackages: expected lessons 2–20, got ${packageNumbers.join(", ")}`);
}

const handoffNumbers = lessonPackageHandoffs.map((handoff) => handoff.package.number);
if (JSON.stringify(handoffNumbers) !== JSON.stringify(expectedPackageNumbers)) {
  issues.push(`lessonPackageHandoffs: expected lessons 2–20, got ${handoffNumbers.join(", ")}`);
}

for (const handoff of lessonPackageHandoffs) {
  addIssues(`handoff-${handoff.package.number}`, validateLessonPackageHandoff(handoff));
  const attributionById = new Map(handoff.audioAttribution.map((item) => [item.phraseId, item]));

  for (const phrase of handoff.package.phrases) {
    const attribution = attributionById.get(phrase.id);
    if (!attribution) continue;
    if (attribution.audioUrl !== phrase.audio.audioUrl) {
      issues.push(`lesson-${handoff.package.number}/${phrase.id}: handoff audio URL differs from package metadata`);
    }
    if (attribution.originalUrl !== phrase.audio.originalUrl) {
      issues.push(`lesson-${handoff.package.number}/${phrase.id}: handoff original URL differs from package metadata`);
    }
    if (attribution.sourceUrl !== phrase.source.canonicalUrl) {
      issues.push(`lesson-${handoff.package.number}/${phrase.id}: handoff source URL differs from package metadata`);
    }

    try {
      const expectedOriginalUrl = officialMoeAudioUrl(phrase.source.canonicalUrl);
      if (phrase.audio.originalUrl !== expectedOriginalUrl) {
        issues.push(`lesson-${handoff.package.number}/${phrase.id}: original audio URL does not match the official MOE source URL`);
      }
    } catch (error) {
      issues.push(`lesson-${handoff.package.number}/${phrase.id}: cannot derive official MOE audio URL (${String(error)})`);
    }
    if (phrase.audio.note.zh.includes("待由") || phrase.audio.note.en.toLowerCase().includes("pending")) {
      issues.push(`lesson-${handoff.package.number}/${phrase.id}: audio note still describes incomplete metadata`);
    }

    const relativePath = phrase.audio.audioUrl.replace(/^\//, "");
    const filePath = join(repoRoot, "public", relativePath);
    try {
      await access(filePath);
      const bytes = await readFile(filePath);
      if (bytes.subarray(0, 3).toString() !== "ID3") {
        issues.push(`lesson-${handoff.package.number}/${phrase.id}: local audio must retain an ID3 header`);
      }
      if (bytes.length <= 1_000) {
        issues.push(`lesson-${handoff.package.number}/${phrase.id}: local audio is unexpectedly small`);
      }
    } catch {
      issues.push(`lesson-${handoff.package.number}/${phrase.id}: missing local audio ${phrase.audio.audioUrl}`);
    }
  }
}

const playableNumbers = lessonCatalog
  .filter((lesson) => lesson.status === "prototype")
  .map((lesson) => lesson.number)
  .sort((left, right) => left - right);
const expectedPlayableNumbers = Array.from({ length: 20 }, (_, index) => index + 1);
if (JSON.stringify(playableNumbers) !== JSON.stringify(expectedPlayableNumbers)) {
  issues.push(`lessonCatalog: expected playable lessons 1–20, got ${playableNumbers.join(", ")}`);
}
const pathOrders = lessonCatalog.map((lesson) => lesson.pathOrder);
const expectedPathOrders = Array.from({ length: 20 }, (_, index) => index + 1);
if (JSON.stringify(pathOrders) !== JSON.stringify(expectedPathOrders)) {
  issues.push(`lessonCatalog: expected recommended path order 1–20, got ${pathOrders.join(", ")}`);
}

const lessonOne = lessonCatalog.find((lesson) => lesson.number === 1);
const lessonTwelve = lessonCatalog.find((lesson) => lesson.number === 12);
const lessonOneKeys = new Set(lessonOne?.phrases.map((phrase) => `${phrase.hanji}\t${phrase.tailo}`));
const repeatedLessonTwelvePhrases = lessonTwelve?.phrases.filter(
  (phrase) => lessonOneKeys.has(`${phrase.hanji}\t${phrase.tailo}`),
) ?? [];
if (repeatedLessonTwelvePhrases.length > 0) {
  issues.push(`lessonCatalog: Lesson 12 repeats Lesson 1 phrase(s): ${repeatedLessonTwelvePhrases.map((phrase) => phrase.hanji).join(", ")}`);
}

if (issues.length > 0) {
  console.error(`Lesson validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  const phraseCount = lessonPackages.reduce((total, lesson) => total + lesson.phrases.length, 0);
  console.log(`Lesson validation passed: ${lessonPackages.length} packages, ${phraseCount} phrases, ${phraseCount} licensed original audio assets, playable lessons 1–20.`);
}
