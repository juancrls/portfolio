"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VueIsland } from "./VueIsland";

const NAMES = [
  "Ana Costa",
  "Bruno Lima",
  "Chen Tanaka",
  "Dara Novak",
  "Elif Kovac",
  "Farid Haddad",
  "Greta Bauer",
  "Hugo Pires",
];

const REACT_CODE = `const [query, setQuery] = useState("");

// Dependencies declared by hand. Forget one and it goes stale.
const results = useMemo(
  () => NAMES.filter((n) => n.toLowerCase().includes(query.toLowerCase())),
  [query],
);

// The whole component re-runs, then React diffs the result.`;

const VUE_CODE = `const query = ref("");

// Dependencies tracked at read time. No array to forget.
const results = computed(() =>
  NAMES.filter((n) => n.toLowerCase().includes(query.value.toLowerCase())),
);

// setup() runs once. Only effects that read the ref re-run.`;

export function FrameworkCompare() {
  const [tab, setTab] = useState<"react" | "vue">("react");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="React 19" subtitle="hooks · explicit dependencies · VDOM diff">
        <ReactFilterCard />
      </Card>

      <Card title="Vue 3" subtitle="composition API · proxy reactivity · fine-grained">
        <VueIsland />
      </Card>

      <div className="lg:col-span-2">
        <div role="tablist" aria-label="Implementation source" className="flex gap-1">
          {(["react", "vue"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                tab === key ? "bg-sage text-moss" : "text-soft hover:bg-bone-deep"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <pre className="mt-2 overflow-x-auto rounded-[--radius-card] border bg-bone-deep px-4 py-3 font-mono text-[11.5px] leading-relaxed">
          <code>{tab === "react" ? REACT_CODE : VUE_CODE}</code>
        </pre>
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[--radius-card] border bg-paper p-4">
      <h3 className="text-[13px] font-semibold tracking-tight">{title}</h3>
      <p className="mb-3 font-mono text-[10px] text-faint">{subtitle}</p>
      {children}
    </section>
  );
}

function ReactFilterCard() {
  const [query, setQuery] = useState("");
  const evaluations = useRef(0);

  const results = useMemo(() => {
    evaluations.current += 1;
    return NAMES.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const [shown, setShown] = useState(0);
  useEffect(() => setShown(evaluations.current), [results]);

  return (
    <div className="space-y-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter names…"
        aria-label="Filter names (React)"
        className="w-full rounded-md border bg-bone-deep px-2.5 py-1.5 text-[12px] outline-none placeholder:text-faint focus-visible:border-ink"
      />
      <ul className="space-y-0.5 text-[12px]">
        {results.slice(0, 4).map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <p className="font-mono text-[10px] text-faint">
        {results.length} matches · useMemo evaluated {shown}x
      </p>
    </div>
  );
}
