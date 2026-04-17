export type DepartureStatus = "open" | "closed" | "cancelled";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";
export type PaymentStatus = "initiated" | "succeeded" | "failed" | "refunded";
export type DepartureCity = "islamabad" | "lahore";

export type DepartureRow = {
  id: string;
  tour_slug: string;
  departure_date: string;
  max_seats: number;
  seats_booked: number;
  status: DepartureStatus;
  price_islamabad: number;
  price_lahore: number | null;
  single_supplement: number | null;
  created_at: string;
};

export type BookingRow = {
  id: string;
  booking_ref: string;
  user_id: string | null;
  departure_id: string;
  seats: number;
  departure_city: DepartureCity;
  single_rooms: number;
  total_amount: number;
  currency: string;
  status: BookingStatus;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingParticipantRow = {
  id: string;
  booking_id: string;
  full_name: string;
  cnic_or_passport: string | null;
  date_of_birth: string | null;
  dietary: string | null;
  emergency_contact: string | null;
};

export type ReviewRow = {
  id: string;
  user_id: string | null;
  tour_slug: string;
  rating: number;
  title: string | null;
  body: string;
  approved: boolean;
  created_at: string;
};

export type CreateBookingArgs = {
  p_departure_id: string;
  p_seats: number;
  p_departure_city: DepartureCity;
  p_single_rooms: number;
  p_contact_name: string;
  p_contact_email: string;
  p_contact_phone: string;
  p_participants: Array<{
    full_name: string;
    cnic_or_passport?: string | null;
    date_of_birth?: string | null;
    dietary?: string | null;
    emergency_contact?: string | null;
  }>;
  p_notes?: string | null;
};

export type CreateBookingResult = {
  booking_id: string;
  booking_ref: string;
  total_amount: number;
};

export type Database = {
  public: {
    Tables: {
      departures: {
        Row: DepartureRow;
        Insert: Omit<DepartureRow, "id" | "created_at" | "seats_booked" | "status"> &
          Partial<Pick<DepartureRow, "id" | "created_at" | "seats_booked" | "status">>;
        Update: Partial<DepartureRow>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: Omit<BookingRow, "id" | "created_at" | "updated_at" | "status"> &
          Partial<Pick<BookingRow, "id" | "created_at" | "updated_at" | "status">>;
        Update: Partial<BookingRow>;
        Relationships: [];
      };
      booking_participants: {
        Row: BookingParticipantRow;
        Insert: Omit<BookingParticipantRow, "id"> & Partial<Pick<BookingParticipantRow, "id">>;
        Update: Partial<BookingParticipantRow>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: Omit<ReviewRow, "id" | "created_at" | "approved"> &
          Partial<Pick<ReviewRow, "id" | "created_at" | "approved">>;
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      create_booking: {
        Args: CreateBookingArgs;
        Returns: CreateBookingResult[];
      };
    };
  };
}
