import type { Lesson, PlayableLesson } from "../types/lesson.ts";
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

export const nextPlayableLesson = (
  lessons: readonly PlayableLesson[],
  activeLessonId: string,
): PlayableLesson | null => {
  const orderedLessons = [...lessons].sort((left, right) => left.pathOrder - right.pathOrder);
  const activeIndex = orderedLessons.findIndex((lesson) => lesson.id === activeLessonId);
  return activeIndex >= 0 ? orderedLessons[activeIndex + 1] ?? null : null;
};
