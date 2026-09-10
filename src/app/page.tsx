import Image from "next/image";
import Link from "next/link";
import { ABOUT, CONTACT, HERO, PROJECTS } from "@/content/profile";
import { SignatureStroke } from "@/components/SignatureStroke";
import { IconArrowRight } from "@/components/icons";
import portrait from "@/content/portrait.jpg";

export default function Home() {
  return (
    <div className="mx-auto max-w-[68rem] px-5 sm:px-8">
      <section className="settle relative pb-20 pt-14 sm:pt-24">
        <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-12">
          <div className="order-2 min-w-0 sm:order-1">
            <h1 className="display max-w-[16ch] text-[clamp(2.6rem,7.5vw,5.2rem)]">
              {HERO.headline}
            </h1>
            <SignatureStroke />
            <p className="mt-7 max-w-[46ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-[1.55] text-soft">
              {HERO.lede}
            </p>
          </div>

          <Image
            src={portrait}
            alt="Juan Costa"
            priority
            sizes="(min-width: 640px) 232px, 104px"
            className="order-1 h-[130px] w-[104px] rounded-[var(--radius-panel)] object-cover ring-1 ring-[var(--rule)] sm:order-2 sm:h-[290px] sm:w-[232px]"
          />
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/playground"
            className="group inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-[14px] font-medium text-ink shadow-[0_1px_2px_rgb(27_30_25/0.10)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--lime-edge)] hover:shadow-[0_10px_22px_-10px_rgb(27_30_25/0.45)]"
          >
            Open the playground
            <IconArrowRight
              size={15}
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </Link>
          <a
            href={`mailto:${CONTACT.email}`}
            className="rounded-full border border-rule-firm px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-sage"
          >
            Get in touch
          </a>
        </div>

        <p className="mt-10 text-[12px] text-faint">
          {HERO.stack.join("   ·   ")}
        </p>
      </section>

      <section id="work" className="scroll-mt-24 pb-8">
        <ul className="space-y-3">
          {PROJECTS.map((project) => (
            <li key={project.slug}>
              <Link
                href={project.href}
                className="group grid grid-cols-1 gap-x-8 gap-y-4 rounded-[var(--radius-panel)] bg-sage px-6 py-7 transition-colors duration-300 hover:bg-sage-deep sm:grid-cols-[minmax(0,1fr)_auto] sm:px-9 sm:py-8"
              >
                <h2 className="display min-w-0 text-[clamp(1.5rem,3vw,2.1rem)] sm:col-start-1 sm:row-start-1">
                  {project.name}
                </h2>

                <div className="sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:text-right">
                  <p className="numeral text-[clamp(2.4rem,6vw,3.6rem)] text-ink">
                    {project.metric.value}
                  </p>
                  <p className="mt-1.5 max-w-[24ch] text-[12px] leading-snug text-faint transition-colors group-hover:text-soft sm:ml-auto">
                    {project.metric.label}
                  </p>
                </div>

                <div className="mt-2 min-w-0 sm:mt-0 sm:col-start-1 sm:row-start-2">
                  <p className="max-w-[46ch] text-[14px] leading-relaxed text-soft">
                    {project.tagline}
                  </p>
                  <p className="mt-5 text-[11px] text-faint transition-colors group-hover:text-soft">
                    {project.stack.join("  ·  ")}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink sm:col-start-2 sm:row-start-3 sm:justify-end">
                  Read the case
                  <IconArrowRight
                    size={14}
                    className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="contact"
        className="-mx-5 scroll-mt-24 rounded-[var(--radius-panel)] px-5 py-14 sm:-mx-8 sm:px-8"
      >
        <div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <p className="max-w-[52ch] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.5] text-ink">
            {ABOUT}
          </p>
          <ul className="space-y-2 text-[14px] sm:text-right">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="rule-link font-medium">
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.linkedin} className="rule-link text-soft">
                linkedin.com/in/juan-fcosta
              </a>
            </li>
            <li>
              <a href={CONTACT.github} className="rule-link text-soft">
                github.com/juancrls
              </a>
            </li>
            <li className="text-[12px] text-faint">{CONTACT.location}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
