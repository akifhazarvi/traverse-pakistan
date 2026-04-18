"use client";

import { BookingWizard } from "@/components/booking/BookingWizard";
import type { Tour } from "@/types/tour";
import type { Review } from "@/types/review";

export function GroupTourCheckoutClient({ tour, reviews }: { tour: Tour; reviews: Review[] }) {
  return <BookingWizard tour={tour} reviews={reviews} />;
}
