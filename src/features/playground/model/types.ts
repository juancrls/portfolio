export type Capability = "dataset" | "filter" | "page" | "selection";

export type BlockKind = "source" | "filter" | "table" | "chart" | "paginator" | "detail";

export interface BlockSpec {
  kind: BlockKind;
  name: string;
  blurb: string;
  provides: Capability[];
  consumes: Capability[];
  proves: string;
  span: 1 | 2;
}

export interface PlacedBlock {
  id: string;
  kind: BlockKind;
}

export interface Row {
  id: number;
  customer: string;
  country: string;
  plan: "Free" | "Pro" | "Scale" | "Enterprise";
  status: "active" | "trialing" | "churned";
  mrr: number;
  createdAt: string;
}

export interface FilterValue {
  text: string;
  plan: Row["plan"] | "all";
  status: Row["status"] | "all";
}
