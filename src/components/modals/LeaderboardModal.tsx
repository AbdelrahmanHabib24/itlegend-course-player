'use strict';
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 p-6 animate-slide-up max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Leaderboard</h2>
              <p className="text-[11px] text-slate-500">Top learners by completed lessons & quiz points</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Motivational Message Area (Eng. Ali Shaheen) — Compact & Professional */}
        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0" dir="rtl">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20B486]" />
              <span className="text-xs font-semibold text-slate-900">رسالة تشجيعية من م. علي شاهين</span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200/60 shadow-2xs">
              {mentorQuote.levelName}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            &ldquo;{mentorQuote.quote}&rdquo;{' '}
            <span className="inline-block mr-1">
              {mentorQuote.emoji}
            </span>
          </p>
        </div>

        {/* Scrollable Leaderboard List */}
        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {LEADERBOARD_USERS.map((user) => {
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={user.rank}
                className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  isCurrentUser
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200/50'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                {/* Rank & User */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      user.rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-2xs'
                        : user.rank === 2
                        ? 'bg-slate-200 text-slate-800'
                        : user.rank === 3
                        ? 'bg-amber-700/80 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {user.rank}
                  </div>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurrentUser ? 'text-emerald-800' : 'text-slate-800'
                        }`}
                      >
                        {user.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <span>{user.completedLessons} Lessons</span>
                      <span>•</span>
                      <span className="text-amber-600 font-medium">{user.badge}</span>
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 block font-mono">
                    {user.points} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-slate-100 shrink-0 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
