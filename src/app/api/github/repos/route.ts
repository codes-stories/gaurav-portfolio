import { NextResponse } from "next/server"

export const revalidate = 1800

export async function GET() {
    try {
        const res = await fetch("https://api.github.com/users/codes-stories/repos?sort=stars&per_page=6&direction=desc", {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "gaurav-portfolio",
            },
            next: { revalidate: 1800 },
        })

        if (!res.ok) return NextResponse.json([])

        const data = await res.json()
        return NextResponse.json(Array.isArray(data) ? data : [])
    } catch {
        return NextResponse.json([])
    }
}