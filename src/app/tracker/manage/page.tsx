"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Pause, Pencil, RotateCcw, X } from "lucide-react";

type Priority = "low" | "medium" | "high" | "critical";

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

const priorityStyles: Record<Priority, string> = {
  low: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  medium: "border-yellow-400/40 bg-yellow-400/10 text-yellow-200",
  high: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  critical: "border-red-400/40 bg-red-400/10 text-red-200",
};

export default function TrackerManagePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [subjectRes, topicRes, taskRes] = await Promise.all([
      fetch("/api/tracker/subjects"),
      fetch("/api/tracker/topics"),
      fetch("/api/tracker/tasks?includeDeferred=true"),
    ]);
    setSubjects(await subjectRes.json());
    setTopics(await topicRes.json());
    setTasks(await taskRes.json());
    setLoading(false);
  };

  useEffect(() => {
    loadData().catch(() => setLoading(false));
  }, []);

  const patchTask = async (taskId: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/tracker/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
  };

  const saveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    const data = new FormData(event.currentTarget);
    await patchTask(editing._id, {
      title: data.get("title"),
      description: data.get("description"),
      priority: data.get("priority"),
      estimatedMinutes: Number(data.get("estimatedMinutes")),
    });
    setSaving(false);
    setEditing(null);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-white/10 pb-5">
          <a href="/tracker" className="mb-4 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white">
            <ArrowLeft size={16} />
            Back to tracker
          </a>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Tracker Manage</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Subjects, topics, and tasks</h1>
        </header>

        {loading ? (
          <div className="mt-6 flex h-80 items-center justify-center rounded-lg border border-white/10 bg-zinc-950">
            <Loader2 className="animate-spin text-cyan-300" />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-zinc-950/80">
                <div className="border-b border-white/10 p-4">
                  <h2 className="text-lg font-semibold">Subjects</h2>
                </div>
                <div className="divide-y divide-white/10">
                  {subjects.length === 0 ? (
                    <p className="p-4 text-sm text-white/50">No subjects yet.</p>
                  ) : (
                    subjects.map((subject) => (
                      <div key={subject._id} className="flex items-center justify-between gap-3 p-4">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span className="truncate font-medium">{subject.name}</span>
                        </span>
                        <span className="text-sm text-white/40">
                          {topics.filter((topic) => subjectIdFor(topic) === subject._id).length} topics
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-950/80">
                <div className="border-b border-white/10 p-4">
                  <h2 className="text-lg font-semibold">Topics</h2>
                </div>
                <div className="max-h-96 divide-y divide-white/10 overflow-y-auto">
                  {topics.length === 0 ? (
                    <p className="p-4 text-sm text-white/50">No topics yet.</p>
                  ) : (
                    topics.map((topic) => (
                      <div key={topic._id} className="flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{topic.name}</p>
                          <p className="mt-1 text-sm text-white/45">{subjectNameFor(topic, subjects)}</p>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/55">
                          {topic.maxTimeMinutes} min
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/80">
              <div className="flex flex-col gap-2 border-b border-white/10 p-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">All tasks</h2>
                  <p className="mt-1 text-sm text-white/45">Tasks are never hard deleted. Deferred tasks can be restored.</p>
                </div>
                <span className="text-sm text-white/45">{tasks.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left text-sm">
                  <thead className="text-white/45">
                    <tr>
                      <th className="px-4 py-3 font-medium">Task</th>
                      <th className="px-4 py-3 font-medium">Subject</th>
                      <th className="px-4 py-3 font-medium">Topic</th>
                      <th className="px-4 py-3 font-medium">Priority</th>
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 font-medium">Points</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id} className={`border-t border-white/10 ${task.isDeferred ? "bg-white/[0.03] text-white/45" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            <p className={task.isDeferred ? "line-through" : ""}>{task.title}</p>
                            {task.description && <p className="mt-1 truncate text-xs text-white/35">{task.description}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">{task.subjectId?.name}</td>
                        <td className="px-4 py-3">{task.topicId?.name}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${priorityStyles[task.priority]}`}>{task.priority}</span>
                        </td>
                        <td className="px-4 py-3">{task.estimatedMinutes} min</td>
                        <td className="px-4 py-3">+{task.pointValue} / -{task.penaltyValue}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => setEditing(task)} className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 text-white/70 transition hover:text-white">
                              <Pencil size={15} />
                              Edit
                            </button>
                            {task.isDeferred ? (
                              <button onClick={() => patchTask(task._id, { isDeferred: false })} className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-300/25 px-3 text-emerald-200 transition hover:bg-emerald-300/10">
                                <RotateCcw size={15} />
                                Restore
                              </button>
                            ) : (
                              <button onClick={() => patchTask(task._id, { isDeferred: true })} className="inline-flex h-9 items-center gap-2 rounded-md border border-orange-300/25 px-3 text-orange-200 transition hover:bg-orange-300/10">
                                <Pause size={15} />
                                Defer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <form onSubmit={saveEdit} className="w-full rounded-t-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl sm:max-w-xl sm:rounded-lg">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit task</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/70">Title</span>
                <input name="title" defaultValue={editing.title} required className="tracker-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/70">Description</span>
                <textarea name="description" defaultValue={editing.description} className="tracker-input min-h-24 resize-none" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/70">Priority</span>
                  <select name="priority" defaultValue={editing.priority} className="tracker-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/70">Estimated minutes</span>
                  <input name="estimatedMinutes" defaultValue={editing.estimatedMinutes} type="number" min={1} required className="tracker-input" />
                </label>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function subjectIdFor(topic: Topic) {
  return typeof topic.subjectId === "string" ? topic.subjectId : topic.subjectId._id;
}

function subjectNameFor(topic: Topic, subjects: Subject[]) {
  if (typeof topic.subjectId !== "string") return topic.subjectId.name;
  return subjects.find((subject) => subject._id === topic.subjectId)?.name || "Unknown subject";
}
