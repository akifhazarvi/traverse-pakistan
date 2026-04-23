"use client";

import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { NavSearchBar } from "./NavSearchBar";
import { UserMenu } from "@/components/auth/UserMenu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const showSearch = pathname !== "/";

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md"
      style={{ boxShadow: "0 1px 0 var(--border-default)" }}
    >
      <nav className="mx-auto max-w-[1400px] grid grid-cols-[1fr_auto_1fr] items-start min-h-[76px] px-5 sm:px-8 lg:px-16">
        {/* Logo — fixed height so it never moves when search expands */}
        <div className="shrink-0 h-[76px] flex items-center">
          <Link href="/">
            <Image
              src="/logo-white.png"
              alt="Traverse Pakistan"
              width={150}
              height={44}
              className="h-9 w-auto sm:h-11"
              priority
            />
          </Link>
        </div>

        {/* Search bar — col 2 of grid, auto width, naturally centered */}
        <div className="flex justify-center py-3 min-h-[76px] w-[714px]">
          {showSearch && <NavSearchBar />}
        </div>

        {/* Right CTAs — fixed height so they never move when search expands */}
        <div className="flex items-center justify-end gap-1.5 h-[76px]">
          <ThemeToggle className="hidden sm:flex" />
          <UserMenu />
          <a
            href="tel:+923216650670"
            className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-subtle)] whitespace-nowrap"
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
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--whatsapp)] text-white text-[13px] font-semibold rounded-[var(--radius-full)] hover:brightness-110 transition-all whitespace-nowrap"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Mobile hamburger */}
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
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 py-4 bg-[var(--bg-primary)] border-t border-[var(--border-default)] space-y-2">
          <a
            href="tel:+923216650670"
            className="flex items-center gap-2 px-4 py-3 text-[15px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-[var(--radius-sm)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            Call +92-321-6650670
          </a>
        </div>
      </div>
    </header>
  );
}
