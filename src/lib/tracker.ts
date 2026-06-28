import mongoose from "mongoose";
import {
  TrackerDailyLog,
  TrackerTask,
  TrackerUserStats,
} from "@/lib/models/tracker";

export type TrackerPriority = "low" | "medium" | "high" | "critical";
export type DailyLogStatus = "pending" | "completed" | "deferred";

export const POINTS_BY_PRIORITY: Record<TrackerPriority, number> = {
  low: 5,
  medium: 10,
  high: 20,
  critical: 30,
};

export const PENALTIES_BY_PRIORITY: Record<TrackerPriority, number> = {
  low: 2,
  medium: 5,
  high: 10,
  critical: 15,
};

export function getUserId() {
  return "default";
}

export function startOfDay(value?: string | Date) {
  const date = value ? new Date(value) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSameDay(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false;
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function getPriorityValues(priority: TrackerPriority) {
  return {
    pointValue: POINTS_BY_PRIORITY[priority],
    penaltyValue: PENALTIES_BY_PRIORITY[priority],
  };
}

export function isObjectId(value: string) {
  return mongoose.Types.ObjectId.isValid(value);
}

export async function ensureStats() {
  return TrackerUserStats.findOneAndUpdate(
    { userId: getUserId() },
    { $setOnInsert: { userId: getUserId() } },
    { new: true, upsert: true }
  );
}

export async function ensureDailyLogs(date = startOfDay()) {
  const day = startOfDay(date);
  const tasks = await TrackerTask.find({ isDeferred: false }).select("_id");

  await Promise.all(
    tasks.map((task) =>
      TrackerDailyLog.updateOne(
        { taskId: task._id, date: day },
        {
          $setOnInsert: {
            taskId: task._id,
            date: day,
            status: "pending",
            pointsAwarded: 0,
            penaltyApplied: 0,
          },
        },
        { upsert: true }
      )
    )
  );

  return TrackerDailyLog.find({ date: day })
    .populate({
      path: "taskId",
      populate: [
        { path: "subjectId", model: "TrackerSubject" },
        { path: "topicId", model: "TrackerTopic" },
      ],
    })
    .sort({ createdAt: 1 });
}

export async function recalculateStreakForToday() {
  const today = startOfDay();
  const stats = await ensureStats();
  const activeTaskCount = await TrackerTask.countDocuments({ isDeferred: false });

  if (activeTaskCount === 0) {
    stats.currentStreak = 0;
    stats.lastUpdated = new Date();
    await stats.save();
    return stats;
  }

  const completedCount = await TrackerDailyLog.countDocuments({
    date: today,
    status: "completed",
  });

  const allCompleted = completedCount === activeTaskCount;
  if (allCompleted) {
    if (!isSameDay(stats.lastUpdated, today)) {
      stats.currentStreak += 1;
    }
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  stats.lastUpdated = new Date();
  await stats.save();
  return stats;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
