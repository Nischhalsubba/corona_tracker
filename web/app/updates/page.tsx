import type { Metadata } from "next";
import Link from "next/link";

import { getGlobalSummary, getReportingUpdates, SOURCE_ENDPOINT_GROUPS } from "@/lib/data/covid";
import { formatCompactNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Updates & Reporting Notes",
  description: "Read live reporting notes, current COVID-19 changes, and source-backed updates in the tracker.",
  alternates: { canonical: "/updates" }
};

export default async function UpdatesPage() {
  const [global, updates] = await Promise.all([getGlobalSummary(), getReportingUpdates()]);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <div className="surface rounded-[28px] p-8">
          <div className="inline-flex rounded-[14px] bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary)]">
            Live reporting notes
          </div>
          <h1 className="mt-5 text-[2.6rem] font-bold tracking-[-0.05em]">Real-time COVID-19 updates and reporting notes</h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--text-secondary)]">
            This page is generated from live public COVID-19 data so people can quickly see where current reporting changes are happening.
          </p>
        </div>

        <div className="surface rounded-[28px] p-6">
          <div className="text-sm text-[var(--text-tertiary)]">Latest global refresh</div>
          <div className="mt-3 text-[2.4rem] font-bold tracking-[-0.05em]">{formatCompactNumber(global.todayCases)} new cases</div>
          <div className="mt-2 text-base text-[var(--text-secondary)]">{formatCompactNumber(global.todayDeaths)} newly reported deaths in the current live snapshot.</div>
          <div className="mt-5 rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
            <div className="text-sm text-[var(--text-tertiary)]">Affected countries</div>
            <div className="mt-1 font-semibold">{formatCompactNumber(global.affectedCountries)}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {updates.map((update, index) => (
          <article key={update.id} className="surface rounded-[28px] p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className={`inline-flex rounded-[12px] px-3 py-2 text-xs font-semibold ${
                  update.tone === "negative"
                    ? "bg-[rgba(255,90,95,0.12)] text-[var(--negative)]"
                    : update.tone === "info"
                      ? "bg-[rgba(76,125,255,0.12)] text-[var(--info)]"
                      : "bg-[var(--primary-soft)] text-[var(--primary)]"
                }`}>
                  {index === 0 ? "Global" : "Country update"}
                </div>
                <h2 className="mt-4 text-[1.8rem] font-bold tracking-[-0.04em]">{update.title}</h2>
              </div>
              <div className="rounded-[16px] bg-[var(--surface-soft)] px-4 py-3 text-right">
                <div className="text-xs text-[var(--text-tertiary)]">{update.metricLabel}</div>
                <div className="mt-1 font-semibold">{formatCompactNumber(update.metricValue)}</div>
              </div>
            </div>

            <p className="mt-4 text-base text-[var(--text-secondary)]">{update.summary}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <div className="text-sm text-[var(--text-tertiary)]">Published</div>
                <div className="mt-1 font-semibold">{new Date(update.publishedAt).toUTCString()}</div>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <div className="text-sm text-[var(--text-tertiary)]">{update.secondaryLabel ?? "Source"}</div>
                <div className="mt-1 font-semibold">
                  {update.secondaryValue !== undefined ? formatCompactNumber(update.secondaryValue) : update.sourceMeta.label}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-[var(--text-secondary)]">Source: {update.sourceMeta.label}</div>
              <Link
                href={update.slug ? `/countries/${update.slug}` : "/"}
                className="rounded-[14px] bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)]"
              >
                {update.slug ? "Open country" : "Back to dashboard"}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="surface rounded-[28px] p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-[14px] bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)]">
              Source coverage
            </div>
            <h2 className="mt-4 text-[1.9rem] font-bold tracking-[-0.04em]">Reference feeds linked in the product</h2>
          </div>
          <Link href="/methodology" className="rounded-[14px] bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)]">
            Open methodology
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {SOURCE_ENDPOINT_GROUPS.map((group) => (
            <div key={group.id} className="soft-panel rounded-[20px] px-5 py-5">
              <div className="text-sm font-semibold text-[var(--foreground)]">{group.title}</div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{group.description}</p>
              <div className="mt-3 text-xs font-semibold text-[var(--primary)]">{group.endpoints.length} linked endpoints</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
