'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Lock,
  FileText,
  Plus,
  Minus,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { CurriculumSection, LessonItem } from '@/types/course';

interface CurriculumSidebarProps {
  curriculum: CurriculumSection[];
  currentLessonId: string;
  progressPercentage: number;
  onSelectLesson: (lesson: LessonItem) => void;
  onOpenExamModal?: (lesson: LessonItem) => void;
  onOpenPdfModal?: (lesson: LessonItem) => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  curriculum,
  currentLessonId,
  progressPercentage,
  onSelectLesson,
  onOpenExamModal,
  onOpenPdfModal,
}) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(() => {
    if (currentLessonId) {
      const parent = curriculum.find((sec) =>
        sec.lessons.some((l) => l.id === currentLessonId)
      );
      if (parent) return parent.id;
    }
    return curriculum[0]?.id || null;
  });

  useEffect(() => {
    if (!currentLessonId) return;
    const parentSection = curriculum.find((sec) =>
      sec.lessons.some((l) => l.id === currentLessonId)
    );
    if (parentSection) {
      setOpenSectionId(parentSection.id);
    }
  }, [currentLessonId, curriculum]);

  const [animatedProgress, setAnimatedProgress] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 200);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const toggleSection = (sectionId: string) => {
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  const clampedProgressLeft = `clamp(22px, ${Math.min(
    Math.max(animatedProgress, 0),
    100
  )}%, calc(100% - 22px))`;
  
  return (
    <aside
      aria-labelledby="curriculum-heading"
      className="w-full scroll-mt-24"
    >
      {/* Title */}
      <h2
        id="curriculum-heading"
        className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 tracking-tight"
      >
        Topics for This Course
      </h2>

      {/* Progress Section */}
      <div className="mb-8 w-full">
        <div className="relative w-full h-[92px]">
          {/* You marker */}
          <div
            className="absolute top-0 z-10 w-9 -translate-x-1/2 transition-[left] duration-700 ease-out"
            style={{ left: clampedProgressLeft }}
          >
            <div className="flex flex-col items-center">
              {/* You circle */}
              <div
                className="
                  flex
                  h-[36px]
                  w-[36px]
                  items-center
                  justify-center
                  rounded-full
                  border-[2px]
                  border-[#C8C8C8]
                  bg-white
                  text-[14px]
                  font-normal
                  leading-none
                  text-marker
                "
              >
                You
              </div>

              {/* Triangle Pointer */}
              <span
                aria-hidden="true"
                className="
                  mt-1
                  block
                  h-0
                  w-0
                  self-center
                  border-l-[4px]
                  border-r-[4px]
                  border-t-[5px]
                  border-l-transparent
                  border-r-transparent
                  border-t-[#C8C8C8]
                "
              />
            </div>
          </div>

          {/* Progress bar track */}
          <div className="pt-[52px]">
            <div
              className="
                relative
                h-[6px]
                w-full
                overflow-hidden
                rounded-full
                bg-track
              "
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={animatedProgress}
              aria-label="Course progress"
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-progress
                  transition-[width]
                  duration-700
                  ease-out
                "
                style={{
                  width: `${animatedProgress}%`,
                }}
              />
            </div>
          </div>

          {/* Percentage directly under You marker */}
          <div
            className="
              absolute
              top-[70px]
              -translate-x-1/2
              whitespace-nowrap
              text-[15px]
              font-normal
              leading-none
              text-marker
              transition-[left]
              duration-700
              ease-out
            "
            style={{ left: clampedProgressLeft }}
          >
            {animatedProgress}%
          </div>
        </div>
      </div>

      {/* Accordion Cards List  */}
      <div className="space-y-3.5 sm:space-y-4">
        {curriculum.map((section) => {
          const isOpen = openSectionId === section.id;

          return (
            <div
              key={section.id}
              className="bg-white rounded-[2px] border border-[#EEEEEE] overflow-hidden shadow-none transition-colors"
            >
              {/* Card Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
                className="w-full px-4.5 py-3.5 sm:px-5 sm:py-4 flex items-start justify-between text-left hover:bg-slate-50/40 transition-colors cursor-pointer"
              >
                <div className="pr-3 flex-1 min-w-0">
                  <h3 className="text-[14.5px] sm:text-[15px] font-semibold text-[#1F242F] leading-snug">
                    <span className="lg:hidden">
                      {section.mobileTitle || section.week}
                    </span>
                    <span className="hidden lg:inline">{section.week}</span>
                  </h3>
                  <p className="hidden lg:block text-[12px] text-[#7A7D82] mt-1 leading-relaxed font-normal break-words">
                    {section.title}
                  </p>
                </div>
                <div className="text-[#9EA3AE] mt-0.5 shrink-0">
                  {/* Mobile +/- */}
                  <span className="lg:hidden">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                    )}
                  </span>
                  {/* Desktop Chevrons */}
                  <span className="hidden lg:inline">
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 stroke-[1.5] text-[#9EA3AE]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 stroke-[1.5] text-[#9EA3AE]" />
                    )}
                  </span>
                </div>
              </button>

              {/* Separator under header if open */}
              {isOpen && <div className="mx-4.5 sm:mx-5 border-t border-[#EEEEEE]" />}

              {/* Lesson Items inside Section */}
              {isOpen && (
                <div>
                  {section.lessons.map((lesson, idx) => {
                    const isLast = idx === section.lessons.length - 1;
                    const isCurrent = lesson.id === currentLessonId;
                    const badgeQuestions =
                      lesson.type === 'exam' && lesson.examData
                        ? `${lesson.examData.questions.length} QUESTION${
                            lesson.examData.questions.length === 1 ? '' : 'S'
                          }`
                        : lesson.badgeQuestions;
                    const badgeDuration =
                      lesson.type === 'exam' && lesson.examData
                        ? `${Math.round(
                            lesson.examData.durationSeconds / 60
                          )} MINUTES`
                        : lesson.badgeDuration;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          onSelectLesson(lesson);
                          if (lesson.type === 'exam') {
                            onOpenExamModal?.(lesson);
                          } else if (lesson.type === 'pdf') {
                            onOpenPdfModal?.(lesson);
                          }
                        }}
                        className={`w-full text-left px-4.5 sm:px-5 transition-colors cursor-pointer group ${
                          isCurrent
                            ? 'bg-[#FAFAFA]'
                            : 'hover:bg-[#F9FAFB]/70'
                        }`}
                      >
                        <div
                          className={`py-2.5 sm:py-3 flex items-center justify-between gap-3 ${
                            isLast ? '' : 'border-b border-[#EEEEEE]'
                          }`}
                        >
                          {/* Left: Icon & Lesson Title */}
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#65A98A] stroke-[1.75]" />
                            ) : isCurrent ? (
                              <div className="w-3.5 h-3.5 rounded-full bg-[#65A98A] text-white flex items-center justify-center shrink-0">
                                <Play className="w-2 h-2 fill-current" />
                              </div>
                            ) : (
                              <FileText
                                className="w-3.5 h-3.5 shrink-0 text-[#9EA3AE] stroke-[1.5] group-hover:text-[#64748B]"
                              />
                            )}
                            <span
                              className={`min-w-0 whitespace-normal break-words text-[13px] sm:text-[13.5px] leading-snug ${
                                isCurrent
                                  ? 'font-medium text-[#22252A]'
                                  : 'font-normal text-[#3F4146]'
                              }`}
                            >
                              {lesson.title}
                            </span>
                          </div>

                          {/* Right: Badges or Lock */}
                          <div className="flex shrink-0 flex-col items-end justify-center gap-1">
                            {badgeQuestions && (
                              <span
                                className="
                                  inline-flex items-center justify-center
                                  rounded-[2px]
                                  bg-[#F2FAF8]
                                  px-1.5 py-0.5
                                  text-[10px] font-medium leading-none
                                  tracking-tight
                                  text-[#65A98A]
                                  whitespace-nowrap
                                "
                              >
                                {badgeQuestions}
                              </span>
                            )}

                            {badgeDuration && (
                              <span
                                className="
                                  inline-flex items-center justify-center
                                  rounded-[2px]
                                  bg-[#FDF2F4]
                                  px-1.5 py-0.5
                                  text-[10px] font-medium leading-none
                                  tracking-tight
                                  text-[#D8727D]
                                  whitespace-nowrap
                                "
                              >
                                {badgeDuration}
                              </span>
                            )}

                            {!badgeQuestions && !badgeDuration && (
                              <Lock
                                className="h-3.5 w-3.5 text-[#C4C7CE] stroke-[1.5]"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
