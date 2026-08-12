import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Understand the purpose, scope, and limitations of the COVID-19 Tracker.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="surface rounded-[28px] p-8">
        <h1 className="text-[2.4rem] font-bold tracking-[-0.04em]">About</h1>
        <p className="mt-3 max-w-3xl text-lg text-[var(--text-secondary)]">
          COVID-19 Tracker is a public-facing dashboard built to prioritize clarity, source transparency, and crawlable country detail pages instead of a single opaque client-side chart.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="surface rounded-[28px] p-6">
          <h2 className="text-2xl font-semibold">What this product is for</h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            The app is designed for quick scanning, country comparison, and historical context. It surfaces source labels, update timing, and cadence so users can understand whether a metric is a current snapshot, long-run history, or weekly official report.
          </p>
        </article>

        <article className="surface rounded-[28px] p-6">
          <h2 className="text-2xl font-semibold">Limitations</h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            Public COVID-19 reporting is heterogeneous and subject to retrospective corrections. Snapshot totals, recoveries, and active case estimates may vary by source, and official WHO reporting cadence is weekly rather than real-time.
          </p>
        </article>
      </section>
    </div>
  );
}
