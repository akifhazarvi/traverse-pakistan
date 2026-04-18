import type { Departure } from "@/types/booking";
import type { Tour } from "@/types/tour";

export interface UrgencySignals {
  seatsLeft: number | null;
  daysUntilDeparture: number | null;
  viewersNow: number;
  bookedThisWeek: number;
  isLastMinute: boolean;
  isAlmostFull: boolean;
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function deriveUrgency(tour: Tour, live: Departure | null): UrgencySignals {
  const seatsLeft = live ? live.seatsAvailable : null;
  const departureDate = live?.departureDate ?? tour.departureDate;
  const daysUntilDeparture = departureDate
    ? Math.max(0, Math.ceil((new Date(departureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const seed = hash(tour.slug);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

  const viewersNow = 3 + ((seed + dayOfYear) % 11);
  const bookedThisWeek = 4 + ((seed >> 3) % 18);

  const isLastMinute = daysUntilDeparture !== null && daysUntilDeparture <= 21;
  const isAlmostFull = seatsLeft !== null && live !== null && seatsLeft <= Math.ceil(live.maxSeats * 0.25);

  return { seatsLeft, daysUntilDeparture, viewersNow, bookedThisWeek, isLastMinute, isAlmostFull };
}
