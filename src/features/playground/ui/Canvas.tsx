"use client";

import { useCallback, useState } from "react";
import { BlockShell } from "@/features/playground/ui/BlockShell";
import { ChartBlock } from "@/features/playground/blocks/ChartBlock";
import { DetailBlock } from "@/features/playground/blocks/DetailBlock";
import { FilterBlock } from "@/features/playground/blocks/FilterBlock";
import { PaginatorBlock } from "@/features/playground/blocks/PaginatorBlock";
import { SourceBlock } from "@/features/playground/blocks/SourceBlock";
import { TableBlock } from "@/features/playground/blocks/TableBlock";
import { useCanvasRegistry } from "@/features/playground/ui/CanvasContext";
import { END_ZONE } from "@/features/playground/hooks/useBlockDrag";
import { PALETTE, REGISTRY } from "@/features/playground/model/registry";
import {
  actions,
  availableCapabilities,
  selectBlocks,
  selectDrag,
  usePlayground,
} from "@/features/playground/model/state";
import type { BlockKind } from "@/features/playground/model/types";
import { Wires } from "@/features/playground/ui/Wires";

const RENDERERS: Record<BlockKind, (props: { id: string }) => React.ReactElement> = {
  source: SourceBlock,
  filter: FilterBlock,
  table: TableBlock,
  chart: ChartBlock,
  paginator: PaginatorBlock,
  detail: DetailBlock,
};

export function Canvas() {
  const blocks = usePlayground(selectBlocks);
  const drag = usePlayground(selectDrag);
  const { setCanvas } = useCanvasRegistry();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const available = availableCapabilities(blocks);
  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      setContainer(element);
      setCanvas(element);
    },
    [setCanvas],
  );

  const leaving = drag ? drag.outside : false;
  const holding = drag !== null && !drag.keyboard;

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const kind = event.dataTransfer.getData("text/plain") as BlockKind;
    if (PALETTE.includes(kind) && !blocks.some((block) => block.kind === kind)) {
      actions.addBlock(kind);
    }
  };

  return (
    <div
      ref={ref}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative min-h-[420px] rounded-[var(--radius-card)] border-2 border-dashed p-5 transition-colors sm:p-7 ${
        leaving
          ? "border-[var(--clay)] bg-bone-deep"
          : dragging || holding
            ? "border-rule-firm bg-sage"
            : "border-transparent bg-bone-deep"
      }`}
    >
      {blocks.length === 0 ? (
        <div className="grid min-h-[380px] place-items-center px-6 text-center">
          <div>
            <p className="text-[13px] font-medium">Canvas is empty.</p>
            <p className="mx-auto mt-1 max-w-xs text-[12px] text-soft">
              Add components from the palette, or{" "}
              <button
                type="button"
                onClick={() => actions.reset()}
                className="rule-link font-medium text-moss"
              >
                restore the default layout
              </button>
              .
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative z-10 grid grid-cols-1 items-start gap-x-8 gap-y-14 sm:grid-cols-2">
            {blocks.map((block) => {
              const Renderer = RENDERERS[block.kind];
              const spec = REGISTRY[block.kind];
              const missing = spec.consumes.filter((capability) => !available.has(capability));
              const degraded =
                spec.optionalNote !== undefined &&
                (spec.optionally ?? []).some((capability) => !available.has(capability));
              return (
                <BlockShell
                  key={block.id}
                  id={block.id}
                  kind={block.kind}
                  missing={missing}
                  note={degraded ? spec.optionalNote : undefined}
                >
                  <Renderer id={block.id} />
                </BlockShell>
              );
            })}
          </div>
          {holding && blocks.length > 1 && (
            <div
              aria-hidden
              className={`relative z-10 mt-14 grid place-items-center rounded-[var(--radius-card)] border-2 border-dashed py-10 text-[12px] transition-colors ${
                drag?.over === END_ZONE
                  ? "border-[var(--lime-edge)] bg-sage text-ink"
                  : "border-rule-firm text-soft"
              }`}
            >
              {drag?.over === END_ZONE ? "Release to place last" : "Drop here to place last"}
            </div>
          )}
          <Wires blocks={blocks} container={container} />
        </>
      )}
    </div>
  );
}
