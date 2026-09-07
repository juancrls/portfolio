"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Canvas } from "@/features/playground/ui/Canvas";
import { CanvasProvider } from "@/features/playground/ui/CanvasContext";
import { CodePanel } from "@/features/playground/ui/CodePanel";
import { Hud } from "@/features/playground/ui/Hud";
import { Palette } from "@/features/playground/ui/Palette";
import { Toolbar } from "@/features/playground/ui/Toolbar";
import { selectDrag, usePlayground } from "@/features/playground/model/state";

export function Playground() {
  const drag = usePlayground(selectDrag);
  const lifting = drag !== null && !drag.keyboard;

  useEffect(() => {
    document.body.classList.toggle("is-dragging", lifting);
    return () => document.body.classList.remove("is-dragging");
  }, [lifting]);


  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <CanvasProvider>
        <div className="space-y-3">
          <Toolbar />
          <div className="grid gap-4 lg:grid-cols-[190px_minmax(0,1fr)_200px]">
            <div>
              <div className="lg:sticky lg:top-24">
                <Palette />
              </div>
            </div>
            <Canvas />
            <div>
              <div className="lg:sticky lg:top-24">
                <Hud />
              </div>
            </div>
          </div>
        </div>
        <CodePanel />
      </CanvasProvider>
    </QueryClientProvider>
  );
}
