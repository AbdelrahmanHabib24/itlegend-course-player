
"use client"

import {
  Clock3,
  LibraryBig,
  UsersRound,
  Globe2,
  Presentation,
  type LucideIcon,
} from 'lucide-react';

import type { Course } from '@/types/course';

interface CourseMaterialsProps {
  course: Course;
}

interface MaterialRow {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

export const CourseMaterials = ({ course }: CourseMaterialsProps) => {
  const materialRows: MaterialRow[] = [
    {
      id: 'instructor',
      label: 'Instructor:',
      value: course.instructor.name,
      icon: Presentation,
    },
    {
      id: 'duration',
      label: 'Duration:',
      value: course.duration,
      icon: Clock3,
    },
    {
      id: 'lessons',
      label: 'Lessons:',
      value: String(course.lessonsCount),
      icon: LibraryBig,
    },
    {
      id: 'enrolled',
      label: 'Enrolled:',
      value: `${course.enrolledCount} students`,
      icon: UsersRound,
    },
    {
      id: 'language',
      label: 'Language:',
      value: course.language,
      icon: Globe2,
    },
  ];

  return (
    <section
      aria-labelledby="course-materials-heading"
      className="my-6 scroll-mt-24"
    >
      <h2
        id="course-materials-heading"
        className="mb-4 text-xl font-bold tracking-tight text-[#0F1D38] sm:text-2xl"
      >
        Course Materials
      </h2>

      <div className="bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col">
          {materialRows.map(({ id, label, value, icon: Icon }) => (
            <div
              key={id}
              className="flex min-h-[55px] items-center justify-between border-b border-border py-3 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Icon
                  className="h-[22px] w-[22px] shrink-0 text-[#263F69]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <span className="text-[15px] font-normal leading-none text-[#334D76] sm:text-[16px]">
                  {label}
                </span>
              </div>

              <span className="ml-4 shrink-0 text-[15px] font-normal leading-none text-[#1E293B] sm:text-[16px]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
