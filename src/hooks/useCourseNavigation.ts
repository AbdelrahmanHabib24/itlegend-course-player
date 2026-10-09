
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Course, LessonItem, CurriculumSection } from '@/types/course';

const EMPTY_COMPLETED_LESSONS = new Set<string>();

interface UseCourseNavigationProps {
  course: Course;
  completedLessonIds?: Set<string>;
  currentLessonId?: string;
  onLessonComplete?: (lessonId: string) => void;
}

export function useCourseNavigation({
  course,
  completedLessonIds = EMPTY_COMPLETED_LESSONS,
  currentLessonId: explicitCurrentLessonId,
  onLessonComplete,
}: UseCourseNavigationProps) {
  // Get all lessons from the course.
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return [];

    return course.curriculum.flatMap((section) => section.lessons);
  }, [course?.curriculum]);

  // Determine the initial lesson.
  const initialLesson = useMemo<LessonItem | null>(() => {
    if (allLessons.length === 0) return null;

    if (explicitCurrentLessonId) {
      const explicitLesson = allLessons.find(
        (lesson) => lesson.id === explicitCurrentLessonId,
      );

      if (explicitLesson) return explicitLesson;
    }

    const currentMarked = allLessons.find((lesson) => lesson.isCurrent);
    if (currentMarked) return currentMarked;

    const uncompletedLesson = allLessons.find(
      (lesson) => !completedLessonIds.has(lesson.id),
    );

    return uncompletedLesson ?? allLessons[0];
  }, [allLessons, completedLessonIds, explicitCurrentLessonId]);

  const [currentLesson, setCurrentLesson] =
    useState<LessonItem | null>(initialLesson);

  const courseSlug = course.slug;

  // Reset the selected lesson when switching courses.
  useEffect(() => {
    setCurrentLesson(initialLesson);

    // Intentionally reset only when the course changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug]);

  const currentIndex = currentLesson
    ? allLessons.findIndex((lesson) => lesson.id === currentLesson.id)
    : -1;

  const currentLessonId = currentLesson?.id ?? '';

  const nextLesson =
    currentIndex >= 0 ? allLessons[currentIndex + 1] ?? null : null;

  const previousLesson =
    currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  const selectLesson = useCallback((lesson: LessonItem) => {
    setCurrentLesson(lesson);
  }, []);

  const goToNextLesson = useCallback(() => {
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  }, [nextLesson]);

  const goToPreviousLesson = useCallback(() => {
    if (previousLesson) {
      setCurrentLesson(previousLesson);
    }
  }, [previousLesson]);

  const handleLessonEnded = useCallback(() => {
    if (!currentLesson) return;

    onLessonComplete?.(currentLesson.id);

    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  }, [currentLesson, nextLesson, onLessonComplete]);

  // Add current and completed status to curriculum lessons.
  const enrichedCurriculum = useMemo<CurriculumSection[]>(() => {
    if (!course?.curriculum) return [];

    return course.curriculum.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) => ({
        ...lesson,
        isCurrent: lesson.id === currentLesson?.id,
        completed: completedLessonIds.has(lesson.id),
      })),
    }));
  }, [course?.curriculum, currentLesson, completedLessonIds]);

  return {
    currentLesson,
    currentLessonId,
    allLessons,
    currentIndex,
    nextLesson,
    previousLesson,
    selectLesson,
    goToNextLesson,
    goToPreviousLesson,
    handleLessonEnded,
    enrichedCurriculum,
  };
}
