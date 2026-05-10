import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../../../lib/db";
import { Section, validateSectionData } from "../../../../../../../../lib/models/courses";
import { requireAdmin } from "../../../../../../../../lib/auth";

function isObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(_req: Request, { params }: { params: { sectionId: string } }) {
  await connectDB();
  const id = params.sectionId;
  let section = null;
  if (isObjectId(id)) {
    section = await Section.findById(id).select("title slug content order chapterId createdAt updatedAt");
  }
  if (!section) {
    section = await Section.findOne({ slug: id }).select("title slug content order chapterId createdAt updatedAt");
  }

  if (!section) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(section);
}

export async function PUT(req: Request, { params }: { params: { sectionId: string } }) {
  try {
    requireAdmin(req);
    const body = await req.json();
    validateSectionData(body);
    await connectDB();
    const id = params.sectionId;
    let section = null;
    if (isObjectId(id)) {
      section = await Section.findByIdAndUpdate(id, { title: body.title, content: body.content }, { new: true });
    } else {
      section = await Section.findOneAndUpdate({ slug: id }, { title: body.title, content: body.content }, { new: true });
    }

    if (!section) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error" }, { status: error.status || 500 });
  }
}