"use client";

import { memo, useCallback, useDeferredValue, useMemo, useRef, useState } from "react";
import { recordCompute, useRenderCount } from "@/features/playground/model/instrument";
import {
  actions,
  selectDataset,
  selectFilter,
  selectHasPaginator,
  selectOptimized,
  selectPage,
  selectSelection,
  usePlayground,
} from "@/features/playground/model/state";
import type { Row } from "@/features/playground/model/types";
import { currency, filterAndSort, type Sort, type SortKey } from "@/features/playground/blocks/shared";
import { IconCaret } from "@/components/icons";

const ROW_HEIGHT = 30;
const VIEWPORT = 300;
const OVERSCAN = 6;
// Unwindowed, a 50k-row list locks the tab. Capped so the demo stays survivable.
const UNVIRTUALIZED_CAP = 4000;

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "id", label: "#" },
  { key: "customer", label: "Customer" },
  { key: "country", label: "Country" },
  { key: "plan", label: "Plan" },
  { key: "mrr", label: "MRR", align: "right" },
];

export function TableBlock({ id }: { id: string }) {
  useRenderCount(id);

  const dataset = usePlayground(selectDataset);
  const filter = usePlayground(selectFilter);
  const page = usePlayground(selectPage);
  const optimized = usePlayground(selectOptimized);
  const selection = usePlayground(selectSelection);
  const hasPaginator = usePlayground(selectHasPaginator);

  const [sort, setSort] = useState<Sort>({ key: "id", dir: 1 });
  const [scrollTop, setScrollTop] = useState(0);

  const deferredFilter = useDeferredValue(filter);
  const activeFilter = optimized ? deferredFilter : filter;

  const renders = useRef(0);
  renders.current += 1;
  // A nonce that changes every render defeats the memo cache on purpose.
  const memoKey = optimized ? 0 : renders.current;

  const processed = useMemo(() => {
    const started = performance.now();
    const result = filterAndSort(dataset, activeFilter, sort);
    recordCompute(id, performance.now() - started);
    return result;
  }, [dataset, activeFilter, sort, memoKey, id]);

  const paged = useMemo(() => {
    if (!hasPaginator) return processed;
    const start = page.index * page.size;
    return processed.slice(start, start + page.size);
  }, [processed, hasPaginator, page.index, page.size]);

  const onSelect = useCallback((row: Row) => actions.setSelection(row), []);

  const total = paged.length;
  const startIndex = optimized ? Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN) : 0;
  const endIndex = optimized
    ? Math.min(total, startIndex + Math.ceil(VIEWPORT / ROW_HEIGHT) + OVERSCAN * 2)
    : Math.min(total, UNVIRTUALIZED_CAP);
  const visible = paged.slice(startIndex, endIndex);
  const RowComponent = optimized ? MemoRow : RowView;

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({ key, dir: current.key === key && current.dir === 1 ? -1 : 1 }));

  return (
    <div className="space-y-2">
      <div
        className="overflow-auto rounded-md border bg-bone-deep"
        style={{ height: VIEWPORT }}
        onScroll={(event) => {
          if (optimized) setScrollTop(event.currentTarget.scrollTop);
        }}
      >
        <table className="w-full border-collapse text-[12px]">
          <thead className="sticky top-0 z-10 bg-paper">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sort.key === column.key
                      ? sort.dir === 1
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={`border-b px-2 py-1.5 font-medium ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className={`inline-flex items-center gap-1 text-[11px] transition-colors hover:text-ink ${
                      sort.key === column.key ? "text-ink" : "text-soft"
                    }`}
                  >
                    {column.label}
                    {sort.key === column.key && (
                      <IconCaret size={12} dir={sort.dir === 1 ? "up" : "down"} />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {optimized && startIndex > 0 && (
              <tr aria-hidden style={{ height: startIndex * ROW_HEIGHT }} />
            )}
            {visible.map((row) => (
              <RowComponent
                key={row.id}
                row={row}
                selected={selection?.id === row.id}
                onSelect={onSelect}
              />
            ))}
            {optimized && endIndex < total && (
              <tr aria-hidden style={{ height: (total - endIndex) * ROW_HEIGHT }} />
            )}
            {total === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-2 py-8 text-center text-faint">
                  {dataset ? "No rows match the current filter." : "Waiting for a data source…"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[10px] tabular-nums text-faint">
        rendering {visible.length.toLocaleString("en-US")} of {total.toLocaleString("en-US")} rows
        {optimized
          ? " · windowed"
          : endIndex === UNVIRTUALIZED_CAP
            ? ` · unwindowed, capped at ${UNVIRTUALIZED_CAP.toLocaleString("en-US")}`
            : " · unwindowed"}
      </p>
    </div>
  );
}

interface RowProps {
  row: Row;
  selected: boolean;
  onSelect: (row: Row) => void;
}

function RowView({ row, selected, onSelect }: RowProps) {
  return (
    <tr
      onClick={() => onSelect(row)}
      aria-selected={selected}
      className={`cursor-pointer border-b border-dotted transition-colors ${
        selected ? "bg-sage" : "hover:bg-paper"
      }`}
      style={{ height: ROW_HEIGHT }}
    >
      <td className="px-2 font-mono text-[11px] tabular-nums text-faint">{row.id}</td>
      <td className="px-2">
        <button type="button" className="text-left">
          {row.customer}
        </button>
      </td>
      <td className="px-2 text-soft">{row.country}</td>
      <td className="px-2">{row.plan}</td>
      <td className="px-2 text-right font-mono tabular-nums">{currency(row.mrr)}</td>
    </tr>
  );
}

const MemoRow = memo(RowView);
