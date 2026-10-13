import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TrackerBadge } from "@/lib/models/tracker";
import {
  BADGE_DEFINITIONS,
  getUserId,
  refreshStats,
  type BadgeDefinition,
  type BadgePeriod,
} from "@/lib/tracker";

export type BadgeEarnedInstance = {
  periodKey: string;
  month: number | null;
  year: number | null;
  streakDays: number;
  awardedAt: string;
};

export type BadgeWithCount = BadgeDefinition & {
  count: number;
  earned: BadgeEarnedInstance[];
};

export async function GET() {
  await connectDB();
  await refreshStats();

  const badges = await TrackerBadge.find({ userId: getUserId() })
    .sort({ awardedAt: 1 })
    .lean();

  const group = (period: BadgePeriod): BadgeWithCount[] =>
    BADGE_DEFINITIONS[period]
      .map((def) => {
        const earned = badges
          .filter((badge) => badge.badgeId === def.id)
          .map((badge) => ({
            periodKey: badge.periodKey,
            month: badge.month ?? null,
            year: badge.year ?? null,
            streakDays: badge.streakDays ?? 0,
            awardedAt: (badge.awardedAt as Date)?.toISOString?.() || "",
          }));

        return { ...def, count: earned.length, earned };
      })
      .filter((badge) => badge.count > 0);

  return NextResponse.json({
    weekly: group("weekly"),
    monthly: group("monthly"),
    yearly: group("yearly"),
  });
}
