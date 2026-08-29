"use client";

import { createContext, useContext, useMemo, useRef } from "react";

type Registry = {
  register: (id: string, element: HTMLElement | null) => void;
  nodes: Map<string, HTMLElement>;
  version: { current: number };
  canvas: { current: HTMLElement | null };
  setCanvas: (element: HTMLElement | null) => void;
};

const CanvasContext = createContext<Registry | null>(null);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const nodes = useRef(new Map<string, HTMLElement>()).current;
  const version = useRef(0);
  const canvas = useRef<HTMLElement | null>(null);

  const value = useMemo<Registry>(
    () => ({
      nodes,
      version,
      canvas,
      setCanvas(element) {
        canvas.current = element;
      },
      register(id, element) {
        if (element) nodes.set(id, element);
        else nodes.delete(id);
        version.current += 1;
      },
    }),
    [nodes],
  );

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export function useCanvasRegistry(): Registry {
  const value = useContext(CanvasContext);
  if (!value) throw new Error("useCanvasRegistry must be used inside <CanvasProvider>");
  return value;
}
