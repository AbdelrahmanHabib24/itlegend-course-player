import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseBySlug, COURSES } from '@/data/coursesData';
import { CoursePlayerClient } from '@/components/player/CoursePlayerClient';

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug) || COURSES[0];

  return {
    title: `${course.title} | ITLegend Course Player`,
    description: course.shortDescription,
  };
}

export function generateStaticParams() {
  const slugs = new Set<string>();
  COURSES.forEach((course) => slugs.add(course.slug));
  slugs.add('ui-ux-design-systems');
  slugs.add('typescript-enterprise');
  slugs.add('web-performance-vitals');
  slugs.add('fullstack-mastery');
  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CoursePlayerClient initialCourse={course} />;
}
