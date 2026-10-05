'use client';

import React from 'react';
import {
  Clock3,
  LibraryBig,
  UsersRound,
  Globe2,
  Presentation,
} from 'lucide-react';

import { Course } from '@/types/course';

interface CourseMaterialsProps {
  course: Course;
  onOpenPdfModal?: () => void;
}

type MaterialRow = {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
};

export const CourseMaterials: React.FC<CourseMaterialsProps> = ({
  course,
}) => {
  const materialRows: MaterialRow[] = [
    {
      id: 'instructor',
      label: 'Instructor:',
      value: course.instructor?.name || 'Edward Norton',
      icon: (
        <Presentation
          className="h-[22px] w-[22px] shrink-0 text-[#263F69]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'duration',
      label: 'Duration:',
      value: course.duration,
      icon: (
        <Clock3
          className="h-[22px] w-[22px] shrink-0 text-[#263F69]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'lessons',
      label: 'Lessons:',
      value: String(course.lessonsCount),
      icon: (
        <LibraryBig
          className="h-[22px] w-[22px] shrink-0 text-[#263F69]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'enrolled',
      label: 'Enrolled:',
      value: `${course.enrolledCount} students`,
      icon: (
        <UsersRound
          className="h-[22px] w-[22px] shrink-0 text-[#263F69]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'language',
      label: 'Language:',
      value: course.language,
      icon: (
        <Globe2
          className="h-[22px] w-[22px] shrink-0 text-[#263F69]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ),
    },
  ];

  const renderMaterialRow = (row: MaterialRow, isLast = false) => (
    <div
      key={row.id}
      className={`
        flex
        min-h-[55px]
        items-center
        justify-between
        border-b
        border-border
        py-3
        ${isLast ? 'border-b-0' : ''}
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        {row.icon}

        <span
          className="
            text-[15px] sm:text-[16px]
            font-normal
            leading-none
            text-[#334D76]
          "
        >
          {row.label}
        </span>
      </div>

      <span
        className="
          ml-4
          shrink-0
          text-[15px] sm:text-[16px]
          font-normal
          leading-none
          text-[#1E293B]
        "
      >
        {row.value}
      </span>
    </div>
  );

  return (
    <section
      aria-labelledby="course-materials-heading"
      className="my-6 scroll-mt-24"
    >
      <h2
        id="course-materials-heading"
        className="
          mb-4
          text-xl
          font-bold
          tracking-tight
          text-[#0F1D38]
          sm:text-2xl
        "
      >
        Course Materials
      </h2>

      <div
        className="
          rounded-xl
          border
          border-[#DDE3EA]
          bg-white
          p-6
          shadow-xs
          sm:p-7
        "
      >
        {/* Single-column vertical arrangement matching user reference */}
        <div className="flex flex-col">
          {materialRows.map((row, idx) =>
            renderMaterialRow(row, idx === materialRows.length - 1)
          )}
        </div>
      </div>
    </section>
  );
};