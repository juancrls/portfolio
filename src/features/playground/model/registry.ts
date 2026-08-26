import type { BlockKind, BlockSpec } from "@/features/playground/model/types";

export const REGISTRY: Record<BlockKind, BlockSpec> = {
  source: {
    kind: "source",
    name: "Data Source",
    blurb: "Fetches the dataset and publishes it.",
    provides: ["dataset"],
    consumes: [],
    proves: "TanStack Query · staleTime vs gcTime · request cancellation",
    span: 1,
  },
  filter: {
    kind: "filter",
    name: "Filter Card",
    blurb: "Text, plan and status. Publishes a filter.",
    provides: ["filter"],
    consumes: [],
    proves: "useDeferredValue · debounce · derived state",
    span: 1,
  },
  table: {
    kind: "table",
    name: "Data Table",
    blurb: "Windowed rows, sortable, row selection.",
    provides: ["selection"],
    consumes: ["dataset", "filter", "page"],
    proves: "List virtualization · useMemo · React.memo rows",
    span: 2,
  },
  chart: {
    kind: "chart",
    name: "Revenue Chart",
    blurb: "MRR per plan, derived from the same rows.",
    provides: [],
    consumes: ["dataset", "filter"],
    proves: "Derived aggregation · inline SVG · no chart library",
    span: 1,
  },
  paginator: {
    kind: "paginator",
    name: "Paginator",
    blurb: "Page size and offset for the table.",
    provides: ["page"],
    consumes: [],
    proves: "Controlled state · a11y pagination semantics",
    span: 1,
  },
  detail: {
    kind: "detail",
    name: "Detail Panel",
    blurb: "Shows whichever row is selected.",
    provides: [],
    consumes: ["selection"],
    proves: "Cross-component selection · empty states",
    span: 1,
  },
};

export const PALETTE: BlockKind[] = ["source", "filter", "table", "paginator", "chart", "detail"];

export const DEFAULT_LAYOUT: BlockKind[] = ["source", "filter", "table"];
