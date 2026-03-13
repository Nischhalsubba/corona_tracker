import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/countries", label: "Countries" },
  { href: "/updates", label: "Updates" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(244,246,239,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-full border border-[var(--border)] bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
            COVID-19 Tracker
          </div>
          <p className="hidden max-w-sm text-sm text-[var(--muted)] md:block">
            Global and country-level COVID-19 reporting with source labels and reporting cadence.
          </p>
        </Link>

        <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-medium text-[var(--muted)] transition hover:bg-white hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
