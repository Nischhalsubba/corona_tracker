export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-sm text-[var(--muted)] sm:px-6 lg:px-8">
        <p>Data is presented for informational purposes only.</p>
        <p>Reporting cadence and definitions may differ by source. Always refer to official public health authorities for guidance.</p>
      </div>
    </footer>
  );
}
