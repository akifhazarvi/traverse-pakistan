"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const tabs = [
  { id: "packages", label: "Custom Tours" },
  { id: "hotels", label: "Hotels" },
  { id: "grouptours", label: "Group Tours" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const allDestinations = [
  { name: "Hunza Valley", slug: "hunza", region: "Gilgit Baltistan" },
  { name: "Skardu", slug: "skardu", region: "Gilgit Baltistan" },
  { name: "Fairy Meadows", slug: "fairy-meadows", region: "Gilgit Baltistan" },
  { name: "Ghizar & Phandar", slug: "ghizar", region: "Gilgit Baltistan" },
  { name: "Chitral & Kalash", slug: "chitral", region: "KPK" },
  { name: "Kumrat Valley", slug: "kumrat", region: "KPK" },
  { name: "Swat & Malam Jabba", slug: "swat", region: "KPK" },
  { name: "Neelam Valley", slug: "neelam-valley", region: "Azad Kashmir" },
  { name: "Makran Coast & Gwadar", slug: "makran-coast", region: "Balochistan" },
  { name: "Interior Sindh", slug: "interior-sindh", region: "Sindh" },
  { name: "Multan & Bahawalpur", slug: "multan", region: "Punjab" },
  { name: "Kaghan & Sharan", slug: "kaghan", region: "KPK" },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isInRange(d: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const t = d.getTime();
  return t > start.getTime() && t < end.getTime();
}

type ActiveField = "destination" | "when" | "travelers" | "month" | "groupsize" | "checkin" | "checkout" | "guests" | null;

// ── Calendar Panel ──────────────────────────────────────────────────────────
function CalendarPanel({
  rangeMode,
  startDate,
  endDate,
  onSelect,
}: {
  rangeMode: boolean;
  startDate: Date | null;
  endDate: Date | null;
  onSelect: (date: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovered, setHovered] = useState<Date | null>(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Quick shortcuts
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const thisWeekendStart = new Date(today);
  thisWeekendStart.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
  const thisWeekendEnd = new Date(thisWeekendStart); thisWeekendEnd.setDate(thisWeekendStart.getDate() + 1);

  const shortcuts = [
    { label: "Today", sub: today.toLocaleDateString("en-US", { month: "short", day: "numeric" }), start: today, end: null },
    { label: "Tomorrow", sub: tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" }), start: tomorrow, end: null },
    {
      label: "This weekend",
      sub: `${thisWeekendStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${thisWeekendEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      start: thisWeekendStart, end: thisWeekendEnd,
    },
  ];

  function handleShortcut(start: Date, end: Date | null) {
    onSelect(start);
    if (end) onSelect(end);
    setViewMonth(start.getMonth());
    setViewYear(start.getFullYear());
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const effectiveEnd = rangeMode && startDate && !endDate && hovered
    ? (hovered >= startDate ? hovered : startDate) : endDate;
  const effectiveStart = rangeMode && startDate && !endDate && hovered && hovered < startDate
    ? hovered : startDate;

  function isShortcutActive(s: { start: Date; end: Date | null }) {
    if (!startDate) return false;
    if (s.end) return isSameDay(startDate, s.start) && !!endDate && isSameDay(endDate, s.end);
    return isSameDay(startDate, s.start) && !endDate;
  }

  return (
    <div className="flex">
      {/* Left: Shortcuts */}
      <div className="w-[160px] shrink-0 border-r border-[var(--border-default)] p-3 space-y-2">
        {shortcuts.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => handleShortcut(s.start, s.end)}
            className={cn(
              "w-full text-left px-3 py-3 rounded-xl border transition-all cursor-pointer",
              isShortcutActive(s)
                ? "border-[var(--text-primary)] bg-[var(--bg-subtle)]"
                : "border-[var(--border-default)] hover:border-[var(--border-strong)]"
            )}
          >
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">{s.label}</p>
            <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* Right: Calendar */}
      <div className="flex-1 p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={prevMonth}
            className="w-8 h-8 rounded-full hover:bg-[var(--bg-subtle)] flex items-center justify-center transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button type="button" onClick={nextMonth}
            className="w-8 h-8 rounded-full hover:bg-[var(--bg-subtle)] flex items-center justify-center transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[12px] font-semibold text-[var(--text-tertiary)] py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="h-10" />;
            const isPast = date < today;
            const isStart = startDate ? isSameDay(date, startDate) : false;
            const isEnd = endDate ? isSameDay(date, endDate) : false;
            const inRange = isInRange(date, effectiveStart, effectiveEnd);
            const isToday = isSameDay(date, today);

            return (
              <div key={i} className="relative flex items-center justify-center h-8">
                {/* Range background strip */}
                {inRange && <div className="absolute inset-y-1 left-0 right-0 bg-[var(--bg-subtle)]" />}
                {isStart && effectiveEnd && <div className="absolute inset-y-1 left-1/2 right-0 bg-[var(--bg-subtle)]" />}
                {isEnd && effectiveStart && <div className="absolute inset-y-1 left-0 right-1/2 bg-[var(--bg-subtle)]" />}

                <button
                  type="button"
                  disabled={isPast}
                  onClick={() => !isPast && onSelect(date)}
                  onMouseEnter={() => setHovered(date)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "relative z-10 w-9 h-9 rounded-full text-[14px] font-medium transition-all cursor-pointer select-none",
                    isPast && "text-[var(--text-tertiary)] opacity-30 cursor-not-allowed",
                    !isPast && !isStart && !isEnd && "hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]",
                    isToday && !isStart && !isEnd && !isPast && "font-bold",
                    (isStart || isEnd) && "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold",
                  )}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {startDate && (
          <div className="mt-3 pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
            <button type="button" onClick={() => onSelect(new Date(0))}
              className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--primary)] underline cursor-pointer">
              Clear dates
            </button>
            {rangeMode && startDate && endDate && (
              <span className="text-[13px] text-[var(--text-tertiary)]">
                {Math.round((endDate.getTime() - startDate.getTime()) / 86400000)} nights
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stays Calendar (two months, Airbnb Stays style) ─────────────────────────
function StaysCalendarPanel({
  startDate,
  endDate,
  onSelect,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onSelect: (date: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovered, setHovered] = useState<Date | null>(null);
  const [mode, setMode] = useState<"dates" | "flexible">("dates");
  const [flexibility, setFlexibility] = useState<string>("exact");

  const secondMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const secondYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const effectiveEnd = startDate && !endDate && hovered
    ? (hovered >= startDate ? hovered : startDate) : endDate;
  const effectiveStart = startDate && !endDate && hovered && hovered < startDate
    ? hovered : startDate;

  const flexOptions = [
    { label: "Exact dates", value: "exact" },
    { label: "1 day", value: "1" },
    { label: "2 days", value: "2" },
    { label: "3 days", value: "3" },
    { label: "7 days", value: "7" },
    { label: "14 days", value: "14" },
  ];

  function renderMonth(year: number, month: number, showPrev: boolean, showNext: boolean) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          {showPrev ? (
            <button type="button" onClick={prevMonth}
              className="w-8 h-8 rounded-full hover:bg-[var(--bg-subtle)] flex items-center justify-center transition-colors cursor-pointer border border-[var(--border-default)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          ) : <div className="w-8" />}
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">{MONTH_NAMES[month]} {year}</span>
          {showNext ? (
            <button type="button" onClick={nextMonth}
              className="w-8 h-8 rounded-full hover:bg-[var(--bg-subtle)] flex items-center justify-center transition-colors cursor-pointer border border-[var(--border-default)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          ) : <div className="w-8" />}
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold text-[var(--text-tertiary)] py-0.5">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="h-10" />;
            const isPast = date < today;
            const isStart = startDate ? isSameDay(date, startDate) : false;
            const isEnd = endDate ? isSameDay(date, endDate) : false;
            const inRange = isInRange(date, effectiveStart, effectiveEnd);
            const isToday = isSameDay(date, today);

            return (
              <div key={i} className="relative flex items-center justify-center h-8">
                {inRange && <div className="absolute inset-y-1 left-0 right-0 bg-[var(--primary-light)]" />}
                {isStart && effectiveEnd && <div className="absolute inset-y-1 left-1/2 right-0 bg-[var(--primary-light)]" />}
                {isEnd && effectiveStart && <div className="absolute inset-y-1 left-0 right-1/2 bg-[var(--primary-light)]" />}
                <button
                  type="button"
                  disabled={isPast}
                  onClick={() => !isPast && onSelect(date)}
                  onMouseEnter={() => setHovered(date)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "relative z-10 w-8 h-8 rounded-full text-[13px] font-medium transition-all cursor-pointer select-none",
                    isPast && "text-[var(--text-tertiary)] opacity-30 cursor-not-allowed",
                    !isPast && !isStart && !isEnd && "hover:border hover:border-[var(--text-primary)] text-[var(--text-primary)]",
                    isToday && !isStart && !isEnd && !isPast && "font-bold underline decoration-[var(--primary)] underline-offset-2",
                    (isStart || isEnd) && "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold",
                  )}
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

  const nights = startDate && endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / 86400000) : 0;

  return (
    <div>
      {/* Dates / Flexible toggle */}
      <div className="flex justify-center pt-3 pb-3 border-b border-[var(--border-default)]">
        <div className="flex items-center bg-[var(--bg-subtle)] rounded-full p-1">
          <button type="button" onClick={() => setMode("dates")}
            className={cn(
              "px-6 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer",
              mode === "dates"
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}>
            Dates
          </button>
          <button type="button" onClick={() => setMode("flexible")}
            className={cn(
              "px-6 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer",
              mode === "flexible"
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}>
            Flexible
          </button>
        </div>
      </div>

      {/* Two-month grid */}
      <div className="flex gap-6 px-5 py-3">
        {renderMonth(viewYear, viewMonth, true, false)}
        <div className="w-px bg-[var(--border-default)] shrink-0" />
        {renderMonth(secondYear, secondMonth, false, true)}
      </div>

      {/* Flexibility pills */}
      <div className="px-5 pb-3 border-t border-[var(--border-default)] pt-3">
        <div className="flex items-center gap-2 flex-wrap">
          {flexOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFlexibility(opt.value)}
              className={cn(
                "h-9 px-4 rounded-full text-[13px] font-medium border transition-all cursor-pointer",
                flexibility === opt.value
                  ? "border-[var(--text-primary)] bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold"
                  : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-3 flex items-center justify-between">
        <button type="button"
          onClick={() => onSelect(new Date(0))}
          className="text-[13px] font-semibold text-[var(--text-primary)] underline hover:text-[var(--primary)] cursor-pointer">
          Clear dates
        </button>
        {startDate && endDate && (
          <p className="text-[13px] text-[var(--text-tertiary)]">
            {nights} night{nights !== 1 ? "s" : ""}
            {flexibility !== "exact" ? ` ± ${flexibility} day${flexibility !== "1" ? "s" : ""}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}



// ── Main SearchWidget ───────────────────────────────────────────────────────
export function SearchWidget({
  mode = "navigate",
  defaultTab = "packages",
  hideTabs = false,
  defaultActiveField = null,
  onFilter,
  onClose,
}: {
  mode?: "navigate" | "filter";
  defaultTab?: "packages" | "hotels" | "grouptours";
  hideTabs?: boolean;
  defaultActiveField?: ActiveField;
  onFilter?: (params: Record<string, string>) => void;
  onClose?: () => void;
} = {}) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [activeField, setActiveField] = useState<ActiveField>(defaultActiveField);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 });
  const [destSearch, setDestSearch] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDests = allDestinations.filter(
    (d) =>
      d.name.toLowerCase().includes(destSearch.toLowerCase()) ||
      d.region.toLowerCase().includes(destSearch.toLowerCase())
  );

  const selectedDestName = allDestinations.find((d) => d.slug === selectedDest)?.name;
  const totalTravelers = travelers.adults + travelers.children;
  const isHotels = activeTab === "hotels";

  // Format date label
  function fmtDate(d: Date | null) {
    if (!d) return undefined;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function fmtDateRange(start: Date | null, end: Date | null): string | undefined {
    if (!start) return undefined;
    const s = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!end) return s;
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${s} – ${end.getDate()}`;
    }
    return `${s} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  function handleCalendarSelect(date: Date) {
    // Clear signal
    if (date.getTime() === 0) { setStartDate(null); setEndDate(null); return; }

    if (!isHotels) {
      // Single date for tours/customise
      setStartDate(date);
      setEndDate(null);
      setActiveField(activeTab === "grouptours" ? "groupsize" : "travelers");
      return;
    }

    // Range mode for hotels
    if (!startDate || (startDate && endDate)) {
      setStartDate(date); setEndDate(null);
    } else {
      if (date < startDate) { setStartDate(date); setEndDate(null); }
      else { setEndDate(date); setActiveField("guests"); }
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDest) params.set("destination", selectedDest);
    if (startDate) params.set("checkin", startDate.toISOString().split("T")[0]);
    if (endDate) params.set("checkout", endDate.toISOString().split("T")[0]);
    if (travelers.adults !== 2 || travelers.children !== 0)
      params.set("guests", String(travelers.adults + travelers.children));

    if (mode === "filter") {
      const tabPath = activeTab === "hotels" ? "/hotels" : activeTab === "grouptours" ? "/grouptours" : "/packages";
      router.push(`${tabPath}${params.toString() ? `?${params.toString()}` : ""}`);
      onFilter?.({
        destination: selectedDest ?? "",
        checkin: startDate?.toISOString().split("T")[0] ?? "",
        checkout: endDate?.toISOString().split("T")[0] ?? "",
        guests: String(travelers.adults + travelers.children),
      });
    } else {
      const basePath = activeTab === "packages" ? "/packages" : activeTab === "hotels" ? "/hotels" : "/grouptours";
      router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
    }
    setActiveField(null);
    onClose?.();
  };

  const isCalendarField = (f: ActiveField) =>
    f === "when" || f === "month" || f === "checkin" || f === "checkout";

  return (
    <div className="w-full max-w-[900px] mx-auto" ref={widgetRef}>
      {/* Tabs */}
      {!hideTabs && <div className="flex justify-center gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setActiveField("destination"); }}
            className={cn(
              "px-5 py-2.5 text-[14px] font-semibold rounded-[var(--radius-full)] transition-all duration-200 cursor-pointer",
              activeTab === tab.id
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                : mode === "filter"
                  ? "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                  : "bg-[var(--on-dark-glass-hover)] text-[var(--on-dark)] hover:bg-[var(--on-dark-glass-hover)]"
            )}
            style={activeTab === tab.id ? { boxShadow: "var(--shadow-sm)" } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>}

      {/* Search Bar */}
      <div className="relative">
        <div
          className={cn(
            "rounded-[var(--radius-full)] flex items-center",
            mode === "filter"
              ? "bg-[var(--bg-subtle)] h-[66px] px-2"
              : "bg-[var(--bg-primary)] p-1.5 sm:p-2"
          )}
          style={mode !== "filter" ? { boxShadow: "0 8px 40px rgba(0,0,0,0.25)" } : undefined}
        >
          {/* Customise Tab */}
          {activeTab === "packages" && (
            <>
              <DestinationField value={selectedDestName} active={activeField === "destination"}
                destSearch={destSearch} onDestSearchChange={setDestSearch} className="flex-1"
                onActivate={() => setActiveField(activeField === "destination" ? null : "destination")} />
              <Divider />
              <FieldButton label="When" value={fmtDate(startDate)} placeholder="Add dates"
                active={activeField === "when"} className="flex-1"
                onClick={() => setActiveField(activeField === "when" ? null : "when")} />
              <Divider className="" />
              <div className={cn("flex items-center rounded-[var(--radius-full)] transition-colors", mode === "navigate" ? "flex-1" : "ml-1", activeField === "travelers" && "bg-[var(--bg-primary)] shadow-sm")}>
                <FieldButton label="Who"
                  value={totalTravelers > 0 ? `${totalTravelers} guest${totalTravelers > 1 ? "s" : ""}` : undefined}
                  placeholder="Add guests" active={activeField === "travelers"} className="flex-1" noActiveBg
                  onClick={() => setActiveField(activeField === "travelers" ? null : "travelers")} />
                <button type="button" onClick={handleSearch}
                  className={cn(
                    "shrink-0 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--text-inverse)] hover:bg-[var(--primary-hover)] active:scale-95 transition-all duration-200 cursor-pointer",
                    mode === "filter" ? "gap-2 px-5 py-3 h-auto" : "w-12 h-12 sm:w-14 sm:h-14"
                  )}
                  style={{ boxShadow: "var(--shadow-sm)" }} aria-label="Search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {mode === "filter" && <span className="text-[14px] font-semibold">Search</span>}
                </button>
              </div>
            </>
          )}

          {/* Group Tours Tab */}
          {activeTab === "grouptours" && (
            <>
              <DestinationField value={selectedDestName} active={activeField === "destination"}
                destSearch={destSearch} onDestSearchChange={setDestSearch} className="flex-1"
                onActivate={() => setActiveField(activeField === "destination" ? null : "destination")} />
              <Divider />
              <FieldButton label="When" value={fmtDate(startDate)} placeholder="Add dates"
                active={activeField === "month"} className="flex-1"
                onClick={() => setActiveField(activeField === "month" ? null : "month")} />
              <Divider className="" />
              <div className={cn("flex items-center rounded-[var(--radius-full)] transition-colors", mode === "navigate" ? "flex-1" : "ml-1", activeField === "groupsize" && "bg-[var(--bg-primary)] shadow-sm")}>
                <FieldButton label="Who"
                  value={totalTravelers > 0 ? `${totalTravelers} guest${totalTravelers > 1 ? "s" : ""}` : undefined}
                  placeholder="Add guests" active={activeField === "groupsize"} className="flex-1" noActiveBg
                  onClick={() => setActiveField(activeField === "groupsize" ? null : "groupsize")} />
                <button type="button" onClick={handleSearch}
                  className={cn(
                    "shrink-0 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--text-inverse)] hover:bg-[var(--primary-hover)] active:scale-95 transition-all duration-200 cursor-pointer",
                    mode === "filter" ? "gap-2 px-5 py-3 h-auto" : "w-12 h-12 sm:w-14 sm:h-14"
                  )}
                  style={{ boxShadow: "var(--shadow-sm)" }} aria-label="Search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {mode === "filter" && <span className="text-[14px] font-semibold">Search</span>}
                </button>
              </div>
            </>
          )}

          {/* Hotels Tab */}
          {activeTab === "hotels" && (
            <>
              <DestinationField value={selectedDestName} active={activeField === "destination"}
                destSearch={destSearch} onDestSearchChange={setDestSearch} className="flex-1"
                onActivate={() => setActiveField(activeField === "destination" ? null : "destination")} />
              <Divider />
              <FieldButton label="When" value={fmtDateRange(startDate, endDate)} placeholder="Add dates"
                active={activeField === "checkin" || activeField === "checkout"} className="flex-1"
                onClick={() => setActiveField(activeField === "checkin" || activeField === "checkout" ? null : "checkin")} />
              <Divider className="" />
              <div className={cn("flex items-center rounded-[var(--radius-full)] transition-colors", mode === "navigate" ? "flex-1" : "ml-1", activeField === "guests" && "bg-[var(--bg-primary)] shadow-sm")}>
                <FieldButton label="Who"
                  value={totalTravelers > 0 ? `${totalTravelers} guest${totalTravelers > 1 ? "s" : ""}` : undefined}
                  placeholder="Add guests" active={activeField === "guests"} className="flex-1" noActiveBg
                  onClick={() => setActiveField(activeField === "guests" ? null : "guests")} />
                <button type="button" onClick={handleSearch}
                  className={cn(
                    "shrink-0 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--text-inverse)] hover:bg-[var(--primary-hover)] active:scale-95 transition-all duration-200 cursor-pointer",
                    mode === "filter" ? "gap-2 px-5 py-3 h-auto" : "w-12 h-12 sm:w-14 sm:h-14"
                  )}
                  style={{ boxShadow: "var(--shadow-sm)" }} aria-label="Search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {mode === "filter" && <span className="text-[14px] font-semibold">Search</span>}
                </button>
              </div>
            </>
          )}


        </div>

        {/* Destination dropdown */}
        {activeField === "destination" && (
          <DropdownPanel className="left-0 w-full sm:w-[420px]">

            <div className="max-h-[320px] overflow-y-auto py-1">
              {filteredDests.length === 0 && (
                <p className="px-4 py-6 text-center text-[14px] text-[var(--text-tertiary)]">No destinations found</p>
              )}
              {filteredDests.map((dest) => (
                <button key={dest.slug} type="button"
                  onClick={() => { setSelectedDest(dest.slug); setDestSearch(""); setActiveField(activeTab === "hotels" ? "checkin" : activeTab === "grouptours" ? "month" : "when"); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer",
                    selectedDest === dest.slug && "bg-[var(--primary-light)]"
                  )}>
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">{dest.name}</p>
                    <p className="text-[12px] text-[var(--text-tertiary)]">{dest.region}</p>
                  </div>
                  {selectedDest === dest.slug && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </DropdownPanel>
        )}

        {/* Experiences/Tours calendar (single month + shortcuts) */}
        {isCalendarField(activeField) && !isHotels && (
          <DropdownPanel className="left-1/2 -translate-x-1/2 w-[340px] sm:w-[520px]">
            <CalendarPanel
              rangeMode={false}
              startDate={startDate}
              endDate={endDate}
              onSelect={handleCalendarSelect}
            />
          </DropdownPanel>
        )}

        {/* Stays calendar (two months, Airbnb Stays style) */}
        {isCalendarField(activeField) && isHotels && (
          <DropdownPanel className="left-1/2 -translate-x-1/2 w-[340px] sm:w-[720px]">
            <StaysCalendarPanel
              startDate={startDate}
              endDate={endDate}
              onSelect={handleCalendarSelect}
            />
          </DropdownPanel>
        )}

        {/* Travelers / Group size / Guests dropdown */}
        {(activeField === "travelers" || activeField === "groupsize" || activeField === "guests") && (
          <DropdownPanel className="right-0 sm:right-16 w-[320px]">
            <div className="p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">Adults</p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">Ages 13+</p>
                </div>
                <div className="flex items-center gap-3">
                  <StepperButton onClick={() => setTravelers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))} disabled={travelers.adults <= 1}>−</StepperButton>
                  <span className="w-8 text-center text-[15px] font-semibold tabular-nums">{travelers.adults}</span>
                  <StepperButton onClick={() => setTravelers((p) => ({ ...p, adults: Math.min(20, p.adults + 1) }))}>+</StepperButton>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">Children</p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">Ages 2-12</p>
                </div>
                <div className="flex items-center gap-3">
                  <StepperButton onClick={() => setTravelers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))} disabled={travelers.children <= 0}>−</StepperButton>
                  <span className="w-8 text-center text-[15px] font-semibold tabular-nums">{travelers.children}</span>
                  <StepperButton onClick={() => setTravelers((p) => ({ ...p, children: p.children + 1 }))}>+</StepperButton>
                </div>
              </div>
              <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                <span className="text-[13px] text-[var(--text-tertiary)]">{totalTravelers} traveler{totalTravelers !== 1 ? "s" : ""} total</span>
                <button type="button" onClick={() => setActiveField(null)}
                  className="text-[13px] font-semibold text-[var(--primary)] hover:underline cursor-pointer">Done</button>
              </div>
            </div>
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function FieldButton({ label, value, placeholder, active, onClick, className, noActiveBg }: {
  label: string; value?: string; placeholder: string; active: boolean; onClick: () => void; className?: string; noActiveBg?: boolean;
}) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        "flex flex-col px-4 sm:px-6 py-2 rounded-[var(--radius-full)] transition-colors cursor-pointer text-left",
        !noActiveBg && active ? "bg-[var(--bg-primary)] shadow-sm" : !active ? "hover:bg-[var(--bg-elevated)]/60" : "", className
      )}>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">{label}</span>
      <span className={cn("text-[14px] truncate", value ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-tertiary)]")}>
        {value || placeholder}
      </span>
    </button>
  );
}

function DropdownPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "absolute top-full mt-3 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-default)] z-50 overflow-hidden",
      "animate-in fade-in slide-in-from-top-2 duration-200", className
    )} style={{ boxShadow: "var(--shadow-lg)" }}>
      {children}
    </div>
  );
}

function StepperButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={cn(
        "w-9 h-9 border border-[var(--border-default)] rounded-full flex items-center justify-center",
        "text-[16px] font-medium text-[var(--text-secondary)] cursor-pointer",
        "hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border-default)] disabled:hover:text-[var(--text-secondary)]"
      )}>
      {children}
    </button>
  );
}

function DestinationField({ value, active, destSearch, onDestSearchChange, onActivate, className }: {
  value?: string; active: boolean; destSearch: string;
  onDestSearchChange: (v: string) => void; onActivate: () => void; className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (active) { setTimeout(() => inputRef.current?.focus(), 0); } }, [active]);
  return (
    <div
      onClick={onActivate}
      className={cn(
        "flex flex-col px-4 sm:px-6 py-2 rounded-[var(--radius-full)] transition-colors cursor-pointer text-left",
        active ? "bg-[var(--bg-primary)] shadow-sm" : "hover:bg-[var(--bg-elevated)]/60", className
      )}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Where</span>
      {active ? (
        <input
          ref={inputRef}
          type="text"
          value={destSearch}
          onChange={(e) => onDestSearchChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="Search destinations"
          className="text-[14px] text-[var(--text-primary)] bg-transparent placeholder:text-[var(--text-tertiary)] w-full min-w-0"
          style={{ outline: "none", boxShadow: "none", border: "none" }}
        />
      ) : (
        <span className={cn("text-[14px] truncate", value ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-tertiary)]")}>
          {value || "Search destinations"}
        </span>
      )}
    </div>
  );
}

function Divider({ className }: { className?: string }) {
  return <div className={cn("w-px h-8 bg-[var(--border-default)]/60 shrink-0 mx-1", className)} />;
}
