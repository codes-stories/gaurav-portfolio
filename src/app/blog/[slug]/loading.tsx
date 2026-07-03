export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      <article className="mx-auto max-w-3xl px-4 py-20 text-white">
        <header className="mb-14 space-y-4">
          <div className="h-12 w-4/5 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-60 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-10 w-36 rounded-full bg-white/10 animate-pulse" />
        </header>

        <div className="mb-16 h-[420px] rounded-2xl border border-white/10 bg-white/10 animate-pulse" />

        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-6">
          <div className="h-5 w-full rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-11/12 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-10/12 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-9/12 rounded-lg bg-white/10 animate-pulse" />
        </div>
      </article>
    </main>
  );
}