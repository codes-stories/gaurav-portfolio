"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Activity {
    id: string
    platform: "leetcode" | "github"
    title: string
    subtitle: string
    description: string
    url: string
    icon: string
    color: string
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [active, setActive] = useState(0)
    const [expanded, setExpanded] = useState<Activity | null>(null)

    useEffect(() => {
        async function fetchAll() {
            const all: Activity[] = []

            try {
                const res = await fetch("/api/leetcode/recent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: "Gaurav_krrr" }),
                })
                const data = await res.json()
                const subs = data?.data?.recentAcSubmissionList || []
                subs.slice(0, 3).forEach((sub: any) => {
                    const slug = sub.titleSlug || ""
                    const pretty = slug
                        .split("-")
                        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                    all.push({
                        id: `lc-${sub.timestamp}`,
                        platform: "leetcode",
                        title: sub.title,
                        subtitle: "LeetCode",
                        description: pretty,
                        url: `https://leetcode.com/problems/${slug}/`,
                        icon: "⚡",
                        color: "from-orange-500/20 to-yellow-500/20 border-orange-500/20",
                    })
                })
            } catch {}

            try {
                const res = await fetch("/api/github/events")
                const data = await res.json()
                if (Array.isArray(data)) {
                    data.slice(0, 3).forEach((event: any) => {
                        const repo = event.repo?.name?.split("/").pop() || ""
                        const typeMap: Record<string, { title: string; icon: string; desc: string }> = {
                            PushEvent: { title: `Pushed to ${repo}`, icon: "🚀", desc: `${event.payload?.size || 0} commits pushed` },
                            CreateEvent: { title: `Created ${repo}`, icon: "✨", desc: `New ${event.payload?.ref_type || "repo"} created` },
                            IssuesEvent: { title: `Issue on ${repo}`, icon: "🎯", desc: event.payload?.action || "updated" },
                            PullRequestEvent: { title: `PR on ${repo}`, icon: "🔀", desc: event.payload?.action || "updated" },
                            WatchEvent: { title: `Starred ${repo}`, icon: "⭐", desc: "Added to favorites" },
                            ForkEvent: { title: `Forked ${repo}`, icon: "🍴", desc: "Created a fork" },
                        }
                        const info = typeMap[event.type] || { title: event.type, icon: "📌", desc: "" }
                        all.push({
                            id: `gh-${event.id}`,
                            platform: "github",
                            title: info.title,
                            subtitle: new Date(event.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                            description: info.desc,
                            url: `https://github.com/${event.repo?.name || ""}`,
                            icon: info.icon,
                            color: "from-purple-500/20 to-blue-500/20 border-purple-500/20",
                        })
                    })
                }
            } catch {}

            setActivities(all)
        }

        fetchAll()
    }, [])

    useEffect(() => {
        if (activities.length <= 1) return
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % activities.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [activities.length])

    if (activities.length === 0) return null

    return (
        <>
            <div className="mt-6">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recent Activity</h4>
                <div className="relative h-[300px] overflow-hidden rounded-2xl">
                    {activities.map((activity, i) => (
                        <motion.div
                            key={activity.id}
                            className="absolute inset-0"
                            animate={{
                                y: `${(i - active) * 100}%`,
                                opacity: Math.abs(i - active) === 0 ? 1 : 0.15,
                                filter: Math.abs(i - active) === 0 ? "blur(0px)" : "blur(4px)",
                                scale: Math.abs(i - active) === 0 ? 1 : 0.92,
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <div
                                onClick={() => setExpanded(activity)}
                                className={`bg-gradient-to-br ${activity.color} backdrop-blur-sm rounded-2xl overflow-hidden border hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full flex flex-col p-5`}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="text-2xl">{activity.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                                            {activity.title}
                                        </h3>
                                        <p className="text-[10px] text-zinc-400 mt-1">{activity.subtitle}</p>
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${
                                        activity.platform === "leetcode"
                                            ? "bg-orange-500/20 text-orange-300"
                                            : "bg-purple-500/20 text-purple-300"
                                    }`}>
                                        {activity.platform === "leetcode" ? "LC" : "GH"}
                                    </span>
                                </div>

                                {activity.description && (
                                    <p className="text-xs text-zinc-300/80 leading-relaxed line-clamp-4 mt-auto">
                                        {activity.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {activities.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    i === active ? "bg-white w-4" : "bg-white/30"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setExpanded(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <span className="text-4xl mb-4 block">{expanded.icon}</span>
                                <h2 className="text-lg font-bold text-white mb-2">{expanded.title}</h2>
                                <p className="text-sm text-zinc-400 mb-2">{expanded.subtitle}</p>
                                {expanded.description && (
                                    <p className="text-xs text-zinc-300/70 mb-6 leading-relaxed">{expanded.description}</p>
                                )}
                                <div className="flex gap-3">
                                    <a
                                        href={expanded.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors"
                                    >
                                        View {expanded.platform === "leetcode" ? "Problem" : "Repo"}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <button
                                        onClick={() => setExpanded(null)}
                                        className="px-4 py-2.5 bg-white/5 text-zinc-400 rounded-xl text-sm hover:bg-white/10 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}