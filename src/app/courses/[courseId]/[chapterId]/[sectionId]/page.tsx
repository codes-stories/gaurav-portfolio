import React from "react";
import { connectDB } from "../../../../../lib/db";
import Course, { Chapter, Section } from "../../../../../lib/models/courses";
import Link from "next/link";

async function resolveAll(courseParam: string, chapterParam: string, sectionParam: string) {
  await connectDB();
  const isObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

  let course = null;
  if (isObjectId(courseParam)) course = await Course.findById(courseParam).select("title slug");
  if (!course) course = await Course.findOne({ slug: courseParam }).select("title slug");
  if (!course) return { course: null, chapter: null, section: null };

  let chapter = null;
  if (isObjectId(chapterParam)) chapter = await Chapter.findById(chapterParam).select("title slug");
  if (!chapter) chapter = await Chapter.findOne({ slug: chapterParam, courseId: course._id }).select("title slug");
  if (!chapter) return { course, chapter: null, section: null };

  let section = null;
  if (isObjectId(sectionParam)) section = await Section.findById(sectionParam).select("title slug content order chapterId");
  if (!section) section = await Section.findOne({ slug: sectionParam, chapterId: chapter._id }).select("title slug content order chapterId");

  return { course, chapter, section };
}

export default async function SectionPage({ params }: { params: { courseId: string; chapterId: string; sectionId: string } }) {
  const { courseId, chapterId, sectionId } = params;
  const { course, chapter, section } = await resolveAll(courseId, chapterId, sectionId);
  if (!course || !chapter || !section) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Section not found</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{section.title}</h1>
        <p className="text-sm text-gray-500">{course.title} / {chapter.title}</p>
      </header>

      <article className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: section.content }} />
      </article>
    </div>
  );
}

export const revalidate = 60;
