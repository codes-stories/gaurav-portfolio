"use client"

import { useState, useEffect } from "react"

export function useLeetCode(username: string) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function fetchData() {
            try {
                const res = await fetch("/api/leetcode", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username }),
                })

                const json = await res.json()

                if (json.errors) {
                    if (!cancelled) setError(json.errors[0]?.message || "GraphQL error")
                    return
                }

                const user = json?.data?.matchedUser
                if (!user) {
                    if (!cancelled) setError("No user found")
                    return
                }

                const stats = user.submitStatsGlobal?.acSubmissionNum || []
                const find = (d: string) => stats.find((s: any) => s.difficulty === d)

                const result = {
                    totalSolved: find("All")?.count || 0,
                    easySolved: find("Easy")?.count || 0,
                    mediumSolved: find("Medium")?.count || 0,
                    hardSolved: find("Hard")?.count || 0,
                    totalEasy: 963,
                    totalMedium: 2111,
                    totalHard: 973,
                    ranking: user.profile?.ranking || 0,
                    reputation: user.profile?.reputation || 0,
                    contributionPoint: user.contributions?.points || 0,
                }

                if (!cancelled) setData(result)
            } catch (err: any) {
                if (!cancelled) setError(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchData()
        return () => { cancelled = true }
    }, [username])

    return { data, loading, error }
}