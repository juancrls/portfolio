"use client";

import { useEffect, useRef, useState } from "react";

const NAMES = [
  "Ana Costa",
  "Bruno Lima",
  "Chen Tanaka",
  "Dara Novak",
  "Elif Kovac",
  "Farid Haddad",
  "Greta Bauer",
  "Hugo Pires",
];

export function VueIsland() {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");

  useEffect(() => {
    let unmount: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        const { createApp, h, ref, computed, watchEffect } = await import("vue");
        if (cancelled || !host.current) return;

        const app = createApp({
          setup() {
            const query = ref("");
            const renders = ref(0);

            const results = computed(() =>
              NAMES.filter((name) => name.toLowerCase().includes(query.value.toLowerCase())),
            );

            watchEffect(() => {
              void results.value;
              renders.value += 1;
            });

            return () =>
              h("div", { class: "space-y-2" }, [
                h("input", {
                  value: query.value,
                  placeholder: "Filter names…",
                  "aria-label": "Filter names (Vue)",
                  class:
                    "w-full rounded-md border bg-bone-deep px-2.5 py-1.5 text-[12px] outline-none placeholder:text-faint",
                  onInput: (event: Event) => {
                    query.value = (event.target as HTMLInputElement).value;
                  },
                }),
                h(
                  "ul",
                  { class: "space-y-0.5 text-[12px]" },
                  results.value.slice(0, 4).map((name) => h("li", { key: name }, name)),
                ),
                h(
                  "p",
                  { class: "font-mono text-[10px] text-faint" },
                  `${results.value.length} matches · computed re-evaluated ${renders.value}x`,
                ),
              ]);
          },
        });

        app.mount(host.current);
        unmount = () => app.unmount();
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      unmount?.();
    };
  }, []);

  return (
    <div>
      <div ref={host} />
      {status === "idle" && <p className="text-[12px] text-faint">Loading Vue…</p>}
      {status === "error" && (
        <p className="text-[12px] text-clay">Vue island failed to load.</p>
      )}
    </div>
  );
}
