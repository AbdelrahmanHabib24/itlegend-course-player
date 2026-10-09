
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Course, LessonItem, CommentItem } from "@/types/course";

import { Breadcrumb } from "@/components/player/Breadcrumb";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { SectionQuickNav } from "@/components/player/SectionQuickNav";
import { CourseMaterials } from "@/components/player/CourseMaterials";
import { CommentsSection } from "@/components/player/CommentsSection";
import { CurriculumSidebar } from "@/components/player/CurriculumSidebar";

import { ExamModal } from "@/components/modals/ExamModal";
import { PdfModal } from "@/components/modals/PdfModal";
import { AskQuestionModal } from "@/components/modals/AskQuestionModal";
import { LeaderboardModal } from "@/components/modals/LeaderboardModal";

import {
  useCourseProgress,
  syncCourseWithProgress,
} from "@/hooks/useCourseProgress";

import { useCourseNavigation } from "@/hooks/useCourseNavigation";

import { ClipboardCheck, FileText } from "lucide-react";

interface CoursePlayerClientProps {
  initialCourse: Course;
}

const scrollToElement = (element: HTMLElement | null) => {
  element?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

export const CoursePlayerClient = ({
  initialCourse,
}: CoursePlayerClientProps) => {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [comments, setComments] = useState<CommentItem[]>(
    initialCourse.comments,
  );

  const commentsStorageKey = `itlegend_comments_${initialCourse.slug}`;

  // Synchronize course progress.
  useEffect(() => {
    setCourse(syncCourseWithProgress(initialCourse));
  }, [initialCourse]);

  // Load saved comments.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(commentsStorageKey);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setComments(parsed as CommentItem[]);
          return;
        }
      }
    } catch {
      // Ignore storage or parsing errors.
    }

    setComments(initialCourse.comments);
  }, [commentsStorageKey, initialCourse.comments]);

  // Scroll target refs.
  const playerRef = useRef<HTMLDivElement | null>(null);
  const curriculumRef = useRef<HTMLDivElement | null>(null);
  const mobileCurriculumRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  // Modal states.
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [activeExamLesson, setActiveExamLesson] = useState<LessonItem | null>(
    null,
  );

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activePdfLesson, setActivePdfLesson] = useState<LessonItem | null>(
    null,
  );

  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Course progress tracking.
  const {
    completedLessonIds,
    progress: courseProgress,
    completeLesson,
  } = useCourseProgress(course);

  const handleCompleteLesson = useCallback(
    (lessonId: string) => {
      completeLesson(lessonId);
      setCourse((prev) => syncCourseWithProgress(prev));
    },
    [completeLesson],
  );

  // Course navigation.
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

  // Open exam modal.
  const handleOpenExam = (lesson: LessonItem) => {
    if (lesson.type !== "exam") return;

    setActiveExamLesson(lesson);
    setIsExamModalOpen(true);
  };

  // Open PDF modal.
  const handleOpenPdf = (lesson: LessonItem) => {
    if (lesson.type !== "pdf") return;

    setActivePdfLesson(lesson);
    setIsPdfModalOpen(true);
  };

  // PDF completion.
  const handlePdfComplete = () => {
    if (!activePdfLesson) return;

    handleCompleteLesson(activePdfLesson.id);
  };

  // Lesson selection.
  const handleSelectLesson = (lesson: LessonItem) => {
    selectLesson(lesson);

    if (lesson.type === "exam") {
      handleOpenExam(lesson);
    } else if (lesson.type === "pdf") {
      handleOpenPdf(lesson);
    } else if (lesson.type === "video") {
      scrollToElement(playerRef.current);
    }
  };

  // Scroll to curriculum.
  const scrollToCurriculum = () => {
    const target =
      (window.innerWidth < 1024 ? mobileCurriculumRef.current : null) ??
      curriculumRef.current;

    scrollToElement(target);
  };

  // Scroll to comments.
  const scrollToComments = () => {
    scrollToElement(commentsRef.current);
  };

  // Add comment.
  const handleAddComment = (content: string) => {
    const newComment: CommentItem = {
      id: `c-user-${Date.now()}`,
      authorName: "Abdelrahman Habib",
      authorAvatar: "/images/student-avatar-1.png",
      date: "Just now",
      content,
    };

    const updatedComments = [newComment, ...comments];

    setComments(updatedComments);

    try {
      localStorage.setItem(
        commentsStorageKey,
        JSON.stringify(updatedComments),
      );
    } catch {
      // Ignore storage errors.
    }
  };

  // Exam completion.
  const handleExamComplete = () => {
    if (!activeExamLesson) return;

    handleCompleteLesson(activeExamLesson.id);

    if (nextLesson) {
      selectLesson(nextLesson);
    }
  };

 



// Video player.
const videoPlayerNode = (
  <div
    ref={playerRef}
    className="order-1 sticky top-0 z-40 md:static bg-background py-2 sm:py-0 scroll-mt-4"
  >
    {currentLesson?.type === "pdf" ? (
      // PDF Content
      <div className="relative w-full h-auto sm:aspect-video rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center py-5 px-3 sm:p-6 text-center shadow-md overflow-hidden select-none">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-2 sm:px-4">
          <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg mb-2.5 sm:mb-4 shrink-0">
            <FileText className="w-5 h-5 sm:w-8 sm:h-8" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap justify-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30 whitespace-nowrap">
              PDF Document
            </span>

            {currentLesson.pdfPages && (
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono whitespace-nowrap">
                {currentLesson.pdfPages} Pages
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2 line-clamp-2 leading-snug sm:leading-tight max-w-md">
            {currentLesson.title}
          </h3>

          {currentLesson.pdfTitle &&
            currentLesson.pdfTitle !== currentLesson.title && (
              <p className="text-[11px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2 font-medium line-clamp-1 max-w-md leading-normal">
                {currentLesson.pdfTitle}
              </p>
            )}

          {currentLesson.description && (
            <p className="text-[11px] sm:text-sm text-slate-300 mb-3 sm:mb-5 line-clamp-2 max-w-md leading-relaxed">
              {currentLesson.description}
            </p>
          )}

          <button
            type="button"
            onClick={() => handleOpenPdf(currentLesson)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer w-auto shrink-0"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Open PDF</span>
          </button>
        </div>
      </div>
    ) : currentLesson?.type === "exam" ? (
      // Exam Content
      <div className="relative w-full h-auto sm:aspect-video rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center py-5 px-3 sm:p-6 text-center shadow-md overflow-hidden select-none">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-2 sm:px-4">
          <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#405CFF] text-white flex items-center justify-center shadow-lg mb-2.5 sm:mb-4 shrink-0">
            <ClipboardCheck className="w-5 h-5 sm:w-8 sm:h-8" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap justify-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-[#405CFF]/20 text-[#8EA3FF] border border-[#405CFF]/30 whitespace-nowrap">
              Exam Assessment
            </span>

            {currentLesson.badgeQuestions && (
              <span className="text-[11px] sm:text-xs text-slate-400 whitespace-nowrap">
                {currentLesson.badgeQuestions}
              </span>
            )}

            {currentLesson.badgeDuration && (
              <span className="text-[11px] sm:text-xs text-slate-400 whitespace-nowrap">
                {currentLesson.badgeDuration}
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2 line-clamp-2 leading-snug sm:leading-tight max-w-md">
            {currentLesson.title}
          </h3>

          {currentLesson.description && (
            <p className="text-[11px] sm:text-sm text-slate-300 mb-3 sm:mb-5 line-clamp-2 max-w-md leading-relaxed">
              {currentLesson.description}
            </p>
          )}

          <button
            type="button"
            onClick={() => handleOpenExam(currentLesson)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#405CFF] hover:bg-[#334DE6] text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer w-auto shrink-0"
          >
            <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Start Assessment</span>
          </button>
        </div>
      </div>
    ) : currentLesson?.type === "video" ? (
      <VideoPlayer
        currentLesson={currentLesson}
        courseThumbnail={course.thumbnail}
        onLessonEnded={handleLessonEnded}
      />
    ) : null}
  </div>
);



  // Quick navigation.
  const quickNavNode = (
    <SectionQuickNav
      onScrollToCurriculum={scrollToCurriculum}
      onScrollToComments={scrollToComments}
      onOpenAskQuestion={() => setIsAskQuestionOpen(true)}
      onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
    />
  );

  // Course materials.
  const courseMaterialsNode = <CourseMaterials course={course} />;

  // Comments.
  const commentsNode = (
    <div ref={commentsRef} className="order-5 scroll-mt-20 sm:scroll-mt-24">
      <CommentsSection comments={comments} onAddComment={handleAddComment} />
    </div>
  );

  // Curriculum sidebar.
  const curriculumSidebarNode = (
    <CurriculumSidebar
      curriculum={enrichedCurriculum}
      currentLessonId={currentLessonId}
      progressPercentage={courseProgress}
      onSelectLesson={handleSelectLesson}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col text-slate-800">
      <main className="flex-1 player-container w-full max-w-[1304px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Breadcrumb courseTitle={course.title} />

          <h1 className="text-xl sm:text-2xl lg:text-[30px] font-extrabold text-slate-900 tracking-tight leading-tight mt-2 break-words">
            {course.title}
          </h1>
        </div>

        {/* Standard Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          <div className="w-full lg:col-span-7 xl:col-span-8 flex flex-col">
            {videoPlayerNode}

            <div className="order-2">{quickNavNode}</div>

            <div className="order-3">{courseMaterialsNode}</div>

            {/* Mobile Curriculum */}
            <div
              ref={mobileCurriculumRef}
              className="order-4 lg:hidden my-6 scroll-mt-20 sm:scroll-mt-24"
            >
              {curriculumSidebarNode}
            </div>

            {commentsNode}
          </div>

          {/* Desktop Curriculum */}
          <div
            ref={curriculumRef}
            className="hidden lg:block lg:col-span-5 xl:col-span-4 scroll-mt-20 sm:scroll-mt-24"
          >
            {curriculumSidebarNode}
          </div>
        </div>
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
        pdfTitle={activePdfLesson?.pdfTitle}
        pdfUrl={activePdfLesson?.pdfUrl}
        pdfPages={activePdfLesson?.pdfPages}
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
