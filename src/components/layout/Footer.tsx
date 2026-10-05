'use strict';
import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-16 py-10">
      <div className="max-w-[1304px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#309255] flex items-center justify-center text-white font-bold text-xs">
            IT
          </div>
          <span className="font-semibold text-slate-700">ITLegend Course Platform</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-[#309255] transition-colors">Courses</Link>
          <Link href="/courses/starting-seo" className="hover:text-[#309255] transition-colors">Course Player</Link>
          <span className="text-slate-400">Frontend Hiring Challenge</span>
        </div>
      </div>
    </footer>
  );
};
