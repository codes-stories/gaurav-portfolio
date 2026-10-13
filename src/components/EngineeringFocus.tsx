import { Braces, ShieldCheck, Waypoints } from "lucide-react";

const principles = [
  {
    title: "Start with the system boundary",
    detail:
      "Clarify data ownership, API contracts, permissions, and failure paths before implementation grows expensive.",
    icon: Waypoints,
  },
  {
    title: "Build for operability",
    detail:
      "Treat authentication, validation, admin workflows, and useful signals as part of the feature—not follow-up work.",
    icon: ShieldCheck,
  },
  {
    title: "Make trade-offs explicit",
    detail:
      "Choose the simplest solution that meets the product need, then document the constraints and next sensible improvement.",
    icon: Braces,
  },
];

export default function EngineeringFocus() {
  return (
    <section className="w-full text-left">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
          Engineering approach
        </p>
        <h2 className="font-display heading-grad-2 mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Building beyond the happy path.
        </h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
          The work I enjoy sits between product requirements and dependable systems:
          clear boundaries, thoughtful implementation, and ownership after launch.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {principles.map(({ title, detail, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-200">
              <Icon size={18} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
