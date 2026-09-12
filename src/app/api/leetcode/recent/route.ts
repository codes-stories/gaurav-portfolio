import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username } = body

        const query = `
            query recentSubmissions($username: String!) {
                recentAcSubmissionList(username: $username, limit: 5) {
                    title
                    titleSlug
                    timestamp
                }
            }
        `

        const res = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
                "Origin": "https://leetcode.com",
            },
            body: JSON.stringify({ query, variables: { username } }),
        })

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch recent submissions" }, { status: 500 })
    }
}