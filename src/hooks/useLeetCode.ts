"use client"

import { useState, useEffect } from "react"

export function useLeetCode(username: string) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        async function fetch() {
            try {
                const query = `
                    query getUserProfile($username: String!) {
                        matchedUser(username: $username) {
                            submitStatsGlobal {
                                acSubmissionNum {
                                    difficulty
                                    count
                                    submissions
                                }
                            }
                            profile {
                                ranking
                                reputation
                                contributionPoint
                                userAvatar
                            }
                        }
                    }
                `
                const res = await fetch("https://leetcode.com/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, variables: { username } }),
                })
                const json = await res.json()
                if (!cancelled) {
                    const user = json?.data?.matchedUser
                    if (user) {
                        const stats = user.submitStatsGlobal?.acSubmissionNum || []
                        const get = (d: string) => stats.find((s: any) => s.difficulty === d)?.count || 0
                        setData({
                            totalSolved: get("All"),
                            easySolved: get("Easy"),
                            mediumSolved: get("Medium"),
                            hardSolved: get("Hard"),
                            totalEasy: 963,
                            totalMedium: 2111,
                            totalHard: 973,
                            ranking: user.profile?.ranking || 0,
                            reputation: user.profile?.reputation || 0,
                            contributionPoint: user.profile?.contributionPoint || 0,
                        })
                    }
                }
            } catch {}
            finally { if (!cancelled) setLoading(false) }
        }
        fetch()
        return () => { cancelled = true }
    }, [username])

    return { data, loading }
}
