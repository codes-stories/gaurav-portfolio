import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TrackerSubject, TrackerTopic } from "@/lib/models/tracker";
import { isObjectId } from "@/lib/tracker";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const filter = subjectId && isObjectId(subjectId) ? { subjectId } : {};
  const topics = await TrackerTopic.find(filter)
    .populate("subjectId")
    .sort({ createdAt: 1 });

  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    if (!body.subjectId || !isObjectId(body.subjectId)) {
      return NextResponse.json({ error: "Valid subjectId is required" }, { status: 400 });
    }

    const subject = await TrackerSubject.findById(body.subjectId);
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Topic name is required" }, { status: 400 });
    }

    const topic = await TrackerTopic.create({
      subjectId: body.subjectId,
      name,
      maxTimeMinutes: Number(body.maxTimeMinutes || 60),
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
