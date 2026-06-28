import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TrackerDailyLog } from "@/lib/models/tracker";
import { addDays, ensureStats, startOfDay } from "@/lib/tracker";

function keyFor(date: Date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

export async function GET() {
  await connectDB();
  const end = startOfDay();
  const start = addDays(end, -29);
  const stats = await ensureStats();
  const logs = await TrackerDailyLog.find({ date: { $gte: start, $lte: end } }).populate({
    path: "taskId",
    populate: [
      { path: "subjectId", model: "TrackerSubject" },
      { path: "topicId", model: "TrackerTopic" },
    ],
  });

  const days = Array.from({ length: 30 }, (_, index) => {
    const date = addDays(start, index);
    return { date: keyFor(date), completed: 0, total: 0, points: 0, penalties: 0, completionRate: 0 };
  });

  const byDay = new Map(days.map((day) => [day.date, day]));
  const subjects = new Map<string, any>();

  logs.forEach((log: any) => {
    const day = byDay.get(keyFor(log.date));
    if (!day) return;
    day.total += 1;
    if (log.status === "completed") day.completed += 1;
    day.points += Number(log.pointsAwarded || 0);
    day.penalties += Number(log.penaltyApplied || 0);

    const subject = log.taskId?.subjectId;
    const topic = log.taskId?.topicId;
    const subjectKey = String(subject?._id || "unknown");
    const row =
      subjects.get(subjectKey) ||
      {
        subjectId: subjectKey,
        subjectName: subject?.name || "Unassigned",
        color: subject?.color || "#94a3b8",
        topics: new Map<string, any>(),
        tasksDone: 0,
        totalTasks: 0,
        totalPoints: 0,
        totalPenalties: 0,
        avgCompletion: 0,
      };

    row.totalTasks += 1;
    if (log.status === "completed") row.tasksDone += 1;
    row.totalPoints += Number(log.pointsAwarded || 0);
    row.totalPenalties += Number(log.penaltyApplied || 0);

    const topicKey = String(topic?._id || "unknown");
    const topicRow =
      row.topics.get(topicKey) ||
      { topicId: topicKey, topicName: topic?.name || "Untitled", tasksDone: 0, totalTasks: 0 };
    topicRow.totalTasks += 1;
    if (log.status === "completed") topicRow.tasksDone += 1;
    row.topics.set(topicKey, topicRow);
    subjects.set(subjectKey, row);
  });

  days.forEach((day) => {
    day.completionRate = day.total ? Math.round((day.completed / day.total) * 100) : 0;
  });

  const subjectBreakdown = Array.from(subjects.values()).map((row) => ({
    ...row,
    topics: Array.from(row.topics.values()),
    avgCompletion: row.totalTasks ? Math.round((row.tasksDone / row.totalTasks) * 100) : 0,
  }));

  const sorted = [...days].sort((a, b) => b.completed - a.completed || b.points - a.points);
  return NextResponse.json({
    range: "monthly",
    days,
    subjectBreakdown,
    kpis: {
      bestDay: sorted[0] || null,
      worstDay: [...days].sort((a, b) => a.completionRate - b.completionRate)[0] || null,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      totalPoints: stats.totalPoints,
    },
  });
}
