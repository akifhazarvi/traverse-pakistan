export interface FAQ {
  question: string;
  answer: string;
}

export interface DestinationFAQs {
  destinationSlug: string;
  faqs: FAQ[];
}
