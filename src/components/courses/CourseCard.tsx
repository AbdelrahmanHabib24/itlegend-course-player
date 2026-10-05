'use strict';
import React from 'react';
import Link from 'next/link';
import { Course } from '@/types/course';
import { Clock, BookOpen, Users, Play, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const isStarted = course.progress > 0;
  const isCompleted = course.progress === 100;

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
            {course.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isCompleted ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          ) : isStarted ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#20B486] text-white flex items-center gap-1 shadow-xs">
              <Play className="w-3 h-3 fill-current" />
              In Progress
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-white shadow-xs">
              Not Started
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Instructor & Level */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
            <div className="flex items-center gap-2">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
              />
              <span className="font-medium text-slate-700">{course.instructor.name}</span>
            </div>
            <span className="font-medium text-slate-500 px-2 py-0.5 rounded-sm bg-slate-100 text-[11px]">
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-[#20B486] transition-colors mb-2">
            <Link href={`/courses/${course.slug}`}>{course.title}</Link>
          </h2>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {course.shortDescription}
          </p>
        </div>

        <div>
          {/* Metadata items */}
          <div className="flex items-center justify-between text-xs text-slate-500 py-3 border-t border-slate-100 gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {course.lessonsCount} Lessons
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {course.enrolledCount} Students
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 mb-4">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 font-medium">Course Progress</span>
              <span className="font-bold text-slate-800">{course.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#20B486] rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Action button */}
          <Link
            href={`/courses/${course.slug}`}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isStarted
                ? 'bg-[#20B486] hover:bg-[#1A9B73] text-white shadow-xs hover:shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {isCompleted ? (
              <>
                Review Course
                <ArrowRight className="w-4 h-4" />
              </>
            ) : isStarted ? (
              <>
                Continue Course
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Start Course
                <Play className="w-3.5 h-3.5 fill-current" />
              </>
            )}
          </Link>
        </div>
      </div>
    </article>
  );
};
