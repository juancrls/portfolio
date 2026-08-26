"use client";

import { useEffect, useRef, useState } from "react";

// Kept outside React: writing render counts into state during render would be
// the re-render storm the panel exists to measure.
const counts = new Map<string, number>();
const computeMs = new Map<string, number>();

export function countRender(id: string): void {
  counts.set(id, (counts.get(id) ?? 0) + 1);
}

export function recordCompute(id: string, ms: number): void {
  computeMs.set(id, ms);
}

export function resetInstruments(): void {
  counts.clear();
  computeMs.clear();
}

export function readInstruments(): { counts: Map<string, number>; computeMs: Map<string, number> } {
  return { counts, computeMs };
}

export function useRenderCount(id: string): void {
  countRender(id);
}

export function useFrameRate(active: boolean): number {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    if (!active) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return fps;
}

export function usePollingTick(intervalMs: number): number {
  const [tick, setTick] = useState(0);
  const saved = useRef(intervalMs);
  saved.current = intervalMs;
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), saved.current);
    return () => clearInterval(id);
  }, []);
  return tick;
}
