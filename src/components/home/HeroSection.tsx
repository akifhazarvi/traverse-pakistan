import Image from "next/image";
import { SearchWidget } from "./SearchWidget";
import { Icon } from "@/components/ui/Icon";

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
  return (
    <section className="relative">
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={img.url}
            className="hero-slide absolute inset-0"
            style={{ animationDelay: `${-i * 6}s` }}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="100vw"
              quality={70}
              className="object-cover"
            />
          </div>
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
          <span className="text-[var(--primary-muted)]">Pakistan Tours</span> by the Highest-Rated Tour Operator
        </h1>

        <p
          className="mt-3 text-[16px] sm:text-[17px] text-[var(--on-dark-secondary)] max-w-[560px] mx-auto leading-relaxed text-center"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
        >
          Group tours, custom holidays, and verified hotels across Hunza, Skardu,
          Chitral, and K2 Base Camp — trusted by 1,300+ travelers with 4.9-star reviews.
        </p>

        {/* Social proof — instant trust */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[var(--on-dark)]"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Icon name="star" size="sm" weight="fill" color="var(--rating-gold)" />
            <span><span className="font-bold tabular-nums">4.9</span> · 1,300+ travelers</span>
          </span>
          <span className="hidden sm:inline text-[var(--on-dark-tertiary)]">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="shield-check" size="sm" weight="regular" />
            TripAdvisor Travelers&apos; Choice 2025
          </span>
          <span className="hidden sm:inline text-[var(--on-dark-tertiary)]">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="shield-check" size="sm" weight="regular" />
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
