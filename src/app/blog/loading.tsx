export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 mt-5">
      <div className="mx-auto max-w-5xl px-4 py-14 text-white">
        <div className="mb-10 space-y-3">
          <div className="h-10 w-40 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-72 rounded-lg bg-white/10 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black"
            >
              <div className="h-56 bg-white/10 animate-pulse" />
              <div className="space-y-4 p-6">
                <div className="h-7 w-4/5 rounded-lg bg-white/10 animate-pulse" />
                <div className="h-4 w-2/3 rounded-lg bg-white/10 animate-pulse" />
                <div className="h-4 w-28 rounded-lg bg-white/10 animate-pulse" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}