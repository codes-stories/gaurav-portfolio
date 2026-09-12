"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink } from "lucide-react"

interface Blog {
    _id: string
    title: string
    slug: string
    coverImage?: string
    tags?: string[]
    createdAt: string
}

export default function BlogMarquee() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [active, setActive] = useState(0)
    const [expanded, setExpanded] = useState<Blog | null>(null)

    useEffect(() => {
        fetch("/api/blogs")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.blogs || data.data || []
                setBlogs(list.filter((b: Blog) => b.createdAt).slice(0, 4))
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (blogs.length <= 1) return
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % blogs.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [blogs.length])

    if (blogs.length === 0) return null

    return (
        <>
            <div className="mt-6">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Latest Blogs</h4>
                <div className="relative h-[200px] overflow-hidden rounded-2xl">
                    {blogs.map((blog, i) => (
                        <motion.div
                            key={blog._id}
                            className="absolute inset-0"
                            animate={{
                                y: `${(i - active) * 100}%`,
                                opacity: Math.abs(i - active) === 0 ? 1 : 0.15,
                                filter: Math.abs(i - active) === 0 ? "blur(0px)" : "blur(4px)",
                                scale: Math.abs(i - active) === 0 ? 1 : 0.92,
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <div
                                onClick={() => setExpanded(blog)}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-500/50 transition-all duration-300 cursor-pointer group h-full flex flex-col"
                            >
                                {blog.coverImage && (
                                    <div className="relative h-24 overflow-hidden">
                                        <img
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                                    </div>
                                )}
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-[10px] text-zinc-500 mt-1">
                                            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {blog.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300/70 rounded text-[9px]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {blogs.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    i === active ? "bg-white w-4" : "bg-white/30"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setExpanded(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {expanded.coverImage && (
                                <img
                                    src={expanded.coverImage}
                                    alt={expanded.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-white mb-2">{expanded.title}</h2>
                                <p className="text-xs text-zinc-500 mb-4">
                                    {new Date(expanded.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                                {expanded.tags && expanded.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {expanded.tags.map((tag) => (
                                            <span key={tag} className="px-2 py-0.5 bg-blue-500/10 text-blue-300/80 rounded text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <a
                                        href={`/blog/${expanded.slug}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors"
                                    >
                                        Read Full Blog
                                        <ExternalLink size={14} />
                                    </a>
                                    <button
                                        onClick={() => setExpanded(null)}
                                        className="px-4 py-2.5 bg-white/5 text-zinc-400 rounded-xl text-sm hover:bg-white/10 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}