import { NextResponse } from "next/server"

export const revalidate = 1800

export async function GET() {
    try {
        const res = await fetch("https://api.github.com/users/codes-stories", {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "gaurav-portfolio",
            },
            next: { revalidate: 1800 },
        })

        if (!res.ok) {
            return NextResponse.json({
                login: "codes-stories",
                public_repos: 0,
                followers: 0,
                following: 0,
                html_url: "https://github.com/codes-stories",
            })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({
            login: "codes-stories",
            public_repos: 0,
            followers: 0,
            following: 0,
            html_url: "https://github.com/codes-stories",
        })
    }
}