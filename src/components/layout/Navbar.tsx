"use client";

import { cn } from "@/lib/utils";
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
        <div className="flex justify-center py-3 min-h-[76px] w-[850px]">
          {showSearch && <NavSearchBar />}
        </div>

        {/* Right CTAs — fixed height so they never move when search expands */}
        <div className="flex items-center justify-end gap-1.5 h-[76px]">
          <ThemeToggle className="hidden sm:flex" />
          <UserMenu />

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
        <div className="px-5 py-4 bg-[var(--bg-primary)] border-t border-[var(--border-default)] flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
