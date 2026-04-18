export type QuoteRequestType = "package" | "hotel" | "tour" | "custom";

export interface CreateQuoteRequestInput {
  requestType: QuoteRequestType;
  slug?: string;
  displayName: string;
  tier?: string;
  preferredStartDate?: string;
  preferredEndDate?: string;
  adults: number;
  children: number;
  rooms: number;
  departureCity?: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
}

export interface QuoteRequestSummary {
  id: string;
  createdAt: string;
}
