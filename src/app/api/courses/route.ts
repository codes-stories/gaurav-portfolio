import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Course, { validateCourseData } from "../../../lib/models/courses";
import { requireAdmin } from "../../../lib/auth";

export async function GET() {
  await connectDB();
  const courses = await Course.find()
    .select("title slug description instructor duration price thumbnail order chapters createdAt updatedAt")
    .sort({ order: 1, createdAt: -1 })
    .populate({
      path: "chapters",
      select: "title slug courseId order sections createdAt updatedAt",
      options: { sort: { order: 1, createdAt: 1 } },
      populate: { path: "sections", select: "title slug content order chapterId createdAt updatedAt", options: { sort: { order: 1, createdAt: 1 } } },
    });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const body = await req.json();
    validateCourseData(body);
    await connectDB();
    const course = await Course.create({
      title: body.title,
      description: body.description,
      instructor: body.instructor,
      duration: body.duration,
      price: body.price,
      chapters: [],
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error" }, { status: error.status || 500 });
  }
}