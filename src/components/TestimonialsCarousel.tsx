"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
    {
        name: "Rahul Sharma",
        role: "Senior Software Engineer at Flipkart",
        text: "Gaurav's system design thinking is impressive for his experience level. His QR-based attendance system showed real architectural maturity.",
        avatar: "RS",
        color: "from-blue-500 to-cyan-500",
    },
    {
        name: "Priya Patel",
        role: "Tech Lead at Razorpay",
        text: "Worked with Gaurav on a collaborative project. His code quality, documentation, and ability to debug complex issues stood out immediately.",
        avatar: "PP",
        color: "from-purple-500 to-pink-500",
    },
    {
        name: "Amit Kumar",
        role: "Full Stack Developer at Meesho",
        text: "Gaurav doesn't just write code — he thinks about scalability, edge cases, and user experience. Rare for someone at his level.",
        avatar: "AK",
        color: "from-orange-500 to-red-500",
    },
    {
        name: "Sneha Gupta",
        role: "Product Manager at Swiggy",
        text: "His real-time chat application was production-grade. WebSocket handling, message queuing, and the UI was clean and intuitive.",
        avatar: "SG",
        color: "from-green-500 to-emerald-500",
    },
    {
        name: "Vikram Singh",
        role: "DevOps Engineer at Amazon",
        text: "Impressed by Gaurav's understanding of CI/CD pipelines and containerization. He automated deployment workflows that saved the team hours.",
        avatar: "VS",
        color: "from-yellow-500 to-orange-500",
    },
]

export default function TestimonialsCarousel() {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(0)

    const next = useCallback(() => {
        setDirection(1)
        setCurrent((prev) => (prev + 1) % testimonials.length)
    }, [])

    const prev = useCallback(() => {
        setDirection(-1)
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }, [])

    useEffect(() => {
        const timer = setInterval(next, 6000)
        return () => clearInterval(timer)
    }, [next])

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
    }

    const t = testimonials[current]

    return (
        <section className="relative bg-black text-white py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                        Testimonials
                    </h2>
                    <p className="text-zinc-400 text-lg">What colleagues say about working with me</p>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-6" />
                </div>

                <div className="relative min-h-[320px]">
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center mx-auto mb-6`}>
                                    <span className="text-xl font-bold text-white">{t.avatar}</span>
                                </div>

                                <blockquote className="text-lg md:text-xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
                                    &ldquo;{t.text}&rdquo;
                                </blockquote>

                                <div>
                                    <div className="font-semibold text-white">{t.name}</div>
                                    <div className="text-sm text-zinc-500">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={prev}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    i === current ? "bg-white w-6" : "bg-white/20 hover:bg-white/40"
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}