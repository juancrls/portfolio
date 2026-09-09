"use client";

import { resetInstruments } from "@/features/playground/model/instrument";
import { actions, selectOptimized, selectRowTarget, usePlayground } from "@/features/playground/model/state";

const ROW_OPTIONS = [1_000, 5_000, 50_000];

export function Toolbar() {
  const optimized = usePlayground(selectOptimized);
  const rowTarget = usePlayground(selectRowTarget);
  const heavy = !optimized && rowTarget >= 50_000;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius-card)] border bg-paper px-3 py-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={optimized}
          onClick={() => {
            resetInstruments();
            actions.setOptimized(!optimized);
          }}
          className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${
            optimized ? "bg-lime" : "bg-bone-deep"
          }`}
        >
          <span
            className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-[left] duration-200 ${
              optimized ? "left-[18px]" : "left-0.5"
            }`}
          />
          <span className="sr-only">Toggle render optimisations</span>
        </button>
        <span className="text-[12px] font-medium">
          Optimisations{" "}
          <span className={`font-mono text-[11px] ${optimized ? "text-moss" : "text-clay"}`}>
            {optimized ? "on" : "off"}
          </span>
        </span>
      </div>

      <label className="flex items-center gap-2 text-[12px]">
        <span className="text-soft">Dataset</span>
        <select
          value={rowTarget}
          onChange={(event) => {
            resetInstruments();
            actions.setRowTarget(Number(event.target.value));
          }}
          className="rounded-md border bg-bone-deep px-2 py-1 text-[12px] tabular-nums outline-none focus-visible:border-ink"
        >
          {ROW_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.toLocaleString("en-US")} rows
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            resetInstruments();
            actions.reset();
          }}
          className="rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-bone-deep"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            resetInstruments();
            actions.clear();
          }}
          className="rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-bone-deep"
        >
          Clear
        </button>
      </div>

      {heavy && (
        <p role="status" className="w-full text-[11px] leading-snug text-clay">
          50k rows unoptimised re-sorts everything per keystroke. Expect a stutter, that is the point.
        </p>
      )}
    </div>
  );
}
