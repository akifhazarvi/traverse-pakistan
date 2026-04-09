"use client";

import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

const destinations = [
  { name: "Hunza Valley", slug: "hunza", region: "Gilgit Baltistan" },
  { name: "Skardu", slug: "skardu", region: "Gilgit Baltistan" },
  { name: "Fairy Meadows", slug: "fairy-meadows", region: "Gilgit Baltistan" },
  { name: "Ghizar & Phandar", slug: "ghizar", region: "Gilgit Baltistan" },
  { name: "Chitral & Kalash", slug: "chitral", region: "KPK" },
  { name: "Kumrat Valley", slug: "kumrat", region: "KPK" },
  { name: "Neelam Valley", slug: "neelam-valley", region: "Azad Kashmir" },
  { name: "Makran Coast", slug: "makran-coast", region: "Balochistan" },
];

const navLinks = [
  { label: "Tours", href: "/tours" },
  { label: "Hotels", href: "/hotels" },
  { label: "Travel Styles", href: "/travel-styles" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md"
      style={{ boxShadow: "0 1px 0 var(--border-default)" }}
    >
      <nav className="mx-auto max-w-[1400px] flex items-center justify-between h-[68px] px-5 sm:px-8 lg:px-16">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Traverse Pakistan"
            width={150}
            height={44}
            className="h-9 w-auto sm:h-11"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {/* Destinations dropdown */}
          <div ref={destRef} className="relative">
            <button
              type="button"
              onClick={() => setDestOpen(!destOpen)}
              className={cn(
                "px-3.5 py-2 text-[14px] font-medium rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-fast)] cursor-pointer flex items-center gap-1",
                destOpen
                  ? "text-[var(--text-primary)] bg-[var(--bg-subtle)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              Destinations
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={cn("transition-transform duration-200", destOpen && "rotate-180")}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown */}
            {destOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-[360px] bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-default)] py-3 z-50"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <div className="px-4 pb-2 mb-1 border-b border-[var(--border-default)]">
                  <Link
                    href="/destinations"
                    onClick={() => setDestOpen(false)}
                    className="text-[13px] font-semibold text-[var(--primary)] hover:underline"
                  >
                    View all destinations &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.slug}
                      href={`/destinations/${dest.slug}`}
                      onClick={() => setDestOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <div>
                        <span className="text-[14px] font-medium text-[var(--text-primary)]">
                          {dest.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-tertiary)] font-medium">
                        {dest.region}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-2 text-[14px] font-medium text-[var(--text-secondary)]",
                "hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]",
                "rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-fast)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle className="hidden sm:flex" />
          <a
            href="tel:+923216650670"
            className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-subtle)]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            Call Us
          </a>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--whatsapp)] text-white text-[13px] font-semibold rounded-[var(--radius-full)] hover:brightness-110 transition-all duration-[var(--duration-fast)]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span className={cn("w-[18px] h-[1.5px] bg-[var(--text-primary)] transition-all duration-300", mobileOpen && "translate-y-[7px] rotate-45")} />
              <span className={cn("w-[18px] h-[1.5px] bg-[var(--text-primary)] transition-all duration-300", mobileOpen && "opacity-0")} />
              <span className={cn("w-[18px] h-[1.5px] bg-[var(--text-primary)] transition-all duration-300", mobileOpen && "-translate-y-[7px] -rotate-45")} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 py-3 bg-[var(--bg-primary)] border-t border-[var(--border-default)] space-y-0.5">
          {/* Destinations section */}
          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">
              Destinations
            </p>
            <div className="grid grid-cols-2 gap-1">
              {destinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                  {dest.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="h-px bg-[var(--border-default)] mx-4 my-2" />
          {/* Other links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-[15px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-[var(--radius-sm)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+923216650670"
            className="block px-4 py-3 text-[15px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-[var(--radius-sm)] transition-colors"
          >
            Call +92-321-6650670
          </a>
        </div>
      </div>
    </header>
  );
}
