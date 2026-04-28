"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { Hotel, HotelRoom } from "@/types/hotel";

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isBefore(a: Date, b: Date) {
  return startOfDay(a) < startOfDay(b);
}
function diffDays(a: Date, b: Date) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}
function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDOW(y: number, m: number) { return new Date(y, m, 1).getDay(); }

/* ─── Calendar ──────────────────────────────────────────────────────────────── */

type Selecting = "checkin" | "checkout";

interface CalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  hovered: Date | null;
  selecting: Selecting;
  onHover: (d: Date | null) => void;
  onSelect: (d: Date) => void;
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

function CalendarGrid({ checkIn, checkOut, hovered, selecting, onHover, onSelect, year, month, onPrev, onNext }: CalendarProps) {
  const today = startOfDay(new Date());
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDOW(year, month);

  const cells: (Date | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const rangeEnd = selecting === "checkout" ? (checkOut ?? hovered) : checkOut;

  function isInRange(d: Date) {
    if (!checkIn || !rangeEnd) return false;
    const lo = isBefore(checkIn, rangeEnd) ? checkIn : rangeEnd;
    const hi = isBefore(checkIn, rangeEnd) ? rangeEnd : checkIn;
    return startOfDay(d) > startOfDay(lo) && startOfDay(d) < startOfDay(hi);
  }

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button type="button" onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer text-[var(--text-secondary)]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3L5 8L10 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="text-[13px] font-bold text-[var(--text-primary)]">{MONTHS[month]} {year}</span>
        <button type="button" onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer text-[var(--text-secondary)]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-[var(--text-tertiary)] py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} />;

          const past = startOfDay(date) < today;
          const isCI = checkIn ? isSameDay(date, checkIn) : false;
          const isCO = checkOut ? isSameDay(date, checkOut) : false;
          const inRange = isInRange(date);
          const isToday = isSameDay(date, today);

          const rangeStart = checkIn && rangeEnd && isSameDay(date,
            isBefore(checkIn, rangeEnd) ? checkIn : rangeEnd);
          const rangeEndDay = checkIn && rangeEnd && !isSameDay(checkIn, rangeEnd) && isSameDay(date,
            isBefore(checkIn, rangeEnd) ? rangeEnd : checkIn);

          return (
            <div
              key={date.toISOString()}
              className={[
                "relative h-9 flex items-center justify-center",
                inRange ? "bg-[var(--primary-light)]" : "",
                rangeStart && rangeEnd && !isSameDay(checkIn!, rangeEnd) ? "rounded-l-full" : "",
                rangeEndDay ? "rounded-r-full" : "",
              ].join(" ")}
            >
              <button
                type="button"
                disabled={past}
                onClick={() => !past && onSelect(date)}
                onMouseEnter={() => !past && onHover(date)}
                onMouseLeave={() => onHover(null)}
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all duration-100 cursor-pointer select-none",
                  past ? "text-[var(--text-tertiary)] opacity-30 cursor-not-allowed" : "",
                  (isCI || isCO) ? "bg-[var(--primary)] text-[var(--text-inverse)] font-bold shadow-sm" : "",
                  !isCI && !isCO && !past ? "hover:bg-[var(--primary-light)] hover:text-[var(--primary)]" : "",
                  isToday && !isCI && !isCO ? "border border-[var(--primary)] text-[var(--primary)]" : "",
                  inRange && !isCI && !isCO ? "text-[var(--primary)] font-semibold" : "",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Counter ───────────────────────────────────────────────────────────────── */

function Counter({ label, sub, value, onDec, onInc, disableDec, disableInc }: {
  label: string; sub: string; value: number;
  onDec: () => void; onInc: () => void;
  disableDec: boolean; disableInc: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-[13px] font-semibold text-[var(--text-primary)]">{label}</p>
        <p className="text-[11px] text-[var(--text-tertiary)]">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onDec} disabled={disableDec}
          className="w-8 h-8 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer disabled:opacity-30 bg-[var(--bg-primary)] text-lg leading-none">
          −
        </button>
        <span className="w-5 text-center text-[15px] font-semibold tabular-nums text-[var(--text-primary)]">{value}</span>
        <button type="button" onClick={onInc} disabled={disableInc}
          className="w-8 h-8 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer disabled:opacity-30 bg-[var(--bg-primary)] text-lg leading-none">
          +
        </button>
      </div>
    </div>
  );
}

/* ─── Main sidebar ──────────────────────────────────────────────────────────── */

interface HotelBookingSidebarProps {
  hotel: Hotel;
}

const MAX_GUESTS = 20;
const MAX_ROOMS = 10;

/** Guests per room: Suite/Family/Presidential rooms fit 5; standard rooms fit 3 */
function getRoomCapacity(roomName: string): number {
  const large = /suite|family|presidential/i.test(roomName);
  return large ? 5 : 3;
}

/** Minimum rooms needed given guest count and room capacity */
function minRoomsNeeded(totalGuests: number, capacity: number): number {
  return Math.max(1, Math.ceil(totalGuests / capacity));
}

export function HotelBookingSidebar({ hotel }: HotelBookingSidebarProps) {
  const today = new Date();

  // Calendar
  const [calOpen, setCalOpen] = useState(false);
  const [selecting, setSelecting] = useState<Selecting>("checkin");
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);

  // Room
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom>(hotel.rooms[0]);
  const [numRooms, setNumRooms] = useState(1);

  // Guests
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const calRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) setGuestsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function openFor(s: Selecting) {
    setSelecting(s);
    setCalOpen(true);
  }

  function handleDateSelect(date: Date) {
    if (selecting === "checkin") {
      setCheckIn(date);
      setCheckOut(null);
      setSelecting("checkout");
      // stay open for checkout
    } else {
      if (!checkIn || isBefore(date, checkIn) || isSameDay(date, checkIn)) {
        // Picked before/same as check-in → restart
        setCheckIn(date);
        setCheckOut(null);
        setSelecting("checkout");
      } else {
        setCheckOut(date);
        setCalOpen(false);
      }
    }
  }

  function clearDates() {
    setCheckIn(null);
    setCheckOut(null);
    setSelecting("checkin");
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  // Pricing
  const nights = checkIn && checkOut ? diffDays(checkIn, checkOut) : 0;
  const nightlyTotal = selectedRoom.price * numRooms;
  const subtotal = nightlyTotal * (nights || 1);

  const ciLabel = checkIn ? fmt(checkIn) : "Add date";
  const coLabel = checkOut ? fmt(checkOut) : "Add date";
  const totalGuests = adults + children;

  const whatsappMsg =
    `Hi! I'd like to book at ${hotel.name}.\n\n` +
    `Room: ${selectedRoom.name} × ${numRooms}\n` +
    (checkIn && checkOut ? `Dates: ${fmt(checkIn)} – ${fmt(checkOut)} (${nights} night${nights !== 1 ? "s" : ""})\n` : "") +
    `Adults: ${adults}${children > 0 ? `\nChildren: ${children}` : ""}\n` +
    `Est. total: ${formatPrice(subtotal)}\n\nPlease confirm availability.`;

  return (
    <div className="sticky top-[120px]">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-[var(--radius-md)] p-6" style={{ boxShadow: "var(--shadow-sm)" }}>

        {/* Price header */}
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{formatPrice(selectedRoom.price)}</span>
            <span className="text-[14px] text-[var(--text-tertiary)]"> / night</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="star" size="sm" weight="fill" color="var(--primary-muted)" />
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">{hotel.rating}</span>
            <span className="text-[12px] text-[var(--text-tertiary)]">({hotel.reviewCount})</span>
          </div>
        </div>

        {/* Room selector */}
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] block mb-2">Room Type</label>
          <div className="space-y-2">
            {hotel.rooms.map((room) => (
              <button
                key={room.name}
                type="button"
                onClick={() => { setSelectedRoom(room); setNumRooms(minRoomsNeeded(adults + children, getRoomCapacity(room.name))); }}
                className={`w-full text-left px-3 py-2.5 border rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
                  selectedRoom.name === room.name
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border-default)] hover:border-[var(--primary)] bg-[var(--bg-subtle)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--text-primary)]">{room.name}</p>
                    <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{room.beds}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-[13px] font-bold text-[var(--text-primary)] tabular-nums">{formatPrice(room.price)}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">/ night</p>
                  </div>
                </div>
                {room.available <= 2 && (
                  <p className="text-[10px] font-semibold text-[var(--warning)] mt-1">Only {room.available} left!</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Airbnb-style date grid */}
        <div className="mb-3" ref={calRef}>
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] block mb-2">Dates</label>
          <div className="border border-[var(--border-default)] rounded-[var(--radius-sm)] overflow-hidden">
            <div className="grid grid-cols-2">
              {/* Check-in */}
              <button
                type="button"
                onClick={() => openFor("checkin")}
                className={`p-3 text-left border-r border-[var(--border-default)] transition-colors cursor-pointer ${
                  calOpen && selecting === "checkin"
                    ? "bg-[var(--primary-light)] border-b-2 border-b-[var(--primary)]"
                    : "hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Check-in</p>
                <p className={`text-[13px] mt-0.5 font-medium ${checkIn ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
                  {ciLabel}
                </p>
              </button>
              {/* Check-out */}
              <button
                type="button"
                onClick={() => openFor("checkout")}
                className={`p-3 text-left transition-colors cursor-pointer ${
                  calOpen && selecting === "checkout"
                    ? "bg-[var(--primary-light)] border-b-2 border-b-[var(--primary)]"
                    : "hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Check-out</p>
                <p className={`text-[13px] mt-0.5 font-medium ${checkOut ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
                  {coLabel}
                </p>
              </button>
            </div>
          </div>

          {/* Calendar dropdown */}
          {calOpen && (
            <div className="mt-1 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl p-4 z-50 relative" style={{ boxShadow: "var(--shadow-md)" }}>
              <p className="text-[11px] text-center text-[var(--text-tertiary)] mb-3 font-medium">
                {selecting === "checkin" ? "Select check-in date" : "Select check-out date"}
              </p>
              <CalendarGrid
                checkIn={checkIn} checkOut={checkOut} hovered={hovered}
                selecting={selecting} onHover={setHovered}
                onSelect={handleDateSelect}
                year={calYear} month={calMonth}
                onPrev={prevMonth} onNext={nextMonth}
              />
              <div className="mt-3 pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                <button type="button" onClick={clearDates}
                  className="text-[12px] text-[var(--text-tertiary)] underline cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                  Clear dates
                </button>
                {nights > 0 && (
                  <span className="text-[12px] font-semibold text-[var(--primary)]">
                    {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Guests & Rooms dropdown */}
        <div className="mb-4" ref={guestsRef}>
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] block mb-2">Guests & Rooms</label>
          <button
            type="button"
            onClick={() => setGuestsOpen(o => !o)}
            className={`w-full p-3 border rounded-[var(--radius-sm)] text-left flex items-center justify-between cursor-pointer transition-colors ${
              guestsOpen
                ? "border-[var(--primary)] ring-2 ring-[var(--primary-light)]"
                : "border-[var(--border-default)] hover:border-[var(--primary)] bg-[var(--bg-subtle)]"
            }`}
          >
            <div>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                {totalGuests} guest{totalGuests !== 1 ? "s" : ""} · {numRooms} room{numRooms !== 1 ? "s" : ""}
              </p>
            </div>
            <svg
              width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
              className={`text-[var(--text-secondary)] transition-transform ${guestsOpen ? "rotate-180" : ""}`}
            >
              <path d="M3 6L8 11L13 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {guestsOpen && (
            <div className="mt-1 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-1" style={{ boxShadow: "var(--shadow-md)" }}>
              <div className="divide-y divide-[var(--border-default)]">
                <Counter
                  label="Adults" sub="Age 13+"
                  value={adults}
                  onDec={() => {
                    const newAdults = Math.max(1, adults - 1);
                    setAdults(newAdults);
                    const needed = minRoomsNeeded(newAdults + children, getRoomCapacity(selectedRoom.name));
                    setNumRooms(r => Math.max(needed, r > needed ? r - 1 : needed));
                  }}
                  onInc={() => {
                    const newAdults = Math.min(MAX_GUESTS - children, adults + 1);
                    setAdults(newAdults);
                    setNumRooms(r => Math.max(r, minRoomsNeeded(newAdults + children, getRoomCapacity(selectedRoom.name))));
                  }}
                  disableDec={adults <= 1}
                  disableInc={adults + children >= MAX_GUESTS}
                />
                <Counter
                  label="Children" sub="Ages 2–12"
                  value={children}
                  onDec={() => {
                    const newChildren = Math.max(0, children - 1);
                    setChildren(newChildren);
                    const needed = minRoomsNeeded(adults + newChildren, getRoomCapacity(selectedRoom.name));
                    setNumRooms(r => Math.max(needed, r > needed ? r - 1 : needed));
                  }}
                  onInc={() => {
                    const newChildren = Math.min(MAX_GUESTS - adults, children + 1);
                    setChildren(newChildren);
                    setNumRooms(r => Math.max(r, minRoomsNeeded(adults + newChildren, getRoomCapacity(selectedRoom.name))));
                  }}
                  disableDec={children <= 0}
                  disableInc={adults + children >= MAX_GUESTS}
                />
                <Counter
                  label="Rooms" sub={`${getRoomCapacity(selectedRoom.name)} guests per room · auto-adjusted`}
                  value={numRooms}
                  onDec={() => {
                    const needed = minRoomsNeeded(adults + children, getRoomCapacity(selectedRoom.name));
                    setNumRooms(r => Math.max(needed, r - 1));
                  }}
                  onInc={() => setNumRooms(r => Math.min(Math.min(MAX_ROOMS, selectedRoom.available), r + 1))}
                  disableDec={numRooms <= minRoomsNeeded(adults + children, getRoomCapacity(selectedRoom.name))}
                  disableInc={numRooms >= Math.min(MAX_ROOMS, selectedRoom.available)}
                />
              </div>
              {numRooms > 1 && numRooms === minRoomsNeeded(adults + children, getRoomCapacity(selectedRoom.name)) && (
                <p className="text-[11px] text-[var(--primary)] text-center pb-2 font-medium">
                  {numRooms} rooms added — {getRoomCapacity(selectedRoom.name)} guests max per room
                </p>
              )}
              <button
                type="button"
                onClick={() => setGuestsOpen(false)}
                className="w-full text-center text-[13px] font-semibold text-[var(--primary)] py-3 cursor-pointer hover:underline"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Price breakdown */}
        <div className="mb-4 space-y-2 pt-4 border-t border-[var(--border-default)]">
          <div className="flex justify-between text-[13px]">
            <span className="text-[var(--text-secondary)]">
              {formatPrice(selectedRoom.price)} × {numRooms} room{numRooms > 1 ? "s" : ""} × {nights || 1} night{(nights || 1) !== 1 ? "s" : ""}
            </span>
            <span className="text-[var(--text-primary)] font-medium tabular-nums">{formatPrice(subtotal)}</span>
          </div>
          {nights > 0 && (
            <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-[var(--border-default)]">
              <span className="text-[var(--text-primary)]">Total</span>
              <span className="text-[var(--text-primary)] tabular-nums">{formatPrice(subtotal)}</span>
            </div>
          )}
          {!nights && (
            <p className="text-[11px] text-[var(--text-tertiary)]">Select dates to see total</p>
          )}
        </div>

        {/* CTA */}
        {checkIn && checkOut ? (
          <Link
            href={`/hotels/${hotel.slug}/checkout?room=${encodeURIComponent(selectedRoom.name)}&checkin=${checkIn.toISOString().split("T")[0]}&checkout=${checkOut.toISOString().split("T")[0]}&adults=${adults}&children=${children}&rooms=${numRooms}&guests=${adults + children}`}
            className="w-full h-[52px] bg-[var(--primary)] text-[var(--text-inverse)] text-[15px] font-semibold rounded-[var(--radius-sm)] flex items-center justify-center gap-2 hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all"
          >
            Book Now
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openFor("checkin")}
            className="w-full h-[52px] bg-[var(--primary)] text-[var(--text-inverse)] text-[15px] font-semibold rounded-[var(--radius-sm)] flex items-center justify-center gap-2 hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all cursor-pointer"
          >
            {checkIn ? "Select check-out date" : "Select dates to book"}
          </button>
        )}
        <p className="text-center text-[12px] text-[var(--text-tertiary)] mt-2">You won&apos;t be charged yet</p>

        {/* Guarantees */}
        <div className="mt-4 space-y-2 pt-4 border-t border-[var(--border-default)]">
          <p className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            Free cancellation before check-in
          </p>
          <p className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            24/7 WhatsApp support
          </p>
        </div>
      </div>
    </div>
  );
}
