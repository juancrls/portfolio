"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Canvas } from "@/features/playground/ui/Canvas";
import { CanvasProvider } from "@/features/playground/ui/CanvasContext";
import { CodePanel } from "@/features/playground/ui/CodePanel";
import { Hud } from "@/features/playground/ui/Hud";
import { Palette } from "@/features/playground/ui/Palette";
import { Toolbar } from "@/features/playground/ui/Toolbar";

export function Playground() {
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
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Palette />
            </div>
            <Canvas />
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Hud />
            </div>
          </div>
        </div>
        <CodePanel />
      </CanvasProvider>
    </QueryClientProvider>
  );
}
