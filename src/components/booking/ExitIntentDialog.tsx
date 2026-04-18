"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/utils";

interface ExitIntentDialogProps {
  tourName: string;
  storageKey: string;
}

export function ExitIntentDialog({ tourName, storageKey }: ExitIntentDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fullKey = `tp-exit-intent-${storageKey}`;
    try {
      if (window.sessionStorage.getItem(fullKey) === "dismissed") return;
    } catch {
      /* ignore */
    }

    let triggered = false;

    const handler = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY <= 8 && e.relatedTarget === null) {
        triggered = true;
        setOpen(true);
      }
    };

    const scrollHandler = () => {
      if (triggered) return;
      if (window.scrollY > 600 && window.performance.now() > 30000) {
        triggered = true;
        setOpen(true);
      }
    };

    document.addEventListener("mouseout", handler);
    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => {
      document.removeEventListener("mouseout", handler);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [storageKey]);

  function dismiss() {
    setOpen(false);
    try {
      window.sessionStorage.setItem(`tp-exit-intent-${storageKey}`, "dismissed");
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  const message = `Hi! I'm about to book the ${tourName} tour but I have a question first. Can you help?`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div
        className="relative w-full sm:max-w-md bg-[var(--bg-primary)] rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)] p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="w-12 h-12 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        </div>

        <h2 id="exit-intent-title" className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
          Have a question before booking?
        </h2>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
          Chat with our {tourName} specialist on WhatsApp — typical reply in under 1 hour. We&apos;ll also
          hold your seat while you decide.
        </p>

        <div className="mt-5 space-y-2">
          <a
            href={getWhatsAppUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="w-full h-[48px] bg-[var(--whatsapp)] text-white text-[15px] font-bold rounded-[var(--radius-sm)] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
            </svg>
            Chat with Hunza specialist
          </a>
          <Link
            href="/contact"
            onClick={dismiss}
            className="block w-full h-[44px] text-center text-[14px] font-semibold text-[var(--text-primary)] border border-[var(--border-default)] rounded-[var(--radius-sm)] flex items-center justify-center hover:bg-[var(--bg-subtle)] transition-colors"
          >
            Request a callback
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="w-full text-center text-[13px] text-[var(--text-tertiary)] pt-1 cursor-pointer hover:text-[var(--text-primary)]"
          >
            No thanks, continue booking
          </button>
        </div>
      </div>
    </div>
  );
}
