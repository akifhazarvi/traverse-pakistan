import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GroupToursClient } from "@/components/tours/GroupToursClient";
import { getAllTours } from "@/services/tour.service";

export const metadata: Metadata = {
  title: "All Group Tours",
  description:
    "Browse all group tour packages across Pakistan. Group tours, trekking, cultural trips, luxury getaways, and more.",
};

export default async function GroupToursPage() {
  const tours = await getAllTours();

  return (
    <div className="pb-12">
      <div className="py-8 sm:py-10 border-b border-[var(--border-default)]">
        <Container>
          <Breadcrumb items={[{ label: "Group Tours" }]} />
          <div className="mt-4">
            <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight">
              Explore All Group Tours
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl">
              From weekend getaways to epic 15-day treks — find your perfect Pakistani adventure
            </p>
          </div>
        </Container>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-[var(--text-tertiary)]">Loading…</div>}>
        <GroupToursClient tours={tours} />
      </Suspense>
    </div>
  );
}
