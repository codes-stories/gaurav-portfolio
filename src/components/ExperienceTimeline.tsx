"use client"

import { motion } from "framer-motion"

const timeline = [
    {
        type: "experience",
        title: "Software Development Engineer Intern",
        org: "Tech Startup",
        date: "2024 - Present",
        description: "Building scalable microservices, REST APIs, and real-time systems using Node.js, React, and MongoDB. Led migration from monolith to microservices architecture.",
        tags: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
        icon: "💼",
    },
    {
        type: "education",
        title: "B.Tech Computer Science",
        org: "University",
        date: "2021 - 2025",
        description: "CGPA: 8.5+ | Coursework: Data Structures, Algorithms, OS, DBMS, System Design, Computer Networks",
        tags: ["DSA", "System Design", "OOPs", "DBMS"],
        icon: "🎓",
    },
    {
        type: "certification",
        title: "AWS Certified Cloud Practitioner",
        org: "Amazon Web Services",
        date: "2024",
        description: "Foundational understanding of AWS Cloud services, security, architecture, pricing, and support.",
        tags: ["AWS", "Cloud", "Infrastructure"],
        icon: "📜",
    },
    {
        type: "experience",
        title: "Open Source Contributor",
        org: "GitHub Community",
        date: "2023 - Present",
        description: "Contributed to 10+ open source projects. Active in MERN stack and DevOps communities. 80+ repositories with 25+ followers.",
        tags: ["Open Source", "Git", "CI/CD", "Community"],
        icon: "🌐",
    },
    {
        type: "certification",
        title: "Meta Front-End Developer",
        org: "Meta (Coursera)",
        date: "2023",
        description: "Professional certificate covering React, Figma, version control, and testing with 95% completion rate.",
        tags: ["React", "Figma", "Testing", "UI/UX"],
        icon: "📜",
    },
]

const typeColors: Record<string, string> = {
    experience: "from-blue-500 to-cyan-500",
    education: "from-purple-500 to-pink-500",
    certification: "from-green-500 to-emerald-500",
}

const typeBg: Record<string, string> = {
    experience: "bg-blue-500/10 border-blue-500/20",
    education: "bg-purple-500/10 border-purple-500/20",
    certification: "bg-green-500/10 border-green-500/20",
}

export default function ExperienceTimeline() {
    return (
        <section className="relative bg-black text-white py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                        Experience
                    </h2>
                    <p className="text-zinc-400 text-lg">My journey as a developer</p>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-6" />
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                    {timeline.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative flex items-start mb-12 ${
                                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                            }`}
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${typeColors[item.type]} border-2 border-black z-10">
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${typeColors[item.type]} animate-ping opacity-20`} />
                            </div>

                            {/* Content */}
                            <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                                <div className={`bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 group`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeBg[item.type]}`}>
                                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-zinc-500 ml-auto">{item.date}</span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-zinc-400 mb-3">{item.org}</p>
                                    <p className="text-sm text-zinc-300 leading-relaxed mb-4">{item.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-zinc-400 border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}