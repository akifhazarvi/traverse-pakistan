import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PackagesClient } from "@/components/packages/PackagesClient";
import { getAllPackages } from "@/services/package.service";

export const metadata: Metadata = {
  title: "Holiday Packages — Custom Dates | Traverse Pakistan",
  description: "Choose your own dates. Pick Deluxe or Luxury. Explore Pakistan's most iconic destinations with expert guides and hand-picked hotels.",
};

export default async function PackagesPage() {
  const packages = await getAllPackages();

  return (
    <div className="pb-12">
      <div className="py-8 sm:py-10 border-b border-[var(--border-default)]">
        <Container>
          <Breadcrumb items={[{ label: "Packages" }]} />
          <div className="mt-4">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--primary)]">Flexible Packages</span>
            <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--text-primary)] tracking-tight mt-1">
              Design Your Dream Journey
            </h1>
            <p className="mt-2 text-lg text-[var(--text-secondary)] max-w-2xl">
              Your dates. Your tier. Hand-picked hotels that elevate as you go.
            </p>
          </div>
        </Container>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-[var(--text-tertiary)]">Loading…</div>}>
        <PackagesClient packages={packages} />
      </Suspense>
    </div>
  );
}
