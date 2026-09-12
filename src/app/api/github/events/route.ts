import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const res = await fetch("https://api.github.com/users/codes-stories/events/public?per_page=10", {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "gaurav-portfolio",
            },
            next: { revalidate: 300 },
        })

        if (!res.ok) {
            return NextResponse.json([])
        }

        const data = await res.json()
        return NextResponse.json(Array.isArray(data) ? data : [])
    } catch {
        return NextResponse.json([])
    }
}