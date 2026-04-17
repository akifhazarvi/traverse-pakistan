"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";
import type { Hotel } from "@/types/hotel";

function fmt(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function diffDays(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function HotelCheckoutClient({ hotel }: { hotel: Hotel }) {
  const searchParams = useSearchParams();

  const checkin  = searchParams.get("checkin") ?? "";
  const checkout = searchParams.get("checkout") ?? "";
  const guests   = Number(searchParams.get("guests") ?? 2);
  const rooms    = Number(searchParams.get("rooms") ?? 1);
  const roomName = searchParams.get("room") ?? hotel.rooms[0]?.name ?? "";
  const adults   = Number(searchParams.get("adults") ?? guests);
  const children = Number(searchParams.get("children") ?? 0);

  const selectedRoom = hotel.rooms.find((r) => r.name === roomName) ?? hotel.rooms[0];
  const nights = checkin && checkout ? diffDays(checkin, checkout) : 0;
  const subtotal = selectedRoom.price * rooms * (nights || 1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    arrivalTime: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const msg =
      `Hi! I'd like to confirm a hotel booking.\n\n` +
      `*Hotel:* ${hotel.name}, ${hotel.location}\n` +
      `*Room:* ${selectedRoom.name} × ${rooms}\n` +
      (checkin && checkout
        ? `*Dates:* ${fmt(checkin)} → ${fmt(checkout)} (${nights} night${nights !== 1 ? "s" : ""})\n`
        : "") +
      `*Guests:* ${adults} adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}\n` +
      `*Estimated Total:* ${formatPrice(subtotal)}\n\n` +
      `*Guest Details:*\n` +
      `Name: ${form.firstName} ${form.lastName}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      (form.arrivalTime ? `Arrival Time: ${form.arrivalTime}\n` : "") +
      (form.specialRequests ? `Special Requests: ${form.specialRequests}\n` : "") +
      `\nPlease confirm availability and send payment details.`;

    window.open(getWhatsAppUrl(msg), "_blank");
    setSubmitted(true);
  }

  const isValid = form.firstName && form.lastName && form.email && form.phone;

  return (
    <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

      {/* ── Left: Guest form ── */}
      <form onSubmit={handleSubmit} className="space-y-8">


        {/* Guest details */}
        <section>
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Guest details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                First name <span className="text-[var(--error)]" aria-hidden="true">*</span>
              </label>
              <input
                name="firstName" type="text" required value={form.firstName} onChange={handleChange}
                placeholder="Ali"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                Last name <span className="text-[var(--error)]" aria-hidden="true">*</span>
              </label>
              <input
                name="lastName" type="text" required value={form.lastName} onChange={handleChange}
                placeholder="Khan"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                Email <span className="text-[var(--error)]" aria-hidden="true">*</span>
              </label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="ali@example.com"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
                Phone <span className="text-[var(--error)]" aria-hidden="true">*</span>
              </label>
              <input
                name="phone" type="tel" required value={form.phone} onChange={handleChange}
                placeholder="+92 300 0000000"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Arrival */}
        <section>
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Arrival details</h2>
          <div>
            <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
              Estimated arrival time
            </label>
            <select
              name="arrivalTime" value={form.arrivalTime} onChange={handleChange}
              className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors cursor-pointer"
            >
              <option value="">Select time (optional)</option>
              <option>Before 12:00 PM</option>
              <option>12:00 PM – 2:00 PM</option>
              <option>2:00 PM – 4:00 PM</option>
              <option>4:00 PM – 6:00 PM</option>
              <option>6:00 PM – 8:00 PM</option>
              <option>After 8:00 PM</option>
            </select>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5">
              Check-in is from {hotel.checkIn}. Early check-in subject to availability.
            </p>
          </div>
        </section>

        {/* Special requests */}
        <section>
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">Special requests</h2>
          <textarea
            name="specialRequests" value={form.specialRequests} onChange={handleChange}
            rows={4}
            placeholder="Any dietary requirements, accessibility needs, room preferences, or other requests…"
            className="w-full px-4 py-3 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors resize-none"
          />
          <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5">
            Special requests cannot be guaranteed — we&apos;ll do our best to accommodate them.
          </p>
        </section>

        {/* Cancellation notice */}
        <section className="p-4 bg-[var(--primary-light)] border border-[var(--primary)]/20 rounded-[var(--radius-md)]">
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" className="mt-0.5 shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <p className="text-[13px] font-bold text-[var(--primary-deep)] mb-1">Free cancellation</p>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                {hotel.policies.cancellation[0] ?? "Cancel anytime before check-in for a full refund."}
              </p>
            </div>
          </div>
        </section>

        {/* Submit */}
        {submitted ? (
          <div className="p-5 bg-[var(--primary-light)] border border-[var(--primary)]/30 rounded-[var(--radius-md)] text-center">
            <p className="text-[16px] font-bold text-[var(--primary-deep)] mb-1">Booking request sent!</p>
            <p className="text-[13px] text-[var(--text-secondary)]">We&apos;ve opened WhatsApp with your details. Our team will confirm shortly.</p>
          </div>
        ) : (
          <button
            type="submit"
            disabled={!isValid}
            className="w-full h-[52px] bg-[var(--primary)] text-[var(--text-inverse)] text-[15px] font-bold rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Confirm via WhatsApp
          </button>
        )}
        <p className="text-center text-[12px] text-[var(--text-tertiary)] -mt-4">
          You won&apos;t be charged yet — we&apos;ll confirm availability first.
        </p>
      </form>

      {/* ── Right: Booking summary ── */}
      <aside>
        <div className="sticky top-[100px] bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-[var(--radius-md)] overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
          {/* Hotel image */}
          <div className="relative aspect-[16/9]">
            <Image src={hotel.image} alt={hotel.name} fill className="object-cover" sizes="380px" />
          </div>

          <div className="p-5 space-y-4">
            {/* Hotel name */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] mb-0.5">{hotel.propertyType}</p>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{hotel.name}</h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{hotel.location}</p>
              <p className="text-[12px] text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                <span className="text-[var(--primary-muted)]">★</span>
                {hotel.rating} · {hotel.reviewCount} reviews
              </p>
            </div>

            <div className="border-t border-[var(--border-default)]" />

            {/* Dates */}
            {checkin && checkout ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-tertiary)] mb-0.5">Check-in</p>
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">{fmt(checkin)}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">From {hotel.checkIn}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-tertiary)] mb-0.5">Check-out</p>
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">{fmt(checkout)}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">Until {hotel.checkOut}</p>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[var(--text-tertiary)] italic">No dates selected</p>
            )}

            <div className="border-t border-[var(--border-default)]" />

            {/* Room & guests */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Room</span>
                <span className="font-semibold text-[var(--text-primary)]">{selectedRoom.name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Rooms</span>
                <span className="font-semibold text-[var(--text-primary)]">{rooms}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">Guests</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {adults} adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--border-default)]" />

            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">
                  {formatPrice(selectedRoom.price)} × {rooms} room{rooms > 1 ? "s" : ""} × {nights || 1} night{(nights || 1) !== 1 ? "s" : ""}
                </span>
                <span className="text-[var(--text-primary)] font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[var(--success)]">
                <span>Taxes & fees</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-[var(--border-default)]">
                <span className="text-[var(--text-primary)]">Estimated total</span>
                <span className="text-[var(--text-primary)] tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[10px] text-[var(--text-tertiary)]">Final price confirmed by our team on WhatsApp</p>
            </div>

          </div>
        </div>
      </aside>
    </div>
  );
}
