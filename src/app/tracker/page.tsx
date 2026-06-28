"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  Flame,
  FolderTree,
  LayoutDashboard,
  Loader2,
  Pause,
  Plus,
  Target,
  X,
} from "lucide-react";

type Priority = "low" | "medium" | "high" | "critical";
type LogStatus = "pending" | "completed" | "deferred";

type Subject = {
  _id: string;
  name: string;
  color: string;
};

type Topic = {
  _id: string;
  name: string;
  maxTimeMinutes: number;
  subjectId: Subject | string;
};

type Task = {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  estimatedMinutes: number;
  pointValue: number;
  penaltyValue: number;
  isDeferred: boolean;
  subjectId: Subject;
  topicId: Topic;
};

type DailyLog = {
  _id: string;
  status: LogStatus;
  actualMinutes?: number;
  pointsAwarded: number;
  penaltyApplied: number;
  taskId: Task;
};

type Stats = {
  totalPoints: number;
  totalPenalties: number;
  currentStreak: number;
  longestStreak: number;
};

const priorityStyles: Record<Priority, string> = {
  low: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  medium: "border-yellow-400/40 bg-yellow-400/10 text-yellow-200",
  high: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  critical: "border-red-400/40 bg-red-400/10 text-red-200",
};

const priorityValues: Record<Priority, { points: number; penalty: number }> = {
  low: { points: 5, penalty: 2 },
  medium: { points: 10, penalty: 5 },
  high: { points: 20, penalty: 10 },
  critical: { points: 30, penalty: 15 },
};

const subjectColors = ["#38bdf8", "#22c55e", "#f97316", "#f43f5e", "#a78bfa", "#14b8a6"];

const emptyTaskForm = {
  subjectId: "",
  topicId: "",
  newSubjectName: "",
  newTopicName: "",
  title: "",
  description: "",
  priority: "medium" as Priority,
  estimatedMinutes: 30,
};

export default function TrackerPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState(emptyTaskForm);
  const [floatPoints, setFloatPoints] = useState<Record<string, number>>({});

  const loadTracker = async () => {
    setLoading(true);
    const [subjectRes, topicRes, logRes, statsRes] = await Promise.all([
      fetch("/api/tracker/subjects"),
      fetch("/api/tracker/topics"),
      fetch("/api/tracker/daily-log"),
      fetch("/api/tracker/stats"),
    ]);

    setSubjects(await subjectRes.json());
    setTopics(await topicRes.json());
    setLogs(await logRes.json());
    setStats(await statsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    loadTracker().catch(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    const total = logs.length;
    const completed = logs.filter((log) => log.status === "completed").length;
    const deferred = logs.filter((log) => log.status === "deferred").length;
    const todayScore = logs.reduce(
      (sum, log) => sum + Number(log.pointsAwarded || 0) - Number(log.penaltyApplied || 0),
      0
    );

    return {
      total,
      completed,
      deferred,
      todayScore,
      completion: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [logs]);

  const groupedLogs = useMemo(() => {
    const groups = new Map<string, { subject: Subject; topics: Map<string, { topic: Topic; logs: DailyLog[] }> }>();

    logs.forEach((log) => {
      const task = log.taskId;
      if (!task) return;
      const subject = task.subjectId;
      const topic = task.topicId;
      if (!groups.has(subject._id)) {
        groups.set(subject._id, { subject, topics: new Map() });
      }
      const subjectGroup = groups.get(subject._id)!;
      if (!subjectGroup.topics.has(topic._id)) {
        subjectGroup.topics.set(topic._id, { topic, logs: [] });
      }
      subjectGroup.topics.get(topic._id)!.logs.push(log);
    });

    return Array.from(groups.values()).map((group) => ({
      ...group,
      topics: Array.from(group.topics.values()),
    }));
  }, [logs]);

  const filteredTopics = topics.filter((topic) => {
    const subjectId = typeof topic.subjectId === "string" ? topic.subjectId : topic.subjectId._id;
    return subjectId === form.subjectId;
  });

  const patchLog = async (log: DailyLog, status: LogStatus) => {
    const previousStatus = log.status;
    setLogs((current) =>
      current.map((item) =>
        item._id === log._id
          ? {
              ...item,
              status,
              pointsAwarded: status === "completed" ? item.taskId.pointValue : 0,
              penaltyApplied: status === "deferred" ? item.taskId.penaltyValue : 0,
            }
          : item
      )
    );

    if (status === "completed" && previousStatus !== "completed") {
      setFloatPoints((current) => ({ ...current, [log._id]: log.taskId.pointValue }));
      window.setTimeout(() => {
        setFloatPoints((current) => {
          const next = { ...current };
          delete next[log._id];
          return next;
        });
      }, 900);
    }

    const res = await fetch(`/api/tracker/daily-log/${log._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      await loadTracker();
      return;
    }

    const updated = await res.json();
    setLogs((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    const statsRes = await fetch("/api/tracker/stats");
    setStats(await statsRes.json());
  };

  const createTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      let subjectId = form.subjectId;
      if (subjectId === "new") {
        const subjectRes = await fetch("/api/tracker/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.newSubjectName,
            color: subjectColors[subjects.length % subjectColors.length],
          }),
        });
        const subject = await subjectRes.json();
        subjectId = subject._id;
      }

      let topicId = form.topicId;
      if (topicId === "new") {
        const topicRes = await fetch("/api/tracker/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectId,
            name: form.newTopicName,
            maxTimeMinutes: Math.max(1, Number(form.estimatedMinutes || 30)),
          }),
        });
        const topic = await topicRes.json();
        topicId = topic._id;
      }

      await fetch("/api/tracker/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          topicId,
          title: form.title,
          description: form.description,
          priority: form.priority,
          estimatedMinutes: Number(form.estimatedMinutes || 30),
        }),
      });

      setForm(emptyTaskForm);
      setModalOpen(false);
      await loadTracker();
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Daily Task Tracker</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Today&apos;s checklist</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/tracker/analytics" className="inline-flex h-10 items-center gap-2 rounded-md border border-white/15 px-3 text-sm text-white/80 transition hover:border-cyan-300/50 hover:text-white">
              <BarChart3 size={16} />
              Analytics
            </a>
            <a href="/tracker/manage" className="inline-flex h-10 items-center gap-2 rounded-md border border-white/15 px-3 text-sm text-white/80 transition hover:border-cyan-300/50 hover:text-white">
              <LayoutDashboard size={16} />
              Manage
            </a>
            <button onClick={() => setModalOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-black transition hover:bg-cyan-200">
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Today score" value={totals.todayScore} icon={<Target size={18} />} tone="cyan" />
          <StatCard label="Total points" value={stats?.totalPoints || 0} icon={<BookOpen size={18} />} tone="green" />
          <StatCard label="Current streak" value={stats?.currentStreak || 0} suffix="days" icon={<Flame size={18} />} tone="orange" />
          <StatCard label="Completion" value={totals.completion} suffix="%" icon={<Check size={18} />} tone="violet" />
        </section>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr_260px]">
          <aside className={`${sidebarOpen ? "block" : "hidden"} rounded-lg border border-white/10 bg-zinc-950/80 p-4 lg:block`}>
            <button onClick={() => setSidebarOpen(false)} className="mb-3 flex w-full items-center justify-between rounded-md border border-white/10 px-3 py-2 text-sm lg:hidden">
              Subjects and topics
              <ChevronDown size={16} />
            </button>
            <SubjectTree subjects={subjects} topics={topics} />
          </aside>

          <section className="min-h-[520px]">
            <button onClick={() => setSidebarOpen(true)} className="mb-3 inline-flex h-10 items-center gap-2 rounded-md border border-white/15 px-3 text-sm text-white/80 lg:hidden">
              <FolderTree size={16} />
              Subjects
            </button>

            {loading ? (
              <div className="flex h-80 items-center justify-center rounded-lg border border-white/10 bg-zinc-950">
                <Loader2 className="animate-spin text-cyan-300" />
              </div>
            ) : logs.length === 0 ? (
              <EmptyState onAdd={() => setModalOpen(true)} />
            ) : (
              <div className="space-y-5">
                {groupedLogs.map((group) => (
                  <div key={group.subject._id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: group.subject.color }} />
                      <h2 className="text-lg font-semibold">{group.subject.name}</h2>
                    </div>
                    {group.topics.map(({ topic, logs: topicLogs }) => (
                      <div key={topic._id} className="rounded-lg border border-white/10 bg-zinc-950/70 p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h3 className="text-sm font-medium text-white/75">{topic.name}</h3>
                          <span className="text-xs text-white/40">{topicLogs.length} tasks</span>
                        </div>
                        <div className="space-y-3">
                          {topicLogs.map((log) => (
                            <TaskCard key={log._id} log={log} floating={floatPoints[log._id]} onStatus={patchLog} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-lg border border-white/10 bg-zinc-950/80 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/50">Progress</h2>
            <div className="mt-4 rounded-lg border border-white/10 bg-black p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-white/50">Today completion</p>
                  <p className="mt-1 text-3xl font-semibold">{totals.completion}%</p>
                </div>
                <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-sm text-orange-200">
                  {stats?.currentStreak || 0} streak
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${totals.completion}%` }} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <MiniStat label="Done" value={totals.completed} />
              <MiniStat label="Deferred" value={totals.deferred} />
              <MiniStat label="Penalties" value={stats?.totalPenalties || 0} />
              <MiniStat label="Best streak" value={stats?.longestStreak || 0} />
            </div>
          </aside>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <form onSubmit={createTask} className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl sm:max-w-2xl sm:rounded-lg">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Add task for today</h2>
                <p className="mt-1 text-sm text-white/50">Create the subject or topic inline when needed.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Subject">
                <select required value={form.subjectId} onChange={(event) => setForm({ ...form, subjectId: event.target.value, topicId: "" })} className="tracker-input">
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                  <option value="new">Create new subject</option>
                </select>
              </Field>
              {form.subjectId === "new" && (
                <Field label="New subject">
                  <input required value={form.newSubjectName} onChange={(event) => setForm({ ...form, newSubjectName: event.target.value })} className="tracker-input" placeholder="DSA" />
                </Field>
              )}
              <Field label="Topic">
                <select required value={form.topicId} onChange={(event) => setForm({ ...form, topicId: event.target.value })} className="tracker-input" disabled={!form.subjectId}>
                  <option value="">Select topic</option>
                  {filteredTopics.map((topic) => (
                    <option key={topic._id} value={topic._id}>{topic.name}</option>
                  ))}
                  <option value="new">Create new topic</option>
                </select>
              </Field>
              {form.topicId === "new" && (
                <Field label="New topic">
                  <input required value={form.newTopicName} onChange={(event) => setForm({ ...form, newTopicName: event.target.value })} className="tracker-input" placeholder="Dynamic programming" />
                </Field>
              )}
              <Field label="Title">
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="tracker-input" placeholder="Solve 3 medium problems" />
              </Field>
              <Field label="Estimated minutes">
                <input required min={1} type="number" value={form.estimatedMinutes} onChange={(event) => setForm({ ...form, estimatedMinutes: Number(event.target.value) })} className="tracker-input" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="tracker-input min-h-24 resize-none" placeholder="Optional notes" />
                </Field>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-white/70">Priority</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(priorityValues) as Priority[]).map((priority) => (
                  <button key={priority} type="button" onClick={() => setForm({ ...form, priority })} className={`rounded-md border px-3 py-3 text-left text-sm capitalize transition ${form.priority === priority ? priorityStyles[priority] : "border-white/10 bg-black text-white/65 hover:border-white/25"}`}>
                    <span className="font-semibold">{priority}</span>
                    <span className="mt-1 block text-xs opacity-75">+{priorityValues[priority].points} / -{priorityValues[priority].penalty}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-white/60">
                Awards <span className="font-semibold text-green-300">+{priorityValues[form.priority].points}</span> points, penalty <span className="font-semibold text-orange-300">-{priorityValues[form.priority].penalty}</span>.
              </div>
              <button disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:opacity-60">
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value, suffix = "", icon, tone }: { label: string; value: number; suffix?: string; icon: React.ReactNode; tone: "cyan" | "green" | "orange" | "violet" }) {
  const tones = {
    cyan: "text-cyan-200 bg-cyan-300/10 border-cyan-300/20",
    green: "text-emerald-200 bg-emerald-300/10 border-emerald-300/20",
    orange: "text-orange-200 bg-orange-300/10 border-orange-300/20",
    violet: "text-violet-200 bg-violet-300/10 border-violet-300/20",
  };

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-4">
      <div className={`mb-4 inline-flex rounded-md border p-2 ${tones[tone]}`}>{icon}</div>
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}{suffix && <span className="ml-1 text-base text-white/50">{suffix}</span>}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-black p-3">
      <p className="text-white/45">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function SubjectTree({ subjects, topics }: { subjects: Subject[]; topics: Topic[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/50">Subjects</h2>
        <FolderTree size={16} className="text-white/40" />
      </div>
      {subjects.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-white/50">No subjects yet.</p>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => {
            const childTopics = topics.filter((topic) => {
              const subjectId = typeof topic.subjectId === "string" ? topic.subjectId : topic.subjectId._id;
              return subjectId === subject._id;
            });
            return (
              <details key={subject._id} className="group rounded-md border border-white/10 bg-black/50 p-3" open>
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="truncate">{subject.name}</span>
                  </span>
                  <ChevronDown size={15} className="text-white/40 transition group-open:rotate-180" />
                </summary>
                <div className="mt-3 space-y-2 pl-4">
                  {childTopics.map((topic) => (
                    <div key={topic._id} className="truncate border-l border-white/10 pl-3 text-sm text-white/55">{topic.name}</div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TaskCard({ log, floating, onStatus }: { log: DailyLog; floating?: number; onStatus: (log: DailyLog, status: LogStatus) => void }) {
  const task = log.taskId;
  const completed = log.status === "completed";
  const deferred = log.status === "deferred";

  return (
    <article className={`relative rounded-lg border p-4 transition ${completed ? "border-emerald-300/25 bg-emerald-300/10" : deferred ? "border-orange-300/25 bg-orange-300/10" : "border-white/10 bg-black"}`}>
      {floating && <span className="pointer-events-none absolute right-6 top-2 animate-[floatUp_900ms_ease-out_forwards] text-sm font-semibold text-emerald-300">+{floating}</span>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className={`font-semibold ${completed ? "text-white/55 line-through" : "text-white"}`}>{task.title}</h4>
            <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${priorityStyles[task.priority]}`}>{task.priority}</span>
            {deferred && <span className="rounded-full border border-orange-300/30 bg-orange-300/10 px-2 py-0.5 text-xs text-orange-200">Deferred</span>}
          </div>
          {task.description && <p className="mt-2 text-sm text-white/50">{task.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/45">
            <span>{task.estimatedMinutes} min</span>
            <span>+{task.pointValue} pts</span>
            <span>-{task.penaltyValue} penalty</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => onStatus(log, "completed")} className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-300/25 px-3 text-sm text-emerald-200 transition hover:bg-emerald-300/10">
            <Check size={15} />
            Complete
          </button>
          <button onClick={() => onStatus(log, "deferred")} className="inline-flex h-9 items-center gap-2 rounded-md border border-orange-300/25 px-3 text-sm text-orange-200 transition hover:bg-orange-300/10">
            <Pause size={15} />
            Defer
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-zinc-950/70 p-8 text-center">
      <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
        <Target size={24} />
      </div>
      <h2 className="mt-4 text-xl font-semibold">No tasks yet</h2>
      <p className="mt-2 max-w-sm text-sm text-white/55">Add your first subject, topic, and task to start tracking today&apos;s work.</p>
      <button onClick={onAdd} className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-black transition hover:bg-cyan-200">
        <Plus size={16} />
        Add First Task
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/70">{label}</span>
      {children}
    </label>
  );
}
