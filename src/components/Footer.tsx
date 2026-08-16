import { CONTACT } from "@/content/profile";

export function Footer() {
  return (
    <footer className="mx-auto max-w-[68rem] px-5 pb-10 pt-20 sm:px-8">
      <div className="flex flex-col gap-3 border-t pt-6 text-[12px] text-faint sm:flex-row sm:items-center">
        <p>Next.js, TypeScript, Tailwind. Source on GitHub.</p>
        <ul className="flex gap-5 sm:ml-auto">
          <li>
            <a href={CONTACT.github} className="rule-link">
              GitHub
            </a>
          </li>
          <li>
            <a href={CONTACT.linkedin} className="rule-link">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="/cv.pdf" className="rule-link">
              CV
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
