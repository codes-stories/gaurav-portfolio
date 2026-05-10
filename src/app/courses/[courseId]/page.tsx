import React from "react";
import { connectDB } from "../../../lib/db";
import Course from "../../../lib/models/courses";
import Link from "next/link";

async function resolveCourse(idOrSlug: string) {
  await connectDB();
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  let course = null;
  if (isObjectId) {
    course = await Course.findById(idOrSlug)
      .select("title slug description thumbnail order chapters")
      .populate({ path: "chapters", select: "title slug order sections", options: { sort: { order: 1, createdAt: 1 } } });
  }
  if (!course) {
    course = await Course.findOne({ slug: idOrSlug })
      .select("title slug description thumbnail order chapters")
      .populate({ path: "chapters", select: "title slug order sections", options: { sort: { order: 1, createdAt: 1 } } });
  }
  return course;
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = await resolveCourse(params.courseId);
  if (!course) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        {course.thumbnail && <img src={course.thumbnail} alt={`${course.title} thumbnail`} className="mt-4 max-w-full h-auto" />}
        <p className="mt-4 text-gray-600">{course.description}</p>
        <p className="mt-2 text-sm text-gray-500">Chapters: {course.chapters?.length || 0}</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Chapters</h2>
        <ol className="list-decimal pl-6">
          {course.chapters?.map((ch: any) => (
            <li key={ch._id} className="mb-2">
              <Link href={`/courses/${course.slug}/${ch.slug ?? ch._id}`}>{ch.title}</Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export const revalidate = 60;
