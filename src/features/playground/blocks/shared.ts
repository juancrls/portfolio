import type { FilterValue, Row } from "@/features/playground/model/types";

export type SortKey = keyof Pick<Row, "id" | "customer" | "country" | "plan" | "mrr" | "status">;
export interface Sort {
  key: SortKey;
  dir: 1 | -1;
}

export function matches(row: Row, filter: FilterValue): boolean {
  if (filter.plan !== "all" && row.plan !== filter.plan) return false;
  if (filter.status !== "all" && row.status !== filter.status) return false;
  if (filter.text) {
    const needle = filter.text.toLowerCase();
    if (
      !row.customer.toLowerCase().includes(needle) &&
      !row.country.toLowerCase().includes(needle)
    ) {
      return false;
    }
  }
  return true;
}

export function filterAndSort(rows: Row[] | null, filter: FilterValue, sort: Sort): Row[] {
  if (!rows) return [];
  const out: Row[] = [];
  for (const row of rows) if (matches(row, filter)) out.push(row);
  out.sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    if (left === right) return 0;
    return (left > right ? 1 : -1) * sort.dir;
  });
  return out;
}

export const currency = (value: number): string =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
