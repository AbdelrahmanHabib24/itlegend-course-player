'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenLeaderboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLeaderboard }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-200 relative z-30 shadow-xs">
      <div className="max-w-[1304px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[17px] leading-tight text-slate-900 tracking-tight">
                ITLegend
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-primary border border-emerald-200/80">
                Academy
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium tracking-normal mt-0.5">
              Course Learning Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            Courses Catalog
          </Link>
        </nav>

        {/* Right Section: Student Account + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {/* Student Account Badge */}
          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 overflow-hidden shadow-xs">
              <User className="w-4.5 h-4.5 text-slate-600" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                Student Account
              </span>
            </div>
          </div>

          {/* Mobile/Tablet Menu Toggle Button (<1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Menu (<1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200 shadow-md">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            Courses Catalog
          </Link>
        </div>
      )}
    </header>
  );
};
