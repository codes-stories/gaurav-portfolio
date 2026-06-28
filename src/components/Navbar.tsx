"use client";

import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
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
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <a
          href="/"
          className="text-lg sm:text-xl font-semibold tracking-tight text-white"
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
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-lg">
          <div className="px-6 py-6 space-y-4 text-lg">
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
