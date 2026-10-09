import { useState, useEffect, useCallback } from "react";
import type { Course } from "@/types/course";
import { SLUG_ALIASES } from "@/data/slugAliases";

export function getStoredCompletedLessonIds(slug: string): string[] | null {
  try {
    const alias = SLUG_ALIASES[slug];

    const stored =
      localStorage.getItem(`itlegend_progress_${slug}`) ||
      (alias ? localStorage.getItem(`itlegend_progress_${alias}`) : null);

    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) && parsed.every((id) => typeof id === "string")
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function getCurriculumCompletedLessonIds(course: Course): Set<string> {
  const ids = new Set<string>();

  course.curriculum.forEach((section) => {
    section.lessons.forEach((lesson) => {
      if (lesson.completed) {
        ids.add(lesson.id);
      }
    });
  });

  return ids;
}

export function getInitialCompletedLessonIds(course: Course): Set<string> {
  const ids = getCurriculumCompletedLessonIds(course);
  const stored = getStoredCompletedLessonIds(course.slug);

  stored?.forEach((id) => ids.add(id));

  return ids;
}

export function calculateCourseProgress(
  course: Course,
  completedLessonIds: Set<string> | string[],
): number {
  const completedSet =
    completedLessonIds instanceof Set
      ? completedLessonIds
      : new Set(completedLessonIds);

  const totalLessons = course.curriculum.reduce(
    (total, section) => total + section.lessons.length,
    0,
  );

  if (totalLessons === 0) return 0;

  let completedCount = 0;

  course.curriculum.forEach((section) => {
    section.lessons.forEach((lesson) => {
      if (completedSet.has(lesson.id)) {
        completedCount++;
      }
    });
  });

  return Math.min(100, Math.round((completedCount / totalLessons) * 100));
}

export function getCourseStatus(progress: number): Course["status"] {
  if (progress === 100) return "completed";
  if (progress > 0) return "in-progress";

  return "not-started";
}

export function syncCourseWithProgress(course: Course): Course {
  const completedIds = getInitialCompletedLessonIds(course);
  const progress = calculateCourseProgress(course, completedIds);
  const status = getCourseStatus(progress);

  const enrichedCurriculum = course.curriculum.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({
      ...lesson,
      completed: completedIds.has(lesson.id),
    })),
  }));

  return {
    ...course,
    progress,
    status,
    curriculum: enrichedCurriculum,
  };
}

export function useCourseProgress(course: Course) {
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () => getCurriculumCompletedLessonIds(course),
  );

  useEffect(() => {
    setCompletedLessonIds(getInitialCompletedLessonIds(course));
  }, [course.slug]);

  const progress = calculateCourseProgress(course, completedLessonIds);

  const completeLesson = useCallback(
    (lessonId: string) => {
      if (completedLessonIds.has(lessonId)) return;

      const next = new Set(completedLessonIds);
      next.add(lessonId);

      setCompletedLessonIds(next);

      try {
        localStorage.setItem(
          `itlegend_progress_${course.slug}`,
          JSON.stringify([...next]),
        );
      } catch {
        // Ignore storage errors.
      }
    },
    [completedLessonIds, course.slug],
  );

  return {
    completedLessonIds,
    progress,
    completeLesson,
  };
}
