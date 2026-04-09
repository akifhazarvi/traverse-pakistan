import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TourFilters } from "@/components/tours/TourFilters";
import { getAllTours } from "@/services/tour.service";

export const metadata: Metadata = {
  title: "All Tours",
  description:
    "Browse all tour packages across Pakistan. Group tours, trekking, cultural trips, luxury getaways, and more.",
};

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Tours" }]} />
        <div className="mt-6 mb-10">
          <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight">
            Explore All Tours
          </h1>
          <p className="text-lg text-[var(--text-tertiary)] mt-2 max-w-2xl">
            From weekend getaways to epic 15-day treks — find your perfect Pakistani adventure
          </p>
        </div>
        <TourFilters tours={tours} />
      </Container>
    </div>
  );
}
