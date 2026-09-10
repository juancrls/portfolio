"use client";

import { useId, useState } from "react";

interface Props {
  children: React.ReactNode;
  hint: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

// Hover and keyboard focus reveal it; a tap toggles it, because touch has no
// hover and a tooltip nobody can reach is decoration.
export function Hint({ children, hint, align = "center", className = "" }: Props) {
  const id = useId();
  const [pinned, setPinned] = useState(false);

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={pinned}
        onClick={() => setPinned((open) => !open)}
        onBlur={() => setPinned(false)}
        className={`cursor-help border-b border-dotted border-rule-firm text-left transition-colors hover:border-ink ${className}`}
      >
        {children}
      </button>

      <span
        id={id}
        role="tooltip"
        className={`hint-bubble pointer-events-none absolute bottom-full z-50 mb-2 w-max max-w-[min(15rem,calc(100vw-2.5rem))] rounded-[10px] border bg-paper px-3 py-2 text-left font-sans text-[11.5px] font-normal leading-snug text-soft shadow-[var(--shadow-rest)] group-hover:block group-focus-within:block ${
          align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2"
        } ${pinned ? "block" : "hidden"}`}
      >
        {hint}
      </span>
    </span>
  );
}
