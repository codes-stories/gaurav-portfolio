"use client";

import { Award, Cog, Crown, Flame, Medal, Shield, Swords, Trophy } from "lucide-react";
import type { BadgeWithCount } from "./badge-types";

const ICONS: Record<string, typeof Flame> = {
  flame: Flame,
  swords: Swords,
  cog: Cog,
  medal: Medal,
  shield: Shield,
  trophy: Trophy,
  crown: Crown,
  award: Award,
};

export default function WeeklyBadges({ badges }: { badges: BadgeWithCount[] }) {
  if (badges.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-white/45">
        No weekly badges yet — keep a 7-day streak to earn your first.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {badges.map((badge) => {
        const Icon = ICONS[badge.icon] || Award;
        return (
          <div
            key={badge.id}
            className="relative rounded-lg border p-3"
            style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}12` }}
          >
            {badge.count > 1 && (
              <span className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-xs font-semibold text-white/80">
                x{badge.count}
              </span>
            )}
            <span
              className="inline-flex rounded-md border p-2"
              style={{ borderColor: `${badge.color}50`, color: badge.color }}
            >
              <Icon size={18} />
            </span>
            <h4 className="mt-2 text-sm font-semibold text-white">{badge.name}</h4>
            <p className="mt-0.5 text-xs text-white/45">{badge.description}</p>
            <p className="mt-1 text-xs text-white/35">
              Best streak {Math.max(...badge.earned.map((e) => e.streakDays))} days
            </p>
          </div>
        );
      })}
    </div>
  );
}
