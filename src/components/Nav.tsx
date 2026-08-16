import Link from "next/link";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/playground", label: "Playground" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[68rem] items-center gap-3 px-5 py-4 sm:px-8"
      >
        <Link
          href="/"
          className="display text-[15px] tracking-[-0.02em] text-ink"
        >
          Juan Costa
        </Link>
        <ul className="ml-auto flex items-center gap-1 rounded-full bg-paper/80 p-1 backdrop-blur-md">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-full px-3.5 py-1.5 text-[13px] text-soft transition-colors hover:bg-sage hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
