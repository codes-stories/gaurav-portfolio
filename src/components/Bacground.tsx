"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BACKDROP_IMAGES = [
    "/image/the-division-3840x2160-25529.jpg",
    "/image/bmw-m3-final-3840x2160-16048.jpg",
    "/image/bmw-m3-cs-5120x2880-26516.jpg",
    "/image/bmw-m3-angel-eyes-black-background-5k-3840x2160-896.jpg",
    "/image/japan-artistic-3840x2160-25406.jpg",
    "/image/hoppers-2026-movie-3840x2160-25458.jpg",
    "/image/mabel-hoppers-2026-3840x2160-25533.jpg",

];

export const PageBackdrop = () => {
    const pathname = usePathname();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const applyIndex = () => {
            const segment = Math.floor(window.scrollY / window.innerHeight);
            setIndex((prev) => (prev === segment ? prev : segment));
        };

        // Debounce so fast scrolling doesn't churn images mid-scroll;
        // the swap only starts once scrolling settles, then crossfades slowly.
        const onScroll = () => {
            clearTimeout(timer);
            timer = setTimeout(applyIndex, 250);
        };

        applyIndex();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [pathname]);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
            {BACKDROP_IMAGES.map((src, i) => {
                const active = index % BACKDROP_IMAGES.length === i;
                return (
                    <div
                        key={src}
                        className="bg-backdrop-float absolute inset-[-6%] bg-cover bg-center bg-no-repeat transition-opacity duration-[4000ms] ease-[cubic-bezier(0.4,0,0.6,1)]"
                        style={{
                            backgroundImage: `url(${src})`,
                            opacity: active ? 0.7 : 0,
                            animationDuration: `${18 + i * 4}s`,
                            animationDelay: `${i * 1.5}s`,
                        }}
                    />
                );
            })}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
        </div>
    );
};

export const FloatingElements = () => (
    <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_36%),linear-gradient(to_right,hsl(var(--border)/0.55)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.55)_1px,transparent_1px)] bg-[size:auto,4rem_4rem,4rem_4rem] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.12),transparent_36%),linear-gradient(to_right,hsl(var(--border)/0.7)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.7)_1px,transparent_1px)]"
    />
);
