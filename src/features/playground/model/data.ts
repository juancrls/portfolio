import type { Row } from "@/features/playground/model/types";

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Ana", "Bruno", "Chen", "Dara", "Elif", "Farid", "Greta", "Hugo", "Ines", "Jonas", "Kira", "Luca", "Maya", "Nadia", "Omar", "Petra", "Quinn", "Rui", "Sena", "Tomas", "Uma", "Vero", "Wren", "Yara", "Zane"];
const LAST = ["Almeida", "Bauer", "Costa", "Duarte", "Eriksen", "Ferreira", "Gomes", "Haddad", "Ibarra", "Jensen", "Kovac", "Lima", "Moreau", "Novak", "Oliveira", "Pires", "Rossi", "Silva", "Tanaka", "Varga"];
const COUNTRIES = ["Brazil", "Portugal", "Spain", "Germany", "Netherlands", "Canada", "United States", "Japan", "Australia", "Mexico"];
const PLANS: Row["plan"][] = ["Free", "Pro", "Scale", "Enterprise"];
const STATUSES: Row["status"][] = ["active", "trialing", "churned"];
const PLAN_BASE: Record<Row["plan"], number> = { Free: 0, Pro: 29, Scale: 149, Enterprise: 900 };

export function generateRows(count: number): Row[] {
  const rand = mulberry32(0x5eed);
  const rows: Row[] = new Array(count);
  for (let i = 0; i < count; i += 1) {
    const plan = PLANS[Math.floor(rand() * PLANS.length)];
    const first = FIRST[Math.floor(rand() * FIRST.length)];
    const last = LAST[Math.floor(rand() * LAST.length)];
    const day = 1 + Math.floor(rand() * 28);
    const month = 1 + Math.floor(rand() * 12);
    rows[i] = {
      id: i + 1,
      customer: `${first} ${last}`,
      country: COUNTRIES[Math.floor(rand() * COUNTRIES.length)],
      plan,
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      mrr: Math.round(PLAN_BASE[plan] * (0.8 + rand() * 0.6)),
      createdAt: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
  }
  return rows;
}

export async function fetchRows(count: number, signal?: AbortSignal): Promise<Row[]> {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 420);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("aborted", "AbortError"));
    });
  });
  return generateRows(count);
}
