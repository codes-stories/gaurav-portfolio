"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Repo {
    name: string
    description: string
    language: string
    stargazers_count: number
    forks_count: number
    html_url: string
    topics: string[]
    updated_at: string
}

export default function GitHubPinnedRepos() {
    const [repos, setRepos] = useState<Repo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/github/repos")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setRepos(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const langColors: Record<string, string> = {
        JavaScript: "bg-yellow-400",
        TypeScript: "bg-blue-500",
        Python: "bg-green-500",
        Java: "bg-red-500",
        HTML: "bg-orange-500",
        CSS: "bg-purple-500",
        Shell: "bg-gray-400",
        "Jupyter Notebook": "bg-orange-300",
    }

    return (
        <section className="relative bg-black text-white py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                        Pinned Repos
                    </h2>
                    <p className="text-zinc-400 text-lg">Open source projects & experiments</p>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-6" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading
                        ? Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-zinc-900/50 rounded-2xl p-6 border border-white/5 animate-pulse">
                                <div className="h-4 bg-zinc-800 rounded w-1/2 mb-3" />
                                <div className="h-3 bg-zinc-800 rounded w-3/4 mb-4" />
                                <div className="flex gap-2">
                                    <div className="h-5 bg-zinc-800 rounded w-16" />
                                    <div className="h-5 bg-zinc-800 rounded w-12" />
                                </div>
                            </div>
                        ))
                        : repos.map((repo, index) => (
                            <motion.a
                                key={repo.name}
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 hover:scale-[1.02]"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl group-hover:from-blue-500/10 transition-all duration-500" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                            {repo.name}
                                        </h3>
                                        <svg className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>

                                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2 min-h-[40px]">
                                        {repo.description || "No description provided"}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                        {repo.language && (
                                            <span className="flex items-center gap-1.5">
                                                <span className={`w-2.5 h-2.5 rounded-full ${langColors[repo.language] || "bg-gray-400"}`} />
                                                {repo.language}
                                            </span>
                                        )}
                                        {repo.stargazers_count > 0 && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {repo.stargazers_count}
                                            </span>
                                        )}
                                        {repo.forks_count > 0 && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                                {repo.forks_count}
                                            </span>
                                        )}
                                    </div>

                                    {repo.topics && repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {repo.topics.slice(0, 3).map((topic) => (
                                                <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.a>
                        ))}
                </div>

                <div className="text-center mt-10">
                    <a
                        href="https://github.com/codes-stories?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        View all repositories
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}