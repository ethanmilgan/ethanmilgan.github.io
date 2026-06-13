"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8c1b4]/80 bg-[#fff7f1]/92 px-4 py-4 backdrop-blur-md sm:px-8 lg:px-14">
      <div className="flex min-h-11 items-center justify-between gap-5">
        <Link className="serif whitespace-nowrap text-2xl font-bold" href="/" onClick={() => setIsOpen(false)}>
          styleeditbyreena
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-[#6f5d55] sm:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link className="hover:text-[#b76a7a]" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link
            aria-label="Account"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c1b4] bg-white text-[#2b2320] hover:border-[#b76a7a] hover:text-[#b76a7a]"
            href="/account"
            title="Account"
          >
            <span className="relative h-5 w-5" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-current" />
              <span className="absolute bottom-0 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-t-full border-2 border-current border-b-0" />
            </span>
          </Link>
        </nav>

        <button
          aria-controls="mobile-site-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#d8c1b4] bg-white text-[#2b2320] transition hover:border-[#b76a7a] hover:text-[#b76a7a] sm:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
          <span className="flex h-5 w-5 flex-col justify-center gap-1.5" aria-hidden="true">
            <span className={`h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-[#2b2320]/45 transition-opacity sm:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[min(82vw,340px)] flex-col border-l border-[#d8c1b4] bg-[#fff7f1] p-5 shadow-[-24px_0_70px_rgba(43,35,32,0.22)] transition-transform duration-300 sm:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="mobile-site-menu"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="serif text-2xl font-bold">styleeditbyreena</p>
          <button
            aria-label="Close navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#d8c1b4] bg-white text-[#2b2320]"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <span className="relative h-5 w-5" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rotate-45 rounded-full bg-current" />
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
            </span>
          </button>
        </div>

        <nav className="mt-8 grid gap-3 text-base font-black text-[#2b2320]" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              className="rounded-lg border border-[#d8c1b4] bg-white px-4 py-4 hover:border-[#b76a7a] hover:text-[#b76a7a]"
              href={item.href}
              key={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="flex items-center justify-between rounded-lg border border-[#d8c1b4] bg-white px-4 py-4 hover:border-[#b76a7a] hover:text-[#b76a7a]"
            href="/account"
            onClick={() => setIsOpen(false)}
          >
            Account
            <span className="relative h-5 w-5" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-current" />
              <span className="absolute bottom-0 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-t-full border-2 border-current border-b-0" />
            </span>
          </Link>
        </nav>
      </aside>
    </header>
  );
}
