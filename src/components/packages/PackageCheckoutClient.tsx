"use client";

import { PackageBookingWizard } from "./PackageBookingWizard";
import type { Package } from "@/types/package";
import type { Review } from "@/types/review";

export function PackageCheckoutClient({ pkg, reviews }: { pkg: Package; reviews: Review[] }) {
  return <PackageBookingWizard pkg={pkg} reviews={reviews} />;
}
