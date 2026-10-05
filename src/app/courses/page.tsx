import React from 'react';
import type { Metadata } from 'next';
import { COURSES } from '@/data/coursesData';
import { CoursesListingClient } from '@/components/courses/CoursesListingClient';

export const metadata: Metadata = {
  title: 'Courses Catalog | ITLegend Interactive Learning Platform',
  description:
    'Browse our comprehensive catalog of digital skills courses and continue your learning journey.',
};

export default function CoursesPage() {
  return <CoursesListingClient initialCourses={COURSES} />;
}
