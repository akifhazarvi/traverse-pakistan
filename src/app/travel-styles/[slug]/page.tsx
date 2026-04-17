import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TourGrid } from "@/components/tours/TourGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
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
  if (!style) {
    return buildMetadata({
      title: "Not Found",
      path: `/travel-styles/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${style.name} Tours in Pakistan`,
    description: `${style.description} Browse Pakistan ${style.name.toLowerCase()} tours with dual-city departures, expert guides, and 4.9-star reviews.`.slice(0, 160),
    path: `/travel-styles/${style.slug}`,
    tags: [style.name, "Pakistan tours", style.slug],
  });
}

export default async function TravelStyleDetailPage({ params }: Props) {
  const { slug } = await params;
  const style = travelStyles.find((s) => s.slug === slug);
  if (!style) notFound();

  const tours = await getToursByStyle(slug);

  const schema = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Travel Styles", url: "/travel-styles" },
    { name: style.name, url: `/travel-styles/${style.slug}` },
  ]);

  return (
    <div className="py-8 sm:py-12">
      <JsonLd data={schema} id={`travel-style-${style.slug}-jsonld`} />
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
