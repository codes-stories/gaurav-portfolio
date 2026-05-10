import React from "react";
import { connectDB } from "../../../../lib/db";
import Course, { Chapter, Section } from "../../../../lib/models/courses";
import Link from "next/link";

async function resolveCourseAndChapter(courseParam: string, chapterParam: string) {
  await connectDB();
  const isObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

  let course = null;
  if (isObjectId(courseParam)) course = await Course.findById(courseParam).select("title slug");
  if (!course) course = await Course.findOne({ slug: courseParam }).select("title slug");
  if (!course) return { course: null, chapter: null };

  let chapter = null;
  if (isObjectId(chapterParam)) chapter = await Chapter.findById(chapterParam).select("title slug order sections courseId");
  if (!chapter) chapter = await Chapter.findOne({ slug: chapterParam, courseId: course._id }).select("title slug order sections courseId");
  return { course, chapter };
}

export default async function ChapterPage({ params }: { params: { courseId: string; chapterId: string } }) {
  const { courseId, chapterId } = params;
  const { course, chapter } = await resolveCourseAndChapter(courseId, chapterId);
  if (!course || !chapter) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Chapter not found</h1>
      </div>
    );
  }

  await connectDB();
  const sections = await Section.find({ chapterId: chapter._id }).select("title slug order").sort({ order: 1, createdAt: 1 });

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{chapter.title}</h1>
        <p className="text-sm text-gray-500">Course: <Link href={`/courses/${course.slug}`}>{course.title}</Link></p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Sections</h2>
        <ol className="list-decimal pl-6">
          {sections.map((s: any) => (
            <li key={s._id} className="mb-2">
              <Link href={`/courses/${course.slug}/${chapter.slug}/${s.slug ?? s._id}`}>{s.title}</Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export const revalidate = 60;
