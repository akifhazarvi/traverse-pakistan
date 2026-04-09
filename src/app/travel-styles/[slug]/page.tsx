import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TourGrid } from "@/components/tours/TourGrid";
import { travelStyles } from "@/data/travel-styles";
import { getToursByStyle } from "@/services/tour.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return travelStyles.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const style = travelStyles.find((s) => s.slug === slug);
  if (!style) return { title: "Not Found" };
  return {
    title: `${style.name} Tours`,
    description: style.description,
  };
}

export default async function TravelStyleDetailPage({ params }: Props) {
  const { slug } = await params;
  const style = travelStyles.find((s) => s.slug === slug);
  if (!style) notFound();

  const tours = await getToursByStyle(slug);

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb
          items={[
            { label: "Travel Styles", href: "/travel-styles" },
            { label: style.name },
          ]}
        />
        <div className="mt-6 mb-10">
          <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight">
            {style.name}
          </h1>
          <p className="text-lg text-[var(--text-tertiary)] mt-2 max-w-2xl">
            {style.description}
          </p>
        </div>
        <TourGrid tours={tours} />
      </Container>
    </div>
  );
}
