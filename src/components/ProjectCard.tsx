"use client"

import { useState, useEffect, useRef } from "react"
import { Github, ExternalLink } from "lucide-react"
import { Project } from "../app/projects/page"

interface ProjectCardProps {
    project: Project
    index: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [hasHydrated, setHasHydrated] = useState(false)

    useEffect(() => {
        setHasHydrated(true)
    }, [])

    if (!hasHydrated) return null

    return (
        <div
            ref={cardRef}
            data-card-index={index}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:scale-[1.02] hover:border-gray-500/50 transition-all duration-300 cursor-pointer group"
        >
            <div className="relative overflow-hidden">
                <img
                    src={typeof project.image === "string" ? project.image : project.image.src}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold mb-1 text-white">
                    {project.title}
                </h3>
                <p className="text-blue-400/70 text-xs font-medium mb-2">
                    {project.tagline}
                </p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 4).map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-0.5 bg-blue-500/10 text-blue-300/80 rounded text-xs">
                            {tech}
                        </span>
                    ))}
                    {project.tech.length > 4 && (
                        <span className="px-2 py-0.5 text-zinc-500 text-xs">
                            +{project.tech.length - 4}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-gray-700/50">
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Github size={14} />
                        Code
                    </a>
                    <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={14} />
                        Live
                    </a>
                </div>
            </div>
        </div>
    )
}

export { ProjectCard }