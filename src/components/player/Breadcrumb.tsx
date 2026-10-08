import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  courseTitle: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ courseTitle }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-slate-400">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            Courses
          </Link>
        </li>
        <li aria-hidden="true" className="text-slate-400">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li className="text-slate-700 font-semibold truncate max-w-[280px] sm:max-w-md" aria-current="page">
          Course Details
        </li>
      </ol>
    </nav>
  );
};
