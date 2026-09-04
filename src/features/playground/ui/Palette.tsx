"use client";

import { PALETTE, REGISTRY } from "@/features/playground/model/registry";
import { actions, selectBlocks, usePlayground } from "@/features/playground/model/state";
import type { BlockKind } from "@/features/playground/model/types";

export function Palette() {
  const blocks = usePlayground(selectBlocks);
  const placed = new Set(blocks.map((block) => block.kind));

  return (
    <div>
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
        Components
      </h2>
      <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
        {PALETTE.map((kind) => (
          <li key={kind}>
            <Chip kind={kind} disabled={placed.has(kind)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ kind, disabled }: { kind: BlockKind; disabled: boolean }) {
  const spec = REGISTRY[kind];

  return (
    <button
      type="button"
      draggable={!disabled}
      disabled={disabled}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", kind);
        event.dataTransfer.effectAllowed = "copy";
      }}
      onClick={() => actions.addBlock(kind)}
      aria-label={
        disabled ? `${spec.name} is already on the canvas` : `Add ${spec.name} to the canvas`
      }
      className={`relative w-full rounded-lg border px-2.5 py-2 text-left transition-colors ${
        disabled
          ? "cursor-default border-transparent bg-sage"
          : "cursor-grab bg-paper hover:border-rule-firm hover:bg-sage active:cursor-grabbing"
      }`}
    >
      <span className="flex items-center gap-1.5 text-[12px] font-semibold tracking-tight">
        {spec.name}
        {disabled && (
          <span className="ml-auto shrink-0 text-[9px] font-normal uppercase tracking-wider text-soft">
            on canvas
          </span>
        )}
      </span>
      <span className="mt-0.5 block font-mono text-[9px] leading-relaxed text-faint">
        {spec.provides.length > 0 && <>out: {spec.provides.join(", ")}</>}
        {spec.provides.length > 0 && spec.consumes.length > 0 && " · "}
        {spec.consumes.length > 0 && <>in: {spec.consumes.join(", ")}</>}
      </span>
    </button>
  );
}
