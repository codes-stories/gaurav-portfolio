import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  TrackerDailyLog,
  TrackerTask,
  TrackerUserStats,
} from "@/lib/models/tracker";
import {
  getUserId,
  isObjectId,
  recalculateStreakForToday,
  type DailyLogStatus,
} from "@/lib/tracker";

const statuses = ["pending", "completed", "deferred"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid daily log id" }, { status: 400 });
    }

    const body = await req.json();
    await connectDB();

    const log = await TrackerDailyLog.findById(params.id);
    if (!log) {
      return NextResponse.json({ error: "Daily log not found" }, { status: 404 });
    }

    const task = await TrackerTask.findById(log.taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const nextStatus = statuses.includes(body.status)
      ? (body.status as DailyLogStatus)
      : log.status;

    const previousPoints = Number(log.pointsAwarded || 0);
    const previousPenalty = Number(log.penaltyApplied || 0);
    const nextPoints = nextStatus === "completed" ? Number(task.pointValue || 0) : 0;
    const nextPenalty = nextStatus === "deferred" ? Number(task.penaltyValue || 0) : 0;

    log.status = nextStatus;
    log.pointsAwarded = nextPoints;
    log.penaltyApplied = nextPenalty;
    if (body.actualMinutes !== undefined) {
      log.actualMinutes = Number(body.actualMinutes);
    }
    if (body.notes !== undefined) {
      log.notes = String(body.notes || "");
    }

    await log.save();

    await TrackerUserStats.findOneAndUpdate(
      { userId: getUserId() },
      {
        $inc: {
          totalPoints: nextPoints - previousPoints,
          totalPenalties: nextPenalty - previousPenalty,
        },
        $setOnInsert: { userId: getUserId() },
      },
      { upsert: true }
    );

    await recalculateStreakForToday();

    const populated = await TrackerDailyLog.findById(log._id).populate({
      path: "taskId",
      populate: [
        { path: "subjectId", model: "TrackerSubject" },
        { path: "topicId", model: "TrackerTopic" },
      ],
    });

    return NextResponse.json(populated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
