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
  const liveReports = countries.slice(0, 6);
  const recoveryRatio = safeRatio(global.totalRecovered, global.totalCases);
  const deathRatio = safeRatio(global.totalDeaths, global.totalCases);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
        <div className="surface rounded-[32px] p-8">
          <div className="inline-flex rounded-full bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary)]">
            Clean public dashboard
          </div>
          <h1 className="mt-5 max-w-3xl text-[2.4rem] font-bold leading-tight tracking-[-0.04em] sm:text-[3.2rem]">
            COVID-19 reporting that feels easy to scan and easy to trust.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
            A soft analytics dashboard for global and country-level reporting, with transparent sources, calm hierarchy, and shareable detail pages.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/countries"
              className="rounded-[16px] bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              Explore dashboard
            </Link>
            <Link
              href="/methodology"
              className="rounded-[16px] bg-[var(--primary-soft)] px-5 py-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[#ffdada]"
            >
              View methodology
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <SourceBadge meta={global.sourceMeta} />

          <div className="surface rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[2rem] font-bold tracking-[-0.04em]">Ratio of Recovery</h2>
              <span className="rounded-full bg-[rgba(52,199,89,0.14)] px-3 py-1 text-xs font-semibold text-[var(--positive)]">
                Recovered
              </span>
            </div>
            <div className="mt-8 flex items-center justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,_#ff5a5f_0_31%,_#f4f1f1_31%_100%)] p-3">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <div className="text-4xl font-bold tracking-[-0.05em] text-[var(--foreground)]">
                      {recoveryRatio !== null ? `${(recoveryRatio * 100).toFixed(1)}%` : "N/A"}
                    </div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)]">Recovery ratio</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="soft-panel rounded-[18px] px-4 py-3">
                <div className="text-[var(--text-tertiary)]">Affected</div>
                <div className="mt-1 font-semibold text-[var(--foreground)]">{formatCompactNumber(global.totalCases)}</div>
              </div>
              <div className="soft-panel rounded-[18px] px-4 py-3">
                <div className="text-[var(--text-tertiary)]">Recovered</div>
                <div className="mt-1 font-semibold text-[var(--foreground)]">{formatCompactNumber(global.totalRecovered)}</div>
              </div>
            </div>
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_400px]">
        <div className="space-y-6">
          <WorldMap countries={countries} />

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="surface rounded-[28px] p-6">
              <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                <div className="flex h-40 items-end justify-center rounded-[24px] bg-[var(--primary-soft)] p-5">
                  <div className="relative h-28 w-28">
                    <div className="absolute bottom-0 left-5 h-24 w-16 rounded-t-[40px] rounded-b-[24px] bg-[var(--primary)]" />
                    <div className="absolute bottom-14 left-3 h-12 w-12 rounded-full bg-[#2e3a8c]" />
                    <div className="absolute bottom-12 right-1 h-10 w-10 rounded-full bg-[#ffd7d8]" />
                    <div className="absolute bottom-2 right-0 h-20 w-14 rounded-[28px] bg-white" />
                  </div>
                </div>
                <div>
                  <span className="rounded-[12px] bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                    News & Update
                  </span>
                  <h2 className="mt-4 text-[2rem] font-bold tracking-[-0.04em]">5 symptoms of COVID-19 you should know</h2>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    A soft editorial card for updates, awareness notes, and public-health guidance.
                  </p>
                  <Link href="/updates" className="mt-5 inline-flex rounded-[14px] bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)]">
                    Read more
                  </Link>
                </div>
              </div>
            </article>

            <article className="surface rounded-[28px] p-6">
              <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                <div className="flex h-40 items-end justify-center rounded-[24px] bg-[#fff5f2] p-5">
                  <div className="relative h-28 w-28">
                    <div className="absolute left-2 top-1 h-5 w-10 rounded-full bg-[#ffd9d9]" />
                    <div className="absolute right-2 top-8 h-6 w-14 rounded-full bg-[#ffe8e8]" />
                    <div className="absolute left-8 top-10 h-12 w-12 rounded-full bg-[var(--primary)]" />
                    <div className="absolute left-0 bottom-0 h-14 w-10 rounded-t-[18px] bg-[#2e3a8c]" />
                    <div className="absolute right-0 bottom-0 h-16 w-10 rounded-t-[18px] bg-[#4537ad]" />
                    <div className="absolute left-10 bottom-3 h-11 w-11 rounded-[12px] bg-white" />
                  </div>
                </div>
                <div>
                  <span className="rounded-[12px] bg-[rgba(52,199,89,0.14)] px-3 py-1 text-xs font-semibold text-[var(--positive)]">
                    Support
                  </span>
                  <h2 className="mt-4 text-[2rem] font-bold tracking-[-0.04em]">Support communities and relief programs</h2>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    Keep secondary illustration blocks gentle and informative rather than dramatic or fear-based.
                  </p>
                  <Link href="/about" className="mt-5 inline-flex rounded-[14px] bg-[#eaf7ee] px-4 py-3 text-sm font-semibold text-[var(--positive)]">
                    Learn more
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="surface rounded-[28px] p-6">
            <div className="border-b border-[var(--border)] pb-4">
              <h2 className="text-[2rem] font-bold tracking-[-0.04em]">Top countries</h2>
              <p className="text-sm text-[var(--text-secondary)]">Most affected countries ranked by reported cases.</p>
            </div>
            <div className="mt-4 space-y-3">
              {topCountries.map((country, index) => (
                <Link
                  key={country.slug}
                  href={`/countries/${country.slug}`}
                  className="soft-panel flex items-center justify-between rounded-[20px] px-4 py-4 transition hover:bg-[var(--primary-soft)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--primary)] shadow-[var(--shadow-sm)]">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{country.name}</div>
                      <div className="mt-1 text-sm text-[var(--text-secondary)]">
                        Affected {formatCompactNumber(country.totalCases)} · Recovered {formatCompactNumber(country.totalRecovered)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[var(--foreground)]">{formatCompactNumber(country.totalCases)}</div>
                    <div className="mt-1 text-xs text-[var(--text-tertiary)]">{country.sourceMeta.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface rounded-[28px] p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <h2 className="text-[2rem] font-bold tracking-[-0.04em]">Live reports</h2>
              <div className="flex gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] text-[var(--text-tertiary)]">‹</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] text-[var(--primary)]">›</span>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {liveReports.map((country) => (
                <div key={country.slug} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {country.flagUrl ? (
                      <img src={country.flagUrl} alt="" className="h-5 w-7 rounded-sm object-cover shadow-[0_4px_12px_rgba(31,41,55,0.12)]" />
                    ) : (
                      <div className="h-5 w-7 rounded-sm bg-[var(--primary-soft)]" />
                    )}
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatCompactNumber(country.totalCases)}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <CountryTable countries={countries} />
    </div>
  );
}
