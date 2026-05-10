import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../../lib/db";
import { Chapter, Section, validateSectionData } from "../../../../../../../lib/models/courses";
import { requireAdmin } from "../../../../../../../lib/auth";

function isObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(_req: Request, { params }: { params: { chapterId: string } }) {
  await connectDB();
  const chapterId = params.chapterId;
  let chapter = null;
  if (isObjectId(chapterId)) {
    chapter = await Chapter.findById(chapterId).select("_id");
  }
  if (!chapter) {
    chapter = await Chapter.findOne({ slug: chapterId }).select("_id");
  }
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const sections = await Section.find({ chapterId: chapter._id })
    .select("title slug content order chapterId createdAt updatedAt")
    .sort({ order: 1, createdAt: 1 });
  return NextResponse.json(sections);
}

export async function POST(req: Request, { params }: { params: { chapterId: string } }) {
  try {
    requireAdmin(req);
    const body = await req.json();
    validateSectionData(body);
    await connectDB();

    const chapterId = params.chapterId;
    let chapter = null;
    if (isObjectId(chapterId)) {
      chapter = await Chapter.findById(chapterId);
    }
    if (!chapter) {
      chapter = await Chapter.findOne({ slug: chapterId });
    }
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const section = await Section.create({
      title: body.title,
      content: body.content,
      chapterId: chapter._id,
    });

    if (!chapter.sections.some((sectionId: any) => sectionId.toString() === section._id.toString())) {
      chapter.sections.push(section._id);
      await chapter.save();
    }

    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error" }, { status: error.status || 500 });
  }
}