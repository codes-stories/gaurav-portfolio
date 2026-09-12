"use client";

import { useEffect, useState } from "react";
import { X, Menu, Moon, Sun } from "lucide-react";
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
  const [isDark, setIsDark] = useState(false);
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
    setIsDark(dark);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const dark = !isDark;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    setIsDark(dark);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <a
          href="/"
          className="text-lg sm:text-xl font-semibold tracking-tight text-foreground"
        >
          Gaurav Kumar
        </a>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {showSectionNav &&
            NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="nav-link"
              >
                {item.label}
              </button>
            ))}
          <NavLink href="/courses">Courses</NavLink>
          <NavLink href="/tracker">Tracker</NavLink>
          <NavLink href="/about">Me</NavLink>
          <NavLink href="/blog">Blogs</NavLink>
          <NavLink href="/admin/inbox">Inbox</NavLink>
          <ThemeToggle isDark={isDark} onClick={toggleTheme} />
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden rounded-lg p-2 text-foreground hover:bg-muted"
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
          className="absolute inset-x-0 top-16 z-50 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-background pb-[env(safe-area-inset-bottom)] shadow-2xl md:hidden"
        >
          <div className="space-y-2 px-6 py-5 text-lg">
            {showSectionNav &&
              NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="mobile-link"
                >
                  {item.label}
                </button>
              ))}
            <MobileLink href="/courses" onClick={() => setIsMenuOpen(false)}>
              Courses
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
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-muted-foreground">Appearance</span>
              <ThemeToggle isDark={isDark} onClick={toggleTheme} />
            </div>
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
  return <a href={href} className="nav-link">{children}</a>;
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
  return (
    <a href={href} onClick={onClick} className="mobile-link">
      {children}
    </a>
  );
}

function ThemeToggle({ isDark, onClick }: { isDark: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
