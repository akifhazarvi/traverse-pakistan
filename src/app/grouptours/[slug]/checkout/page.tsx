import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { buildMetadata } from "@/lib/seo/metadata";
import { getTourBySlug, getAllTours } from "@/services/tour.service";
import { GroupTourCheckoutClient } from "@/components/tours/GroupTourCheckoutClient";

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
  return buildMetadata({
    title: tour ? `Checkout — ${tour.name}` : "Checkout",
    description: "Secure checkout for your Traverse Pakistan tour booking.",
    path: `/grouptours/${slug}/checkout`,
    noIndex: true,
  });
}

export default async function GroupTourCheckoutPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <div className="py-6 sm:py-10 pb-20">
      <Container>
        <Breadcrumb
          items={[
            { label: "Group Tours", href: "/grouptours" },
            { label: tour.name, href: `/grouptours/${tour.slug}` },
            { label: "Checkout" },
          ]}
        />
        <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight mt-4 mb-8">
          Confirm your booking
        </h1>
        <Suspense fallback={<div className="py-20 text-center text-[var(--text-tertiary)]">Loading…</div>}>
          <GroupTourCheckoutClient tour={tour} />
        </Suspense>
      </Container>
    </div>
  );
}
