import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Course, { validateCourseData } from "../../../../lib/models/courses";
import { requireAdmin } from "../../../../lib/auth";

function isObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(_req: Request, { params }: { params: { courseId: string } }) {
  await connectDB();
  const id = params.courseId;
  let course = null;
  if (isObjectId(id)) {
    course = await Course.findById(id)
      .select("title slug description instructor duration price thumbnail order chapters createdAt updatedAt")
      .populate({
        path: "chapters",
        select: "title slug courseId order sections createdAt updatedAt",
        options: { sort: { order: 1, createdAt: 1 } },
        populate: { path: "sections", select: "title slug content order chapterId createdAt updatedAt", options: { sort: { order: 1, createdAt: 1 } } },
      });
  }
  if (!course) {
    course = await Course.findOne({ slug: id })
      .select("title slug description instructor duration price thumbnail order chapters createdAt updatedAt")
      .populate({
        path: "chapters",
        select: "title slug courseId order sections createdAt updatedAt",
        options: { sort: { order: 1, createdAt: 1 } },
        populate: { path: "sections", select: "title slug content order chapterId createdAt updatedAt", options: { sort: { order: 1, createdAt: 1 } } },
      });
  }

  if (!course) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  try {
    requireAdmin(req);
    const body = await req.json();
    validateCourseData(body);
    await connectDB();
    const course = await Course.findByIdAndUpdate(
      params.courseId,
      {
        title: body.title,
        description: body.description,
        instructor: body.instructor,
        duration: body.duration,
        price: body.price,
      },
      { new: true }
    );

    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error" }, { status: error.status || 500 });
  }
}