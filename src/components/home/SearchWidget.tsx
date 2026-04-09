"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "customise", label: "Customise" },
  { id: "tours", label: "Group Tours" },
  { id: "hotels", label: "Hotels" },
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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const groupSizes = [
  { label: "1-2 travelers", value: "1-2" },
  { label: "3-5 travelers", value: "3-5" },
  { label: "6-10 travelers", value: "6-10" },
  { label: "10-15 travelers", value: "10-15" },
  { label: "15+ travelers", value: "15+" },
];

type ActiveField = "destination" | "when" | "travelers" | "month" | "groupsize" | "checkin" | "checkout" | "guests" | null;

export function SearchWidget() {
  const [activeTab, setActiveTab] = useState<TabId>("customise");
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 });
  const [destSearch, setDestSearch] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDest) params.set("destination", selectedDest);
    if (selectedMonth) params.set("month", selectedMonth);
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ""}`);
    setActiveField(null);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto" ref={widgetRef}>
      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); setActiveField(null); }}
            className={cn(
              "px-5 py-2.5 text-[14px] font-semibold rounded-[var(--radius-full)] transition-all duration-200 cursor-pointer",
              activeTab === tab.id
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                : "bg-[var(--on-dark-glass-hover)] text-[var(--on-dark)] hover:bg-[var(--on-dark-glass-hover)]"
            )}
            style={activeTab === tab.id ? { boxShadow: "var(--shadow-sm)" } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div
          className="bg-[var(--bg-primary)] rounded-[var(--radius-full)] flex items-center p-1.5 sm:p-2"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
        >
          {/* ── Customise Tab ── */}
          {activeTab === "customise" && (
            <>
              <FieldButton
                label="Destination"
                value={selectedDestName || undefined}
                placeholder="Where to?"
                active={activeField === "destination"}
                onClick={() => setActiveField(activeField === "destination" ? null : "destination")}
                className="flex-[2]"
              />
              <Divider />
              <FieldButton
                label="When"
                value={selectedMonth || undefined}
                placeholder="Select month"
                active={activeField === "when"}
                onClick={() => setActiveField(activeField === "when" ? null : "when")}
                className="flex-1 hidden sm:flex"
              />
              <Divider className="hidden sm:block" />
              <FieldButton
                label="Travelers"
                value={totalTravelers > 0 ? `${totalTravelers} guest${totalTravelers > 1 ? "s" : ""}` : undefined}
                placeholder="Add guests"
                active={activeField === "travelers"}
                onClick={() => setActiveField(activeField === "travelers" ? null : "travelers")}
                className="flex-1 hidden sm:flex"
              />
            </>
          )}

          {/* ── Group Tours Tab ── */}
          {activeTab === "tours" && (
            <>
              <FieldButton
                label="Destination"
                value={selectedDestName || undefined}
                placeholder="Choose region"
                active={activeField === "destination"}
                onClick={() => setActiveField(activeField === "destination" ? null : "destination")}
                className="flex-[2]"
              />
              <Divider />
              <FieldButton
                label="Month"
                value={selectedMonth || undefined}
                placeholder="When?"
                active={activeField === "month"}
                onClick={() => setActiveField(activeField === "month" ? null : "month")}
                className="flex-1 hidden sm:flex"
              />
              <Divider className="hidden sm:block" />
              <FieldButton
                label="Group Size"
                value={totalTravelers > 0 ? `${totalTravelers} people` : undefined}
                placeholder="How many?"
                active={activeField === "groupsize"}
                onClick={() => setActiveField(activeField === "groupsize" ? null : "groupsize")}
                className="flex-1 hidden sm:flex"
              />
            </>
          )}

          {/* ── Hotels Tab ── */}
          {activeTab === "hotels" && (
            <>
              <FieldButton
                label="Location"
                value={selectedDestName || undefined}
                placeholder="City or destination"
                active={activeField === "destination"}
                onClick={() => setActiveField(activeField === "destination" ? null : "destination")}
                className="flex-[2]"
              />
              <Divider />
              <FieldButton
                label="Check-in"
                value={selectedMonth ? `${selectedMonth} 2026` : undefined}
                placeholder="Add date"
                active={activeField === "checkin"}
                onClick={() => setActiveField(activeField === "checkin" ? null : "checkin")}
                className="flex-1 hidden sm:flex"
              />
              <Divider className="hidden sm:block" />
              <FieldButton
                label="Guests"
                value={totalTravelers > 0 ? `${totalTravelers} guest${totalTravelers > 1 ? "s" : ""}` : undefined}
                placeholder="Add guests"
                active={activeField === "guests"}
                onClick={() => setActiveField(activeField === "guests" ? null : "guests")}
                className="flex-1 hidden sm:flex"
              />
            </>
          )}

          {/* Search button */}
          <button
            type="button"
            onClick={handleSearch}
            className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[var(--primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--primary-hover)] active:scale-95 transition-all duration-200 cursor-pointer ml-1"
            style={{ boxShadow: "var(--shadow-sm)" }}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* ── Dropdowns ── */}

        {/* Destination dropdown */}
        {activeField === "destination" && (
          <DropdownPanel className="left-0 w-full sm:w-[420px]">
            <div className="p-3 border-b border-[var(--border-default)]">
              <input
                type="text"
                value={destSearch}
                onChange={(e) => setDestSearch(e.target.value)}
                placeholder="Search destinations..."
                className="w-full h-10 px-4 bg-[var(--bg-subtle)] rounded-[var(--radius-sm)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                autoFocus
              />
            </div>
            <div className="max-h-[320px] overflow-y-auto py-1">
              {filteredDests.length === 0 && (
                <p className="px-4 py-6 text-center text-[14px] text-[var(--text-tertiary)]">No destinations found</p>
              )}
              {filteredDests.map((dest) => (
                <button
                  key={dest.slug}
                  type="button"
                  onClick={() => { setSelectedDest(dest.slug); setActiveField(null); setDestSearch(""); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer",
                    selectedDest === dest.slug && "bg-[var(--primary-light)]"
                  )}
                >
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

        {/* Month / When dropdown */}
        {(activeField === "when" || activeField === "month" || activeField === "checkin") && (
          <DropdownPanel className="left-1/2 -translate-x-1/2 w-[340px]">
            <p className="px-4 pt-3 pb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Select Month
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-3">
              {months.map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => { setSelectedMonth(month); setActiveField(null); }}
                  className={cn(
                    "py-2.5 px-2 text-[13px] font-medium rounded-[var(--radius-sm)] transition-all cursor-pointer text-center",
                    selectedMonth === month
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
            {selectedMonth && (
              <div className="px-4 pb-3 pt-1 border-t border-[var(--border-default)]">
                <button
                  type="button"
                  onClick={() => { setSelectedMonth(null); }}
                  className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--primary)] cursor-pointer"
                >
                  Clear selection
                </button>
              </div>
            )}
          </DropdownPanel>
        )}

        {/* Travelers / Group size / Guests dropdown */}
        {(activeField === "travelers" || activeField === "groupsize" || activeField === "guests") && (
          <DropdownPanel className="right-0 sm:right-16 w-[320px]">
            <div className="p-4 space-y-5">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">Adults</p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">Ages 13+</p>
                </div>
                <div className="flex items-center gap-3">
                  <StepperButton
                    onClick={() => setTravelers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                    disabled={travelers.adults <= 1}
                  >
                    −
                  </StepperButton>
                  <span className="w-8 text-center text-[15px] font-semibold tabular-nums">
                    {travelers.adults}
                  </span>
                  <StepperButton
                    onClick={() => setTravelers((p) => ({ ...p, adults: Math.min(20, p.adults + 1) }))}
                  >
                    +
                  </StepperButton>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">Children</p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">Ages 2-12</p>
                </div>
                <div className="flex items-center gap-3">
                  <StepperButton
                    onClick={() => setTravelers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
                    disabled={travelers.children <= 0}
                  >
                    −
                  </StepperButton>
                  <span className="w-8 text-center text-[15px] font-semibold tabular-nums">
                    {travelers.children}
                  </span>
                  <StepperButton
                    onClick={() => setTravelers((p) => ({ ...p, children: p.children + 1 }))}
                  >
                    +
                  </StepperButton>
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                <span className="text-[13px] text-[var(--text-tertiary)]">
                  {totalTravelers} traveler{totalTravelers !== 1 ? "s" : ""} total
                </span>
                <button
                  type="button"
                  onClick={() => setActiveField(null)}
                  className="text-[13px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function FieldButton({
  label,
  value,
  placeholder,
  active,
  onClick,
  className,
}: {
  label: string;
  value?: string;
  placeholder: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col px-4 sm:px-6 py-2 rounded-[var(--radius-full)] transition-colors cursor-pointer text-left",
        active ? "bg-[var(--bg-subtle)]" : "hover:bg-[var(--bg-subtle)]/60",
        className
      )}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
        {label}
      </span>
      <span
        className={cn(
          "text-[14px] truncate",
          value ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-tertiary)]"
        )}
      >
        {value || placeholder}
      </span>
    </button>
  );
}

function DropdownPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute top-full mt-3 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-default)] z-50 overflow-hidden",
        "animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      {children}
    </div>
  );
}

function StepperButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-9 h-9 border border-[var(--border-default)] rounded-full flex items-center justify-center",
        "text-[16px] font-medium text-[var(--text-secondary)] cursor-pointer",
        "hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border-default)] disabled:hover:text-[var(--text-secondary)]"
      )}
    >
      {children}
    </button>
  );
}

function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("w-px h-8 bg-[var(--border-default)]/60 shrink-0 mx-1", className)} />
  );
}
