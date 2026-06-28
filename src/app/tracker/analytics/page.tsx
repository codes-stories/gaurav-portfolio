"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, Flame, Loader2, TrendingDown, TrendingUp } from "lucide-react";

type DayMetric = {
  date: string;
  completed: number;
  total: number;
  points: number;
  penalties: number;
  completionRate: number;
};

type SubjectBreakdown = {
  subjectId: string;
  subjectName: string;
  color: string;
  tasksDone: number;
  totalTasks: number;
  totalPoints: number;
  totalPenalties: number;
  avgCompletion: number;
};

type Analytics = {
  range: "weekly" | "monthly";
  days: DayMetric[];
  subjectBreakdown: SubjectBreakdown[];
  kpis: {
    bestDay: DayMetric | null;
    worstDay: DayMetric | null;
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
  };
};

export default function TrackerAnalyticsPage() {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tracker/analytics/${range}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  const maxCompleted = useMemo(
    () => Math.max(1, ...(data?.days || []).map((day) => day.completed)),
    [data]
  );
  const maxPoints = useMemo(
    () => Math.max(1, ...(data?.days || []).map((day) => Math.max(day.points, day.penalties))),
    [data]
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="/tracker" className="mb-4 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white">
              <ArrowLeft size={16} />
              Back to tracker
            </a>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Tracker Analytics</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Performance dashboard</h1>
          </div>
          <div className="inline-flex w-fit rounded-md border border-white/10 bg-zinc-950 p-1">
            {(["weekly", "monthly"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setRange(item)}
                className={`h-9 rounded px-4 text-sm capitalize transition ${range === item ? "bg-cyan-300 text-black" : "text-white/60 hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        {loading || !data ? (
          <div className="mt-6 flex h-80 items-center justify-center rounded-lg border border-white/10 bg-zinc-950">
            <Loader2 className="animate-spin text-cyan-300" />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Kpi label="Best day" value={data.kpis.bestDay?.completed || 0} suffix="done" icon={<TrendingUp size={18} />} />
              <Kpi label="Worst day" value={data.kpis.worstDay?.completionRate || 0} suffix="%" icon={<TrendingDown size={18} />} />
              <Kpi label="Current streak" value={data.kpis.currentStreak} suffix="days" icon={<Flame size={18} />} />
              <Kpi label="Longest streak" value={data.kpis.longestStreak} suffix="days" icon={<Flame size={18} />} />
              <Kpi label="All-time points" value={data.kpis.totalPoints} icon={<BarChart3 size={18} />} />
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-4">
                <h2 className="text-lg font-semibold">Tasks completed</h2>
                <div className="mt-6 flex h-64 items-end gap-2 overflow-x-auto pb-2">
                  {data.days.map((day) => (
                    <div key={day.date} className="flex min-w-10 flex-1 flex-col items-center justify-end gap-2">
                      <div className="flex h-48 w-full items-end rounded bg-white/5">
                        <div className="w-full rounded bg-cyan-300 transition-all" style={{ height: `${(day.completed / maxCompleted) * 100}%` }} />
                      </div>
                      <span className="text-xs text-white/40">{formatShortDate(day.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-4">
                <h2 className="text-lg font-semibold">Points vs penalties</h2>
                <div className="mt-6 space-y-3">
                  {data.days.map((day) => (
                    <div key={day.date} className="grid grid-cols-[58px_1fr] items-center gap-3">
                      <span className="text-xs text-white/40">{formatShortDate(day.date)}</span>
                      <div className="space-y-1.5">
                        <div className="h-2 rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-emerald-300" style={{ width: `${(day.points / maxPoints) * 100}%` }} />
                        </div>
                        <div className="h-2 rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-orange-300" style={{ width: `${(day.penalties / maxPoints) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Points</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-300" /> Penalties</span>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/80">
              <div className="border-b border-white/10 p-4">
                <h2 className="text-lg font-semibold">Subject breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-white/45">
                    <tr>
                      <th className="px-4 py-3 font-medium">Subject</th>
                      <th className="px-4 py-3 font-medium">Tasks done</th>
                      <th className="px-4 py-3 font-medium">Points</th>
                      <th className="px-4 py-3 font-medium">Penalties</th>
                      <th className="px-4 py-3 font-medium">Avg completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subjectBreakdown.map((row) => (
                      <tr key={row.subjectId} className="border-t border-white/10">
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                            {row.subjectName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/70">{row.tasksDone}/{row.totalTasks}</td>
                        <td className="px-4 py-3 text-emerald-200">{row.totalPoints}</td>
                        <td className="px-4 py-3 text-orange-200">{row.totalPenalties}</td>
                        <td className="px-4 py-3">{row.avgCompletion}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function Kpi({ label, value, suffix = "", icon }: { label: string; value: number; suffix?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-4">
      <div className="mb-3 inline-flex rounded-md border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200">{icon}</div>
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}{suffix && <span className="ml-1 text-base text-white/50">{suffix}</span>}</p>
    </div>
  );
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" });
}
