"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Course } from "@/types/course";
import { Header } from "@/components/layout/Header";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilter } from "@/components/courses/CourseFilter";
import {
  getCourseStatus,
  syncCourseWithProgress,
} from "@/hooks/useCourseProgress";

interface CoursesListingClientProps {
  initialCourses: Course[];
}


const matchesSearchQuery = (course: Course, query: string): boolean => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  return (
    course.title.toLowerCase().includes(normalizedQuery) ||
    course.instructor.name.toLowerCase().includes(normalizedQuery) ||
    course.shortDescription.toLowerCase().includes(normalizedQuery)
  );
};


const matchesStatusFilter = (course: Course, status: string): boolean =>
  status === "all" || getCourseStatus(course.progress) === status;


const filterCourses = (
  courses: Course[],
  category: string,
  status: string,
  searchQuery: string,
): Course[] =>
  courses.filter(
    (course) =>
      (category === "All" || course.category === category) &&
      matchesStatusFilter(course, status) &&
      matchesSearchQuery(course, searchQuery),
  );



export const CoursesListingClient = ({
  initialCourses,
}: CoursesListingClientProps) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

 useEffect(() => {
  const syncCourses = () => {
    setCourses(initialCourses.map(syncCourseWithProgress));
  };

  syncCourses();

  window.addEventListener("storage", syncCourses);
  window.addEventListener("focus", syncCourses);

  return () => {
    window.removeEventListener("storage", syncCourses);
    window.removeEventListener("focus", syncCourses);
  };
}, [initialCourses]);


const categories = Array.from(
  new Set(initialCourses.map((course) => course.category)),
);

const filteredCourses = filterCourses(
  courses,
  selectedCategory,
  selectedStatus,
  searchQuery,
);

 

  return (
    <div className="min-h-screen bg-background flex flex-col text-slate-800">
      <Header />

      <main className="flex-1 player-container w-full py-8">
        <section
          aria-labelledby="catalog-heading"
          className="mb-8 sm:mb-10 text-center sm:text-left"
        >
          <h1
            id="catalog-heading"
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Explore Courses & Continue Learning
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Choose from industry-standard courses designed for modern developers
            and digital creators. Pick up where you left off or start a new
            skill track today.
          </p>
        </section>

        <CourseFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        {filteredCourses.length > 0 ? (
          <section
            aria-label="Available Courses"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </section>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>

            <h2 className="text-base font-bold text-slate-800 mb-1">
              No matching courses found
            </h2>

            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or resetting filters.
            </p>
          </div>
        )}
      </main>

     
    </div>
  );
};