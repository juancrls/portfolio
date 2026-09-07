import type { Metadata } from "next";
import { ProgressionChart, RuntimeDiagram, TrainingPipeline } from "@/components/diagrams";
import { BackLink, CaseHeader, Callout, Section, StackLine, Stats } from "@/components/case";

export const metadata: Metadata = {
  title: "Caligraf.ia",
  description:
    "A handwriting engine for Portuguese text, trained from open fonts, with an automated gate that decides which checkpoint ships.",
};

export default function CaligrafiaPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <BackLink />
      <CaseHeader
        context="Personal project · 2026"
        title="Caligraf.ia"
        lede="Typed Portuguese in, handwritten pen strokes out. Trained from scratch, because the weights everyone uses are research-only and cannot ship."
        links={[{ href: "https://caligrafia.app", label: "Visit caligrafia.app" }]}
      />

      <Stats
        items={[
          { value: "0.42 → 0.70", label: "legibility, four rounds" },
          { value: "21.6k", label: "synthetic stroke pairs" },
          { value: "~9s", label: "generation, CPU" },
        ]}
      />

      <Section title="Why Portuguese">
        <p>
          Handwriting models are trained and demoed on English. Portuguese carries accents (á, ã, ç,
          ê) that are one or two pixels wide, which is exactly what a naive skeletoniser throws
          away when it reduces a glyph to a stroke. Getting them to survive the data pipeline
          was most of the work.
        </p>
      </Section>

      <Section title="Pipeline">
        <p>
          Open-licence cursive fonts are thinned to a one-pixel skeleton and walked to recover a pen
          trajectory. Small components are preserved deliberately, so the accents make it into the
          training data instead of being erased by the thinning step.
        </p>
        <TrainingPipeline />
      </Section>

      <Section title="The gate">
        <p>
          Training loss kept falling while the output stayed unreadable. So the ruler is external
          and frozen: an OCR model reads back what the checkpoint wrote, and the similarity is the
          score. CI for a generative model.
        </p>
        <ProgressionChart />
      </Section>

      <Callout title="The benchmark that lied">
        A throughput probe said batch 256 was 1.9&times; faster. Real training was four times slower,
        7.1s per step against 1.7s. The probe used fixed 600-step sequences; real samples carry a
        priming prefix, reach ~950 steps, and at 256 they filled 11.4 of 12&nbsp;GB and thrashed. A
        benchmark that does not reproduce the real shape of the work will lie to you confidently.
      </Callout>

      <Section title="Runtime">
        <RuntimeDiagram />
      </Section>

      <Section title="Who built it">
        <p>
          The source is closed, it is a running product with transactions in it. If you want to
          confirm who is behind it, the privacy policy on{" "}
          <a href="https://caligrafia.app" target="_blank" rel="noreferrer" className="rule-link text-moss">
            caligrafia.app
          </a>{" "}
          carries my name and the registered company.
        </p>
      </Section>

      <StackLine>PyTorch · Python · Flask · NumPy · TrOCR · scikit-image</StackLine>
    </article>
  );
}
