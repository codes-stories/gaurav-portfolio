"use client"

import { useState, useEffect } from "react"
import BlogEditor from "./Editor"
import Heatmap from "./Heatmap"
import { useGitHubContributions } from "../hooks/useGitHubContributions"
import { useLeetCodeCalendar } from "../hooks/useLeetCodeCalendar"
import { useLeetCode } from "../hooks/useLeetCode"

export default function Hero() {
    const [gitHubData, setGitHubData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const leetcode = useLeetCode("Gaurav_krrr")
    const githubContributions = useGitHubContributions("codes-stories")
    const leetcodeCalendar = useLeetCodeCalendar("Gaurav_krrr")

    useEffect(() => {
        fetch("https://api.github.com/users/codes-stories")
            .then((res) => res.json())
            .then((data) => { setGitHubData(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    return (
        <div className="relative isolate overflow-hidden bg-black min-h-screen">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 py-16 relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                        Being a Programmer....
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                        It is literally true that you can succeed best and quickest by helping others to succeed.
                    </p>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GitHub Stats */}
                    <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">GitHub</h4>
                                    <p className="text-xs text-zinc-500">@codes-stories</p>
                                </div>
                            </div>
                            {loading ? (
                                <div className="space-y-4">
                                    <div className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />
                                    <div className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />
                                </div>
                            ) : gitHubData ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                                            <div className="text-2xl font-bold text-white">{gitHubData.public_repos}</div>
                                            <div className="text-xs text-zinc-500 mt-1">Repos</div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                                            <div className="text-2xl font-bold text-white">{gitHubData.followers}</div>
                                            <div className="text-xs text-zinc-500 mt-1">Followers</div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                                            <div className="text-2xl font-bold text-white">{gitHubData.following}</div>
                                            <div className="text-xs text-zinc-500 mt-1">Following</div>
                                        </div>
                                    </div>
                                    <a href={gitHubData.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mt-4">
                                        View Profile
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            ) : <p className="text-sm text-zinc-500">Failed to load</p>}
                            <div className="mt-4 pt-4 border-t border-white/5">
                                {githubContributions.loading ? (
                                    <div className="h-24 bg-zinc-800/50 rounded-xl animate-pulse" />
                                ) : githubContributions.data ? (
                                    <Heatmap contributions={githubContributions.data.contributions} total={githubContributions.data.total} label="GitHub" />
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* LeetCode Stats */}
                    <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 transition-all duration-500" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">LeetCode</h4>
                                    <p className="text-xs text-zinc-500">Problem Solving</p>
                                </div>
                            </div>
                            {leetcode.loading ? (
                                <div className="space-y-4">
                                    <div className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                                        <div className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                                        <div className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                                    </div>
                                </div>
                            ) : leetCodeData ? (
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-4 border border-orange-500/20">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">{leetcode.data.totalSolved}</div>
                                                <div className="text-xs text-zinc-400 mt-1">Total Solved</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-zinc-300">Rank #{leetcode.data.ranking?.toLocaleString()}</div>
                                                <div className="text-xs text-zinc-500">{leetcode.data.contributionPoint} pts</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors">
                                            <div className="text-xl font-bold text-emerald-400">{leetcode.data.easySolved}</div>
                                            <div className="text-xs text-zinc-500 mt-1">Easy</div>
                                            <div className="text-xs text-zinc-600">/{leetcode.data.totalEasy}</div>
                                        </div>
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center hover:bg-amber-500/20 transition-colors">
                                            <div className="text-xl font-bold text-amber-400">{leetcode.data.mediumSolved}</div>
                                            <div className="text-xs text-zinc-500 mt-1">Medium</div>
                                            <div className="text-xs text-zinc-600">/{leetcode.data.totalMedium}</div>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center hover:bg-red-500/20 transition-colors">
                                            <div className="text-xl font-bold text-red-400">{leetcode.data.hardSolved}</div>
                                            <div className="text-xs text-zinc-500 mt-1">Hard</div>
                                            <div className="text-xs text-zinc-600">/{leetcode.data.totalHard}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            {leetcode.data.contributionPoint} points
                                        </span>
                                        <span>Rep: {leetcode.data.reputation}</span>
                                    </div>
                                </div>
                            ) : <p className="text-sm text-zinc-500">Failed to load</p>}
                            <div className="mt-4 pt-4 border-t border-white/5">
                                {leetcodeCalendar.loading ? (
                                    <div className="h-24 bg-zinc-800/50 rounded-xl animate-pulse" />
                                ) : leetcodeCalendar.data.length > 0 ? (
                                    <Heatmap contributions={leetcodeCalendar.data} total={leetcodeCalendar.total} label="LeetCode" />
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Codeforces Stats */}
                    <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-500" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.5 7.5A1.5 1.5 0 016 9v10.5a1.5 1.5 0 01-3 0V9a1.5 1.5 0 011.5-1.5zm5.25-3A1.5 1.5 0 0111.25 6v13.5a1.5 1.5 0 01-3 0V6A1.5 1.5 0 019.75 4.5zm5.25 3A1.5 1.5 0 0116.5 9v10.5a1.5 1.5 0 01-3 0V9a1.5 1.5 0 011.5-1.5zm5.25-3A1.5 1.5 0 0121.75 6v13.5a1.5 1.5 0 01-3 0V6A1.5 1.5 0 0120.25 4.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">Codeforces</h4>
                                    <p className="text-xs text-zinc-500">@gaurav_krrr</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">5</div>
                                            <div className="text-xs text-zinc-400 mt-1">Problems Solved</div>
                                        </div>
                                    </div>
                                </div>
                                <a href="https://codeforces.com/profile/gaurav_krrr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mt-4">
                                    View Profile
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* GeeksForGeeks Stats */}
                    <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:from-green-500/20 transition-all duration-500" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21.411 2.586a1 1 0 00-1.414 0l-13.99 13.99a1 1 0 001.414 1.414l13.99-13.99a1 1 0 000-1.414zM17 6a1 1 0 100-2 1 1 0 000 2zm-4.707 3.293a1 1 0 00-1.414 0l-4 4a1 1 0 101.414 1.414l4-4a1 1 0 000-1.414z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">GeeksForGeeks</h4>
                                    <p className="text-xs text-zinc-500">@gauravkrrr</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">180</div>
                                            <div className="text-xs text-zinc-400 mt-1">Problems Solved</div>
                                        </div>
                                    </div>
                                </div>
                                <a href="https://www.geeksforgeeks.org/profile/gauravkrrr?tab=activity" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mt-4">
                                    View Profile
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <BlogEditor onSave={() => {}}/>
                </div>
            </div>
        </div>
    )
}