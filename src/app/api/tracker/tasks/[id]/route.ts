import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TrackerTask } from "@/lib/models/tracker";
import { getPriorityValues, isObjectId, type TrackerPriority } from "@/lib/tracker";

const priorities = ["low", "medium", "high", "critical"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
    }

    const body = await req.json();
    await connectDB();

    const updates: Record<string, unknown> = {};
    for (const key of ["title", "description", "estimatedMinutes", "topicId", "subjectId"]) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (body.isDeferred !== undefined) updates.isDeferred = Boolean(body.isDeferred);

    if (body.priority !== undefined) {
      const priority = priorities.includes(body.priority)
        ? (body.priority as TrackerPriority)
        : "medium";
      updates.priority = priority;
      Object.assign(updates, getPriorityValues(priority));
    }

    const task = await TrackerTask.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("subjectId")
      .populate("topicId");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
