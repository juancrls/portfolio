"use client";

import { createSelectorHook, Store } from "@/lib/store";
import { DEFAULT_LAYOUT, REGISTRY } from "@/features/playground/model/registry";
import type { BlockKind, FilterValue, PlacedBlock, Row } from "@/features/playground/model/types";

export type InspectTarget = BlockKind | "store";

export interface DragState {
  id: string;
  kind: BlockKind;
  x: number;
  y: number;
  outside: boolean;
  keyboard: boolean;
  originIndex: number;
  w: number;
  h: number;
  grabX: number;
  grabY: number;
}

export type DatasetStatus = "idle" | "pending" | "success" | "error";

export interface PlaygroundState {
  blocks: PlacedBlock[];
  optimized: boolean;
  rowTarget: number;
  dataset: Row[] | null;
  datasetStatus: DatasetStatus;
  datasetUpdatedAt: number | null;
  datasetIsStale: boolean;
  fetchCount: number;
  cacheHits: number;
  filter: FilterValue;
  page: { index: number; size: number };
  selection: Row | null;
  inspecting: InspectTarget | null;
  drag: DragState | null;
}

export const EMPTY_FILTER: FilterValue = { text: "", plan: "all", status: "all" };

let seq = 0;
const nextId = (kind: BlockKind) => `${kind}-${(seq += 1)}`;

const initialBlocks = (): PlacedBlock[] =>
  DEFAULT_LAYOUT.map((kind) => ({ id: nextId(kind), kind }));

export const store = new Store<PlaygroundState>({
  blocks: initialBlocks(),
  optimized: true,
  rowTarget: 5000,
  dataset: null,
  datasetStatus: "idle",
  datasetUpdatedAt: null,
  datasetIsStale: false,
  fetchCount: 0,
  cacheHits: 0,
  filter: EMPTY_FILTER,
  page: { index: 0, size: 50 },
  selection: null,
  inspecting: null,
  drag: null,
});

export const usePlayground = createSelectorHook(store);

export const actions = {
  addBlock(kind: BlockKind) {
    store.set((s) => ({ blocks: [...s.blocks, { id: nextId(kind), kind }] }));
  },
  removeBlock(id: string) {
    store.set((s) => {
      const blocks = s.blocks.filter((b) => b.id !== id);
      const removed = s.blocks.find((b) => b.id === id);
      const selection = removed?.kind === "table" ? null : s.selection;
      return { blocks, selection };
    });
  },
  moveBlock(id: string, direction: -1 | 1) {
    store.set((s) => {
      const index = s.blocks.findIndex((b) => b.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= s.blocks.length) return {};
      const blocks = [...s.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { blocks };
    });
  },
  reset() {
    seq = 0;
    store.set({
      blocks: initialBlocks(),
      filter: EMPTY_FILTER,
      selection: null,
      page: { index: 0, size: 50 },
      inspecting: null,
    });
  },
  clear() {
    store.set({ blocks: [], selection: null, inspecting: null });
  },
  setFilter(patch: Partial<FilterValue>) {
    store.set((s) => ({ filter: { ...s.filter, ...patch }, page: { ...s.page, index: 0 } }));
  },
  setPage(patch: Partial<PlaygroundState["page"]>) {
    store.set((s) => ({ page: { ...s.page, ...patch } }));
  },
  setSelection(row: Row | null) {
    store.set({ selection: row });
  },
  setOptimized(optimized: boolean) {
    store.set({ optimized });
  },
  setRowTarget(rowTarget: number) {
    store.set({ rowTarget, page: { index: 0, size: 50 }, selection: null });
  },
  setInspecting(kind: InspectTarget | null) {
    store.set({ inspecting: kind });
  },
  reorderTo(id: string, targetIndex: number) {
    store.set((s) => {
      const from = s.blocks.findIndex((b) => b.id === id);
      if (from < 0 || targetIndex < 0 || targetIndex >= s.blocks.length || from === targetIndex) {
        return {};
      }
      const blocks = [...s.blocks];
      const [moved] = blocks.splice(from, 1);
      blocks.splice(targetIndex, 0, moved);
      return { blocks };
    });
  },
  beginDrag(drag: DragState) {
    store.set({ drag });
  },
  updateDrag(patch: Partial<DragState>) {
    store.set((s) => (s.drag ? { drag: { ...s.drag, ...patch } } : {}));
  },
  endDrag() {
    store.set({ drag: null });
  },
  publishDataset(patch: Partial<Pick<PlaygroundState, "dataset" | "datasetStatus" | "datasetUpdatedAt" | "datasetIsStale">>) {
    store.set(patch);
  },
  noteFetch() {
    store.set((s) => ({ fetchCount: s.fetchCount + 1 }));
  },
  noteCacheHit() {
    store.set((s) => ({ cacheHits: s.cacheHits + 1 }));
  },
};

export const selectBlocks = (s: PlaygroundState) => s.blocks;
export const selectOptimized = (s: PlaygroundState) => s.optimized;
export const selectRowTarget = (s: PlaygroundState) => s.rowTarget;
export const selectFilter = (s: PlaygroundState) => s.filter;
export const selectPage = (s: PlaygroundState) => s.page;
export const selectSelection = (s: PlaygroundState) => s.selection;
export const selectDataset = (s: PlaygroundState) => s.dataset;
export const selectDatasetStatus = (s: PlaygroundState) => s.datasetStatus;
export const selectInspecting = (s: PlaygroundState) => s.inspecting;
export const selectDrag = (s: PlaygroundState) => s.drag;
export const selectDraggingId = (s: PlaygroundState) => s.drag?.id ?? null;
export const selectDragOutside = (s: PlaygroundState) => s.drag?.outside ?? false;

export function availableCapabilities(blocks: PlacedBlock[]): Set<string> {
  const set = new Set<string>();
  for (const block of blocks) {
    for (const capability of REGISTRY[block.kind].provides) set.add(capability);
  }
  return set;
}

export interface Wire {
  from: string;
  to: string;
  capability: string;
}

export function computeWires(blocks: PlacedBlock[]): Wire[] {
  const wires: Wire[] = [];
  for (const consumer of blocks) {
    for (const capability of REGISTRY[consumer.kind].consumes) {
      const provider = blocks.find((b) => REGISTRY[b.kind].provides.includes(capability as never));
      if (provider) wires.push({ from: provider.id, to: consumer.id, capability });
    }
  }
  return wires;
}

export const selectHasPaginator = (s: PlaygroundState) =>
  s.blocks.some((b) => b.kind === "paginator");
