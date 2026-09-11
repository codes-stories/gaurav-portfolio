"use client"

interface HeatmapProps {
    contributions: { date: string; count: number; level?: number }[]
    total: number
    label: string
    color?: string
}

const LEVELS = [
    "bg-zinc-800/50",
    "bg-green-900/80",
    "bg-green-700/80",
    "bg-green-500/80",
    "bg-green-400/80",
]

function getLevel(count: number): number {
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    if (count <= 8) return 3
    return 4
}

export default function Heatmap({ contributions, total, label, color = "green" }: HeatmapProps) {
    const days = [...contributions].reverse().slice(0, 365)

    const weeks: { date: string; count: number; level: number }[][] = []
    let currentWeek: { date: string; count: number; level: number }[] = []

    if (days.length > 0) {
        const firstDate = new Date(days[0].date)
        const dayOfWeek = firstDate.getDay()
        for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push({ date: "", count: 0, level: 0 })
        }
    }

    days.forEach((day) => {
        const level = day.level ?? getLevel(day.count)
        currentWeek.push({ ...day, level })
        if (currentWeek.length === 7) {
            weeks.push(currentWeek)
            currentWeek = []
        }
    })
    if (currentWeek.length > 0) weeks.push(currentWeek)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{total} contributions in the last year</span>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <span>Less</span>
                    {LEVELS.map((cls, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="inline-flex gap-[3px]">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[3px]">
                            {week.map((day, di) => (
                                <div
                                    key={di}
                                    title={day.date ? `${day.count} contributions on ${day.date}` : ""}
                                    className={`w-3 h-3 rounded-sm ${LEVELS[day.level]} ${day.date ? "hover:ring-1 hover:ring-white/30 cursor-pointer" : ""} transition-all`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
