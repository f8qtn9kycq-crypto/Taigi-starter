import type { Lesson } from "../types/lesson.ts";
import { lessonPackageHandoffToPlayableLesson } from "./lesson-package-handoff.ts";

export const buildLessonCatalog = (
  baseLessons: readonly Lesson[],
  handoffs: readonly unknown[],
): readonly Lesson[] => {
  const lessonsByNumber = new Map(
    baseLessons.map((lesson) => [lesson.number, lesson] as const),
  );

  for (const handoff of handoffs) {
    const replacementLesson = lessonPackageHandoffToPlayableLesson(handoff);
    if (replacementLesson) {
      lessonsByNumber.set(replacementLesson.number, replacementLesson);
    }
  }

  return [...lessonsByNumber.values()].sort((left, right) => left.pathOrder - right.pathOrder);
};
