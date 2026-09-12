import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username } = body

        const query = `
            query userSubmissionCalendar($username: String!) {
                matchedUser(username: $username) {
                    submissionCalendar
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
        return NextResponse.json({ error: "Failed to fetch LeetCode calendar" }, { status: 500 })
    }
}