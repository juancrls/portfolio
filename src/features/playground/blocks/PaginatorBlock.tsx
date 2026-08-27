"use client";

import { useMemo } from "react";
import { useRenderCount } from "@/features/playground/model/instrument";
import {
  actions,
  selectDataset,
  selectFilter,
  selectPage,
  usePlayground,
} from "@/features/playground/model/state";
import { matches } from "@/features/playground/blocks/shared";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";

const SIZES = [25, 50, 100];

export function PaginatorBlock({ id }: { id: string }) {
  useRenderCount(id);
  const dataset = usePlayground(selectDataset);
  const filter = usePlayground(selectFilter);
  const page = usePlayground(selectPage);

  const total = useMemo(() => {
    if (!dataset) return 0;
    let count = 0;
    for (const row of dataset) if (matches(row, filter)) count += 1;
    return count;
  }, [dataset, filter]);

  const pages = Math.max(1, Math.ceil(total / page.size));
  const current = Math.min(page.index, pages - 1);

  return (
    <nav aria-label="Table pagination" className="space-y-2.5 text-[12px]">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => actions.setPage({ index: Math.max(0, current - 1) })}
          disabled={current === 0}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium transition-colors hover:bg-bone-deep disabled:opacity-40"
        >
          <IconArrowLeft size={13} /> Prev
        </button>
        <span aria-live="polite" className="font-mono text-[11px] tabular-nums text-soft">
          {current + 1} / {pages}
        </span>
        <button
          type="button"
          onClick={() => actions.setPage({ index: Math.min(pages - 1, current + 1) })}
          disabled={current >= pages - 1}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium transition-colors hover:bg-bone-deep disabled:opacity-40"
        >
          Next <IconArrowRight size={13} />
        </button>
      </div>

      <label className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-soft">Rows per page</span>
        <select
          value={page.size}
          onChange={(event) => actions.setPage({ size: Number(event.target.value), index: 0 })}
          className="rounded-md border bg-bone-deep px-2 py-1 text-[12px] outline-none focus-visible:border-ink"
        >
          {SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <p className="font-mono text-[10px] text-faint tabular-nums">
        {total.toLocaleString("en-US")} rows match
      </p>
    </nav>
  );
}
