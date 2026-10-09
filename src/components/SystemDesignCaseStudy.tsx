"use client";

import { useState } from "react";
import { ArrowRight, Database, LockKeyhole, Mail, QrCode, Server, Workflow } from "lucide-react";

const views = {
  current: {
    label: "Current architecture",
    summary: "A focused MERN implementation for QR-based campus entry and exit records.",
    nodes: [
      { label: "Student / guard", detail: "QR scan", icon: QrCode },
      { label: "React client", detail: "Validation + workflow", icon: Workflow },
      { label: "Node / Express", detail: "Auth + API rules", icon: Server },
      { label: "MongoDB", detail: "Entry/exit records", icon: Database },
    ],
    considerations: ["Validate scans server-side", "Keep a clear entry/exit audit trail", "Limit access by role"],
  },
  scale: {
    label: "Scale-ready evolution",
    summary: "A next-step design for higher scan volume, independent notification work, and better operational visibility.",
    nodes: [
      { label: "QR clients", detail: "Rate-limited requests", icon: QrCode },
      { label: "API boundary", detail: "Auth + idempotency", icon: LockKeyhole },
      { label: "Event queue", detail: "Scan events", icon: Workflow },
      { label: "Workers", detail: "Notifications + analytics", icon: Mail },
    ],
    considerations: ["Use idempotency keys for duplicate scans", "Move notifications off the request path", "Track latency, failures, and queue depth"],
  },
};

export default function SystemDesignCaseStudy() {
  const [view, setView] = useState<keyof typeof views>("current");
  const active = views[view];

  return (
    <section className="w-full text-left">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">System design case study</p>
          <h2 className="font-code heading-grad-1 mt-3 text-3xl font-semibold tracking-tight md:text-4xl">SMVDeX: from QR scan to an auditable event.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">A concise look at the implementation today and the trade-offs I would make before increasing campus-scale traffic.</p>
        </div>
        <a href="/projects/SmvDex" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-cyan-700 transition hover:text-cyan-600 dark:text-cyan-200 dark:hover:text-cyan-100">
          View project <ArrowRight size={16} />
        </a>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
        <div className="flex w-fit rounded-lg border border-border bg-muted p-1" role="tablist" aria-label="Architecture view">
          {(Object.keys(views) as Array<keyof typeof views>).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={view === key} onClick={() => setView(key)} className={`rounded-md px-3 py-2 text-sm font-medium transition ${view === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {views[key].label}
            </button>
          ))}
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">{active.summary}</p>

        <div className="mt-7 grid gap-3 md:grid-cols-4">
          {active.nodes.map(({ label, detail, icon: Icon }, index) => (
            <div key={label} className="relative rounded-xl border border-border bg-background p-4">
              {index < active.nodes.length - 1 && <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-muted-foreground md:block" size={16} />}
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-200"><Icon size={17} /></span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{label}</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 border-t border-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Design decisions</p>
          <ul className="mt-3 grid gap-2 text-sm text-foreground md:grid-cols-3">
            {active.considerations.map((item) => <li key={item} className="rounded-lg bg-muted px-3 py-2.5">{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
