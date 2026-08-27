"use client";

import { useMemo } from "react";
import { useRenderCount } from "@/features/playground/model/instrument";
import { selectDataset, selectFilter, usePlayground } from "@/features/playground/model/state";
import type { Row } from "@/features/playground/model/types";
import { currency, matches } from "@/features/playground/blocks/shared";

const PLANS: Row["plan"][] = ["Free", "Pro", "Scale", "Enterprise"];

export function ChartBlock({ id }: { id: string }) {
  useRenderCount(id);
  const dataset = usePlayground(selectDataset);
  const filter = usePlayground(selectFilter);

  const totals = useMemo(() => {
    const sums: Record<string, number> = { Free: 0, Pro: 0, Scale: 0, Enterprise: 0 };
    if (dataset) {
      for (const row of dataset) if (matches(row, filter)) sums[row.plan] += row.mrr;
    }
    return sums;
  }, [dataset, filter]);

  const max = Math.max(1, ...PLANS.map((plan) => totals[plan]));

  return (
    <figure className="space-y-2">
      <figcaption className="sr-only">Monthly recurring revenue per plan</figcaption>
      <div className="space-y-1.5">
        {PLANS.map((plan) => {
          const value = totals[plan];
          const pct = (value / max) * 100;
          return (
            <div key={plan} className="grid grid-cols-[60px_1fr_auto] items-center gap-2">
              <span className="truncate text-[11px] text-soft">{plan}</span>
              <div className="h-3 overflow-hidden rounded-sm bg-bone-deep">
                <div
                  className="h-full rounded-sm transition-[width] duration-300"
                  style={{ width: `${pct}%`, background: "var(--lime-edge)" }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-faint">
                {currency(value)}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
