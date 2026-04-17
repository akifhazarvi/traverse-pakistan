"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchWidget } from "@/components/home/SearchWidget";

const TABS = [
  { id: "packages", label: "Custom Tours" },
  { id: "hotels", label: "Hotels" },
  { id: "grouptours", label: "Group Tours" },
] as const;

type TabId = "packages" | "hotels" | "grouptours";

function getDefaultTab(pathname: string): TabId {
  if (pathname.startsWith("/hotels")) return "hotels";
  if (pathname.startsWith("/grouptours")) return "grouptours";
  return "packages";
}

export function NavSearchBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(getDefaultTab(pathname));
  const [mounted, setMounted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(pathname !== "/");
  const ref = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setActiveTab(getDefaultTab(pathname));
    setOpen(false);
  }, [pathname]);

  // On home: observe hero search widget; when it scrolls out of view, reveal nav pill.
  useEffect(() => {
    if (!isHome) {
      setHeroVisible(false);
      return;
    }
    const hero = document.getElementById("hero-search");
    if (!hero) { setHeroVisible(false); return; }

    setHeroVisible(true);
    const io = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "-48px 0px 0px 0px" }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [isHome, pathname]);

  const merged = isHome && !heroVisible;
  const hidden = isHome && heroVisible;

  return (
    <>
      {/* Grey overlay — rendered via portal so it sits outside navbar stacking context */}
      {mounted && open && createPortal(
        <div
          className="fixed inset-0 bg-black/25 z-40 transition-opacity duration-200"
          onClick={() => setOpen(false)}
        />,
        document.body
      )}

      <div
        ref={ref}
        aria-hidden={hidden}
        className={cn(
          "relative flex justify-center items-center w-full transition-all duration-[400ms] ease-[cubic-bezier(0.2,0,0,1)]",
          hidden
            ? "opacity-0 -translate-y-2 pointer-events-none"
            : "opacity-100 translate-y-0",
          merged && "motion-safe:animate-[navSearchDrop_420ms_cubic-bezier(0.2,0,0,1)]"
        )}
      >

        {/* CLOSED: compact pill */}
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center h-12 w-full max-w-[560px] border border-[var(--border-default)] rounded-full bg-[var(--bg-primary)] hover:shadow-md transition-all duration-200 cursor-pointer pl-4 pr-1.5"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <span className="flex-1 text-left px-2">
              <span className="block text-[12px] font-semibold text-[var(--text-primary)] leading-none whitespace-nowrap">Anywhere</span>
            </span>
            <span className="shrink-0 w-px h-5 bg-[var(--border-default)]" />
            <span className="flex-1 text-center px-3">
              <span className="block text-[12px] font-semibold text-[var(--text-primary)] leading-none whitespace-nowrap">Any week</span>
            </span>
            <span className="shrink-0 w-px h-5 bg-[var(--border-default)]" />
            <span className="flex-1 text-center px-3">
              <span className="block text-[12px] text-[var(--text-tertiary)] leading-none whitespace-nowrap">Add guests</span>
            </span>
            <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[var(--primary)] ml-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
          </button>
        )}

        {/* OPEN: tabs + full search bar inline in navbar */}
        {open && (
          <div className="w-full max-w-[714px] min-h-[152px] flex flex-col justify-center">
            {/* Tab row */}
            <div className="flex justify-center gap-1 mb-3">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative px-5 py-1.5 text-[14px] font-semibold transition-colors duration-200 cursor-pointer rounded-[var(--radius-full)]",
                    activeTab === tab.id
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[var(--text-primary)] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Search bar inline — auto-opens destination dropdown */}
            <SearchWidget
              key={activeTab}
              mode="filter"
              defaultTab={activeTab}
              hideTabs
              defaultActiveField="destination"
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
