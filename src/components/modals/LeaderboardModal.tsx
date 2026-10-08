'use client';

import React from 'react';
import { X, Trophy } from 'lucide-react';
import { LEADERBOARD_USERS } from '@/data/leaderboardData';
import { getMentorQuoteForProgress } from '@/data/mentorQuotes';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentProgress = 63,
}) => {
  if (!isOpen) return null;

  const mentorQuote = getMentorQuoteForProgress(currentProgress);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-6 animate-slide-up max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/50">
              <Trophy className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Student Leaderboard
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Top learners by completed lessons & quiz points
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Motivational Message Area (Eng. Ali Shaheen) — Compact, Subtle & Professional */}
        <div
          dir="rtl"
          className="mb-3.5 px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200/70 shrink-0 text-right"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-medium text-slate-500">
              رسالة تشجيعية من م. علي شاهين
            </span>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {mentorQuote.levelName}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            &ldquo;{mentorQuote.quote}&rdquo;
          </p>
        </div>

        {/* Scrollable Leaderboard List */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1 -mr-1">
          {LEADERBOARD_USERS.map((user) => {
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={user.rank}
                className={`py-2.5 sm:py-3 px-2 sm:px-2.5 flex items-center justify-between gap-2.5 sm:gap-3 transition-colors ${
                  isCurrentUser
                    ? 'bg-emerald-50/70 border border-emerald-200/80 rounded-lg my-1'
                    : 'hover:bg-slate-50/60 rounded-lg'
                }`}
              >
                {/* Left: Rank, Avatar, Student Info */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  {/* Rank */}
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 ${
                      user.rank === 1
                        ? 'bg-amber-100 text-amber-800'
                        : user.rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : user.rank === 3
                            ? 'bg-amber-50 text-amber-900/80'
                            : 'text-slate-400 font-semibold'
                    }`}
                  >
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200/80 shrink-0"
                  />

                  {/* Name & Secondary Metadata */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate leading-snug ${
                        isCurrentUser
                          ? 'text-emerald-900 font-bold'
                          : 'text-slate-900'
                      }`}
                    >
                      {user.name}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 min-w-0">
                      <span className="shrink-0">{user.completedLessons} Lessons</span>
                      <span className="text-slate-500 truncate text-[10.5px]">
                        {user.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Points */}
                <div className="text-right shrink-0 pl-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal ml-1">
                    pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
