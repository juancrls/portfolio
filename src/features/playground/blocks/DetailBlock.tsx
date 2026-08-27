"use client";

import { useRenderCount } from "@/features/playground/model/instrument";
import { selectSelection, usePlayground } from "@/features/playground/model/state";
import { currency } from "@/features/playground/blocks/shared";

export function DetailBlock({ id }: { id: string }) {
  useRenderCount(id);
  const row = usePlayground(selectSelection);

  if (!row) {
    return (
      <p className="py-4 text-center text-[12px] text-faint">
        Select a row in the table to populate this panel.
      </p>
    );
  }

  return (
    <dl className="space-y-1 font-mono text-[11px]">
      <Field label="id" value={`#${row.id}`} />
      <Field label="customer" value={row.customer} />
      <Field label="country" value={row.country} />
      <Field label="plan" value={row.plan} />
      <Field label="status" value={row.status} />
      <Field label="mrr" value={currency(row.mrr)} />
      <Field label="created" value={row.createdAt} />
    </dl>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dotted pb-1">
      <dt className="text-faint">{label}</dt>
      <dd className="truncate font-sans font-medium">{value}</dd>
    </div>
  );
}
