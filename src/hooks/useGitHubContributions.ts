"use client"

import { useState, useEffect } from "react"

interface ContributionDay {
    date: string
    count: number
    level: number
}

interface GitHubContributions {
    total: number
    contributions: ContributionDay[]
}

export function useGitHubContributions(username: string) {
    const [data, setData] = useState<GitHubContributions | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        async function fetch() {
            try {
                const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
                const json = await res.json()
                if (!cancelled) {
                    const total = Object.values(json.total as Record<string, number>).reduce((a, b) => a + b, 0)
                    setData({ total, contributions: json.contributions })
                }
            } catch { if (!cancelled) setData(null) }
            finally { if (!cancelled) setLoading(false) }
        }
        fetch()
        return () => { cancelled = true }
    }, [username])

    return { data, loading }
}
