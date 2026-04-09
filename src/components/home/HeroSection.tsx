"use client";

import { SearchWidget } from "./SearchWidget";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.3;
  const opacity = Math.max(0, 1 - scrollY / 600);

  return (
    <section className="relative flex flex-col items-center justify-center">
      {/* Background with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage:
              "url(https://traversepakistan.com/wp-content/uploads/2022/09/drone1-10.jpg)",
            transform: `translateY(${parallaxOffset}px) scale(1.1)`,
          }}
        />
        {/* Multi-layer gradient for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,34,32,0.4)] via-[rgba(0,0,0,0.1)] to-[rgba(15,34,32,0.7)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,34,32,0.3)] via-transparent to-[rgba(15,34,32,0.3)]" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-[960px] mx-auto px-5 sm:px-8 text-center pt-20 sm:pt-28 pb-36 sm:pb-44"
        style={{ opacity, transform: `translateY(${scrollY * 0.1}px)` }}
      >
        {/* Trust badge above title */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--on-dark-glass)] backdrop-blur-sm rounded-[var(--radius-full)] border border-[var(--on-dark-border)] mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-muted)" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
          <span className="text-[12px] font-semibold text-[var(--on-dark)]">
            Rated 4.9★ by 1,300+ travelers
          </span>
        </div>

        <h1
          className="text-[var(--on-dark)] leading-[1.02] tracking-[-0.04em] font-extrabold"
          style={{
            fontSize: "clamp(2.5rem, 2rem + 3.5vw, 4.5rem)",
            textShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          Discover the Beauty
          <br />
          of <span className="text-[var(--primary-muted)]">Pakistan</span>
        </h1>
        <p
          className="mt-5 text-[17px] sm:text-[19px] text-[var(--on-dark-secondary)] max-w-[520px] mx-auto leading-relaxed font-normal"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
        >
          Explore breathtaking destinations with Pakistan&apos;s highest-rated tour operator
        </p>

        {/* Search Widget */}
        <div className="mt-10 relative z-20">
          <SearchWidget />
        </div>
      </div>

      {/* Bottom fade — smoother transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--hero-fade)] via-[var(--hero-fade)]/80 to-transparent z-[5]" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce" style={{ opacity: Math.max(0, 1 - scrollY / 200) }}>
        <div className="w-6 h-10 border-2 border-[var(--on-dark-tertiary)] rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-[var(--on-dark-secondary)] rounded-full" />
        </div>
      </div>
    </section>
  );
}
