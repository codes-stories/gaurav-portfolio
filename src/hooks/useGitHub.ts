"use client"

import { useState, useEffect } from "react"

interface GitHubProfile {
    login: string
    name: string
    public_repos: number
    followers: number
    following: number
    avatar_url: string
    bio: string
}

interface GitHubData {
    profile: GitHubProfile | null
    recentRepos: { name: string; language: string; stars: number; updated_at: string }[]
    loading: boolean
    error: string | null
}

export function useGitHub(username: string): GitHubData {
    const [profile, setProfile] = useState<GitHubProfile | null>(null)
    const [recentRepos, setRecentRepos] = useState<{ name: string; language: string; stars: number; updated_at: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function fetchGitHub() {
            try {
                setLoading(true)
                setError(null)

                const [profileRes, reposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${username}`),
                    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
                ])

                if (!profileRes.ok) throw new Error("Failed to fetch GitHub profile")

                const profileData = await profileRes.json()
                const reposData = reposRes.ok ? await reposRes.json() : []

                if (!cancelled) {
                    setProfile(profileData)
                    setRecentRepos(
                        reposData.map((repo: any) => ({
                            name: repo.name,
                            language: repo.language || "N/A",
                            stars: repo.stargazers_count,
                            updated_at: repo.updated_at,
                        }))
                    )
                }
            } catch (err: any) {
                if (!cancelled) setError(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchGitHub()
        return () => { cancelled = true }
    }, [username])

    return { profile, recentRepos, loading, error }
}
