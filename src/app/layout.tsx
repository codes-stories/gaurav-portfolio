// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NavbarDemo } from "@/components/Navbar";
import { PageBackdrop } from "@/components/Bacground";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading-serif",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading-tech",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GauravKrrr",
  description: "A Programmer, A Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <NavbarDemo />

        {/* Page content offset for fixed navbar */}
        <main className="theme-surface relative pt-20 sm:pt-22">
          <PageBackdrop />
          {children}
        </main>
      </body>
    </html>
  );
}
// testing for new github branch rules
