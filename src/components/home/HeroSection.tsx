"use client";

import { SearchWidget } from "./SearchWidget";
import { useState, useEffect } from "react";

const heroImages = [
  {
    url: "https://traversepakistan.com/wp-content/uploads/2022/09/drone1-10.jpg",
    alt: "Aerial view of Hunza Valley",
  },
  {
    url: "https://traversepakistan.com/wp-content/uploads/2022/09/AMY_0067.jpg",
    alt: "Cherry blossoms in Hunza",
  },
  {
    url: "https://traversepakistan.com/wp-content/uploads/2022/10/DJI_0114.jpg",
    alt: "Skardu mountains",
  },
  {
    url: "https://traversepakistan.com/wp-content/uploads/2022/10/AMY_0068.jpg",
    alt: "Makran coastline",
  },
  {
    url: "https://traversepakistan.com/wp-content/uploads/2022/09/DSC_1473.jpg",
    alt: "Autumn colors in Skardu",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative">
      {/* Rotating background images with crossfade */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={img.url}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
            style={{
              backgroundImage: `url(${img.url})`,
              opacity: i === current ? 1 : 0,
              transform: i === current ? "scale(1.05)" : "scale(1.1)",
              transition: "opacity 1.5s ease-in-out, transform 8s ease-out",
            }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,34,32,0.5)] via-[rgba(0,0,0,0.15)] to-[rgba(15,34,32,0.6)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[480px] sm:min-h-[540px] px-5 sm:px-8 pt-10 pb-16">
        <h1
          className="text-[var(--on-dark)] leading-[1.05] tracking-[-0.03em] font-extrabold text-center max-w-3xl"
          style={{
            fontSize: "clamp(2rem, 1.5rem + 3vw, 3.5rem)",
            textShadow: "0 2px 16px rgba(0,0,0,0.3)",
          }}
        >
          <span className="text-[var(--primary-muted)]">Pakistan</span> Like Never Before!
        </h1>

        <p
          className="mt-3 text-[16px] sm:text-[17px] text-[var(--on-dark-secondary)] max-w-[480px] mx-auto leading-relaxed text-center"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
        >
          From K2 Base Camp to the Makran Coast — expert guides, verified drivers, unforgettable memories.
        </p>

        {/* Social proof — instant trust */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[var(--on-dark)]"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD56B" stroke="none" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span><span className="font-bold tabular-nums">4.9</span> · 1,300+ travelers</span>
          </span>
          <span className="hidden sm:inline text-[var(--on-dark-tertiary)]">·</span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 5.25-4.5 9-9 9s-9-3.75-9-9 4.5-9 9-9 9 3.75 9 9z" />
            </svg>
            TripAdvisor Travelers&apos; Choice 2025
          </span>
          <span className="hidden sm:inline text-[var(--on-dark-tertiary)]">·</span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2 4 6v6c0 5 3.4 9.3 8 10 4.6-.7 8-5 8-10V6l-8-4z" />
            </svg>
            Verified guides
          </span>
        </div>

        {/* Search Widget */}
        <div id="hero-search" className="w-full max-w-[920px] mt-6 relative z-20">
          <SearchWidget />
        </div>
      </div>



      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--hero-fade)] to-transparent z-[5]" />
    </section>
  );
}
