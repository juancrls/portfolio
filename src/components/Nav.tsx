"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/playground", label: "Playground" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const header = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  // The bar stays while it floats over empty page, and steps out of the way
  // once content would run underneath it. Scrolling back up brings it in.
  useEffect(() => {
    const element = header.current;
    if (!element) return;

    let collideAt = Number.POSITIVE_INFINITY;
    let lastY = window.scrollY;
    let frame = 0;

    const measure = () => {
      const first = document.querySelector("main h1");
      const height = element.offsetHeight;
      collideAt = first ? first.getBoundingClientRect().top + window.scrollY - height : height;
    };

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      if (y <= Math.max(collideAt, 0)) {
        setHidden(false);
        return;
      }
      // Coasting to a stop must not reveal the bar again, so tiny deltas
      // leave the current state alone.
      if (Math.abs(delta) < 4) return;
      setHidden(delta > 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  return (
    <header
      ref={header}
      className={`sticky top-0 z-40 transition-[transform,opacity] duration-300 ease-out ${
        hidden ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
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
        <ul className="ml-auto flex items-center gap-1 rounded-full bg-paper/85 p-1 shadow-[0_1px_2px_rgb(27_30_25/0.05)] ring-1 ring-[var(--rule)] backdrop-blur-md">
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
