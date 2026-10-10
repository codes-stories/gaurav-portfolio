export type BadgeEarnedInstance = {
  periodKey: string;
  month: number | null;
  year: number | null;
  streakDays: number;
  awardedAt: string;
};

export type BadgeWithCount = {
  id: string;
  name: string;
  description: string;
  streakDays: number;
  icon: string;
  color: string;
  period: "weekly" | "monthly" | "yearly";
  count: number;
  earned: BadgeEarnedInstance[];
};

export function formatMonthYear(month: number | null, year: number | null) {
  if (!month || !year) return "";
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}
