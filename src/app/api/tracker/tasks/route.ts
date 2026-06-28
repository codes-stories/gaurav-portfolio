import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  TrackerDailyLog,
  TrackerSubject,
  TrackerTask,
  TrackerTopic,
} from "@/lib/models/tracker";
import {
  getPriorityValues,
  isObjectId,
  startOfDay,
  type TrackerPriority,
} from "@/lib/tracker";

const priorities = ["low", "medium", "high", "critical"];

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const includeDeferred = searchParams.get("includeDeferred") === "true";
  const filter = includeDeferred ? {} : { isDeferred: false };

  const tasks = await TrackerTask.find(filter)
    .populate("subjectId")
    .populate("topicId")
    .sort({ createdAt: -1 });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    if (!body.subjectId || !isObjectId(body.subjectId)) {
      return NextResponse.json({ error: "Valid subjectId is required" }, { status: 400 });
    }

    if (!body.topicId || !isObjectId(body.topicId)) {
      return NextResponse.json({ error: "Valid topicId is required" }, { status: 400 });
    }

    const [subject, topic] = await Promise.all([
      TrackerSubject.findById(body.subjectId),
      TrackerTopic.findOne({ _id: body.topicId, subjectId: body.subjectId }),
    ]);

    if (!subject || !topic) {
      return NextResponse.json({ error: "Subject or topic not found" }, { status: 404 });
    }

    const title = String(body.title || "").trim();
    const priority = priorities.includes(body.priority)
      ? (body.priority as TrackerPriority)
      : "medium";

    if (!title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const task = await TrackerTask.create({
      topicId: body.topicId,
      subjectId: body.subjectId,
      title,
      description: body.description || "",
      priority,
      estimatedMinutes: Math.max(1, Number(body.estimatedMinutes || 30)),
      ...getPriorityValues(priority),
    });

    await TrackerDailyLog.updateOne(
      { taskId: task._id, date: startOfDay() },
      { $setOnInsert: { taskId: task._id, date: startOfDay(), status: "pending" } },
      { upsert: true }
    );

    const populated = await TrackerTask.findById(task._id)
      .populate("subjectId")
      .populate("topicId");

    return NextResponse.json(populated, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
