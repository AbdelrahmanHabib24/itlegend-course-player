'use strict';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Course, LessonItem, CurriculumSection } from '@/types/course';

const EMPTY_COMPLETED_LESSONS = new Set<string>();

interface UseCourseNavigationProps {
  course: Course;
  completedLessonIds?: Set<string>;
  onLessonComplete?: (lessonId: string) => void;
}

export function useCourseNavigation({
  course,
  completedLessonIds = EMPTY_COMPLETED_LESSONS,
  onLessonComplete,
}: UseCourseNavigationProps) {
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return [];
    return course.curriculum.flatMap((sec) => sec.lessons);
  }, [course?.curriculum]);


  const initialLesson = useMemo<LessonItem | null>(() => {
    if (!allLessons || allLessons.length === 0) return null;

    const uncompletedLesson = allLessons.find((l) => !completedLessonIds.has(l.id));

    if (uncompletedLesson) {
      return uncompletedLesson;
    }

    return allLessons[allLessons.length - 1];
  }, [allLessons, completedLessonIds]);

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
