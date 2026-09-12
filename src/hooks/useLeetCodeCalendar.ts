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
            try {
                const res = await fetch("/api/leetcode/calendar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username }),
                })
                const json = await res.json()
                const calStr = json?.data?.matchedUser?.submissionCalendar
                if (calStr) {
                    const cal = typeof calStr === "string" ? JSON.parse(calStr) : calStr
                    const days: LeetCodeDay[] = Object.entries(cal).map(([ts, count]) => ({
                        date: new Date(Number(ts) * 1000).toISOString().split("T")[0],
                        count: count as number,
                    }))
                    days.sort((a, b) => a.date.localeCompare(b.date))
                    if (!cancelled) {
                        setData(days)
                        setTotal(days.reduce((sum, d) => sum + d.count, 0))
                    }
                }
            } catch {}
            if (!cancelled) setLoading(false)
        }

        fetchCalendar()
        return () => { cancelled = true }
    }, [username])

    return { data, total, loading }
}