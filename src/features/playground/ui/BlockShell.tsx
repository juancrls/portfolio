"use client";

import { useCallback } from "react";
import { useCanvasRegistry } from "@/features/playground/ui/CanvasContext";
import { REGISTRY } from "@/features/playground/model/registry";
import { actions, selectDrag, usePlayground } from "@/features/playground/model/state";
import type { BlockKind } from "@/features/playground/model/types";
import { useBlockDrag } from "@/features/playground/hooks/useBlockDrag";
import { IconClose, IconCode, IconGrip, IconTrash } from "@/components/icons";

interface Props {
  id: string;
  kind: BlockKind;
  missing: string[];
  children: React.ReactNode;
}

const LIFT_TARGET = 300;

export function BlockShell({ id, kind, missing, children }: Props) {
  const spec = REGISTRY[kind];
  const { register } = useCanvasRegistry();
  const drag = usePlayground(selectDrag);
  const { onKeyDown, ...pointer } = useBlockDrag(id, kind);

  const ref = useCallback((element: HTMLElement | null) => register(id, element), [id, register]);

  const mine = drag?.id === id;
  const held = mine && drag.keyboard;
  const lifted = mine && !drag.keyboard;
  const leaving = lifted && drag.outside;

  const scale = lifted ? Math.max(0.3, Math.min(0.62, LIFT_TARGET / (drag.w || LIFT_TARGET))) : 1;

  return (
    <div
      ref={ref}
      data-block={id}
      className={`relative ${spec.span === 2 ? "sm:col-span-2" : ""}`}
      style={lifted ? { height: drag.h } : undefined}
    >
      {lifted && (
        <div
          aria-hidden
          className="slot-ghost absolute inset-0 rounded-[--radius-card] border-2 border-dashed"
        />
      )}

      <div
        style={
          lifted
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                width: drag.w,
                zIndex: 60,
                willChange: "transform",
                transform: `translate3d(${drag.x - drag.grabX * scale}px, ${
                  drag.y - drag.grabY * scale
                }px, 0)`,
              }
            : undefined
        }
      >
        {leaving && (
          <div className="absolute -top-9 left-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
            style={{
              background: "var(--paper)",
              borderColor: "var(--clay)",
              color: "var(--clay)",
              boxShadow: "var(--shadow-rest)",
            }}
          >
            <IconTrash size={13} /> Release to remove
          </div>
        )}

        <section
          aria-label={spec.name}
          className={`settle flex flex-col rounded-[--radius-card] border bg-paper ${
            missing.length > 0 ? "border-dashed" : ""
          } ${held ? "ring-2 ring-[var(--lime-edge)]" : ""} ${
            leaving ? "ring-2 ring-[var(--clay)]" : ""
          }`}
          style={{
            transformOrigin: "top left",
            transform: lifted ? `scale(${scale}) rotate(-1.6deg)` : "scale(1)",
            transition:
              "transform 340ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 340ms cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: lifted ? "var(--shadow-lift)" : "var(--shadow-rest)",
          }}
        >
          <header className="flex items-center gap-1.5 border-b px-2 py-2">
            <div
              {...pointer}
              className="flex min-w-0 flex-1 cursor-grab items-center gap-1.5 active:cursor-grabbing"
            >
              <button
                type="button"
                onKeyDown={onKeyDown}
                aria-label={
                  held
                    ? `${spec.name} picked up. Arrow keys to move, Enter to drop, Escape to cancel, Delete to remove.`
                    : `Move ${spec.name}. Drag, or press Enter to pick up.`
                }
                className="grid h-7 w-6 shrink-0 place-items-center rounded-md text-faint transition-colors hover:bg-bone-deep hover:text-ink"
              >
                <IconGrip size={15} />
              </button>
              <h3 className="truncate text-[13px] font-semibold tracking-tight">{spec.name}</h3>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <IconButton
                label={`Inspect ${spec.name} source`}
                onClick={() => actions.setInspecting(kind)}
              >
                <IconCode size={14} />
              </IconButton>
              <IconButton label={`Remove ${spec.name}`} onClick={() => actions.removeBlock(id)}>
                <IconClose size={14} />
              </IconButton>
            </div>
          </header>

          {missing.length > 0 && (
            <p className="border-b bg-sage px-3 py-1.5 text-[11px] text-moss">
              Unwired, nothing provides{" "}
              <span className="font-mono font-semibold">{missing.join(", ")}</span>.
            </p>
          )}

          {held && (
            <p className="border-b px-3 py-1.5 text-[11px] text-moss">
              Arrows to move · Enter to drop · Delete to remove
            </p>
          )}

          <div className="min-w-0 flex-1 p-3">{children}</div>
        </section>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-7 w-7 place-items-center rounded-md text-faint transition-colors hover:bg-bone-deep hover:text-ink"
    >
      {children}
    </button>
  );
}
