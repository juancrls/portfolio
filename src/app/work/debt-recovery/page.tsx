import type { Metadata } from "next";
import { Flow, type FlowEdge, type FlowNode } from "@/components/Flow";
import { BackLink, CaseHeader, Callout, Section, StackLine, Stats } from "@/components/case";

export const metadata: Metadata = {
  title: "Debt Recovery Platform",
  description:
    "A .NET microservices platform for contract and claims management that recovered over $22M in unpaid installments.",
};

const NODES: FlowNode[] = [
  { id: "src", col: 0, row: 0, label: "Source systems", sub: "contracts · payments", tone: "external" },
  { id: "api", col: 1, row: 0, label: "Ingestion API", sub: ".NET, REST" },
  { id: "svc", col: 2, row: 0, label: "Domain services", sub: "contracts · claims", tone: "accent" },
  { id: "bus", col: 1, row: 1, label: "Messaging", sub: "Service Bus · RabbitMQ" },
  { id: "db", col: 0, row: 1, label: "SQL Server", sub: "+ Redis cache" },
];

const EDGES: FlowEdge[] = [
  { from: "src", to: "api" },
  { from: "api", to: "svc" },
  { from: "svc", to: "bus", label: "events" },
  { from: "bus", to: "db" },
];

export default function DebtRecoveryPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <BackLink />
      <CaseHeader
        context="Framework Digital · Senior Software Engineer · 2024 to now"
        title="Debt Recovery Platform"
        lede="A .NET microservices platform for contract and claims management, built to find, track and settle unpaid installments at scale."
      />

      <Stats
        items={[
          { value: "$22M+", label: "recovered in unpaid installments" },
          { value: "hours → minutes", label: "environment setup, after Terraform" },
        ]}
      />

      <Section title="The problem">
        <p>
          What a debtor owes does not live in one place. Contracts, payments and claims sit in
          separate upstream systems, and collection only works if all of them agree on what is
          owed, by whom, and what has already been tried.
        </p>
      </Section>

      <Section title="Architecture">
        <p>
          Microservices around the contract and claims domains, integrated with the upstream
          systems and talking to each other over asynchronous messaging so a slow or unavailable
          integration degrades throughput instead of taking the platform down.
        </p>
        <Flow
          nodes={NODES}
          edges={EDGES}
          caption="The shape of the platform, not its service inventory. Source systems feed an ingestion API, the contract and claims services publish events onto Service Bus and RabbitMQ, and state lands in SQL Server behind a Redis cache. Names here are generic: the internals belong to the client."
        />
      </Section>

      <Callout title="Infrastructure as a deliverable">
        Environments were reusable Terraform modules wired into Azure DevOps pipelines, which took
        setup from hours to minutes. On a platform that integrates with this many external systems,
        the constraint is rarely writing the service. It is having somewhere consistent to run it
        while you integrate the next one.
      </Callout>

      <StackLine>
        .NET 10 · C# · SQL Server · Azure Service Bus · RabbitMQ · Redis · Terraform · Azure DevOps
        · DDD · CQRS
      </StackLine>
    </article>
  );
}
