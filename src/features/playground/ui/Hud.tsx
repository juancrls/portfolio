"use client";

import { readInstruments, useFrameRate, usePollingTick } from "@/features/playground/model/instrument";
import { REGISTRY } from "@/features/playground/model/registry";
import { actions, selectBlocks, selectOptimized, usePlayground, type PlaygroundState } from "@/features/playground/model/state";

const selectCache = (s: PlaygroundState) => `${s.fetchCount}/${s.cacheHits}`;

export function Hud() {
  const blocks = usePlayground(selectBlocks);
  const optimized = usePlayground(selectOptimized);
  const cache = usePlayground(selectCache);
  const fps = useFrameRate(true);
  usePollingTick(300);

  const { counts, computeMs } = readInstruments();
  const [fetches, hits] = cache.split("/");
  const compute = Math.max(0, ...blocks.map((block) => computeMs.get(block.id) ?? 0));

  const fpsTone = fps >= 50 ? "text-moss" : fps >= 25 ? "text-clay" : "text-clay";

  return (
    <aside
      aria-label="Live performance panel"
      className="rounded-[--radius-card] border bg-paper p-3 font-mono text-[11px]"
    >
      <h2 className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-wider text-faint">
        Live metrics
      </h2>

      <div className="mb-2 flex items-baseline justify-between border-b border-dotted pb-2">
        <span className="text-faint">frame rate</span>
        <span className={`text-[15px] font-semibold tabular-nums ${fpsTone}`}>{fps} fps</span>
      </div>

      <dl className="space-y-1">
        <Line label="filter+sort" value={`${compute.toFixed(1)} ms`} />
        <Line label="requests" value={fetches} />
        <Line label="cache hits" value={hits} />
        <Line label="memoisation" value={optimized ? "on" : "off"} tone={optimized ? "ok" : "warn"} />
      </dl>

      <h3 className="mb-1 mt-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-faint">
        Renders
      </h3>
      {blocks.length === 0 ? (
        <p className="text-faint">no blocks on the canvas</p>
      ) : (
        <dl className="space-y-1">
          {blocks.map((block) => (
            <Line
              key={block.id}
              label={REGISTRY[block.kind].name.toLowerCase().replace(/\s+/g, "-")}
              value={String(counts.get(block.id) ?? 0)}
            />
          ))}
        </dl>
      )}

      <button
        type="button"
        onClick={() => actions.setInspecting("store")}
        className="mt-3 font-sans text-[10px] text-faint underline underline-offset-2 transition-colors hover:text-ink"
      >
        why not Context?
      </button>
    </aside>
  );
}

function Line({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="truncate text-faint">{label}</dt>
      <dd
        className={`tabular-nums ${
          tone === "ok" ? "text-moss" : tone === "warn" ? "text-clay" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
