"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const skills = [
    { name: "React", level: 90, category: "frontend", color: "bg-blue-500" },
    { name: "Next.js", level: 85, category: "frontend", color: "bg-zinc-400" },
    { name: "TypeScript", level: 80, category: "frontend", color: "bg-blue-600" },
    { name: "Node.js", level: 85, category: "backend", color: "bg-green-500" },
    { name: "Express", level: 80, category: "backend", color: "bg-gray-400" },
    { name: "MongoDB", level: 75, category: "backend", color: "bg-green-600" },
    { name: "PostgreSQL", level: 70, category: "backend", color: "bg-indigo-500" },
    { name: "Redis", level: 65, category: "backend", color: "bg-red-500" },
    { name: "Docker", level: 70, category: "devops", color: "bg-blue-400" },
    { name: "AWS", level: 60, category: "devops", color: "bg-orange-400" },
    { name: "Git", level: 90, category: "tools", color: "bg-orange-500" },
    { name: "Tailwind", level: 85, category: "tools", color: "bg-teal-400" },
    { name: "GraphQL", level: 65, category: "backend", color: "bg-pink-500" },
    { name: "Python", level: 60, category: "languages", color: "bg-yellow-400" },
    { name: "Java", level: 55, category: "languages", color: "bg-red-600" },
]

const categoryColors: Record<string, { ring: string; fill: string; text: string }> = {
    frontend: { ring: "stroke-blue-500", fill: "fill-blue-500/20", text: "text-blue-400" },
    backend: { ring: "stroke-emerald-500", fill: "fill-emerald-500/20", text: "text-emerald-400" },
    devops: { ring: "stroke-orange-500", fill: "fill-orange-500/20", text: "text-orange-400" },
    tools: { ring: "stroke-purple-500", fill: "fill-purple-500/20", text: "text-purple-400" },
    languages: { ring: "stroke-cyan-500", fill: "fill-cyan-500/20", text: "text-cyan-400" },
}

function getCoord(index: number, total: number, radius: number) {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
}

export default function TechRadar() {
    const [mounted, setMounted] = useState(false)
    const size = 400
    const center = size / 2
    const radius = 150
    const total = skills.length

    useEffect(() => { setMounted(true) }, [])

    return (
        <section className="relative bg-black text-white py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                        Tech Radar
                    </h2>
                    <p className="text-zinc-400 text-lg">Skill proficiency across technologies</p>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-6" />
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Radar Chart */}
                    <div className="flex-1 flex justify-center">
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
                            {/* Grid rings */}
                            {[0.25, 0.5, 0.75, 1].map((scale) => (
                                <circle
                                    key={scale}
                                    cx={center}
                                    cy={center}
                                    r={radius * scale}
                                    fill="none"
                                    stroke="white"
                                    strokeOpacity={0.05 + scale * 0.05}
                                    strokeWidth={1}
                                />
                            ))}

                            {/* Grid lines */}
                            {skills.map((_, i) => {
                                const coord = getCoord(i, total, radius)
                                return (
                                    <line
                                        key={i}
                                        x1={center}
                                        y1={center}
                                        x2={center + coord.x}
                                        y2={center + coord.y}
                                        stroke="white"
                                        strokeOpacity={0.05}
                                        strokeWidth={1}
                                    />
                                )
                            })}

                            {/* Skill polygon */}
                            {mounted && (
                                <motion.polygon
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    points={skills
                                        .map((skill, i) => {
                                            const coord = getCoord(i, total, radius * (skill.level / 100))
                                            return `${center + coord.x},${center + coord.y}`
                                        })
                                        .join(" ")}
                                    className="fill-blue-500/10 stroke-blue-500/40"
                                    strokeWidth={2}
                                />
                            )}

                            {/* Skill points and labels */}
                            {skills.map((skill, i) => {
                                const coord = getCoord(i, total, radius)
                                const skillCoord = getCoord(i, total, radius * (skill.level / 100))
                                const colors = categoryColors[skill.category]

                                return (
                                    <g key={skill.name}>
                                        {/* Point */}
                                        {mounted && (
                                            <motion.circle
                                                initial={{ opacity: 0, r: 0 }}
                                                animate={{ opacity: 1, r: 5 }}
                                                transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                                                cx={center + skillCoord.x}
                                                cy={center + skillCoord.y}
                                                className={`${skill.color}`}
                                                fill="currentColor"
                                                stroke="white"
                                                strokeWidth={1}
                                                strokeOpacity={0.3}
                                            />
                                        )}

                                        {/* Label */}
                                        {mounted && (
                                            <motion.text
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 0.8 + i * 0.03 }}
                                                x={center + coord.x * 1.15}
                                                y={center + coord.y * 1.15}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className={`text-[10px] fill-zinc-400 font-medium`}
                                            >
                                                {skill.name}
                                            </motion.text>
                                        )}
                                    </g>
                                )
                            })}
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 max-w-md">
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(categoryColors).map(([category, colors]) => (
                                <div key={category} className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.ring.replace("stroke-", "from-")}`} />
                                        <span className={`text-sm font-medium capitalize ${colors.text}`}>{category}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {skills
                                            .filter((s) => s.category === category)
                                            .map((skill) => (
                                                <div key={skill.name}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-zinc-400">{skill.name}</span>
                                                        <span className="text-zinc-500">{skill.level}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${skill.level}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className={`h-full rounded-full ${skill.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}