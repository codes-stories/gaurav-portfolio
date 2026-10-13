"use client"

import { useEffect, useRef } from "react"
import { Github, ExternalLink, X, ArrowUpRight, Layers, User, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Project } from "../app/projects/page"

interface ProjectPreviewProps {
    isOpen: boolean
    project: Project | null
    onClose: () => void
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
    isOpen,
    project,
    onClose,
}) => {
    const scrollPosRef = useRef(0)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) {
            scrollPosRef.current = window.scrollY
            document.body.style.overflow = "hidden"
            document.body.style.position = "fixed"
            document.body.style.top = `-${scrollPosRef.current}px`
            document.body.style.width = "100%"
            document.addEventListener("keydown", handleKeyDown)
        }
        return () => {
            document.body.style.overflow = ""
            document.body.style.position = ""
            document.body.style.top = ""
            document.body.style.width = ""
            window.scrollTo(0, scrollPosRef.current)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                    style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-white/[0.06] shadow-[0_0_80px_rgba(0,0,0,0.5)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Hero Image */}
                        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
                            <img
                                src={typeof project.image === "string" ? project.image : project.image.src}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/30 to-transparent" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 border border-white/10 transition-all duration-200 group"
                                aria-label="Close project preview"
                            >
                                <X size={16} className="text-white/70 group-hover:text-white transition-colors" />
                            </button>

                            {/* Status badge */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    {project.status}
                                </span>
                            </div>

                            {/* Title overlay on image */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.4 }}
                                    className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1"
                                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                                >
                                    {project.title}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="text-sm md:text-base text-white/50 font-light"
                                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                                >
                                    {project.tagline}
                                </motion.p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Meta row */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.4 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <User size={14} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Role</p>
                                        <p className="text-sm text-zinc-200 font-medium">{project.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <Layers size={14} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Stack</p>
                                        <p className="text-sm text-zinc-200 font-medium">{project.tech.length} technologies</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                            >
                                <p className="text-zinc-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                                    {project.longDescription}
                                </p>
                            </motion.div>

                            {/* Tech Stack */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                            >
                                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-3">Technology Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.35 + i * 0.03, duration: 0.3 }}
                                            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300 font-medium hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 cursor-default"
                                        >
                                            {tech}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Features */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                            >
                                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-3">Key Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {project.features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.04, duration: 0.3 }}
                                            className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors"
                                        >
                                            <Zap size={12} className="text-amber-400 mt-0.5 shrink-0" />
                                            <span className="text-sm text-zinc-400 leading-snug">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                                className="flex gap-3 pt-6 border-t border-white/[0.06]"
                            >
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 bg-white/[0.06] hover:bg-white/[0.12] rounded-xl text-sm text-white font-medium transition-all duration-200 border border-white/[0.06] hover:border-white/[0.12]"
                                >
                                    <Github size={16} />
                                    Source Code
                                    <ArrowUpRight size={14} className="text-zinc-500" />
                                </a>
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-medium transition-all duration-200"
                                >
                                    <ExternalLink size={16} />
                                    Live Demo
                                    <ArrowUpRight size={14} className="text-zinc-500" />
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export { ProjectPreview }