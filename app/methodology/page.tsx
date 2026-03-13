import type { Metadata } from "next";

import { SourceBadge } from "@/components/source-badge";
import { getSourceCatalog } from "@/lib/data/covid";

export const metadata: Metadata = {
  title: "Methodology & Data Sources",
  description:
    "Learn how this tracker collects, labels, and refreshes COVID-19 data from public sources, including update cadence and metric definitions.",
  alternates: { canonical: "/methodology" }
};

export default async function MethodologyPage() {
  const sources = await getSourceCatalog();

  return (
    <div className="space-y-8">
      <section className="surface rounded-[32px] p-8">
        <h1 className="text-4xl font-bold tracking-tight">Methodology &amp; Data Sources</h1>
        <p className="mt-3 max-w-3xl text-lg text-[var(--muted)]">
          This tracker combines public COVID-19 datasets and labels each view with source and reporting cadence.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {sources.map((source) => (
          <SourceBadge key={`${source.source}-${source.label}`} meta={source} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="surface rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold">Current snapshot</h2>
          <p className="mt-3 text-[var(--muted)]">
            Dashboard cards and country rankings prefer disease.sh for faster snapshot refreshes. If those requests fail, the app falls back to WHO weekly counts for core case and death totals.
          </p>
        </article>

        <article className="surface rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold">Historical dataset</h2>
          <p className="mt-3 text-[var(--muted)]">
            Country trend charts prefer OWID time series, with a disease.sh historical fallback when OWID is unavailable. Testing is not featured as a hero KPI because newer testing updates are not maintained consistently.
          </p>
        </article>

        <article className="surface rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold">Weekly reporting</h2>
          <p className="mt-3 text-[var(--muted)]">
            WHO data is labeled as weekly and never presented as live. When a module is powered by fallback data, the source badge makes that visible.
          </p>
        </article>

        <article className="surface rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold">Metric definitions</h2>
          <p className="mt-3 text-[var(--muted)]">
            Active cases are treated as estimated values, derived as total cases minus recoveries and deaths when the source provides the necessary fields. If a source does not provide recoveries or active counts, the UI shows that as not reported.
          </p>
        </article>
      </section>
    </div>
  );
}
