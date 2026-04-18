import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getAllTours, getTourBySlug } from "@/services/tour.service";
import { BookingSuccessClient } from "@/components/tours/BookingSuccessClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tours = await getAllTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  return { title: tour ? `Booking confirmed — ${tour.name}` : "Booking confirmed" };
}

export default async function BookingSuccessPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <div className="py-10 sm:py-16">
      <Container>
        <Breadcrumb
          items={[
            { label: "Group Tours", href: "/grouptours" },
            { label: tour.name, href: `/grouptours/${tour.slug}` },
            { label: "Booking confirmed" },
          ]}
        />
        <BookingSuccessClient tour={tour} />
      </Container>
    </div>
  );
}
