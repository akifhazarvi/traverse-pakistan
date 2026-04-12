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
          <span className="text-[#A5D6A7]">Pakistan</span> Like Never Before!
                  </h1>

        <p
          className="mt-3 text-[16px] sm:text-[17px] text-[var(--on-dark-secondary)] max-w-[480px] mx-auto leading-relaxed text-center"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
        >
          From K2 Base Camp to the Makran Coast — expert guides, verified drivers, unforgettable memories.
        </p>

        {/* Search Widget */}
        <div className="w-full max-w-[920px] mt-7 relative z-20">
          <SearchWidget />
        </div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
              i === current
                ? "w-6 bg-[var(--on-dark)]"
                : "w-1.5 bg-[var(--on-dark-tertiary)] hover:bg-[var(--on-dark-secondary)]"
            }`}
            aria-label={`Show image ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--hero-fade)] to-transparent z-[5]" />
    </section>
  );
}
