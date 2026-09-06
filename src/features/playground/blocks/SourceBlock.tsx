"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchRows } from "@/features/playground/model/data";
import { useRenderCount } from "@/features/playground/model/instrument";
import { actions, selectRowTarget, usePlayground } from "@/features/playground/model/state";

const STALE_TIME = 30_000;
const GC_TIME = 5 * 60_000;

export function SourceBlock({ id }: { id: string }) {
  useRenderCount(id);
  const rowTarget = usePlayground(selectRowTarget);
  const seen = useRef(new Set<number>());
  const [servedFromCache, setServedFromCache] = useState(false);

  const query = useQuery({
    queryKey: ["rows", rowTarget],
    queryFn: ({ signal }) => fetchRows(rowTarget, signal),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  useEffect(() => {
    if (query.status !== "success") return;
    setServedFromCache(seen.current.has(rowTarget));
    if (!seen.current.has(rowTarget)) {
      seen.current.add(rowTarget);
      actions.noteFetch();
    } else {
      actions.noteCacheHit();
    }
  }, [query.status, query.dataUpdatedAt, rowTarget]);

  useEffect(() => {
    actions.publishDataset({
      dataset: query.data ?? null,
      datasetStatus: query.status === "pending" ? "pending" : query.status,
      datasetUpdatedAt: query.dataUpdatedAt || null,
      datasetIsStale: query.isStale,
    });
  }, [query.data, query.status, query.dataUpdatedAt, query.isStale]);

  const tone =
    query.status === "success" ? "text-moss" : query.status === "error" ? "text-clay" : "text-soft";

  return (
    <div className="space-y-2.5 text-[12px]">
      <div className="flex items-center justify-between gap-2">
        <span className={`font-mono text-[11px] font-semibold ${tone}`}>
          {query.isFetching ? "fetching…" : query.status}
        </span>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="rounded border px-2 py-1 font-medium transition-colors hover:bg-bone-deep"
        >
          Refetch
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
        <Stat label="rows" value={query.data ? query.data.length.toLocaleString("en-US") : "-"} />
        <Stat label="isStale" value={String(query.isStale)} />
        <Stat label="staleTime" value={`${STALE_TIME / 1000}s`} />
        <Stat label="gcTime" value={`${GC_TIME / 60_000}m`} />
        
      </dl>

      <p className="text-[11px] text-faint">Rows are generated in the browser, not fetched.</p>

      {servedFromCache && (
        <p className="text-[11px] font-medium text-moss">Cache hit. Served without a request.</p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-dotted pb-0.5">
      <dt className="text-faint">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
