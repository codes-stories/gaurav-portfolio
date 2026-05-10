import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import Course, { Chapter, validateChapterData } from "../../../../../lib/models/courses";
import { requireAdmin } from "../../../../../lib/auth";

function isObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(_req: Request, { params }: { params: { courseId: string } }) {
  await connectDB();
  const courseId = params.courseId;
  let course = null;
  if (isObjectId(courseId)) {
    course = await Course.findById(courseId).select("_id");
  }
  if (!course) {
    course = await Course.findOne({ slug: courseId }).select("_id");
  }
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const chapters = await Chapter.find({ courseId: course._id })
    .select("title slug courseId order sections createdAt updatedAt")
    .sort({ order: 1, createdAt: 1 })
    .populate({ path: "sections", select: "title slug content order chapterId createdAt updatedAt", options: { sort: { order: 1, createdAt: 1 } } });

  return NextResponse.json(chapters);
}

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    requireAdmin(req);
    const body = await req.json();
    validateChapterData(body);
    await connectDB();

    const courseId = params.courseId;
    let course = null;
    if (isObjectId(courseId)) {
      course = await Course.findById(courseId);
    }
    if (!course) {
      course = await Course.findOne({ slug: courseId });
    }
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const chapter = await Chapter.create({
      title: body.title,
      courseId: course._id,
      sections: [],
    });

    if (!course.chapters.some((chapterId: any) => chapterId.toString() === chapter._id.toString())) {
      course.chapters.push(chapter._id);
      await course.save();
    }

    return NextResponse.json(chapter, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error" }, { status: error.status || 500 });
  }
}