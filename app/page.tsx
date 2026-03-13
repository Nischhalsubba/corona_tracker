import Link from "next/link";

import { CountryTable } from "@/components/country-table";
import { KpiCard } from "@/components/kpi-card";
import { SourceBadge } from "@/components/source-badge";
import { WorldMap } from "@/components/world-map";
import { getCountries, getGlobalSummary } from "@/lib/data/covid";
import { formatCompactNumber, safeRatio } from "@/lib/utils";

export default async function HomePage() {
  const [global, countries] = await Promise.all([getGlobalSummary(), getCountries()]);
  const topCountries = countries.slice(0, 12);
  const recoveryRatio = safeRatio(global.totalRecovered, global.totalCases);
  const deathRatio = safeRatio(global.totalDeaths, global.totalCases);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <div className="surface rounded-[36px] p-8">
          <div className="inline-flex rounded-full bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[var(--primary)]">
            Public health data explorer
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Global and country-level COVID-19 reporting in one clear dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Scan the global situation quickly, compare countries, understand historical direction, and verify every view with source labels and reporting cadence.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/countries" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
              Explore dashboard
            </Link>
            <Link
              href="/methodology"
              className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--primary-soft)]"
            >
              View methodology
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <SourceBadge meta={global.sourceMeta} />
          <div className="surface rounded-[32px] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Trust notes</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li>Current dashboard cards are snapshots and may refresh faster than official weekly reporting.</li>
              <li>Historical charts prefer OWID series and fall back to disease.sh only if OWID is unavailable.</li>
              <li>WHO datasets are reserved as the official weekly reference layer and fallback for core counts.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Cases" value={global.totalCases} helper="Reported confirmed cases" delta={<>24h change: {formatCompactNumber(global.todayCases)}</>} />
        <KpiCard
          title="Total Recovered"
          value={global.totalRecovered}
          helper="Reported recoveries"
          tone="positive"
          delta={recoveryRatio !== null ? <>Recovery ratio: {(recoveryRatio * 100).toFixed(1)}%</> : undefined}
        />
        <KpiCard
          title="Active Cases"
          value={global.activeCases}
          helper="Estimated active cases"
          tone="caution"
          delta={global.affectedCountries !== null ? <>Countries: {formatCompactNumber(global.affectedCountries)}</> : undefined}
        />
        <KpiCard
          title="Total Deaths"
          value={global.totalDeaths}
          helper="Reported deaths"
          tone="negative"
          delta={deathRatio !== null ? <>Case fatality: {(deathRatio * 100).toFixed(2)}%</> : undefined}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <WorldMap countries={countries} />

        <aside className="space-y-5">
          <div className="surface rounded-[32px] p-5">
            <div className="border-b border-[var(--border)] pb-4">
              <h2 className="text-xl font-semibold">Top countries</h2>
              <p className="text-sm text-[var(--muted)]">Most affected countries ranked by reported cases.</p>
            </div>
            <div className="mt-4 space-y-3">
              {topCountries.map((country, index) => (
                <Link
                  key={country.slug}
                  href={`/countries/${country.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3 transition hover:border-[var(--primary)]"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">#{index + 1}</div>
                    <div className="font-medium">{country.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCompactNumber(country.totalCases)}</div>
                    <div className="text-xs text-[var(--muted)]">{country.sourceMeta.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <CountryTable countries={countries} />
    </div>
  );
}
