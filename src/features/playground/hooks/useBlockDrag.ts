"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCanvasRegistry } from "@/features/playground/ui/CanvasContext";
import { actions, store } from "@/features/playground/model/state";
import type { BlockKind } from "@/features/playground/model/types";

const THRESHOLD = 4;
const EDGE_SLACK = 10;

const noop = () => {};

export const END_ZONE = "end";

// Window listeners rather than setPointerCapture: reordering moves the dragged
// card in the DOM, and Chrome drops pointer capture when that happens, which
// ended the drag mid-gesture. Window listeners are indifferent to DOM moves.
export function useBlockDrag(id: string, kind: BlockKind) {
  const { nodes, canvas } = useCanvasRegistry();
  const origin = useRef<{ x: number; y: number } | null>(null);
  const active = useRef(false);
  const frame = useRef(0);
  const detach = useRef<() => void>(noop);

  const isOutside = useCallback(
    (x: number, y: number) => {
      const element = canvas.current;
      if (!element) return false;
      const r = element.getBoundingClientRect();
      return (
        x < r.left - EDGE_SLACK ||
        x > r.right + EDGE_SLACK ||
        y < r.top - EDGE_SLACK ||
        y > r.bottom + EDGE_SLACK
      );
    },
    [canvas],
  );

  const targetUnder = useCallback(
    (x: number, y: number): string => {
      for (const block of store.get().blocks) {
        if (block.id === id) continue;
        const element = nodes.get(block.id);
        if (!element) continue;
        const r = element.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return block.id;
      }
      // Inside the canvas but over no block: the empty run below everything.
      return END_ZONE;
    },
    [id, nodes],
  );

  const stop = useCallback(() => {
    detach.current();
    detach.current = noop;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    origin.current = null;
    active.current = false;
  }, []);

  const settle = useCallback(
    (x: number, y: number, cancelled: boolean) => {
      const wasActive = active.current;
      stop();
      if (!wasActive) return;

      const drag = store.get().drag;
      if (drag && !cancelled) {
        if (isOutside(x, y)) {
          actions.removeBlock(id);
        } else if (drag.over === END_ZONE) {
          actions.reorderTo(id, store.get().blocks.length - 1);
        } else if (drag.over) {
          const index = store.get().blocks.findIndex((block) => block.id === drag.over);
          if (index >= 0) actions.reorderTo(id, index);
        }
      }
      actions.endDrag();
    },
    [id, isOutside, stop],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      // Stops the browser starting a text selection, which used to fire
      // pointercancel and abort the gesture.
      event.preventDefault();

      origin.current = { x: event.clientX, y: event.clientY };
      active.current = false;

      const onMove = (moveEvent: PointerEvent) => {
        const start = origin.current;
        if (!start) return;
        const { clientX: x, clientY: y } = moveEvent;

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
            originIndex: store.get().blocks.findIndex((block) => block.id === id),
            w: slot?.width ?? 0,
            h: slot?.height ?? 0,
            grabX: slot ? start.x - slot.left : 0,
            grabY: slot ? start.y - slot.top : 0,
            over: null,
          });
        }

        if (frame.current) return;
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          const outside = isOutside(x, y);
          actions.updateDrag({ x, y, outside, over: outside ? null : targetUnder(x, y) });
        });
      };

      const onUp = (upEvent: PointerEvent) => settle(upEvent.clientX, upEvent.clientY, false);
      const onKey = (keyEvent: KeyboardEvent) => {
        if (keyEvent.key !== "Escape") return;
        keyEvent.preventDefault();
        settle(0, 0, true);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      window.addEventListener("keydown", onKey);

      detach.current = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        window.removeEventListener("keydown", onKey);
      };
    },
    [id, kind, isOutside, nodes, targetUnder, settle],
  );

  useEffect(() => () => detach.current(), []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const drag = store.get().drag;
      const held = drag?.id === id && drag.keyboard;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (held) {
          actions.endDrag();
          return;
        }
        actions.beginDrag({
          id,
          kind,
          x: 0,
          y: 0,
          outside: false,
          keyboard: true,
          originIndex: store.get().blocks.findIndex((block) => block.id === id),
          w: 0,
          h: 0,
          grabX: 0,
          grabY: 0,
          over: null,
        });
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        if (held) actions.endDrag();
        actions.removeBlock(id);
        return;
      }

      if (!held || !drag) return;

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
    onKeyDown,
    draggable: false,
    style: { touchAction: "none" as const },
  };
}
