import type { Metadata } from "next";
import { Flow, type FlowEdge, type FlowNode } from "@/components/Flow";
import { BackLink, CaseHeader, Callout, Section, StackLine, Stats } from "@/components/case";

export const metadata: Metadata = {
  title: "Incident Dispatch",
  description:
    "A distributed case creation and dispatch system for the São Paulo military police, cutting response time on urgent incidents by 62%.",
};

const NODES: FlowNode[] = [
  { id: "intake", col: 0, row: 0, label: "Intake", sub: "call · report", tone: "external" },
  { id: "cases", col: 1, row: 0, label: "Case service", sub: "creation · triage", tone: "accent" },
  { id: "dispatch", col: 2, row: 0, label: "Dispatch", sub: "unit assignment", tone: "accent" },
  { id: "bus", col: 1, row: 1, label: "RabbitMQ", sub: "status events" },
  { id: "units", col: 2, row: 1, label: "Patrol units", sub: "live status", tone: "external" },
];

const EDGES: FlowEdge[] = [
  { from: "intake", to: "cases" },
  { from: "cases", to: "dispatch", label: "gRPC" },
  { from: "dispatch", to: "units" },
  { from: "bus", to: "cases", label: "events" },
  { from: "units", to: "bus" },
];

export default function IncidentDispatchPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <BackLink />
      <CaseHeader
        context="Polícia Militar do Estado de São Paulo · Software Engineer · 2023 to 2024"
        title="Incident Dispatch"
        lede="A distributed system for opening an incident and routing it to the right patrol unit, built to cut the time between a call coming in and a unit being on its way."
      />

      <Stats items={[{ value: "−62%", label: "response time on urgent incidents" }]} />

      <Section title="The problem">
        <p>
          Creating a case and getting a unit moving were two separate concerns held together by
          people talking to each other. Every handoff cost minutes, and on urgent incidents minutes
          are the whole product.
        </p>
      </Section>

      <Section title="Architecture">
        <p>
          Case creation and dispatch are separate services: synchronous gRPC where the caller needs
          an answer before it can continue, asynchronous events where it does not. Unit status
          flows back through the bus, so dispatch always assigns against current state rather than
          a cached guess.
        </p>
        <Flow
          nodes={NODES}
          edges={EDGES}
          caption="The shape of the system, not its service inventory. Intake feeds the case service, which calls dispatch over gRPC to assign a unit, and unit status flows back through RabbitMQ. Names here are generic: this one runs for a police force."
        />
      </Section>

      <Callout title="Resource starvation under load">
        The interesting failure was not a bug in the domain logic. Under peak traffic the internal
        processes starved each other. Threads and queues were sized for average load, not for the
        bursts this system exists to absorb. Retuning the thread and queue configuration was what
        made the throughput numbers hold, and it is the kind of problem that only shows up once
        real volume arrives.
      </Callout>

      <Section title="Also at PMESP">
        <p>
          Backend lead on a time management system for COPOM, where registering employee timesheets
          was still manual. Automating it halved processing time and removed roughly 100 hours of
          manual work a month.
        </p>
      </Section>

      <StackLine>
        .NET 8 · C# · SQL Server · gRPC · RabbitMQ · Redis · Terraform · DDD
      </StackLine>
    </article>
  );
}
