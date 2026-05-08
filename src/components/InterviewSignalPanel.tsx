"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  Server,
  Sparkles,
} from "lucide-react";

type VisitStats = {
  totalVisitors: number;
  totalVisits: number;
  todayVisitors: number;
  todayVisits: number;
};

const DEFAULT_STATS: VisitStats = {
  totalVisitors: 0,
  totalVisits: 0,
  todayVisitors: 0,
  todayVisits: 0,
};

const highlights = [
  "Full-stack product thinking",
  "Backend-focused architecture",
  "Production-ready Next.js + MongoDB",
];

const systemSignals = [
  { label: "API routes", value: "Live", icon: Server },
  { label: "Daily visitor analytics", value: "Tracked", icon: BarChart3 },
  { label: "Recruiter context capture", value: "Ready", icon: CheckCircle2 },
];

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

export default function InterviewSignalPanel() {
  const [stats, setStats] = useState<VisitStats>(DEFAULT_STATS);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/profile-visits");
        const data = await res.json();
        if (res.ok) {
          setStats({
            totalVisitors: data.totalVisitors || 0,
            totalVisits: data.totalVisits || 0,
            todayVisitors: data.todayVisitors || 0,
            todayVisits: data.todayVisits || 0,
          });
        }
      } catch {
        // Keep the landing experience quiet if analytics is unavailable.
      }
    }

    function syncStats(event: Event) {
      const visitEvent = event as CustomEvent<VisitStats>;
      setStats(visitEvent.detail);
    }

    loadStats();
    window.addEventListener("profile-visit-stats", syncStats);

    return () => {
      window.removeEventListener("profile-visit-stats", syncStats);
    };
  }, []);

  return (
    <div className="mt-10 grid gap-4 text-left lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
              <Activity size={14} />
              Live portfolio signal
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Interview-ready dashboard, built into the portfolio.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              The landing page now behaves like a small product: it records real
              visits, captures recruiter context, and makes system ownership
              visible before an interviewer even opens a project.
            </p>
          </div>

          <div className="grid min-w-[190px] grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Eye size={14} />
                Today
              </div>
              <div className="mt-2 text-3xl font-bold text-white">
                {formatNumber(stats.todayVisitors)}
              </div>
              <div className="mt-1 text-xs text-zinc-500">daily visitors</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <BarChart3 size={14} />
                Total
              </div>
              <div className="mt-2 text-3xl font-bold text-white">
                {formatNumber(stats.totalVisitors)}
              </div>
              <div className="mt-1 text-xs text-zinc-500">unique visitors</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
            >
              <Sparkles className="mb-2 text-cyan-300" size={16} />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              What this proves
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Small details that interviewers can ask about.
            </p>
          </div>
          <a
            href="#projects"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
            aria-label="View projects"
          >
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="mt-5 space-y-3">
          {systemSignals.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200">
                  <Icon size={17} />
                </span>
                <span className="text-sm text-zinc-300">{label}</span>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
          {formatNumber(stats.todayVisits)} landing-page visit
          {stats.todayVisits === 1 ? "" : "s"} recorded today.
        </div>
      </div>
    </div>
  );
}
