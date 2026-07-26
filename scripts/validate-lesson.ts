import { readdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateLessonCollection } from "../app/utils/lesson-factory-validation.ts";

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedDirectory = join(projectDirectory, "app/content/generated");
const files = (await readdir(generatedDirectory)).filter((file) => extname(file) === ".json").sort();
const lessons = await Promise.all(files.map(async (file) => JSON.parse(await readFile(join(generatedDirectory, file), "utf8")) as unknown));
const issues = [...validateLessonCollection(lessons)];

for (const lesson of lessons) {
  if (typeof lesson !== "object" || lesson === null || !Array.isArray((lesson as { targetPhrases?: unknown }).targetPhrases)) continue;
  for (const phrase of (lesson as { targetPhrases: unknown[] }).targetPhrases) {
    if (typeof phrase !== "object" || phrase === null) continue;
    const audio = (phrase as { audio?: { audioUrl?: unknown; sha256?: unknown } }).audio;
    const audioUrl = audio?.audioUrl;
    if (typeof audioUrl !== "string" || !audioUrl.startsWith("/")) continue;
    try {
      const audioPath = join(projectDirectory, "public", audioUrl.slice(1));
      const audioFile = await stat(audioPath);
      if (!audioFile.isFile() || audioFile.size === 0) {
        issues.push({ path: "audio", message: audioUrl + " must reference a non-empty local audio asset" });
      } else {
        const actualSha256 = createHash("sha256").update(await readFile(audioPath)).digest("hex");
        if (actualSha256 !== audio?.sha256) issues.push({ path: "audio", message: audioUrl + " SHA-256 does not match its recorded original checksum" });
      }
    } catch {
      issues.push({ path: "audio", message: audioUrl + " must reference an existing local audio asset" });
    }
  }
}

if (files.length === 0) issues.push({ path: "lessons", message: "must include at least one generated lesson" });

if (issues.length > 0) {
  console.error(issues.map((issue) => "- " + issue.path + ": " + issue.message).join("\n"));
  process.exitCode = 1;
} else {
  console.log("validated " + lessons.length + " generated lessons: " + files.map((file) => basename(file)).join(", "));
}
