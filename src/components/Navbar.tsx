"use client";

import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Repos", id: "repos" },
  { label: "Dashboard", id: "dashboard" },
  { label: "Contact", id: "contact" },
];

export function NavbarDemo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // console.log("PATHNAME:", pathname);

  // Show section nav ONLY on homepage
  const showSectionNav = pathname === "/";

  /* Prevent background scroll on mobile menu */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const dark = savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl border border-white/15 bg-black/45 px-4 shadow-lg shadow-black/20 backdrop-blur-xl sm:px-6">
        {/* LOGO */}
        <a
          href="/"
          className="font-tech text-lg font-bold tracking-tight text-white sm:text-xl"
        >
          Gaurav<span className="heading-grad-1">Krrr</span>
        </a>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {showSectionNav &&
            NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          <NavLink href="/courses">Courses</NavLink>
          <NavLink href="/projects">Work</NavLink>
          <NavLink href="/tracker">Tracker</NavLink>
          <NavLink href="/about">Me</NavLink>
          <NavLink href="/blog">Blogs</NavLink>
          <NavLink href="/admin/inbox">Inbox</NavLink>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle Menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-3 top-[4.5rem] z-50 overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-black/80 pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-xl sm:inset-x-5 md:hidden"
        >
          <div className="space-y-1 px-5 py-4 text-lg">
            {showSectionNav &&
              NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            <MobileLink href="/courses" onClick={() => setIsMenuOpen(false)}>
              Courses
            </MobileLink>
            <MobileLink href="/projects" onClick={() => setIsMenuOpen(false)}>
              Work
            </MobileLink>
            <MobileLink href="/tracker" onClick={() => setIsMenuOpen(false)}>
              Tracker
            </MobileLink>
            <MobileLink href="/about" onClick={() => setIsMenuOpen(false)}>
              Me
            </MobileLink>

            <MobileLink href="/blog" onClick={() => setIsMenuOpen(false)}>
              Blogs
            </MobileLink>

            <MobileLink
              href="/admin/inbox"
              onClick={() => setIsMenuOpen(false)}
            >
              Inbox
            </MobileLink>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ================== HELPERS ================== */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <a
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${isActive
        ? "bg-white/15 text-white"
        : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
    >
      {children}
    </a>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <a
      href={href}
      onClick={onClick}
      className={`block rounded-lg px-3 py-2.5 transition-colors ${isActive
        ? "bg-white/15 text-white"
        : "text-white/75 hover:bg-white/10 hover:text-white"
        }`}
    >
      {children}
    </a>
  );
}
