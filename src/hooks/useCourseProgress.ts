'use strict';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Course } from '@/types/course';

export function useCourseProgress(course: Course) {
  // Initial completed lesson IDs seeded from course curriculum
  const initialCompletedIds = useMemo(() => {
    const ids = new Set<string>();
    course.curriculum.forEach((sec) => {
      sec.lessons.forEach((lesson) => {
        if (lesson.completed) {
          ids.add(lesson.id);
        }
      });
    });
    return ids;
  }, [course.curriculum]);

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(initialCompletedIds);

  // Restore saved progress or seed from curriculum on mount / slug change
  useEffect(() => {
    const ids = new Set<string>();
    course.curriculum.forEach((sec) => {
      sec.lessons.forEach((lesson) => {
        if (lesson.completed) {
          ids.add(lesson.id);
        }
      });
    });

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`itlegend_progress_${course.slug}`);
        if (saved) {
          const parsed: string[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((id) => ids.add(id));
          }
        }
      } catch {
        // ignore storage errors
      }
    }

    setCompletedLessonIds(ids);
  }, [course.slug, course.curriculum]);

  // Persist completed lessons to localStorage whenever state updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (completedLessonIds.size > 0) {
        localStorage.setItem(
          `itlegend_progress_${course.slug}`,
          JSON.stringify(Array.from(completedLessonIds))
        );
      }
    } catch {
      // ignore storage errors
    }
  }, [completedLessonIds, course.slug]);

  // Total count of all lessons across all curriculum sections
  const totalLessons = useMemo(() => {
    return course.curriculum.reduce((acc, sec) => acc + sec.lessons.length, 0);
  }, [course.curriculum]);

  // Single source of truth: progress = completedLessonIds.size / totalLessons * 100
  const progress = useMemo(() => {
    if (totalLessons === 0) return 0;
    return Math.min(100, Math.round((completedLessonIds.size / totalLessons) * 100));
  }, [completedLessonIds, totalLessons]);

  // Action to mark a lesson as completed
  const completeLesson = useCallback((lessonId: string) => {
    setCompletedLessonIds((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });
  }, []);

  // Helper to test if a specific lesson is completed
  const isLessonCompleted = useCallback(
    (lessonId: string) => completedLessonIds.has(lessonId),
    [completedLessonIds]
  );

  // Helper to test if an entire section is completed
  const isSectionCompleted = useCallback(
    (sectionId: string) => {
      const section = course.curriculum.find((s) => s.id === sectionId);
      if (!section || section.lessons.length === 0) return false;
      return section.lessons.every((l) => completedLessonIds.has(l.id));
    },
    [course.curriculum, completedLessonIds]
  );

  return {
    completedLessonIds,
    progress,
    totalLessons,
    completeLesson,
    isLessonCompleted,
    isSectionCompleted,
  };
}
