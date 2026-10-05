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
  onOpenPdfModal?: () => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  curriculum,
  currentLessonId,
  progressPercentage,
  onSelectLesson,
  onOpenExamModal,
  onOpenPdfModal,
}) => {
  // First two sections open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    curriculum.forEach((sec, idx) => {
      initial[sec.id] = idx < 2;
    });
    return initial;
  });

  // When currentLessonId changes, ensure its parent section is open
  useEffect(() => {
    if (!currentLessonId) return;
    const parentSection = curriculum.find((sec) =>
      sec.lessons.some((l) => l.id === currentLessonId)
    );
    if (parentSection) {
      setOpenSections((prev) =>
        prev[parentSection.id] ? prev : { ...prev, [parentSection.id]: true }
      );
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
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

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
            style={{
              left: `clamp(22px, ${Math.min(Math.max(animatedProgress, 0), 100)}%, calc(100% - 22px))`,
            }}
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
            style={{
              left: `clamp(22px, ${Math.min(Math.max(animatedProgress, 0), 100)}%, calc(100% - 22px))`,
            }}
          >
            {animatedProgress}%
          </div>
        </div>
      </div>

      {/* Accordion Cards List  */}
      <div className="space-y-5">
        {curriculum.map((section) => {
          const isOpen = openSections[section.id] ?? false;
          const isSectionCompleted =
            section.lessons.length > 0 &&
            section.lessons.every((l) => l.completed);
          const isCurrentSection = section.lessons.some(
            (l) => l.id === currentLessonId
          );

          return (
            <div
              key={section.id}
              className="bg-white rounded-md border border-slate-200/90 overflow-hidden shadow-2xs transition-colors"
            >
              {/* Card Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
                className="w-full p-5 flex items-start justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="pr-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      <span className="lg:hidden">
                        {section.mobileTitle || section.week}
                      </span>
                      <span className="hidden lg:inline">{section.week}</span>
                    </h3>
                    {isSectionCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : isCurrentSection ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <Play className="w-2.5 h-2.5 fill-current" /> Current Week
                      </span>
                    ) : null}
                  </div>
                  <p className="hidden lg:block text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                    {section.title}
                  </p>
                </div>
                <div className="text-slate-500 mt-1 shrink-0 font-medium">
                  {/* Mobile +/- */}
                  <span className="lg:hidden">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                  {/* Desktop Chevrons */}
                  <span className="hidden lg:inline">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </span>
                </div>
              </button>

              {/* Separator under header if open */}
              {isOpen && <div className="mx-5 border-t border-border" />}

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
                            onOpenPdfModal?.();
                          }
                        }}
                        className={`w-full text-left px-5 transition-colors cursor-pointer group ${
                          isCurrent
                            ? 'bg-slate-50/80 font-semibold'
                            : 'hover:bg-slate-50/50 font-normal'
                        }`}
                      >
                        <div
                          className={`py-3.5 flex items-center justify-between gap-3 text-sm ${
                            isLast ? '' : 'border-b border-border'
                          }`}
                        >
                          {/* Left:  Lesson Title */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
                            ) : isCurrent ? (
                              <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Play className="w-2.5 h-2.5 fill-current" />
                              </div>
                            ) : (
                              <FileText
                                className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600"
                              />
                            )}
                            <span
                              className={`min-w-0 whitespace-normal break-words text-sm leading-5 ${
                                isCurrent
                                  ? 'font-semibold text-slate-900'
                                  : lesson.completed
                                  ? 'text-slate-800'
                                  : 'text-slate-600'
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
                                  rounded-md
                                  bg-[#E8F5F0]
                                  px-2 py-0.5
                                  text-[10px] font-semibold leading-none
                                  tracking-tight
                                  text-[#43B494]
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
                                  rounded-md
                                  bg-[#FCECEE]
                                  px-2 py-0.5
                                  text-[10px] font-semibold leading-none
                                  tracking-tight
                                  text-[#E47782]
                                  whitespace-nowrap
                                "
                              >
                                {badgeDuration}
                              </span>
                            )}

                            {!badgeQuestions && !badgeDuration && (
                              <Lock
                                className="h-4 w-4 text-slate-300"
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
