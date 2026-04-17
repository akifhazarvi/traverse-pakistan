import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BookingSidebar } from "@/components/trip-detail/BookingSidebar";
import { getTourBySlug, getAllTours } from "@/services/tour.service";

interface Props {
  params: Promise<{ tourSlug: string }>;
}

export async function generateStaticParams() {
  const tours = await getAllTours();
  return tours.map((t) => ({ tourSlug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tourSlug } = await params;
  const tour = await getTourBySlug(tourSlug);
  if (!tour) return { title: "Booking" };
  return { title: `Book ${tour.name}`, description: `Book the ${tour.name} tour with Traverse Pakistan.` };
}

export default async function BookingPage({ params }: Props) {
  const { tourSlug } = await params;
  const tour = await getTourBySlug(tourSlug);
  if (!tour) notFound();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb
          items={[
            { label: "Tours", href: "/grouptours" },
            { label: tour.name, href: `/grouptours/${tour.slug}` },
            { label: "Booking" },
          ]}
        />
        <div className="mt-6 mb-10">
          <h1 className="text-[28px] font-bold text-[var(--text-primary)]">
            Book: {tour.name}
          </h1>
          <p className="text-[var(--text-tertiary)] mt-2">
            Full online booking with payment integration is coming in Phase 2. For now, use WhatsApp to confirm your booking.
          </p>
        </div>
        <div className="max-w-[420px]">
          <BookingSidebar tour={tour} />
        </div>
      </Container>
    </div>
  );
}
