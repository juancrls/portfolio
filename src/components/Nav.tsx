"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/playground", label: "Playground" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  // The bar is opaque so content passes behind it. The hairline only appears
  // once there is something behind it to separate from.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 4);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-bone transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_var(--rule)]" : ""
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[68rem] items-center gap-3 px-5 py-4 sm:px-8"
      >
        <Link
          href="/"
          className="display border-b border-rule-firm pb-0.5 text-[15px] tracking-[-0.02em] text-ink transition-colors hover:border-ink"
        >
          Juan Costa
        </Link>
        <ul className="ml-auto flex items-center gap-1 rounded-full bg-paper p-1 ring-1 ring-[var(--rule)]">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-full px-3.5 py-1.5 text-[13px] text-soft transition-colors hover:bg-sage hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
