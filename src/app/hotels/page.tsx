import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatPrice } from "@/lib/utils";
import { getAllHotels } from "@/services/hotel.service";

export const metadata: Metadata = {
  title: "Hotels",
  description: "Browse handpicked hotels, guesthouses & camps across Pakistan.",
};

export default async function HotelsPage() {
  const hotels = await getAllHotels();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Hotels" }]} />
        <div className="mt-6 mb-10">
          <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight">
            Popular Stays
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl">
            Handpicked hotels, guesthouses & camps across Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.slug}`}
              className="group rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-primary)] transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-[var(--primary)] text-[var(--on-dark)] rounded-[var(--radius-full)]">
                    {hotel.tier}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                    {hotel.propertyType} · {hotel.destinationSlug}
                  </span>
                  <span className="flex items-center gap-1 text-[13px]">
                    <span className="text-[var(--primary-muted)]">★</span>
                    <span className="font-semibold text-[var(--text-primary)]">{hotel.rating}</span>
                    <span className="text-[var(--text-tertiary)]">({hotel.reviewCount})</span>
                  </span>
                </div>
                <h3 className="text-[17px] font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                  {hotel.name}
                </h3>
                <p className="text-[13px] text-[var(--text-tertiary)] mt-1 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {hotel.location}
                </p>
                <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
                  <span className="text-[17px] font-bold text-[var(--text-primary)] tabular-nums">
                    {formatPrice(hotel.pricePerNight)}
                  </span>
                  <span className="text-[13px] text-[var(--text-tertiary)]"> / night</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
