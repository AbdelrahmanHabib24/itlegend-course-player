import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCourseBySlug, COURSES } from "@/data/coursesData";
import { SLUG_ALIASES } from "@/data/slugAliases";
import { CoursePlayerClient } from "@/components/player/CoursePlayerClient";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) notFound();

  return {
    title: `${course.title} | ITLegend Course Player`,
    description: course.shortDescription,
  };
}

export function generateStaticParams() {
  const slugs = new Set<string>([
    ...COURSES.map((course) => course.slug),
    ...Object.keys(SLUG_ALIASES),
  ]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) notFound();

  return <CoursePlayerClient key={course.slug} initialCourse={course} />;
}
