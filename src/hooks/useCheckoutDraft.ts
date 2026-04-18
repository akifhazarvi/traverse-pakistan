"use client";

import { useEffect, useRef, useState } from "react";
import type { CheckoutDraft } from "@/components/booking/types";
import { DEFAULT_DRAFT } from "@/components/booking/types";

const STORAGE_PREFIX = "tp-checkout-draft-";
const DRAFT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

function getStorageKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

export function useCheckoutDraft(tourSlug: string, initial: Partial<CheckoutDraft> = {}) {
  const initialized = useRef(false);
  const [draft, setDraft] = useState<CheckoutDraft>(() => ({
    ...DEFAULT_DRAFT(tourSlug),
    ...initial,
  }));

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(getStorageKey(tourSlug));
      if (!raw) return;
      const parsed = JSON.parse(raw) as CheckoutDraft;
      if (Date.now() - parsed.updatedAt > DRAFT_MAX_AGE_MS) {
        window.localStorage.removeItem(getStorageKey(tourSlug));
        return;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft((prev) => ({ ...prev, ...parsed, ...initial, tourSlug }));
    } catch {
      /* ignore */
    }
  }, [tourSlug, initial]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload: CheckoutDraft = { ...draft, updatedAt: Date.now() };
    try {
      window.localStorage.setItem(getStorageKey(tourSlug), JSON.stringify(payload));
    } catch {
      /* storage full / blocked */
    }
  }, [draft, tourSlug]);

  function clearDraft() {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(getStorageKey(tourSlug)); } catch { /* ignore */ }
  }

  return { draft, setDraft, clearDraft } as const;
}

export function hasResumableDraft(tourSlug: string): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getStorageKey(tourSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CheckoutDraft;
    if (Date.now() - parsed.updatedAt > DRAFT_MAX_AGE_MS) return null;
    const hasProgress = parsed.step > 1 || parsed.contact.email || parsed.travelers.length > 0;
    return hasProgress ? parsed : null;
  } catch {
    return null;
  }
}
