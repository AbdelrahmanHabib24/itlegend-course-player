'use strict';
'use client';

import React, { useState, useRef } from 'react';
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
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useCourseNavigation } from '@/hooks/useCourseNavigation';

interface CoursePlayerClientProps {
  initialCourse: Course;
}

export const CoursePlayerClient: React.FC<CoursePlayerClientProps> = ({
  initialCourse,
}) => {
  const [course, setCourse] = useState<Course>(initialCourse);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const desktopCurriculumRef = useRef<HTMLDivElement | null>(null);
  const mobileCurriculumRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  // Hook 1: Course progress & completion single source of truth
  const { completedLessonIds, progress: courseProgress, completeLesson } =
    useCourseProgress(course);

  // Hook 2: Course navigation & curriculum orchestration
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
    onLessonComplete: completeLesson,
  });

  // Wide/Theater mode state
  const [isWideMode, setIsWideMode] = useState<boolean>(false);

  // Modals state
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);
  const [activeExamLesson, setActiveExamLesson] = useState<LessonItem | null>(
    () => (currentLesson.type === 'exam' ? currentLesson : null)
  );

  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [activePdfLesson, setActivePdfLesson] = useState<LessonItem | null>(
    () => (currentLesson.type === 'pdf' ? currentLesson : null)
  );

  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  // Lesson selection handler — preserves completed lessons, updates current lesson
  const handleSelectLesson = (lesson: LessonItem) => {
    selectLesson(lesson);

    if (lesson.type === 'exam') {
      setActiveExamLesson(lesson);
      setIsExamModalOpen(true);
    } else if (lesson.type === 'pdf') {
      setActivePdfLesson(lesson);
      setIsPdfModalOpen(true);
    } else if (lesson.type === 'video') {
      if (playerRef.current) {
        const rect = playerRef.current.getBoundingClientRect();
        // If element is sticky on mobile/tablet (top <= 10 while scrolled down),
        // scroll smoothly to the player's natural top offset. Otherwise use scrollIntoView.
        if (rect.top <= 10 && typeof window !== 'undefined' && window.scrollY > 50) {
          const naturalTop = playerRef.current.parentElement
            ? playerRef.current.parentElement.offsetTop
            : 0;
          window.scrollTo({
            top: Math.max(0, naturalTop - 16),
            behavior: 'smooth',
          });
        } else {
          playerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }
  };

  // React ref-based smooth scroll handlers
  const scrollToCurriculum = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const target = isMobile
      ? mobileCurriculumRef.current || desktopCurriculumRef.current
      : desktopCurriculumRef.current || mobileCurriculumRef.current;

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

    setCourse((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
    }));
  };

  // Exam completion handler: marks exam lesson completed, updates progress, advances to next lesson
  const handleExamComplete = () => {
    if (!activeExamLesson) return;
    completeLesson(activeExamLesson.id);
    if (nextLesson) {
      selectLesson(nextLesson);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      {/* Main Content Area — No Global Header or Footer per original Figma Course Player reference */}
      <main className="flex-1 player-container w-full max-w-[1304px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb & Title: visible above video on all viewports */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb courseTitle={course.title} />
          <h1 className="text-xl sm:text-2xl lg:text-[30px] font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
            {course.title}
          </h1>
        </div>

        {/* Theater / Wide Mode Layout vs Standard 2-Column Layout */}
        {isWideMode ? (
          /* Wide / Theater Mode: Video takes full width, then 2 columns below */
          <div className="space-y-6">
            <div
              ref={playerRef}
              className="sticky top-0 z-40 md:static bg-[#F8FAFC] -mx-4 px-4 py-2 sm:mx-0 sm:px-0 sm:py-0 scroll-mt-4"
            >
              <VideoPlayer
                currentLesson={currentLesson}
                courseThumbnail={course.thumbnail}
                isWideMode={isWideMode}
                onToggleWideMode={() => setIsWideMode(!isWideMode)}
                onLessonEnded={handleLessonEnded}
              />
            </div>

            <SectionQuickNav
              onScrollToCurriculum={scrollToCurriculum}
              onScrollToComments={scrollToComments}
              onOpenAskQuestion={() => setIsAskQuestionOpen(true)}
              onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 xl:col-span-8">
                <CourseMaterials
                  course={course}
                  onOpenPdfModal={() => setIsPdfModalOpen(true)}
                />
                <div ref={commentsRef} className="scroll-mt-20 sm:scroll-mt-24">
                  <CommentsSection
                    comments={course.comments}
                    onAddComment={handleAddComment}
                  />
                </div>
              </div>

              <div ref={desktopCurriculumRef} className="lg:col-span-5 xl:col-span-4 scroll-mt-20 sm:scroll-mt-24">
                <CurriculumSidebar
                  curriculum={enrichedCurriculum}
                  currentLessonId={currentLesson.id}
                  progressPercentage={courseProgress}
                  onSelectLesson={handleSelectLesson}
                  onOpenExamModal={(lesson) => {
                    setActiveExamLesson(lesson);
                    setIsExamModalOpen(true);
                  }}
                  onOpenPdfModal={(lesson) => {
                    setActivePdfLesson(lesson);
                    setIsPdfModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Standard 2-Column Desktop / Responsive Mobile Layout matching Figma exactly */
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column on Desktop / Mobile Video + Headers */}
            <div className="w-full lg:col-span-7 xl:col-span-8 flex flex-col">
              {/* Video Player (Sticky on mobile <768px per Figma note) */}
              <div
                ref={playerRef}
                className="order-1 sticky top-0 z-40 md:static bg-[#F8FAFC] -mx-4 px-4 py-2 sm:mx-0 sm:px-0 sm:py-0 scroll-mt-4"
              >
                <VideoPlayer
                  currentLesson={currentLesson}
                  courseThumbnail={course.thumbnail}
                  isWideMode={isWideMode}
                  onToggleWideMode={() => setIsWideMode(!isWideMode)}
                  onLessonEnded={handleLessonEnded}
                />
              </div>

              {/* Quick Actions (4 Circular buttons matching Figma) */}
              <div className="order-2">
                <SectionQuickNav
                  onScrollToCurriculum={scrollToCurriculum}
                  onScrollToComments={scrollToComments}
                  onOpenAskQuestion={() => setIsAskQuestionOpen(true)}
                  onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                />
              </div>

              {/* Course Materials */}
              <div className="order-3">
                <CourseMaterials
                  course={course}
                  onOpenPdfModal={() => setIsPdfModalOpen(true)}
                />
              </div>

              {/* Mobile/Tablet Only: Topics for This Course placed before Comments per Mobile Figma */}
              <div ref={mobileCurriculumRef} className="order-4 lg:hidden my-6 scroll-mt-20 sm:scroll-mt-24">
                <CurriculumSidebar
                  curriculum={enrichedCurriculum}
                  currentLessonId={currentLesson.id}
                  progressPercentage={courseProgress}
                  onSelectLesson={handleSelectLesson}
                  onOpenExamModal={(lesson) => {
                    setActiveExamLesson(lesson);
                    setIsExamModalOpen(true);
                  }}
                  onOpenPdfModal={(lesson) => {
                    setActivePdfLesson(lesson);
                    setIsPdfModalOpen(true);
                  }}
                />
              </div>

              {/* Comments Section */}
              <div ref={commentsRef} className="order-5 scroll-mt-20 sm:scroll-mt-24">
                <CommentsSection
                  comments={course.comments}
                  onAddComment={handleAddComment}
                />
              </div>
            </div>

            {/* Desktop Only Right Column: Topics for This Course (Curriculum) */}
            <div ref={desktopCurriculumRef} className="hidden lg:block lg:col-span-5 xl:col-span-4 scroll-mt-20 sm:scroll-mt-24">
              <CurriculumSidebar
                curriculum={enrichedCurriculum}
                currentLessonId={currentLesson.id}
                progressPercentage={courseProgress}
                onSelectLesson={handleSelectLesson}
                onOpenExamModal={(lesson) => {
                  setActiveExamLesson(lesson);
                  setIsExamModalOpen(true);
                }}
                onOpenPdfModal={(lesson) => {
                  setActivePdfLesson(lesson);
                  setIsPdfModalOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        examData={activeExamLesson?.examData}
        onExamComplete={handleExamComplete}
      />

      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onComplete={() => {
          const target = activePdfLesson || allLessons.find((l) => l.type === 'pdf');
          if (target) {
            completeLesson(target.id);
          }
        }}
        pdfTitle={
          activePdfLesson?.pdfTitle ||
          activePdfLesson?.title ||
          allLessons.find((l) => l.type === 'pdf')?.pdfTitle ||
          `${course.title} Reference Guide (PDF)`
        }
        pdfUrl={
          activePdfLesson?.pdfUrl ||
          allLessons.find((l) => l.type === 'pdf')?.pdfUrl ||
          '/docs/seo-fundamentals.pdf'
        }
        pdfContent={
          activePdfLesson?.pdfContent ||
          allLessons.find((l) => l.type === 'pdf')?.pdfContent
        }
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
