"use client";

import { ArrowUpRight, Database, Gauge, Layers3, ShieldCheck } from "lucide-react";

const capabilities = [
  {
    title: "Full-stack delivery",
    detail: "Next.js frontends, API routes, authentication, dashboards, and database-backed workflows.",
    icon: Layers3,
  },
  {
    title: "Backend depth",
    detail: "REST APIs, MongoDB models, validation paths, and production-minded service boundaries.",
    icon: Database,
  },
  {
    title: "Product quality",
    detail: "Responsive UI, readable flows, analytics signals, and features recruiters can actually test.",
    icon: Gauge,
  },
  {
    title: "Ownership",
    detail: "Admin tooling, protected routes, content publishing, and operational visibility.",
    icon: ShieldCheck,
  },
];

const stats = [
  { value: "6+", label: "Shipped projects" },
  { value: "470+", label: "DSA problems" },
  { value: "MERN", label: "Core stack" },
  { value: "API-first", label: "Build style" },
];

export default function ProfessionalSnapshot() {
  return (
    <section className="w-full text-left">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
            Developer profile
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            I build portfolio projects like small, working products.
          </h2>
        </div>
        <a
          href="#contact"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-cyan-300/40 hover:text-cyan-100"
        >
          Start a conversation
          <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/75 p-6">
          <p className="text-sm leading-7 text-zinc-300">
            My focus is practical engineering: clean UI, useful backend features,
            and enough system thinking to explain tradeoffs clearly in an
            interview. The site now highlights the work, the architecture, and
            the proof points without making visitors hunt for them.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-2xl font-semibold text-white">{item.value}</div>
                <div className="mt-1 text-xs text-zinc-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {capabilities.map(({ title, detail, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-zinc-950/75 p-5 transition hover:border-cyan-300/30"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
