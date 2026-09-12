// app/page.tsx
import HeroSection from "@/components/ui/HeroSection";
import CardHelper from "@/components/Card3DHelper";
import { AnimatedTestimonialsDemo } from "@/components/Learn";
import TechMarquee from "@/components/AllLearn";
import Footer from "@/components/Footer";
import EngineeringFocus from "@/components/EngineeringFocus";
import SystemDesignCaseStudy from "@/components/SystemDesignCaseStudy";
import { FloatingElements } from "@/components/Bacground";
import Projects from "./projects/page";
import { Contact } from "@/components/contact";
import ToolsLearned from "@/components/Tool-learn";
import ProfileVisitorTracker from "@/components/ProfileVisitorTracker";
import InterviewSignalPanel from "@/components/InterviewSignalPanel";
import ProfessionalSnapshot from "@/components/ProfessionalSnapshot";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import TechRadar from "@/components/TechRadar";
import GitHubPinnedRepos from "@/components/GitHubPinnedRepos";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import LiveDashboard from "@/components/LiveDashboard";

export default function Home() {
  return (
    <div className="relative text-foreground">
      {/* Background */}
      <FloatingElements />
      <ProfileVisitorTracker />

      {/* HERO */}
      <section
        id="home"
        className="flex min-h-screen items-center justify-center pt-20"
      >
        <div className="max-w-6xl w-full px-6 text-center">
          <HeroSection />
          <InterviewSignalPanel />
        </div>
      </section>
      {/* TECH RADAR */}
      <section id="tech-radar" className="flex items-center justify-center">
        <div className="max-w-6xl w-full">
          <TechRadar />
        </div>
      </section>

      {/* GITHUB PINNED REPOS */}
      <section id="repos" className="flex items-center justify-center">
        <div className="max-w-6xl w-full">
          <GitHubPinnedRepos />
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="flex items-center justify-center">
        <div className="max-w-6xl w-full">
          <ExperienceTimeline />
        </div>
      </section>

      {/* LIVE DASHBOARD */}
      <section id="dashboard" className="flex items-center justify-center">
        <div className="max-w-6xl w-full">
          <LiveDashboard />
        </div>
      </section>

      <section className="py-20 flex items-center justify-center">
        <div className="max-w-6xl w-full px-6">
          <ProfessionalSnapshot />
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="py-20 flex items-center justify-center"
      >
        <div className="max-w-6xl w-full px-6 text-center">
          <Projects />
        </div>
      </section>

      <section id="case-study" className="py-24 flex items-center justify-center">
        <div className="max-w-6xl w-full px-6">
          <SystemDesignCaseStudy />
        </div>
      </section>



      {/* SKILLS / CARDS */}
      <section
        id="skills"
        className="py-24 flex items-center justify-center"
      >
        <div className="max-w-6xl w-full px-6 text-center">
          <CardHelper />
          <div className="mt-12">
            <ToolsLearned />
          </div>
        </div>
      </section>


      {/* ENGINEERING APPROACH */}
      <section
        id="approach"
        className="py-24 flex items-center justify-center"
      >
        <div className="max-w-5xl w-full px-6 text-center">
          <EngineeringFocus />
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section id="testimonials" className="flex items-center justify-center">
        <div className="max-w-5xl w-full">
          <TestimonialsCarousel />
        </div>
      </section>

      {/* TECH */}
      <section
        id="tech"
        className="py-24 flex items-center justify-center"
      >
        <div className="max-w-6xl w-full px-6 text-center">
          <TechMarquee />
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-24 flex items-center justify-center"
      >
        <div className="max-w-4xl w-full px-6 text-center">
          <Contact />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex justify-center">
        <div className="max-w-6xl w-full px-6 text-center">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
