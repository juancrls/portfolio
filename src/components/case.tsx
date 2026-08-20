import Link from "next/link";
import { IconArrowLeft, IconExternal } from "./icons";

export function BackLink() {
  return (
    <Link
      href="/#work"
      className="group inline-flex items-center gap-1.5 text-[13px] text-soft transition-colors hover:text-ink"
    >
      <IconArrowLeft
        size={14}
        className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
      />
      All work
    </Link>
  );
}

export function CaseHeader({
  title,
  lede,
  context,
  links,
}: {
  title: string;
  lede: string;
  context: string;
  links?: { href: string; label: string }[];
}) {
  return (
    <header className="settle mt-8">
      <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)]">{title}</h1>
      <p className="mt-3 text-[13px] text-faint">{context}</p>
      <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.8vw,1.2rem)] leading-[1.55] text-soft">
        {lede}
      </p>
      {links && links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-[13px] font-medium text-ink transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              {link.label}
              <IconExternal size={14} />
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="mt-12 divide-y divide-[var(--sage-deep)] rounded-[--radius-panel] bg-sage px-6 py-2 sm:px-8">
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
          <dt className="numeral text-[clamp(2rem,5vw,3rem)] text-ink">{item.value}</dt>
          <dd className="max-w-[34ch] text-[14px] leading-snug text-soft">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="display text-[1.35rem] text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-[16px] leading-[1.65] text-soft [&_figure]:mt-7 [&_p]:max-w-[68ch]">
        {children}
      </div>
    </section>
  );
}

export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="mt-14 rounded-[--radius-panel] bg-sage px-6 py-6 sm:px-8">
      <h2 className="display text-[1.15rem] text-ink">{title}</h2>
      <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.65] text-soft">{children}</p>
    </aside>
  );
}

export function StackLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-14 border-t pt-5 text-[12px] leading-relaxed text-faint">{children}</p>
  );
}
