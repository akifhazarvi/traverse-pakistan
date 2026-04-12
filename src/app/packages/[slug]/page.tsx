import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageDetailClient } from "@/components/packages/PackageDetailClient";
import { getAllPackages, getPackageBySlug, getPackageItinerary } from "@/services/package.service";
import { getAllHotels } from "@/services/hotel.service";
import type { Hotel } from "@/types/hotel";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const packages = await getAllPackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Package Not Found" };
  return { title: pkg.metaTitle, description: pkg.metaDescription };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const [itinerary, allHotels, allPackages] = await Promise.all([
    getPackageItinerary(slug),
    getAllHotels(),
    getAllPackages(),
  ]);

  // Build hotels lookup map
  const hotelsMap: Record<string, Hotel> = {};
  for (const hotel of allHotels) {
    hotelsMap[hotel.slug] = hotel;
  }

  const relatedPackages = allPackages.filter((p) => p.slug !== slug);

  return (
    <PackageDetailClient
      pkg={pkg}
      itinerary={itinerary}
      hotelsMap={hotelsMap}
      relatedPackages={relatedPackages}
    />
  );
}
