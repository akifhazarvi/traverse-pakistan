export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";
export type DepartureCity = "islamabad" | "lahore";

export interface Departure {
  id: string;
  tourSlug: string;
  departureDate: string;
  maxSeats: number;
  seatsBooked: number;
  seatsAvailable: number;
  status: "open" | "closed" | "cancelled";
  pricing: {
    islamabad: number;
    lahore: number | null;
    singleSupplement: number | null;
  };
}

export interface Participant {
  fullName: string;
  cnicOrPassport?: string;
  dateOfBirth?: string;
  dietary?: string;
  emergencyContact?: string;
}

export interface CreateBookingInput {
  departureId: string;
  seats: number;
  departureCity: DepartureCity;
  singleRooms: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  participants: Participant[];
  notes?: string;
}

export interface BookingSummary {
  bookingId: string;
  bookingRef: string;
  totalAmount: number;
}

export interface Booking {
  id: string;
  bookingRef: string;
  departureId: string;
  seats: number;
  departureCity: DepartureCity;
  singleRooms: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  notes: string | null;
  createdAt: string;
}
