'use strict';
'use client';

import React from 'react';
import { BookOpen, MessageSquare, HelpCircle, Trophy } from 'lucide-react';

interface SectionQuickNavProps {
  onScrollToCurriculum?: () => void;
  onScrollToComments?: () => void;
  onOpenAskQuestion?: () => void;
  onOpenLeaderboard?: () => void;
}

/**
 * Section 06 — Course Player Quick Actions
 * Preserves the exact visual structure:
 * 4 circular outline buttons with light border, generous spacing, and divider below.
 * Strictly implements the 4 annotated functional actions:
 * 1. Curriculum / Course Content (smooth-scroll to #curriculum)
 * 2. Comments (smooth-scroll to #comments)
 * 3. Ask Question (opens Ask Question modal with auto-saved localStorage draft)
 * 4. Leaderboard (opens Leaderboard modal)
 */
export const SectionQuickNav: React.FC<SectionQuickNavProps> = ({
  onScrollToCurriculum,
  onScrollToComments,
  onOpenAskQuestion,
  onOpenLeaderboard,
}) => {
  return (
   <div className="flex items-center gap-3 py-4 my-2 border-b border-slate-100">
  {/* 1. Curriculum / Course Content */}
  <button
    type="button"
    onClick={onScrollToCurriculum}
    aria-label="Course Curriculum"
    title="Course Curriculum"
    className="w-10 h-10 rounded-full border border-slate-200/90 bg-white text-slate-500 hover:text-[#5B6CB3] hover:border-[#5B6CB3] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
  >
    <BookOpen className="w-[18px] h-[18px]" />
  </button>

  {/* 2. Comments */}
  <button
    type="button"
    onClick={onScrollToComments}
    aria-label="Course Comments"
    title="Course Comments"
    className="w-10 h-10 rounded-full border border-slate-200/90 bg-white text-slate-500 hover:text-[#E47782] hover:border-[#E47782] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
  >
    <MessageSquare className="w-[18px] h-[18px]" />
  </button>

  {/* 3. Ask Question */}
  <button
    type="button"
    onClick={onOpenAskQuestion}
    aria-label="Ask Question"
    title="Ask Question"
    className="w-10 h-10 rounded-full border border-slate-200/90 bg-white text-slate-500 hover:text-[#8B63C7] hover:border-[#8B63C7] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
  >
    <HelpCircle className="w-[18px] h-[18px]" />
  </button>

  {/* 4. Leaderboard */}
  <button
    type="button"
    onClick={onOpenLeaderboard}
    aria-label="Student Leaderboard"
    title="Student Leaderboard"
    className="w-10 h-10 rounded-full border border-slate-200/90 bg-white text-slate-500 hover:text-[#D59B35] hover:border-[#D59B35] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
  >
    <Trophy className="w-[18px] h-[18px]" />
  </button>
</div>
  );
};
