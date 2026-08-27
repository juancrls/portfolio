"use client";

import { useEffect, useRef, useState } from "react";
import { useRenderCount } from "@/features/playground/model/instrument";
import { actions, selectFilter, selectOptimized, usePlayground } from "@/features/playground/model/state";
import type { Row } from "@/features/playground/model/types";

const PLANS: (Row["plan"] | "all")[] = ["all", "Free", "Pro", "Scale", "Enterprise"];
const STATUSES: (Row["status"] | "all")[] = ["all", "active", "trialing", "churned"];
const DEBOUNCE_MS = 160;

export function FilterBlock({ id }: { id: string }) {
  useRenderCount(id);
  const optimized = usePlayground(selectOptimized);
  const filter = usePlayground(selectFilter);
  const [text, setText] = useState(filter.text);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!optimized) {
      actions.setFilter({ text });
      return;
    }
    timer.current = setTimeout(() => actions.setFilter({ text }), DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [text, optimized]);

  return (
    <div className="space-y-2.5">
      <label className="block">
        <span className="mb-1 block text-[11px] font-medium text-soft">Search</span>
        <input
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Customer or country…"
          className="w-full rounded-md border bg-bone-deep px-2.5 py-1.5 text-[12px] outline-none placeholder:text-faint focus-visible:border-ink"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <Select
          label="Plan"
          value={filter.plan}
          options={PLANS}
          onChange={(value) => actions.setFilter({ plan: value as Row["plan"] | "all" })}
        />
        <Select
          label="Status"
          value={filter.status}
          options={STATUSES}
          onChange={(value) => actions.setFilter({ status: value as Row["status"] | "all" })}
        />
      </div>

      <p className="font-mono text-[10px] text-faint">
        {optimized ? `debounce ${DEBOUNCE_MS}ms → bus` : "every keystroke → bus"}
      </p>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-soft">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border bg-bone-deep px-2 py-1.5 text-[12px] outline-none focus-visible:border-ink"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
