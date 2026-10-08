import { useState, useEffect, useMemo, useCallback } from "react";
import { Course } from "@/types/course";

const SLUG_ALIASES: Record<string, string> = {
  "ui-ux-design-systems": "uiux-design",
  "uiux-design": "ui-ux-design-systems",
  "typescript-enterprise": "typescript",
  typescript: "typescript-enterprise",
  "web-performance-vitals": "web-performance",
  "web-performance": "web-performance-vitals",
  "fullstack-mastery": "full-stack",
  "full-stack": "fullstack-mastery",
};

export function getStoredCompletedLessonIds(slug: string): string[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    let stored = localStorage.getItem(`itlegend_progress_${slug}`);
    if (!stored && SLUG_ALIASES[slug]) {
      stored = localStorage.getItem(`itlegend_progress_${SLUG_ALIASES[slug]}`);
    }

    if (!stored) {
      return null;
    }

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
  course.curriculum.forEach((sec) => {
    sec.lessons.forEach((lesson) => {
      if (lesson.completed) {
        ids.add(lesson.id);
      }
    });
  });
  return ids;
}

export function getInitialCompletedLessonIds(course: Course): Set<string> {
  const ids = getCurriculumCompletedLessonIds(course);

  // Hydrate from localStorage if available on client
  const stored = getStoredCompletedLessonIds(course.slug);
  if (stored && stored.length > 0) {
    stored.forEach((id) => ids.add(id));
  }

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
    (acc, sec) => acc + sec.lessons.length,
    0,
  );

  if (totalLessons === 0) return 0;

  let completedCount = 0;
  course.curriculum.forEach((sec) => {
    sec.lessons.forEach((l) => {
      if (completedSet.has(l.id)) {
        completedCount++;
      }
    });
  });

  if (completedCount >= totalLessons) return 100;
  return Math.min(100, Math.round((completedCount / totalLessons) * 100));
}

export function getCourseStatus(
  progress: number,
): "completed" | "in-progress" | "not-started" {
  if (progress === 100) return "completed";
  if (progress > 0) return "in-progress";
  return "not-started";
}

export function syncCourseWithProgress(course: Course): Course {
  const completedIds = getInitialCompletedLessonIds(course);
  const progress = calculateCourseProgress(course, completedIds);
  const status = getCourseStatus(progress);

  const enrichedCurriculum = course.curriculum.map((sec) => ({
    ...sec,
    lessons: sec.lessons.map((l) => ({
      ...l,
      completed: completedIds.has(l.id),
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
    () => getInitialCompletedLessonIds(course),
  );

  useEffect(() => {
    setCompletedLessonIds(getInitialCompletedLessonIds(course));
  }, [course.slug]);

  const progress = calculateCourseProgress(course, completedLessonIds);

  const completeLesson = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      if (prev.has(lessonId)) return prev;

      const next = new Set(prev);
      next.add(lessonId);

      try {
        localStorage.setItem(
          `itlegend_progress_${course.slug}`,
          JSON.stringify([...next]),
        );
      } catch {}

      return next;
    });
  };

  return {
    completedLessonIds,
    progress,
    completeLesson,
  };
}
