'use strict';

import { useState, useMemo, useCallback } from 'react';
import { Course, LessonItem } from '@/types/course';

interface UseCourseNavigationProps {
  course: Course;
  completedLessonIds?: Set<string>;
  onLessonComplete?: (lessonId: string) => void;
}

export function useCourseNavigation({
  course,
  completedLessonIds = new Set(),
  onLessonComplete,
}: UseCourseNavigationProps) {
  // All lessons in sequential curriculum order
  const allLessons = useMemo(() => {
    return course.curriculum.flatMap((sec) => sec.lessons);
  }, [course.curriculum]);

  // Initial active lesson: first marked as isCurrent, or first available lesson
  const initialLesson = useMemo(() => {
    return allLessons.find((l) => l.isCurrent) || allLessons[0];
  }, [allLessons]);

  const [currentLesson, setCurrentLesson] = useState<LessonItem>(initialLesson);

  const currentIndex = useMemo(() => {
    return allLessons.findIndex((l) => l.id === currentLesson.id);
  }, [allLessons, currentLesson.id]);

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

  // Orchestrates lesson transition on completion: marks current lesson completed and advances
  const handleLessonEnded = useCallback(() => {
    if (onLessonComplete) {
      onLessonComplete(currentLesson.id);
    }
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  }, [currentLesson.id, nextLesson, onLessonComplete]);

  // Enriched curriculum with currentLesson and completed statuses
  const enrichedCurriculum = useMemo(() => {
    return course.curriculum.map((sec) => ({
      ...sec,
      lessons: sec.lessons.map((l) => ({
        ...l,
        isCurrent: l.id === currentLesson.id,
        completed: completedLessonIds.has(l.id),
      })),
    }));
  }, [course.curriculum, currentLesson.id, completedLessonIds]);

  return {
    currentLesson,
    currentLessonId: currentLesson.id,
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
