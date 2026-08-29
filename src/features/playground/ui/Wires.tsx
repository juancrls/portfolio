"use client";

import { useCallback, useEffect, useState } from "react";
import { useCanvasRegistry } from "@/features/playground/ui/CanvasContext";
import { roundedPath } from "@/lib/svgPath";
import { computeWires } from "@/features/playground/model/state";
import type { PlacedBlock } from "@/features/playground/model/types";

interface Path {
  key: string;
  d: string;
  label: string;
  ports: [number, number][];
  labelAt: [number, number];
}

const CORNER = 9;
const LANE_SPACING = 7;

export function Wires({
  blocks,
  container,
}: {
  blocks: PlacedBlock[];
  container: HTMLElement | null;
}) {
  const { nodes } = useCanvasRegistry();
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    if (!container) return;
    const origin = container.getBoundingClientRect();
    setSize({ width: origin.width, height: origin.height });

    const wires = computeWires(blocks);
    const next: Path[] = [];

    wires.forEach((wire, index) => {
      const fromEl = nodes.get(wire.from);
      const toEl = nodes.get(wire.to);
      if (!fromEl || !toEl || fromEl === toEl) return;

      const a = rect(fromEl, origin);
      const b = rect(toEl, origin);
      const lane = ((index % 3) - 1) * LANE_SPACING;

      const sideBySide = a.bottom > b.top + 8 && b.bottom > a.top + 8;

      let points: [number, number][];
      let labelAt: [number, number];

      if (sideBySide) {
        const rightwards = b.cx >= a.cx;
        const x1 = rightwards ? a.right : a.left;
        const x2 = rightwards ? b.left : b.right;
        const y1 = a.cy + lane;
        const y2 = b.cy + lane;
        const midX = (x1 + x2) / 2;
        points = [
          [x1, y1],
          [midX, y1],
          [midX, y2],
          [x2, y2],
        ];
        labelAt = [midX, (y1 + y2) / 2];
      } else {
        const downwards = b.cy >= a.cy;
        const y1 = downwards ? a.bottom : a.top;
        const y2 = downwards ? b.top : b.bottom;
        const x1 = a.cx + lane;
        const x2 = b.cx + lane;
        const midY = (y1 + y2) / 2 + lane;
        points = [
          [x1, y1],
          [x1, midY],
          [x2, midY],
          [x2, y2],
        ];
        labelAt = [(x1 + x2) / 2, midY];
      }

      next.push({
        key: `${wire.from}->${wire.to}:${wire.capability}`,
        d: roundedPath(points, CORNER),
        label: wire.capability,
        ports: [points[0], points[points.length - 1]],
        labelAt,
      });
    });

    setPaths(next);
  }, [blocks, container, nodes]);

  useEffect(() => {
    if (!container) return;
    const raf = requestAnimationFrame(measure);
    const timer = setTimeout(measure, 420);
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    for (const node of nodes.values()) observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [container, measure, nodes]);

  if (paths.length === 0) return null;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
      width={size.width}
      height={size.height}
    >
      {paths.map((path) => (
        <g key={path.key}>
          <path
            d={path.d}
            fill="none"
            stroke="var(--moss)"
            strokeWidth={1.5}
            strokeOpacity={0.6}
            strokeLinecap="round"
            className="wire-live"
          />
          {path.ports.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill="var(--moss)" />
          ))}
          <rect
            x={path.labelAt[0] - path.label.length * 2.6 - 4}
            y={path.labelAt[1] - 7}
            width={path.label.length * 5.2 + 8}
            height={14}
            rx={7}
            fill="var(--bone-deep)"
          />
          <text
            x={path.labelAt[0]}
            y={path.labelAt[1]}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8.5}
            fontFamily="var(--font-mono)"
            fill="var(--moss)"
            opacity={0.85}
          >
            {path.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function rect(element: HTMLElement, origin: DOMRect) {
  const r = element.getBoundingClientRect();
  const left = r.left - origin.left;
  const top = r.top - origin.top;
  return {
    left,
    top,
    right: left + r.width,
    bottom: top + r.height,
    cx: left + r.width / 2,
    cy: top + r.height / 2,
  };
}
