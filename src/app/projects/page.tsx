"use client"

import { useState } from "react"

import chat from "../../Assets/chat-app.png"
import QrScan from "../../Assets/Qr-scan.png"
import ShopEase from "../../Assets/produc-java.png"
import CodeCollab from "../../Assets/collaborative-coding.jpg"
import smvdex from "../../Assets/smvdex-home.png"
import todo from "../../Assets/todo.png"
import coldBegging from "../../Assets/cold-begging.png"
import pulseboard from "../../Assets/pulseboard.png"
import gitpersona from "../../Assets/Gitpersona.png"

import { ProjectCard } from "../../components/ProjectCard"
import { ProjectPreview } from "../../components/ProjectPreview"

export interface Project {
    title: string
    tagline: string
    description: string
    longDescription: string
    tech: string[]
    features: string[]
    image: any
    github: string
    live: string
    role: string
    status: string
}

const projects: Project[] = [
    {
        title: "cold-begging",
        tagline: "See your code's dependency graph instantly",
        description: "A VS Code extension that visualizes function call dependencies and more.",
        longDescription: "Cold-begging is a developer productivity extension that maps out function call dependencies across your codebase in real-time. Instead of manually tracing imports and calls, get an interactive graph that shows exactly how your code is connected.",
        tech: ["VS Code Extension", "TypeScript", "AST Parsing", "Graph Visualization"],
        features: [
            "Interactive function call dependency graph",
            "Real-time codebase analysis",
            "Jump to definition from graph nodes",
            "Supports TypeScript and JavaScript",
            "Lightweight and fast"
        ],
        image: coldBegging,
        github: "https://github.com/codes-stories",
        live: "https://cold-begging.vercel.app/",
        role: "Creator & Lead Developer",
        status: "Active"
    },
    {
        title: "pulseboard",
        tagline: "Developer workflow analytics that matter",
        description: "A dashboard for monitoring and analyzing developer workflows.",
        longDescription: "PulseBoard provides real-time insights into your development pipeline. Track commit frequency, review times, deployment health, and team velocity through a clean, data-driven dashboard built for engineering leaders.",
        tech: ["React", "Node.js", "REST API", "Data Visualization", "Chart.js"],
        features: [
            "Real-time pipeline analytics",
            "Team velocity tracking",
            "Commit and review metrics",
            "Deployment health monitoring",
            "Clean data-driven dashboard"
        ],
        image: pulseboard,
        github: "https://github.com/codes-stories/code-atlas",
        live: "https://pulseboard.vercel.app/",
        role: "Full-Stack Developer",
        status: "Active"
    },
    {
        title: "GitPersona",
        tagline: "One identity per repository, automatically",
        description: "Manage multiple git identities and switch profiles per repository.",
        longDescription: "Git Multi Profile solves the problem of juggling work, personal, and open-source git identities. Create named profiles, auto-switch when opening repos, save uncommitted changes as patches, and commit with enhanced workflow — all stored locally.",
        tech: ["VS Code Extension", "TypeScript", "Git CLI", "VS Code API"],
        features: [
            "Create and manage named profiles",
            "Auto-switch profile per repository",
            "Save uncommitted changes as patches",
            "Enhanced commit workflow with patches",
            "Secure PAT token storage",
            "Import / export profiles"
        ],
        image: gitpersona,
        github: "https://github.com/gitpersona/git-multi-profile",
        live: "https://gitpersona.vercel.app/",
        role: "Creator & Sole Developer",
        status: "Published on VS Code Marketplace"
    },
    {
        title: "smvdeX",
        tagline: "Full-stack educational platform",
        description: "A comprehensive educational web solution with real-time collaboration.",
        longDescription: "smvdeX is a full-stack educational platform built for institutions. It features course management, student dashboards, real-time notifications, and an integrated email system. Built with performance in mind using Redis caching and MongoDB for flexible data storage.",
        tech: ["React", "Node.js", "MongoDB", "Express", "Redis", "Nodemailer"],
        features: [
            "Course management system",
            "Student progress dashboards",
            "Real-time notifications",
            "Email integration via Nodemailer",
            "Redis caching for performance",
            "Responsive design"
        ],
        image: smvdex,
        github: "https://github.com/codes-stories",
        live: "projects/SmvDex",
        role: "Full-Stack Developer",
        status: "Deployed"
    },
    {
        title: "QR Entry-Exit System",
        tagline: "Touchless campus access management",
        description: "QR-based entry-exit system for university campus gate management.",
        longDescription: "A MERN stack application that replaces manual logbooks at university gates. Students scan QR codes for touchless entry and exit, while administrators get a real-time dashboard showing campus occupancy and historical access logs.",
        tech: ["React", "Node.js", "MongoDB", "QR Code API", "CSS3"],
        features: [
            "QR code generation for students",
            "Touchless entry/exit scanning",
            "Real-time occupancy tracking",
            "Admin dashboard with analytics",
            "Historical access logs",
            "Campus-wide deployment ready"
        ],
        image: QrScan,
        github: "https://github.com/codes-stories",
        live: "projects/Qr-system",
        role: "Full-Stack Developer",
        status: "Deployed"
    },
    {
        title: "ShopeEase",
        tagline: "Grocery shop management simplified",
        description: "A desktop application for grocery shop owners to manage inventory and suppliers.",
        longDescription: "ShopeEase is a desktop application built to help small grocery shop owners manage their day-to-day operations. Track inventory levels, manage supplier relationships, generate invoices, and get low-stock alerts — all from a clean, intuitive interface.",
        tech: ["React", "Firebase", "Tailwind CSS", "Electron"],
        features: [
            "Inventory management with categories",
            "Supplier database and tracking",
            "Invoice generation",
            "Low-stock alerts",
            "Sales analytics",
            "Cross-platform desktop app"
        ],
        image: ShopEase,
        github: "https://github.com/codes-stories",
        live: "#",
        role: "Full-Stack Developer",
        status: "Complete"
    },
    {
        title: "Web Chat",
        tagline: "Anonymous real-time conversations",
        description: "Anonymous real-time chat application with WebSocket connections.",
        longDescription: "A real-time chat application where anyone can join conversations without signing up. Built with WebSocket for instant message delivery, Redux for state management, and a clean UI that works across devices.",
        tech: ["React", "Redux", "Node.js", "WebSocket", "Tailwind CSS"],
        features: [
            "Anonymous chat rooms",
            "Real-time message delivery via WebSocket",
            "Multiple chat rooms",
            "User presence indicators",
            "Message history",
            "Responsive design"
        ],
        image: chat,
        github: "https://github.com/codes-stories",
        live: "projects/chat-app",
        role: "Full-Stack Developer",
        status: "Deployed"
    },
    {
        title: "Shop - E-commerce",
        tagline: "Modern e-commerce experience",
        description: "A full-featured e-commerce platform with Redux toolkit cart management.",
        longDescription: "A modern e-commerce frontend that demonstrates Redux Toolkit for state management. Features include product browsing, cart operations with optimistic updates, wishlist, and a clean checkout flow built for learning how real e-commerce apps work.",
        tech: ["React", "Redux Toolkit", "Tailwind CSS", "Node.js", "MongoDB"],
        features: [
            "Product catalog with filtering",
            "Redux Toolkit cart management",
            "Wishlist functionality",
            "Responsive product pages",
            "Optimistic UI updates",
            "Clean checkout flow"
        ],
        image: CodeCollab,
        github: "https://my-shop-app.vercel.app/",
        live: "",
        role: "Frontend Developer",
        status: "Demo"
    },
    {
        title: "Todo App",
        tagline: "Productivity-focused task management",
        description: "A feature-rich todo application with timers, progress tracking, and analytics.",
        longDescription: "More than just a todo list — this app includes pomodoro timers, progress bars, task categorization, and daily productivity insights. Built with Redux for state persistence and a clean interface designed for focus.",
        tech: ["React", "Redux", "Tailwind CSS", "Node.js", "MongoDB"],
        features: [
            "Pomodoro timer integration",
            "Progress tracking with visual bars",
            "Task categories and priorities",
            "Daily productivity insights",
            "Persistent state with Redux",
            "Clean, distraction-free UI"
        ],
        image: todo,
        github: "https://github.com/codes-stories",
        live: "projects/Todo",
        role: "Full-Stack Developer",
        status: "Deployed"
    }
]

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<number | null>(null)

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Featured Projects
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div key={project.title} onClick={() => setSelectedProject(index)}>
                            <ProjectCard project={project} index={index} />
                        </div>
                    ))}
                </div>

                <ProjectPreview
                    isOpen={selectedProject !== null}
                    project={selectedProject !== null ? projects[selectedProject] : null}
                    onClose={() => setSelectedProject(null)}
                />
            </div>
        </section>
    )
}

export default Projects