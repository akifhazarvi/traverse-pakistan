import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { travelStyles } from "@/data/travel-styles";

export function TravelStylesGrid() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          title="Travel Your Way"
          subtitle="Choose a travel style that matches your vibe"
          linkText="View all styles"
          linkHref="/travel-styles"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {travelStyles.map((style, index) => (
            <Link
              key={style.id}
              href={`/travel-styles/${style.slug}`}
              className="group relative rounded-[var(--radius-md)] overflow-hidden"
              style={{ aspectRatio: index === 0 ? "4/3" : "4/3" }}
            >
              <Image
                src={style.image}
                alt={style.name}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.06]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
              />
              {/* Strong gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3
                  className="text-[17px] sm:text-[20px] font-bold text-white leading-tight"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                >
                  {style.name}
                </h3>
                <p className="text-[12px] text-white/70 mt-1 font-medium">
                  {style.tourCount} tours available
                </p>
              </div>

              {/* Hover ring */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-white/20 rounded-[var(--radius-md)] transition-all duration-500" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
