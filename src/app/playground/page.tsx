import type { Metadata } from "next";
import { BackLink } from "@/components/case";
import { FrameworkCompare } from "@/components/FrameworkCompare";
import { Playground } from "@/features/playground";

export const metadata: Metadata = {
  title: "Component Playground",
  description:
    "A live sandbox where React components discover each other through a declared contract, measured as you use it.",
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <header>
        <BackLink />
        <h1 className="display mt-5 text-[clamp(2.2rem,6vw,3.6rem)]">
          Components that wire themselves.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-soft">
          Each block declares what it needs. Drop it in and the canvas connects it.
        </p>
        <p className="mt-5 inline-block rounded-lg border bg-paper px-3 py-2 text-[13px]">
          <span className="text-faint">Try this:</span> type in the filter, then switch{" "}
          <strong className="font-medium">Optimisations off</strong>.
        </p>
      </header>

      <div className="mt-8">
        <Playground />
      </div>

      <section className="mt-20 border-t pt-10">
        <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Same widget, React and Vue
        </h2>
        <FrameworkCompare />
      </section>
    </div>
  );
}
