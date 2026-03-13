import Link from "next/link";

import { KpiCard } from "@/components/kpi-card";
import { WorldMap } from "@/components/world-map";
import { getCountries, getGlobalSummary, getReportingUpdates } from "@/lib/data/covid";
import { formatCompactNumber, safeRatio } from "@/lib/utils";

export default async function HomePage() {
  const [global, countries, updates] = await Promise.all([getGlobalSummary(), getCountries(), getReportingUpdates()]);
  const liveReports = countries.slice(0, 6);
  const recoveryRatio = safeRatio(global.totalRecovered, global.totalCases);
  const previewUpdates = updates.slice(1, 3);

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            <KpiCard title="Total Cases" value={global.totalCases} helper="Reported confirmed cases" delta={<>{formatCompactNumber(global.todayCases)}</>} />
            <KpiCard title="Recovered" value={global.totalRecovered} helper="Reported recoveries" tone="positive" delta={<>{formatCompactNumber(global.todayRecovered)}</>} />
            <KpiCard title="Active Cases" value={global.activeCases} helper="Estimated active cases" tone="caution" delta={<>{formatCompactNumber(global.affectedCountries)}</>} />
            <KpiCard title="Total Deaths" value={global.totalDeaths} helper="Reported deaths" tone="negative" delta={<>{formatCompactNumber(global.todayDeaths)}</>} />
          </div>

          <WorldMap countries={countries} />
        </div>

        <div className="space-y-5">
          <div className="surface rounded-[28px] p-6">
            <h2 className="text-[1.95rem] font-bold tracking-[-0.04em]">Ratio of Recovery</h2>
            <div className="mt-7 flex items-center justify-center">
              <div className="relative flex h-[250px] w-[250px] items-center justify-center rounded-full bg-[conic-gradient(from_210deg,_rgba(255,90,95,0.94)_0_31%,_#f2ecee_31%_100%)] p-[10px]">
                <div className="absolute left-1/2 top-[14px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#e48a92]" />
                <div className="absolute bottom-[24px] right-[14px] h-5 w-5 rounded-full border-4 border-white bg-[var(--primary)] shadow-[0_10px_22px_rgba(255,90,95,0.25)]" />
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                  <div className="text-[2.8rem] font-bold tracking-[-0.05em] text-[var(--foreground)]">
                    {recoveryRatio !== null ? `${(recoveryRatio * 100).toFixed(1)}%` : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-4 text-center text-[14px] font-semibold text-[var(--text-secondary)]">
              <div>{formatCompactNumber(global.totalCases)} Affected</div>
              <div>{formatCompactNumber(global.totalRecovered)} Recovered</div>
            </div>
          </div>

          <div className="surface rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[1.95rem] font-bold tracking-[-0.04em]">Live Reports</h2>
              <div className="flex gap-2">
                <Link
                  href="/countries"
                  className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] text-[var(--text-tertiary)] transition hover:-translate-y-0.5 hover:text-[var(--foreground)]"
                  aria-label="Open countries page"
                >
                  {"<"}
                </Link>
                <Link
                  href="/updates"
                  className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] text-[var(--primary)] transition hover:-translate-y-0.5"
                  aria-label="Open updates page"
                >
                  {">"}
                </Link>
              </div>
            </div>
            <div className="mt-7 space-y-5">
              {liveReports.map((country) => (
                <Link key={country.slug} href={`/countries/${country.slug}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {country.flagUrl ? (
                      <img src={country.flagUrl} alt="" className="h-7 w-10 rounded-[4px] object-cover" />
                    ) : (
                      <div className="h-7 w-10 rounded-[4px] bg-[var(--primary-soft)]" />
                    )}
                    <span className="text-[1.02rem] font-medium">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[1.02rem] font-semibold">{formatCompactNumber(country.totalCases)}</span>
                    <span
                      className={`inline-block h-0 w-0 border-x-[7px] border-x-transparent ${
                        (country.todayCases ?? 0) <= 0 ? "border-t-[10px] border-t-[var(--positive)]" : "border-b-[10px] border-b-[var(--primary)]"
                      }`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {previewUpdates.map((update, index) => (
          <article key={update.id} className="surface rounded-[28px] p-8">
            <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-end">
              <div className="flex h-[220px] items-end justify-center rounded-[24px] bg-white">
                <div className="relative h-40 w-40">
                  <div className={`absolute left-5 top-6 h-6 w-14 rounded-full ${index === 0 ? "bg-[#ffe2e2]" : "bg-[#e7f7eb]"}`} />
                  <div className={`absolute right-6 top-2 h-7 w-16 rounded-full ${index === 0 ? "bg-[#ffeaea]" : "bg-[#f0fbf3]"}`} />
                  <div className={`absolute left-16 top-12 h-16 w-16 rounded-full ${index === 0 ? "bg-[var(--primary)]" : "bg-[var(--positive)]"}`} />
                  <div className="absolute left-2 bottom-0 h-20 w-12 rounded-t-[24px] bg-[#2b3589]" />
                  <div className="absolute right-3 bottom-0 h-24 w-12 rounded-t-[24px] bg-[#4a43b8]" />
                  <div className="absolute left-[52px] bottom-5 h-14 w-14 rounded-[18px] bg-white" />
                </div>
              </div>
              <div>
                <span className={`rounded-[14px] px-4 py-3 text-[15px] font-semibold ${index === 0 ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "bg-[#e6f6e9] text-[var(--positive)]"}`}>
                  {index === 0 ? "Reporting Note" : "Live Update"}
                </span>
                <h2 className="mt-7 max-w-[470px] text-[2.1rem] font-bold leading-tight tracking-[-0.05em]">{update.title}</h2>
                <p className="mt-4 max-w-[460px] text-base text-[var(--text-secondary)]">{update.summary}</p>
                <Link
                  href={update.slug ? `/countries/${update.slug}` : "/updates"}
                  className={`mt-7 inline-flex items-center gap-3 text-[1.8rem] font-bold tracking-[-0.04em] ${index === 0 ? "text-[var(--primary)]" : "text-[var(--positive)]"}`}
                >
                  View Details <span aria-hidden="true">{"->"}</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
