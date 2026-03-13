import type { Metadata } from "next";

import { SourceBadge } from "@/components/source-badge";
import { getSourceCatalog } from "@/lib/data/covid";

export const metadata: Metadata = {
  title: "Methodology & Data Sources",
  description: "Learn how the tracker collects live COVID-19 reporting data, refreshes the dashboard, and labels its source behavior.",
  alternates: { canonical: "/methodology" }
};

export default async function MethodologyPage() {
  const sources = await getSourceCatalog();

  return (
    <div className="space-y-6">
      <section className="surface rounded-[28px] p-8">
        <div className="inline-flex rounded-[14px] bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary)]">
          Implementation notes
        </div>
        <h1 className="mt-5 text-[2.6rem] font-bold tracking-[-0.05em]">Methodology &amp; Data Sources</h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--text-secondary)]">
          The current product is optimized around live public COVID-19 reporting. Dashboard cards, country pages, country rankings, and reporting notes are driven by free current endpoints.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {sources.map((source) => (
          <SourceBadge key={`${source.source}-${source.label}`} meta={source} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="surface rounded-[28px] p-6">
          <h2 className="text-[1.9rem] font-bold tracking-[-0.04em]">Live data strategy</h2>
          <p className="mt-4 text-base text-[var(--text-secondary)]">
            The tracker now prioritizes live disease.sh COVID-19 endpoints for global totals, country detail, rankings, and reporting notes. This keeps user-facing pages aligned around one free current source instead of mixing live and non-live content in the main experience.
          </p>
        </article>

        <article className="surface rounded-[28px] p-6">
          <h2 className="text-[1.9rem] font-bold tracking-[-0.04em]">Refresh policy</h2>
          <p className="mt-4 text-base text-[var(--text-secondary)]">
            Current requests are cached for roughly 20 minutes at the application layer. The UI still labels the actual source refresh time so visitors can see when the current snapshot was last updated.
          </p>
        </article>

        <article className="surface rounded-[28px] p-6">
          <h2 className="text-[1.9rem] font-bold tracking-[-0.04em]">Reporting notes page</h2>
          <p className="mt-4 text-base text-[var(--text-secondary)]">
            The updates page is no longer static editorial copy. It is generated from current country-level case and death deltas, so visitors see live reporting notes backed by the same free source used throughout the app.
          </p>
        </article>

        <article className="surface rounded-[28px] p-6">
          <h2 className="text-[1.9rem] font-bold tracking-[-0.04em]">Fallback behavior</h2>
          <p className="mt-4 text-base text-[var(--text-secondary)]">
            If the current source fails, the app can fall back to WHO weekly data for core resilience. That fallback is labeled clearly and should be treated as backup behavior rather than the primary live experience.
          </p>
        </article>
      </section>
    </div>
  );
}
