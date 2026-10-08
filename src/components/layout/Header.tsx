'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, User } from 'lucide-react';

interface HeaderProps {
  onOpenLeaderboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLeaderboard }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 relative z-30 shadow-xs">
      <div className="max-w-[1304px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-bold text-[17px] leading-tight text-slate-900 tracking-tight">
              ITLegend
            </span>
          </Link>
        </div>

        {/* Navigation: My Learning */}
        <nav aria-label="Main Navigation" className="flex items-center justify-center">
          <Link
            href="/"
            className="px-3 sm:px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="whitespace-nowrap">My Learning</span>
          </Link>
        </nav>

        {/* Right Section: Student Account */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 overflow-hidden shadow-xs shrink-0">
              <User className="w-4.5 h-4.5 text-slate-600" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight whitespace-nowrap">
                Student Account
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
