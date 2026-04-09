import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `Rs ${price.toLocaleString("en-PK")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getWhatsAppUrl(message?: string): string {
  const phone = "923216650670";
  const text =
    message ||
    "Hi! I am interested in booking a tour with Traverse Pakistan.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
