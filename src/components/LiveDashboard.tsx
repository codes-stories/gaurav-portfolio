"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GitHubEvent {
    id: string
    type: string
    repo: { name: string }
    created_at: string
    payload: any
}

interface LiveStats {
    totalCommits: number
    totalPRs: number
    totalIssues: number
    recentActivity: GitHubEvent[]
}

const codeSnippets = [
    {
        title: "Fibonacci Generator",
        lang: "JavaScript",
        code: `function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}
// Output: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34`,
    },
    {
        title: "Debounce Utility",
        lang: "TypeScript",
        code: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Usage
const search = debounce((query: string) => {
  console.log("Searching:", query);
}, 300);`,
    },
    {
        title: "LRU Cache",
        lang: "JavaScript",
        code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}

const cache = new LRUCache(3);
cache.put(1, "a"); cache.put(2, "b");
cache.put(3, "c");
cache.get(1); // "a"
cache.put(4, "d"); // evicts key 2`,
    },
    {
        title: "Promise.all Polyfill",
        lang: "JavaScript",
        code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    const total = promises.length;

    if (total === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          completed++;
          if (completed === total) resolve(results);
        })
        .catch(reject);
    });
  });
}

// Usage
const p1 = Promise.resolve(1);
const p2 = new Promise(r => setTimeout(() => r(2), 100));
const p3 = Promise.resolve(3);
promiseAll([p1, p2, p3]).then(console.log);
// [1, 2, 3]`,
    },
]

export default function LiveDashboard() {
    const [events, setEvents] = useState<GitHubEvent[]>([])
    const [stats, setStats] = useState({ repos: 0, followers: 0, stars: 0 })
    const [activeSnippet, setActiveSnippet] = useState(0)
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        fetch("/api/github/events")
            .then((res) => res.json())
            .then((data) => { if (Array.isArray(data)) setEvents(data.slice(0, 8)) })
            .catch(() => {})

        fetch("/api/github/user")
            .then((res) => res.json())
            .then((d) => setStats({ repos: d.public_repos || 0, followers: d.followers || 0, stars: 0 }))
            .catch(() => {})
    }, [])

    const runCode = () => {
        setIsRunning(true)
        setOutput("")
        const logs: string[] = []
        const fakeConsole = { log: (...args: any[]) => logs.push(args.join(" ")) }
        try {
            const fn = new Function("console", codeSnippets[activeSnippet].code)
            fn(fakeConsole)
            setTimeout(() => { setOutput(logs.join("\n") || "Code executed (no output)"); setIsRunning(false) }, 500)
        } catch (err: any) {
            setOutput(`Error: ${err.message}`)
            setIsRunning(false)
        }
    }

    const eventTypeIcon: Record<string, string> = {
        PushEvent: "🚀",
        CreateEvent: "✨",
        IssuesEvent: "🎯",
        PullRequestEvent: "🔀",
        WatchEvent: "⭐",
        ForkEvent: "🍴",
        DeleteEvent: "🗑️",
        ReleaseEvent: "📦",
    }

    return (
        <section className="relative bg-black text-white py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Activity Feed
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                        Developer Dashboard
                    </h2>
                    <p className="text-zinc-400 text-lg">Real-time activity & interactive code playground</p>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-6" />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Live Activity Feed */}
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <h3 className="text-lg font-bold text-white">GitHub Activity</h3>
                            <span className="text-xs text-zinc-500 ml-auto">@codes-stories</span>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-xl font-bold text-white">{stats.repos}</div>
                                <div className="text-[10px] text-zinc-500">Repos</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-xl font-bold text-white">{stats.followers}</div>
                                <div className="text-[10px] text-zinc-500">Followers</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-xl font-bold text-white">{events.length}</div>
                                <div className="text-[10px] text-zinc-500">Recent Events</div>
                            </div>
                        </div>

                        {/* Event Feed */}
                        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                            {events.length === 0
                                ? Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                                        <div className="flex-1">
                                            <div className="h-3 bg-zinc-800 rounded w-3/4 mb-1" />
                                            <div className="h-2 bg-zinc-800 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))
                                : events.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                                            {eventTypeIcon[event.type] || "📌"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-white truncate">
                                                {event.type.replace("Event", "")} on{" "}
                                                <span className="text-blue-400">{event.repo.name.split("/").pop()}</span>
                                            </div>
                                            <div className="text-[10px] text-zinc-500">
                                                {new Date(event.created_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>

                    {/* Code Playground */}
                    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Code Playground</h3>
                        </div>

                        {/* Snippet Tabs */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            {codeSnippets.map((snippet, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setActiveSnippet(i); setOutput("") }}
                                    className={`shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all ${
                                        i === activeSnippet
                                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                            : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10"
                                    }`}
                                >
                                    {snippet.title}
                                </button>
                            ))}
                        </div>

                        {/* Code Editor */}
                        <div className="bg-zinc-950 rounded-xl border border-white/5 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                                <span className="text-[10px] text-zinc-500">{codeSnippets[activeSnippet].lang}</span>
                                <button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                >
                                    {isRunning ? (
                                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                    {isRunning ? "Running..." : "Run"}
                                </button>
                            </div>
                            <pre className="p-4 text-xs text-zinc-300 overflow-x-auto font-mono leading-relaxed max-h-[280px] overflow-y-auto">
                                <code>{codeSnippets[activeSnippet].code}</code>
                            </pre>
                        </div>

                        {/* Output */}
                        {output && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 bg-zinc-950 rounded-xl border border-white/5 p-4"
                            >
                                <div className="text-[10px] text-zinc-500 mb-2">Output:</div>
                                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}