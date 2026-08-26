import type { BlockKind } from "@/features/playground/model/types";

export interface Snippet {
  title: string;
  note: string;
  code: string;
}

export const SNIPPETS: Record<BlockKind, Snippet> = {
  source: {
    title: "Data Source",
    note: "staleTime decides when a key refetches; gcTime when it is evicted.",
    code: `const query = useQuery({
  queryKey: ["rows", rowTarget],
  queryFn: ({ signal }) => fetchRows(rowTarget, signal),
  staleTime: 30_000,   // fresh: reuse without refetching
  gcTime: 5 * 60_000,  // unused entries evicted after this
});

// The fetcher honours the AbortSignal, so switching keys mid-flight
// cancels the in-flight request instead of racing it.
export async function fetchRows(count, signal) {
  await delay(420, signal);
  return generateRows(count);
}`,
  },
  filter: {
    title: "Filter Card",
    note: "Debounce limits writes to the bus. useDeferredValue, in the table, keeps the input responsive.",
    code: `useEffect(() => {
  if (!optimized) {
    actions.setFilter({ text });
    return;
  }
  const id = setTimeout(() => actions.setFilter({ text }), 160);
  return () => clearTimeout(id);
}, [text, optimized]);`,
  },
  table: {
    title: "Data Table",
    note: "Four independent optimisations. The toolbar switch removes all four.",
    code: `// 1. Keep typing responsive while the heavy list catches up.
const deferredFilter = useDeferredValue(filter);
const activeFilter = optimized ? deferredFilter : filter;

// 2. Do not re-filter and re-sort 50k rows on unrelated renders.
//    memoKey changes every render when optimisations are off,
//    which defeats the cache on purpose.
const processed = useMemo(
  () => filterAndSort(dataset, activeFilter, sort),
  [dataset, activeFilter, sort, memoKey],
);

// 3. Render a window, not the list. Spacers preserve scroll height.
const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
const end = Math.min(total, start + Math.ceil(VIEWPORT / ROW_HEIGHT) + OVERSCAN * 2);

// 4. Identical props skip the subtree. Selecting a row updates two
//    rows, not every row on screen; onSelect is stable via useCallback.
const MemoRow = memo(RowView);`,
  },
  chart: {
    title: "Revenue Chart",
    note: "Derived state, not duplicated state. Same rows, no second request, no chart library.",
    code: `const totals = useMemo(() => {
  const sums = { Free: 0, Pro: 0, Scale: 0, Enterprise: 0 };
  for (const row of dataset ?? []) {
    if (matches(row, filter)) sums[row.plan] += row.mrr;
  }
  return sums;
}, [dataset, filter]);`,
  },
  paginator: {
    title: "Paginator",
    note: "The table consumes a page if one exists and falls back to scrolling if not.",
    code: `const paged = useMemo(() => {
  if (!hasPaginator) return processed;
  const start = page.index * page.size;
  return processed.slice(start, start + page.size);
}, [processed, hasPaginator, page.index, page.size]);`,
  },
  detail: {
    title: "Detail Panel",
    note: "Selection travels through the bus. The table and the panel never import each other.",
    code: `// registry.ts, the contract the canvas resolves on its own
table:  { provides: ["selection"], consumes: ["dataset", "filter", "page"] },
detail: { provides: [],            consumes: ["selection"] },

// No pairwise wiring anywhere
for (const capability of REGISTRY[consumer.kind].consumes) {
  const provider = blocks.find((b) =>
    REGISTRY[b.kind].provides.includes(capability),
  );
  if (provider) wires.push({ from: provider.id, to: consumer.id, capability });
}`,
  },
};

const STORE_CODE = `export function createSelectorHook<T extends object>(store: Store<T>) {
  return function useSelector<S>(selector: (s: T) => S, isEqual = Object.is): S {
    const lastState = useRef<T | null>(null);
    const lastResult = useRef<S | null>(null);

    const getSnapshot = useCallback(() => {
      const state = store.get();
      if (lastState.current === state && lastResult.current !== null) {
        return lastResult.current;          // same state, same slice
      }
      const next = selector(state);
      lastState.current = state;
      if (lastResult.current !== null && isEqual(lastResult.current, next)) {
        return lastResult.current;          // value-equal, keep identity
      }
      lastResult.current = next;
      return next;
    }, [selector, isEqual]);

    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
  };
}`;

export const PANELS: Record<BlockKind | "store", Snippet> = {
  ...SNIPPETS,
  store: {
    title: "The store",
    note: "Context re-renders every consumer when the provider value changes, so one keystroke would re-render a 50k-row table. This subscribes per slice instead.",
    code: STORE_CODE,
  },
};
