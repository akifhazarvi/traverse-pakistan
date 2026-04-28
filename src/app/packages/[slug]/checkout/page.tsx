import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAllPackages, getPackageBySlug } from "@/services/package.service";
import { getLatestReviews } from "@/services/review.service";
import { PackageCheckoutClient } from "@/components/packages/PackageCheckoutClient";

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
  return buildMetadata({
    title: pkg ? `Checkout — ${pkg.name}` : "Checkout",
    description: "Book your Traverse Pakistan holiday package.",
    path: `/packages/${slug}/checkout`,
    noIndex: true,
  });
}

export default async function PackageCheckoutPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const reviews = await getLatestReviews(3);

  return (
    <div className="py-6 sm:py-10 pb-24">
      <Container>
        <Breadcrumb
          items={[
            { label: "Holiday Packages", href: "/packages" },
            { label: pkg.name, href: `/packages/${pkg.slug}` },
            { label: "Checkout" },
          ]}
        />
        <div className="mt-4 mb-6 sm:mb-8">
          <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight">
            Book your package
          </h1>
          <p className="mt-1.5 text-[14px] text-[var(--text-secondary)]">
            {pkg.duration}-day {pkg.name} · {pkg.freeCancellation ? "Free cancellation · " : ""}No charge until confirmed
          </p>
        </div>
        <Suspense fallback={<div className="py-20 text-center text-[var(--text-tertiary)]">Loading…</div>}>
          <PackageCheckoutClient pkg={pkg} reviews={reviews} />
        </Suspense>
      </Container>
    </div>
  );
}
