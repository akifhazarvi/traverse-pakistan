import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatPrice } from "@/lib/utils";
import { getAllDestinations } from "@/services/destination.service";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore all destinations across Pakistan — from Hunza to Skardu, Chitral to Makran Coast.",
};

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Destinations" }]} />
        <div className="mt-6 mb-10">
          <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-lg text-[var(--text-tertiary)] mt-2 max-w-2xl">
            From the peaks of Karakoram to the beaches of Makran — discover Pakistan&apos;s most stunning regions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative rounded-xl overflow-hidden h-[320px] flex flex-col justify-end"
            >
              <Image
                src={dest.heroImage}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative p-6">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--primary-muted)]">
                  {dest.regionSlug.replace("-", " ")}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{dest.name}</h2>
                <p className="text-[14px] text-white/70 mt-1">
                  From {formatPrice(dest.startingPrice)} &middot; {dest.tourCount} tours &middot; {dest.rating}★
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
