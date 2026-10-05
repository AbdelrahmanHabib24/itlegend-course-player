'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Course, LessonItem, CommentItem } from '@/types/course';
import { Breadcrumb } from '@/components/player/Breadcrumb';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { SectionQuickNav } from '@/components/player/SectionQuickNav';
import { CourseMaterials } from '@/components/player/CourseMaterials';
import { CommentsSection } from '@/components/player/CommentsSection';
import { CurriculumSidebar } from '@/components/player/CurriculumSidebar';
import { ExamModal } from '@/components/modals/ExamModal';
import { PdfModal } from '@/components/modals/PdfModal';
import { AskQuestionModal } from '@/components/modals/AskQuestionModal';
import { LeaderboardModal } from '@/components/modals/LeaderboardModal';
import { useCourseProgress, syncCourseWithProgress } from '@/hooks/useCourseProgress';
import { useCourseNavigation } from '@/hooks/useCourseNavigation';

interface CoursePlayerClientProps {
  initialCourse: Course;
}

export const CoursePlayerClient: React.FC<CoursePlayerClientProps> = ({
  initialCourse,
}) => {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [comments, setComments] = useState<CommentItem[]>(initialCourse.comments);
  const [isWideMode, setIsWideMode] = useState<boolean>(false);

  // Sync course with persisted completion data on client mount / course slug change
  useEffect(() => {
    setCourse(syncCourseWithProgress(initialCourse));
  }, [initialCourse.slug, initialCourse]);

  // Load persisted course-specific comments on mount / slug change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`itlegend_comments_${initialCourse.slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setComments(parsed);
          return;
        }
      }
    } catch {
      // Fallback to initial comments on storage or parse errors
    }
    setComments(initialCourse.comments);
  }, [initialCourse.slug, initialCourse.comments]);

  // Scroll target refs
  const playerRef = useRef<HTMLDivElement | null>(null);
  const curriculumRef = useRef<HTMLDivElement | null>(null);
  const mobileCurriculumRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  // Modal states
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [activeExamLesson, setActiveExamLesson] = useState<LessonItem | null>(null);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activePdfLesson, setActivePdfLesson] = useState<LessonItem | null>(null);

  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Course progress tracking & completion
  const { completedLessonIds, progress: courseProgress, completeLesson } =
    useCourseProgress(course);

  // Complete lesson wrapper that updates progress state & course curriculum
  const handleCompleteLesson = React.useCallback((lessonId: string) => {
    completeLesson(lessonId);
    setCourse((prev) => syncCourseWithProgress(prev));
  }, [completeLesson]);

  // Course navigation & curriculum orchestration
  const {
    currentLesson,
    allLessons,
    nextLesson,
    selectLesson,
    handleLessonEnded,
    enrichedCurriculum,
  } = useCourseNavigation({
    course,
    completedLessonIds,
    onLessonComplete: handleCompleteLesson,
  });

  // Resolve active/fallback modal lesson items
  const activeExam =
    activeExamLesson ||
    (currentLesson.type === 'exam' ? currentLesson : allLessons.find((l) => l.type === 'exam')) ||
    null;

  const activePdf =
    activePdfLesson ||
    (currentLesson.type === 'pdf' ? currentLesson : allLessons.find((l) => l.type === 'pdf')) ||
    null;

  const handlePdfComplete = React.useCallback(() => {
    if (activePdf) {
      handleCompleteLesson(activePdf.id);
    }
  }, [activePdf, handleCompleteLesson]);

  // Lesson selection handler
  const handleSelectLesson = (lesson: LessonItem) => {
    selectLesson(lesson);

    if (lesson.type === 'exam') {
      setActiveExamLesson(lesson);
      setIsExamModalOpen(true);
    } else if (lesson.type === 'pdf') {
      setActivePdfLesson(lesson);
      setIsPdfModalOpen(true);
    } else if (lesson.type === 'video') {
      playerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // React ref-based smooth scroll handlers
  const scrollToCurriculum = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const target = isMobile && mobileCurriculumRef.current
      ? mobileCurriculumRef.current
      : curriculumRef.current;

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Add Comment handler with course-specific localStorage persistence
  const handleAddComment = (content: string) => {
    const newComment: CommentItem = {
      id: `c-user-${Date.now()}`,
      authorName: 'Abdelrahman Habib',
      authorAvatar: '/images/student-avatar-1.png',
      date: 'Just now',
      content,
    };

    setComments((prev) => {
      const updated = [newComment, ...prev];
      try {
        localStorage.setItem(
          `itlegend_comments_${initialCourse.slug}`,
          JSON.stringify(updated)
        );
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  // Exam completion handler
  const handleExamComplete = () => {
    if (!activeExam) return;
    handleCompleteLesson(activeExam.id);
    if (nextLesson) {
      selectLesson(nextLesson);
    }
  };

  // Common UI blocks to eliminate duplication between Wide and Standard layouts
  const videoPlayerNode = (
    <div
      ref={playerRef}
      className="order-1 sticky top-0 z-40 md:static bg-background -mx-4 px-4 py-2 sm:mx-0 sm:px-0 sm:py-0 scroll-mt-4"
    >
      <VideoPlayer
        currentLesson={currentLesson}
        courseThumbnail={course.thumbnail}
        isWideMode={isWideMode}
        onToggleWideMode={() => setIsWideMode((prev) => !prev)}
        onLessonEnded={handleLessonEnded}
      />
    </div>
  );

  const quickNavNode = (
    <SectionQuickNav
      onScrollToCurriculum={scrollToCurriculum}
      onScrollToComments={scrollToComments}
      onOpenAskQuestion={() => setIsAskQuestionOpen(true)}
      onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
    />
  );

  const courseMaterialsNode = (
    <CourseMaterials
      course={course}
      onOpenPdfModal={() => setIsPdfModalOpen(true)}
    />
  );

  const commentsNode = (
    <div ref={commentsRef} className="order-5 scroll-mt-20 sm:scroll-mt-24">
      <CommentsSection
        comments={comments}
        onAddComment={handleAddComment}
      />
    </div>
  );

  const curriculumSidebarNode = (
    <CurriculumSidebar
      curriculum={enrichedCurriculum}
      currentLessonId={currentLesson.id}
      progressPercentage={courseProgress}
      onSelectLesson={handleSelectLesson}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col text-slate-800">
      <main className="flex-1 player-container w-full max-w-[1304px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb & Title */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb courseTitle={course.title} />
          <h1 className="text-xl sm:text-2xl lg:text-[30px] font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
            {course.title}
          </h1>
        </div>

        {/* Theater / Wide Mode Layout vs Standard 2-Column Layout */}
        {isWideMode ? (
          <div className="space-y-6">
            {videoPlayerNode}
            {quickNavNode}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 xl:col-span-8">
                {courseMaterialsNode}
                {commentsNode}
              </div>

              <div
                ref={curriculumRef}
                className="lg:col-span-5 xl:col-span-4 scroll-mt-20 sm:scroll-mt-24"
              >
                {curriculumSidebarNode}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
            <div className="w-full lg:col-span-7 xl:col-span-8 flex flex-col">
              {videoPlayerNode}
              <div className="order-2">{quickNavNode}</div>
              <div className="order-3">{courseMaterialsNode}</div>
              <div
                ref={mobileCurriculumRef}
                className="order-4 lg:hidden my-6 scroll-mt-20 sm:scroll-mt-24"
              >
                {curriculumSidebarNode}
              </div>
              {commentsNode}
            </div>

            <div
              ref={curriculumRef}
              className="hidden lg:block lg:col-span-5 xl:col-span-4 scroll-mt-20 sm:scroll-mt-24"
            >
              {curriculumSidebarNode}
            </div>
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        examData={activeExam?.examData}
        onExamComplete={handleExamComplete}
      />

      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onComplete={handlePdfComplete}
        pdfTitle={
          activePdf?.pdfTitle ||
          activePdf?.title ||
          `${course.title} Reference Guide (PDF)`
        }
        pdfUrl={activePdf?.pdfUrl || '/docs/seo-fundamentals.pdf'}
        pdfContent={activePdf?.pdfContent}
        courseTitle={course.title}
      />

      <AskQuestionModal
        isOpen={isAskQuestionOpen}
        onClose={() => setIsAskQuestionOpen(false)}
        onQuestionSubmitted={() => {}}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentProgress={courseProgress}
      />
    </div>
  );
};
