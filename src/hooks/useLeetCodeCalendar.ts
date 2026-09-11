"use client"

import { useState, useEffect } from "react"

interface LeetCodeDay {
    date: string
    count: number
}

export function useLeetCodeCalendar(username: string) {
    const [data, setData] = useState<LeetCodeDay[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function fetchCalendar() {
            // Try the third-party API first
            try {
                const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`)
                if (res.ok) {
                    const json = await res.json()
                    const cal = json.submissionCalendar || {}
                    const days: LeetCodeDay[] = Object.entries(cal).map(([ts, count]) => ({
                        date: new Date(Number(ts) * 1000).toISOString().split("T")[0],
                        count: count as number,
                    }))
                    days.sort((a, b) => a.date.localeCompare(b.date))
                    if (!cancelled) {
                        setData(days)
                        setTotal(days.reduce((sum, d) => sum + d.count, 0))
                    }
                    return
                }
            } catch {}

            // Fallback: use LeetCode GraphQL for recent submissions
            try {
                const query = `
                    query recentAcSubmissions($username: String!) {
                        recentACSubmissions(username: $username) {
                            title
                            timestamp
                        }
                    }
                `
                const res = await fetch("https://leetcode.com/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, variables: { username } }),
                })
                const json = await res.json()
                const subs = json?.data?.recentACSubmissions || []
                const dayMap: Record<string, number> = {}
                subs.forEach((sub: any) => {
                    const date = new Date(Number(sub.timestamp) * 1000).toISOString().split("T")[0]
                    dayMap[date] = (dayMap[date] || 0) + 1
                })
                const days: LeetCodeDay[] = Object.entries(dayMap).map(([date, count]) => ({ date, count }))
                days.sort((a, b) => a.date.localeCompare(b.date))
                if (!cancelled) {
                    setData(days)
                    setTotal(days.reduce((sum, d) => sum + d.count, 0))
                }
            } catch {}

            if (!cancelled) setLoading(false)
        }

        fetchCalendar()
        return () => { cancelled = true }
    }, [username])

    return { data, total, loading }
}
