import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import { generateLesson, type LessonSpec } from "../app/utils/lesson-factory.ts";
import { validateLesson } from "../app/utils/lesson-factory-validation.ts";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const specDirectory = join(projectDirectory, "lesson-specs");
const outputDirectory = join(projectDirectory, "app/content/generated");
await mkdir(outputDirectory, { recursive: true });

function parseSpec(source: string, fileName: string): LessonSpec {
  const parsed = load(source);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error(fileName + ": YAML root must be an object");
  return parsed as LessonSpec;
}

const specFiles = (await readdir(specDirectory)).filter((file) => extname(file) === ".yaml").sort();
for (const file of specFiles) {
  const spec = parseSpec(await readFile(join(specDirectory, file), "utf8"), file);
  const lesson = generateLesson(spec, "lesson-specs/" + file);
  const issues = validateLesson(lesson);
  if (issues.length > 0) throw new Error(file + ":\n" + issues.map((issue) => "- " + issue.path + ": " + issue.message).join("\n"));
  const outputPath = join(outputDirectory, basename(file, extname(file)) + ".json");
  await writeFile(outputPath, JSON.stringify(lesson, null, 2) + "\n", "utf8");
  console.log("generated " + outputPath);
}
