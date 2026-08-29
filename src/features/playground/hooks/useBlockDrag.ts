"use client";

import { useCallback, useRef } from "react";
import { useCanvasRegistry } from "@/features/playground/ui/CanvasContext";
import { actions, store } from "@/features/playground/model/state";
import type { BlockKind } from "@/features/playground/model/types";

const THRESHOLD = 4;
const EDGE_SLACK = 10;

// Pointer Events, not HTML5 drag: touch has no HTML5 drag, and this gives us
// the lift, the outside-the-canvas state and a keyboard path on one handle.
export function useBlockDrag(id: string, kind: BlockKind) {
  const { nodes, canvas } = useCanvasRegistry();
  const origin = useRef<{ x: number; y: number } | null>(null);
  const active = useRef(false);
  const frame = useRef(0);

  const isOutside = useCallback(
    (x: number, y: number) => {
      const el = canvas.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return (
        x < r.left - EDGE_SLACK ||
        x > r.right + EDGE_SLACK ||
        y < r.top - EDGE_SLACK ||
        y > r.bottom + EDGE_SLACK
      );
    },
    [canvas],
  );

  const reorderUnder = useCallback(
    (x: number, y: number) => {
      const blocks = store.get().blocks;
      for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index];
        if (block.id === id) continue;
        const el = nodes.get(block.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          actions.reorderTo(id, index);
          return;
        }
      }
    },
    [id, nodes],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      origin.current = { x: event.clientX, y: event.clientY };
      active.current = false;
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const start = origin.current;
      if (!start) return;

      const { clientX: x, clientY: y } = event;

      if (!active.current) {
        if (Math.hypot(x - start.x, y - start.y) < THRESHOLD) return;
        active.current = true;
        const slot = nodes.get(id)?.getBoundingClientRect();
        actions.beginDrag({
          id,
          kind,
          x,
          y,
          outside: false,
          keyboard: false,
          originIndex: store.get().blocks.findIndex((b) => b.id === id),
          w: slot?.width ?? 0,
          h: slot?.height ?? 0,
          grabX: slot ? start.x - slot.left : 0,
          grabY: slot ? start.y - slot.top : 0,
        });
      }

      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const outside = isOutside(x, y);
        actions.updateDrag({ x, y, outside });
        if (!outside) reorderUnder(x, y);
      });
    },
    [id, kind, isOutside, reorderUnder, nodes],
  );

  const finish = useCallback(
    (event: React.PointerEvent<HTMLElement>, cancelled: boolean) => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
        frame.current = 0;
      }
      const wasActive = active.current;
      origin.current = null;
      active.current = false;

      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (!wasActive) return;

      const drag = store.get().drag;
      if (drag && !cancelled && drag.outside) {
        actions.removeBlock(id);
      } else if (drag && cancelled) {
        actions.reorderTo(id, drag.originIndex);
      }
      actions.endDrag();
    },
    [id],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => finish(event, false),
    [finish],
  );

  const onPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLElement>) => finish(event, true),
    [finish],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const drag = store.get().drag;
      const held = drag?.id === id && drag.keyboard;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (held) actions.endDrag();
        else {
          actions.beginDrag({
            id,
            kind,
            x: 0,
            y: 0,
            outside: false,
            keyboard: true,
            originIndex: store.get().blocks.findIndex((b) => b.id === id),
            w: 0,
            h: 0,
            grabX: 0,
            grabY: 0,
          });
        }
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        if (held) actions.endDrag();
        actions.removeBlock(id);
        return;
      }

      if (!held) return;

      if (event.key === "Escape") {
        event.preventDefault();
        actions.reorderTo(id, drag.originIndex);
        actions.endDrag();
        return;
      }

      const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      if (back || forward) {
        event.preventDefault();
        actions.moveBlock(id, back ? -1 : 1);
      }
    },
    [id, kind],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
    style: { touchAction: "none" as const },
  };
}
