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
import { FileText } from 'lucide-react';

interface CoursePlayerClientProps {
  initialCourse: Course;
}

export const CoursePlayerClient: React.FC<CoursePlayerClientProps> = ({
  initialCourse,
}) => {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [comments, setComments] = useState<CommentItem[]>(initialCourse.comments);
  const [isWideMode, setIsWideMode] = useState<boolean>(false);

  useEffect(() => {
    setCourse(syncCourseWithProgress(initialCourse));
  }, [initialCourse.slug, initialCourse]);

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

  const handleCompleteLesson = React.useCallback((lessonId: string) => {
    completeLesson(lessonId);
    setCourse((prev) => syncCourseWithProgress(prev));
  }, [completeLesson]);

  // Course navigation & curriculum orchestration
  const {
    currentLesson,
    currentLessonId,
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

  // Dedicated named modal open handlers (shared across all placements)
  const handleOpenExam = (lesson: LessonItem) => {
    if (lesson.type === 'exam') {
      setActiveExamLesson(lesson);
      setIsExamModalOpen(true);
    }
  };

  const handleOpenPdf = (lesson?: LessonItem) => {
    const target =
      lesson?.type === 'pdf'
        ? lesson
        : currentLesson?.type === 'pdf'
        ? currentLesson
        : allLessons.find((l) => l.type === 'pdf') || null;

    if (target) {
      setActivePdfLesson(target);
      setIsPdfModalOpen(true);
    }
  };

  const handlePdfComplete = () => {
    if (activePdfLesson) {
      handleCompleteLesson(activePdfLesson.id);
    }
  };

  // Lesson selection handler
  const handleSelectLesson = (lesson: LessonItem) => {
    selectLesson(lesson);

    if (lesson.type === 'exam') {
      handleOpenExam(lesson);
    } else if (lesson.type === 'pdf') {
      handleOpenPdf(lesson);
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

  // Add Comment handler 
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
    if (!activeExamLesson) return;
    handleCompleteLesson(activeExamLesson.id);
    if (nextLesson) {
      selectLesson(nextLesson);
    }
  };

  const videoPlayerNode = (
    <div
      ref={playerRef}
      className="order-1 sticky top-0 z-40 md:static bg-background py-2 sm:py-0 scroll-mt-4"
    >
      {currentLesson?.type === 'pdf' ? (
        <div className="relative w-full aspect-video rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center shadow-md overflow-hidden select-none">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-lg px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg mb-3 sm:mb-4">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                PDF Document
              </span>
              {currentLesson.pdfPages && (
                <span className="text-xs text-slate-400 font-mono">
                  {currentLesson.pdfPages} Pages
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-xl font-bold text-white mb-2 line-clamp-2">
              {currentLesson.pdfTitle || currentLesson.title}
            </h3>

            {currentLesson.description && (
              <p className="text-xs sm:text-sm text-slate-300 mb-5 line-clamp-2 max-w-md">
                {currentLesson.description}
              </p>
            )}

            <button
              type="button"
              onClick={() => handleOpenPdf(currentLesson)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Open PDF
            </button>
          </div>
        </div>
      ) : (
        <VideoPlayer
          currentLesson={currentLesson}
          courseThumbnail={course.thumbnail}
          isWideMode={isWideMode}
          onToggleWideMode={() => setIsWideMode((prev) => !prev)}
          onLessonEnded={handleLessonEnded}
        />
      )}
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
      onOpenPdfModal={handleOpenPdf}
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
      currentLessonId={currentLessonId}
      progressPercentage={courseProgress}
      onSelectLesson={handleSelectLesson}
      onOpenExamModal={handleOpenExam}
      onOpenPdfModal={handleOpenPdf}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col text-slate-800">
      <main className="flex-1 player-container w-full max-w-[1304px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb & Title */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb courseTitle={course.title} />
          <h1 className="text-xl sm:text-2xl lg:text-[30px] font-extrabold text-slate-900 tracking-tight leading-tight mt-2 break-words">
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
        onClose={() => {
          setIsExamModalOpen(false);
          setActiveExamLesson(null);
        }}
        examData={activeExamLesson?.examData}
        onExamComplete={handleExamComplete}
      />

      <PdfModal
        isOpen={isPdfModalOpen && Boolean(activePdfLesson)}
        onClose={() => {
          setIsPdfModalOpen(false);
          setActivePdfLesson(null);
        }}
        onComplete={handlePdfComplete}
        pdfTitle={
          activePdfLesson?.pdfTitle ||
          activePdfLesson?.title ||
          `${course.title} Reference Guide (PDF)`
        }
        pdfUrl={activePdfLesson?.pdfUrl}
        pdfContent={activePdfLesson?.pdfContent}
        courseTitle={course.title}
      />

      <AskQuestionModal
        isOpen={isAskQuestionOpen}
        onClose={() => setIsAskQuestionOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentProgress={courseProgress}
      />
    </div>
  );
};
