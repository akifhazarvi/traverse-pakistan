import { getAllHotels } from "@/services/hotel.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";
import { getHotelBySlug } from "@/services/hotel.service";
import { HotelCheckoutClient } from "@/components/hotels/HotelCheckoutClient";

export async function generateStaticParams() {
  const hotels = await getAllHotels();
  return hotels.map((h) => ({ slug: h.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  return buildMetadata({
    title: hotel ? `Checkout — ${hotel.name}` : "Checkout",
    description: "Secure checkout for your hotel booking with Traverse Pakistan.",
    path: `/hotels/${slug}/checkout`,
    noIndex: true,
  });
}

export default async function HotelCheckoutPage({ params }: Props) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  if (!hotel) notFound();

  return (
    <div className="py-6 sm:py-10 pb-20">
      <Container>
        <Breadcrumb
          items={[
            { label: "Hotels", href: "/hotels" },
            { label: hotel.name, href: `/hotels/${hotel.slug}` },
            { label: "Checkout" },
          ]}
        />
        <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight mt-4 mb-8">
          Confirm your booking
        </h1>
        <Suspense fallback={<div className="py-20 text-center text-[var(--text-tertiary)]">Loading…</div>}>
          <HotelCheckoutClient hotel={hotel} />
        </Suspense>
      </Container>
    </div>
  );
}
