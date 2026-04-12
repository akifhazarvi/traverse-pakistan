import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PackageCard } from "@/components/packages/PackageCard";
import { getAllPackages } from "@/services/package.service";

export const metadata: Metadata = {
  title: "Holiday Packages — Custom Dates | Traverse Pakistan",
  description: "Choose your own dates. Pick Deluxe or Luxury. Explore Pakistan's most iconic destinations with expert guides and hand-picked hotels.",
};

export default async function PackagesPage() {
  const packages = await getAllPackages();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Packages" }]} />

        <div className="mt-8">
          <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--primary)]">Flexible Packages</span>
          <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Design Your Dream Journey
          </h1>
          <p className="mt-3 text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            No fixed departure dates. No group constraints. Pick your tier — <strong>Deluxe</strong> or <strong>Luxury</strong> — choose your travel window, and we handle everything else. Each package features hand-picked hotels that upgrade automatically with your tier.
          </p>
        </div>

        {/* Tier legend */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl flex-1">
            <span className="text-2xl">🏔️</span>
            <div>
              <p className="text-[14px] font-bold text-blue-800">Deluxe</p>
              <p className="text-[13px] text-blue-700 mt-0.5">Premium hotels with mountain views — comfortable, well-located, and great value.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl flex-1">
            <span className="text-2xl">✦</span>
            <div>
              <p className="text-[14px] font-bold text-amber-800">Luxury</p>
              <p className="text-[13px] text-amber-700 mt-0.5">Iconic five-star resorts — lakeside suites, panoramic views, and unforgettable experiences.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} variant="grid" />
          ))}
        </div>
      </Container>
    </div>
  );
}
