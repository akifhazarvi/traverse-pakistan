"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";
import type { Tour } from "@/types/tour";

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

export function GroupTourCheckoutClient({ tour }: { tour: Tour }) {
  const searchParams = useSearchParams();

  const departure = (searchParams.get("departure") ?? "islamabad") as "islamabad" | "lahore";
  const initAdults = Number(searchParams.get("adults") ?? 2);
  const initChildren = Number(searchParams.get("children") ?? 0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: departure === "lahore" ? "Lahore" : "Islamabad",
    specialRequests: "",
  });
  const [adults, setAdults] = useState(initAdults);
  const [children, setChildren] = useState(initChildren);
  const [depCity, setDepCity] = useState<"islamabad" | "lahore">(departure);
  const [submitted, setSubmitted] = useState(false);

  const basePrice = depCity === "lahore" && tour.pricing.lahore
    ? tour.pricing.lahore
    : tour.pricing.islamabad;
  const totalTravelers = adults + children;
  const subtotal = basePrice * totalTravelers;
  const singleSupplement = totalTravelers === 1 && tour.pricing.singleSupplement
    ? tour.pricing.singleSupplement
    : 0;
  const grandTotal = subtotal + singleSupplement;

  const departureDate = tour.departureDate ? fmtDate(tour.departureDate) : "Flexible";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const msg =
      `Hi! I'd like to book the "${tour.name}" tour.\n\n` +
      `*Tour:* ${tour.name}\n` +
      `*Departure:* ${depCity === "lahore" ? "Lahore" : "Islamabad"}\n` +
      `*Date:* ${departureDate}\n` +
      `*Duration:* ${tour.duration} days\n` +
      `*Adults:* ${adults}\n` +
      (children > 0 ? `*Children:* ${children}\n` : "") +
      (singleSupplement > 0 ? `*Single Supplement:* ${formatPrice(singleSupplement)}\n` : "") +
      `*Total:* ${formatPrice(grandTotal)}\n\n` +
      `*Guest Details:*\n` +
      `Name: ${form.firstName} ${form.lastName}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      (form.specialRequests ? `Special Requests: ${form.specialRequests}\n` : "") +
      `\nPlease confirm availability.`;

    window.open(getWhatsAppUrl(msg), "_blank");
    setSubmitted(true);
  }

  const isValid = form.firstName && form.lastName && form.email && form.phone;

  return (
    <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

      {/* ── Left: Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Departure city */}
        {tour.pricing.lahore && (
          <section>
            <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Departure city</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["islamabad", "lahore"] as const).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setDepCity(city)}
                  className={`h-12 rounded-[var(--radius-sm)] text-[14px] font-semibold border transition-colors cursor-pointer capitalize ${
                    depCity === city
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border-default)] hover:border-[var(--primary)]"
                  }`}
                >
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                  <span className="block text-[11px] font-normal opacity-80 mt-0.5">
                    {formatPrice(city === "lahore" ? (tour.pricing.lahore ?? tour.pricing.islamabad) : tour.pricing.islamabad)} / person
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Travelers */}
        <section>
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Travelers</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Adults */}
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Adults</label>
              <div className="flex items-center border border-[var(--border-default)] rounded-[var(--radius-sm)] overflow-hidden">
                <button type="button" onClick={() => setAdults(a => Math.max(1, a - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors text-xl cursor-pointer border-r border-[var(--border-default)]">−</button>
                <span className="flex-1 text-center text-[15px] font-semibold text-[var(--text-primary)]">{adults}</span>
                <button type="button" onClick={() => setAdults(a => Math.min(tour.maxGroupSize, a + 1))}
                  className="w-11 h-11 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors text-xl cursor-pointer border-l border-[var(--border-default)]">+</button>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-1">Age 13+</p>
            </div>
            {/* Children */}
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Children</label>
              <div className="flex items-center border border-[var(--border-default)] rounded-[var(--radius-sm)] overflow-hidden">
                <button type="button" onClick={() => setChildren(c => Math.max(0, c - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors text-xl cursor-pointer border-r border-[var(--border-default)]">−</button>
                <span className="flex-1 text-center text-[15px] font-semibold text-[var(--text-primary)]">{children}</span>
                <button type="button" onClick={() => setChildren(c => Math.min(tour.maxGroupSize - adults, c + 1))}
                  className="w-11 h-11 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors text-xl cursor-pointer border-l border-[var(--border-default)]">+</button>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-1">Ages 2–12 · 50% off</p>
            </div>
          </div>
          {totalTravelers >= tour.maxGroupSize && (
            <p className="mt-2 text-[12px] text-[var(--warning)] font-medium">Max group size of {tour.maxGroupSize} reached</p>
          )}
          {singleSupplement > 0 && (
            <p className="mt-2 text-[12px] text-amber-600 font-medium flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Single traveller supplement: {formatPrice(singleSupplement)}
            </p>
          )}
        </section>

        {/* Guest details */}
        <section>
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Lead traveller details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                First name <span className="text-red-500">*</span>
              </label>
              <input name="firstName" type="text" required value={form.firstName} onChange={handleChange}
                placeholder="Ali"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                Last name <span className="text-red-500">*</span>
              </label>
              <input name="lastName" type="text" required value={form.lastName} onChange={handleChange}
                placeholder="Khan"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                Email <span className="text-red-500">*</span>
              </label>
              <input name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="ali@example.com"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                Phone <span className="text-red-500">*</span>
              </label>
              <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
                placeholder="+92 300 0000000"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors" />
            </div>
          </div>
        </section>

        {/* Special requests */}
        <section>
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Special requests</h2>
          <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange}
            rows={3} placeholder="Dietary requirements, accessibility needs, room preferences…"
            className="w-full px-4 py-3 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors resize-none" />
        </section>

        {/* Cancellation */}
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-[var(--radius-md)]">
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="mt-0.5 shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p className="text-[13px] font-bold text-emerald-800 mb-1">Free cancellation</p>
              <p className="text-[12px] text-emerald-700">Cancel up to 7 days before departure for a full refund.</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        {submitted ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-[var(--radius-md)] text-center">
            <p className="text-[16px] font-bold text-emerald-800 mb-1">Booking request sent!</p>
            <p className="text-[13px] text-emerald-700">Our team will confirm your booking via WhatsApp shortly.</p>
          </div>
        ) : (
          <button type="submit" disabled={!isValid}
            className="w-full h-[52px] bg-[var(--primary)] text-white text-[15px] font-bold rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
            Confirm via WhatsApp
          </button>
        )}
        <p className="text-center text-[12px] text-[var(--text-tertiary)] -mt-4">
          You won&apos;t be charged yet — we&apos;ll confirm availability first.
        </p>
      </form>

      {/* ── Right: Summary ── */}
      <aside>
        <div className="sticky top-[100px] bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-[var(--radius-md)] overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="relative aspect-[16/9]">
            <Image src={tour.images[0]?.url || ""} alt={tour.name} fill className="object-cover" sizes="380px" />
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] mb-0.5">
                {tour.category.replace(/-/g, " ")}
              </p>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{tour.name}</h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-1 flex items-center gap-1">
                <span className="text-[var(--primary-muted)]">★</span>
                {tour.rating} · {tour.reviewCount} reviews
              </p>
            </div>

            <div className="border-t border-[var(--border-default)]" />

            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Departure</span>
                <span className="font-semibold text-[var(--text-primary)] capitalize">{depCity}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Date</span>
                <span className="font-semibold text-[var(--text-primary)]">{departureDate}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Duration</span>
                <span className="font-semibold text-[var(--text-primary)]">{tour.duration} days</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Travelers</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {adults} adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Max group size</span>
                <span className="font-semibold text-[var(--text-primary)]">{tour.maxGroupSize}</span>
              </div>
            </div>

            <div className="border-t border-[var(--border-default)]" />

            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">{formatPrice(basePrice)} × {totalTravelers} traveller{totalTravelers !== 1 ? "s" : ""}</span>
                <span className="text-[var(--text-primary)] font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              {singleSupplement > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--text-secondary)]">Single supplement</span>
                  <span className="text-[var(--text-primary)] font-medium tabular-nums">{formatPrice(singleSupplement)}</span>
                </div>
              )}
              <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-[var(--border-default)]">
                <span className="text-[var(--text-primary)]">Estimated total</span>
                <span className="text-[var(--text-primary)] tabular-nums">{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-[10px] text-[var(--text-tertiary)]">Final price confirmed by our team on WhatsApp</p>
            </div>

          </div>
        </div>
      </aside>
    </div>
  );
}
