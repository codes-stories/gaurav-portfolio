"use client"

import { Code, Link2, Github, Cpu, Globe } from "lucide-react"
import { useGitHub } from "../hooks/useGitHub"
import { useLeetCode } from "../hooks/useLeetCode"

export default function CardHelper() {
    const github = useGitHub("codes-stories")
    const leetcode = useLeetCode("Gaurav_krrr")

    const codingPlatforms = [
        {
            name: "GitHub",
            solved: github.profile?.public_repos ?? 0,
            total: 5000,
            rating: github.profile?.followers ?? 0,
            ratingLabel: "Followers",
            color: "bg-blue-500",
            url: "https://github.com/codes-stories",
            loading: github.loading,
            recentRepos: github.recentRepos,
        },
        {
            name: "LeetCode",
            solved: leetcode.profile?.totalSolved ?? 0,
            total: leetcode.profile?.totalQuestions ?? 3000,
            rating: leetcode.profile?.ranking ?? 0,
            ratingLabel: "Rank",
            color: "bg-yellow-500",
            url: "https://leetcode.com/u/Gaurav_krrr/",
            loading: leetcode.loading,
            easy: leetcode.profile?.easySolved ?? 0,
            medium: leetcode.profile?.mediumSolved ?? 0,
            hard: leetcode.profile?.hardSolved ?? 0,
        },
        {
            name: "Codeforces",
            solved: 5,
            total: 3000,
            rating: 0,
            ratingLabel: "Rating",
            color: "bg-blue-500",
            url: "https://codeforces.com/profile/gaurav_krrr",
            loading: false,
        },
        {
            name: "GeeksForGeeks",
            solved: 180,
            total: 2000,
            rating: 0,
            ratingLabel: "Rating",
            color: "bg-orange-500",
            url: "https://www.geeksforgeeks.org/profile/gauravkrrr?tab=activity",
            loading: false,
        },
    ]

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Coding Platforms
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {codingPlatforms.map((platform, index) => (
                        <a
                            key={index}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center shrink-0`}>
                                    {platform.name === "GitHub" && <Github size={22} className="text-white" />}
                                    {platform.name === "LeetCode" && <Code size={22} className="text-white" />}
                                    {platform.name === "Codeforces" && <Cpu size={22} className="text-white" />}
                                    {platform.name === "GeeksForGeeks" && <Globe size={22} className="text-white" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                                    <p className="text-xs text-gray-400">{platform.url.replace("https://", "")}</p>
                                </div>
                            </div>

                            {platform.loading ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-3 bg-gray-700 rounded w-full" />
                                    <div className="h-3 bg-gray-700 rounded w-3/4" />
                                    <div className="h-2 bg-gray-700 rounded-full w-full" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Solved:</span>
                                        <span className="text-green-400 font-medium">{platform.solved}</span>
                                    </div>

                                    {platform.name === "LeetCode" && platform.easy !== undefined && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-400">Easy: {platform.easy}</span>
                                            <span className="text-yellow-400">Medium: {platform.medium}</span>
                                            <span className="text-red-400">Hard: {platform.hard}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-300">{platform.ratingLabel}:</span>
                                        <span className="text-blue-400 font-medium">
                                            {platform.rating > 0 ? (platform.name === "LeetCode" ? `#${platform.rating.toLocaleString()}` : platform.rating) : "N/A"}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`${platform.color} h-2 rounded-full transition-all duration-1000`}
                                            style={{ width: `${Math.min((platform.solved / platform.total) * 100, 100)}%` }}
                                        />
                                    </div>

                                    {/* GitHub recent repos */}
                                    {platform.name === "GitHub" && github.recentRepos.length > 0 && (
                                        <div className="pt-2 border-t border-gray-700/50">
                                            <p className="text-xs text-gray-500 mb-2">Recent repos</p>
                                            <div className="space-y-1">
                                                {github.recentRepos.slice(0, 3).map((repo, i) => (
                                                    <div key={i} className="flex justify-between text-xs">
                                                        <span className="text-gray-300 truncate">{repo.name}</span>
                                                        <span className="text-gray-500 shrink-0 ml-2">{repo.language}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-4 flex justify-center">
                                <Link2 size={20} className="text-green-500 group-hover:text-green-400 transition-colors" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}