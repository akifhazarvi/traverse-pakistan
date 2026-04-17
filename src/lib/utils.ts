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

/**
 * Deterministic "saved" count from a slug + popularity signal.
 * Gives every card stable social-proof numbers between renders
 * while making popular tours (higher rating/reviews) trend higher.
 */
export function getSavedCountForSlug(slug: string, popularityBoost = 0): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  const base = 40 + (Math.abs(hash) % 260);
  return Math.round(base + popularityBoost);
}
