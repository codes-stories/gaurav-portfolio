import mongoose from "mongoose";
import badgesConfig from "@/lib/badges.json";
import {
  TrackerBadge,
  TrackerDailyLog,
  TrackerTask,
  TrackerUserStats,
} from "@/lib/models/tracker";

export type TrackerPriority = "low" | "medium" | "high" | "critical";
export type DailyLogStatus = "pending" | "completed" | "deferred" | "failed";
export type BadgePeriod = "weekly" | "monthly" | "yearly";

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

/* ================== BADGES ================== */

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  streakDays: number;
  icon: string;
  color: string;
  period: BadgePeriod;
}

function withPeriod(
  defs: Omit<BadgeDefinition, "period">[],
  period: BadgePeriod
): BadgeDefinition[] {
  return defs.map((def) => ({ ...def, period }));
}

export const BADGE_DEFINITIONS: Record<BadgePeriod, BadgeDefinition[]> = {
  weekly: withPeriod(badgesConfig.weekly, "weekly"),
  monthly: withPeriod(badgesConfig.monthly, "monthly"),
  yearly: withPeriod(badgesConfig.yearly, "yearly"),
};

/** ISO-8601 week key, e.g. "2026-W41" */
export function isoWeekKey(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function pickTier(period: BadgePeriod, streak: number) {
  const tiers = [...BADGE_DEFINITIONS[period]].reverse();
  return tiers.find((tier) => streak >= tier.streakDays) || null;
}

/**
 * Awards the highest matching badge tier for each period. One award per
 * (badge, periodKey) — so the same badge earned again in a later week /
 * month / year stacks up as "xN times".
 */
export async function awardBadgesForStreak(streak: number) {
  if (streak <= 0) return [];

  const now = new Date();
  const userId = getUserId();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const slots: { period: BadgePeriod; periodKey: string }[] = [
    { period: "weekly", periodKey: isoWeekKey(now) },
    { period: "monthly", periodKey: `${year}-${String(month).padStart(2, "0")}` },
    { period: "yearly", periodKey: `${year}` },
  ];

  const awarded: (BadgeDefinition & { periodKey: string })[] = [];

  for (const slot of slots) {
    const tier = pickTier(slot.period, streak);
    if (!tier) continue;

    const result = await TrackerBadge.updateOne(
      { userId, badgeId: tier.id, periodKey: slot.periodKey },
      {
        $setOnInsert: {
          userId,
          badgeId: tier.id,
          period: slot.period,
          periodKey: slot.periodKey,
          month,
          year,
          streakDays: streak,
          awardedAt: new Date(),
        },
      },
      { upsert: true }
    );

    if ((result as any).upsertedCount) {
      awarded.push({ ...tier, periodKey: slot.periodKey });
    }
  }

  return awarded;
}

/** Recompute streak, then award any newly earned badges. */
export async function refreshStats() {
  const stats = await recalculateStreakForToday();
  await awardBadgesForStreak(stats.currentStreak);
  return stats;
}
