import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { Chapter, validateChapterData } from "../../../../../../lib/models/courses";
import { requireAdmin } from "../../../../../../lib/auth";

export async function GET(_req: Request, { params }: { params: { chapterId: string } }) {
  await connectDB();
  const chapter = await Chapter.findById(params.chapterId).populate({
    path: "sections",
    select: "title content chapterId createdAt updatedAt",
  });

  if (!chapter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(chapter);
}

export async function PUT(req: Request, { params }: { params: { chapterId: string } }) {
  try {
    requireAdmin(req);
    const body = await req.json();
    validateChapterData(body);
    await connectDB();
    const chapter = await Chapter.findByIdAndUpdate(
      params.chapterId,
      { title: body.title },
      { new: true }
    );

    if (!chapter) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error" }, { status: error.status || 500 });
  }
}