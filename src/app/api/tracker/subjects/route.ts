import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TrackerSubject } from "@/lib/models/tracker";
import { escapeRegex } from "@/lib/tracker";

export async function GET() {
  await connectDB();
  const subjects = await TrackerSubject.find().sort({ createdAt: 1 });
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }

    const existing = await TrackerSubject.findOne({
      name: new RegExp(`^${escapeRegex(name)}$`, "i"),
    });

    if (existing) return NextResponse.json(existing, { status: 200 });

    const subject = await TrackerSubject.create({
      name,
      color: body.color || "#38bdf8",
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
