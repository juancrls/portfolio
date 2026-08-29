"use client";

import { useEffect } from "react";
import { PANELS } from "@/features/playground/model/snippets";
import { actions, selectInspecting, usePlayground } from "@/features/playground/model/state";
import { IconClose } from "@/components/icons";

export function CodePanel() {
  const kind = usePlayground(selectInspecting);

  useEffect(() => {
    if (!kind) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") actions.setInspecting(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind]);

  if (!kind) return null;
  const snippet = PANELS[kind];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close code panel"
        onClick={() => actions.setInspecting(null)}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${snippet.title} source`}
        className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-auto rounded-t-2xl border bg-paper sm:rounded-2xl"
        style={{ boxShadow: "var(--shadow-rest)" }}
      >
        <header className="sticky top-0 flex items-start gap-3 border-b bg-paper px-4 py-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[14px] font-semibold tracking-tight">{snippet.title}</h2>
            <p className="mt-1 text-[12px] leading-snug text-soft">{snippet.note}</p>
          </div>
          <button
            type="button"
            onClick={() => actions.setInspecting(null)}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border text-soft transition-colors hover:bg-bone-deep hover:text-ink"
          >
            <IconClose size={15} />
          </button>
        </header>
        <pre className="overflow-x-auto bg-bone-deep px-4 py-3 font-mono text-[11.5px] leading-relaxed">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
