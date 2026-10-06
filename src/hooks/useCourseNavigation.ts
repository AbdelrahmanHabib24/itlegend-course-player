'use strict';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Course, LessonItem, CurriculumSection } from '@/types/course';

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
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return [];
    return course.curriculum.flatMap((sec) => sec.lessons);
  }, [course?.curriculum]);

  const initialLesson = useMemo<LessonItem | null>(() => {
    if (!allLessons || allLessons.length === 0) return null;

    // 1. Explicitly stored/current lesson for this course
    if (explicitCurrentLessonId) {
      const explicit = allLessons.find((l) => l.id === explicitCurrentLessonId);
      if (explicit) return explicit;
    }

    const currentMarked = allLessons.find((l) => l.isCurrent);
    if (currentMarked) {
      return currentMarked;
    }

    // 2. First uncompleted lesson
    const uncompletedLesson = allLessons.find((l) => !completedLessonIds.has(l.id));
    if (uncompletedLesson) {
      return uncompletedLesson;
    }

    // 3. First available lesson (never force final lesson on completed course)
    return allLessons[0];
  }, [allLessons, completedLessonIds, explicitCurrentLessonId]);

  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(initialLesson);

  useEffect(() => {
    setCurrentLesson(initialLesson);
  }, [initialLesson]);

  const currentIndex = useMemo(() => {
    if (!currentLesson) return -1;
    return allLessons.findIndex((l) => l.id === currentLesson.id);
  }, [allLessons, currentLesson]);

  const currentLessonId = currentLesson?.id ?? '';

  const nextLesson = useMemo(() => {
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  }, [allLessons, currentIndex]);

  const previousLesson = useMemo(() => {
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  }, [allLessons, currentIndex]);

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
    if (onLessonComplete) {
      onLessonComplete(currentLesson.id);
    }
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  }, [currentLesson, nextLesson, onLessonComplete]);

  const enrichedCurriculum = useMemo<CurriculumSection[]>(() => {
    if (!course?.curriculum) return [];
    return course.curriculum.map((sec) => ({
      ...sec,
      lessons: sec.lessons.map((l) => ({
        ...l,
        isCurrent: currentLesson ? l.id === currentLesson.id : false,
        completed: completedLessonIds.has(l.id),
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
