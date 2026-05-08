"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Loader2, UserRound, X } from "lucide-react";

const VISITOR_KEY_STORAGE = "gaurav-profile-visitor-key";
const VISITOR_SAVED_STORAGE = "gaurav-profile-visitor-saved";
const DAILY_VISIT_STORAGE = "gaurav-profile-daily-visit";

type VisitStats = {
  totalVisitors: number;
  totalVisits: number;
  todayVisitors: number;
  todayVisits: number;
};

type ProfileVisitStatsEvent = CustomEvent<VisitStats>;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function createVisitorKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ProfileVisitorTracker() {
  const [stats, setStats] = useState<VisitStats>({
    totalVisitors: 0,
    totalVisits: 0,
    todayVisitors: 0,
    todayVisits: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    reason: "",
  });

  const visitorLabel = useMemo(() => {
    if (!stats.totalVisitors) return "Profile visitors";
    return `${stats.totalVisitors.toLocaleString()} profile visitor${
      stats.totalVisitors === 1 ? "" : "s"
    }`;
  }, [stats.totalVisitors]);

  useEffect(() => {
    function publishStats(nextStats: VisitStats) {
      window.dispatchEvent(
        new CustomEvent("profile-visit-stats", { detail: nextStats })
      );
    }

    function normalizeStats(data: any): VisitStats {
      return {
        totalVisitors: data.totalVisitors || 0,
        totalVisits: data.totalVisits || 0,
        todayVisitors: data.todayVisitors || 0,
        todayVisits: data.todayVisits || 0,
      };
    }

    async function loadStats() {
      try {
        const res = await fetch("/api/profile-visits");
        const data = await res.json();
        if (res.ok) {
          const nextStats = normalizeStats(data);
          setStats(nextStats);
          publishStats(nextStats);
        }
      } catch {
        // Keep the counter quiet if the network is unavailable.
      }
    }

    async function recordDailyVisit() {
      const currentDay = todayKey();
      if (localStorage.getItem(DAILY_VISIT_STORAGE) === currentDay) return;

      try {
        let visitorKey = localStorage.getItem(VISITOR_KEY_STORAGE);
        if (!visitorKey) {
          visitorKey = createVisitorKey();
          localStorage.setItem(VISITOR_KEY_STORAGE, visitorKey);
        }

        const res = await fetch("/api/profile-visits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorKey,
            path: window.location.pathname,
            referrer: document.referrer,
          }),
        });
        const data = await res.json();

        if (res.ok) {
          const nextStats = normalizeStats(data);
          localStorage.setItem(DAILY_VISIT_STORAGE, currentDay);
          setStats(nextStats);
          publishStats(nextStats);
        }
      } catch {
        // The portfolio should still load even if analytics cannot be saved.
      }
    }

    loadStats();
    recordDailyVisit();

    if (!localStorage.getItem(VISITOR_SAVED_STORAGE)) {
      const timer = window.setTimeout(() => setIsOpen(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submitVisit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    if (!name) {
      setError("Please enter your name.");
      return;
    }

    setIsSaving(true);

    try {
      let visitorKey = localStorage.getItem(VISITOR_KEY_STORAGE);
      if (!visitorKey) {
        visitorKey = createVisitorKey();
        localStorage.setItem(VISITOR_KEY_STORAGE, visitorKey);
      }

      const res = await fetch("/api/profile-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name,
          visitorKey,
          path: window.location.pathname,
          referrer: document.referrer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to save your visit.");
      }

      const nextStats = {
        totalVisitors: data.totalVisitors || 0,
        totalVisits: data.totalVisits || 0,
        todayVisitors: data.todayVisitors || 0,
        todayVisits: data.todayVisits || 0,
      };
      setStats(nextStats);
      window.dispatchEvent(
        new CustomEvent("profile-visit-stats", { detail: nextStats })
      );
      localStorage.setItem(VISITOR_SAVED_STORAGE, "true");
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Unable to save your visit.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/85 px-4 py-3 text-left text-white shadow-2xl shadow-black/40 backdrop-blur-xl transition hover:border-white/25 hover:bg-zinc-900"
        aria-label="Open profile visitor form"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
          <Eye size={18} />
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold leading-tight">
            {visitorLabel}
          </span>
          <span className="block text-xs text-zinc-400">
            {stats.todayVisitors.toLocaleString()} visitor
            {stats.todayVisitors === 1 ? "" : "s"} today
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                  <UserRound size={22} />
                </div>
                <h2 className="text-2xl font-bold">Thanks for visiting</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Share a few details so I can remember who visited my profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close visitor form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitVisit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                    maxLength={80}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
                    placeholder="Your name"
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  Email
                  <input
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    type="email"
                    maxLength={120}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  Role
                  <input
                    name="role"
                    value={form.role}
                    onChange={updateField}
                    maxLength={80}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
                    placeholder="Recruiter, developer..."
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  Company
                  <input
                    name="company"
                    value={form.company}
                    onChange={updateField}
                    maxLength={100}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
                    placeholder="Company or college"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-zinc-300">
                Reason for visit
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={updateField}
                  maxLength={300}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
                  placeholder="Hiring, project review, collaboration..."
                />
              </label>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving && <Loader2 size={18} className="animate-spin" />}
                Save my visit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
