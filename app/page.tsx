import Link from "next/link";

import { KpiCard } from "@/components/kpi-card";
import { WorldMap } from "@/components/world-map";
import { getCountries, getGlobalSummary } from "@/lib/data/covid";
import { formatCompactNumber, safeRatio } from "@/lib/utils";

export default async function HomePage() {
  const [global, countries] = await Promise.all([getGlobalSummary(), getCountries()]);
  const liveReports = countries.slice(0, 6);
  const recoveryRatio = safeRatio(global.totalRecovered, global.totalCases);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
            <KpiCard title="Total Cases" value={global.totalCases} helper="Reported confirmed cases" delta={<>2.48k</>} />
            <KpiCard title="Recovered" value={global.totalRecovered} helper="Reported recoveries" tone="positive" delta={<>up</>} />
            <KpiCard title="Active Cases" value={global.activeCases} helper="Estimated active cases" tone="caution" delta={<>up</>} />
            <KpiCard title="Total Death" value={global.totalDeaths} helper="Reported deaths" tone="negative" delta={<>up</>} />
          </div>

          <WorldMap countries={countries} />
        </div>

        <div className="space-y-6">
          <div className="surface rounded-[28px] p-8">
            <h2 className="text-[2rem] font-bold tracking-[-0.04em]">Ratio of Recovery</h2>
            <div className="mt-8 flex items-center justify-center">
              <div className="relative flex h-[290px] w-[290px] items-center justify-center rounded-full bg-[conic-gradient(from_210deg,_rgba(255,90,95,0.94)_0_31%,_#f6efef_31%_100%)] p-[10px]">
                <div className="absolute left-1/2 top-[16px] h-3 w-3 -translate-x-1/2 rounded-full bg-[#f08a8f]" />
                <div className="absolute bottom-[26px] right-[14px] h-6 w-6 rounded-full border-4 border-white bg-[var(--primary)] shadow-[0_10px_22px_rgba(255,90,95,0.25)]" />
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                  <div className="text-[3rem] font-bold tracking-[-0.05em] text-[var(--foreground)]">
                    {recoveryRatio !== null ? `${(recoveryRatio * 100).toFixed(1)}%` : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 text-center text-[15px] font-semibold text-[var(--text-secondary)]">
              <div>{formatCompactNumber(global.totalCases)} Affected</div>
              <div>{formatCompactNumber(global.totalRecovered)} Recovered</div>
            </div>
          </div>

          <div className="surface rounded-[28px] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[2rem] font-bold tracking-[-0.04em]">Live Reports</h2>
              <div className="flex gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] text-[var(--text-tertiary)]">{"<"}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] text-[var(--primary)]">{">"}</span>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              {liveReports.map((country) => (
                <div key={country.slug} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {country.flagUrl ? (
                      <img src={country.flagUrl} alt="" className="h-7 w-10 rounded-[3px] object-cover" />
                    ) : (
                      <div className="h-7 w-10 rounded-[3px] bg-[var(--primary-soft)]" />
                    )}
                    <span className="text-[1.05rem] font-medium">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[1.05rem] font-semibold">{formatCompactNumber(country.totalCases)}</span>
                    <span
                      className={`inline-block h-0 w-0 border-x-[7px] border-x-transparent ${
                        country.name === "China" ? "border-t-[10px] border-t-[var(--positive)]" : "border-b-[10px] border-b-[var(--primary)]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="surface rounded-[28px] p-8">
          <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-end">
            <div className="flex h-[220px] items-end justify-center rounded-[24px] bg-white">
              <div className="relative h-40 w-36">
                <div className="absolute bottom-0 left-3 h-28 w-24 rounded-t-[48px] rounded-b-[28px] bg-[var(--primary)]" />
                <div className="absolute left-9 top-7 h-14 w-14 rounded-full bg-[#232f80]" />
                <div className="absolute left-5 top-14 h-12 w-14 rounded-[16px] bg-[#ffd8da]" />
                <div className="absolute right-2 top-14 h-14 w-14 rounded-full bg-[#ffe4e6]" />
                <div className="absolute bottom-0 left-9 h-20 w-12 rounded-t-[26px] bg-white" />
              </div>
            </div>
            <div>
              <span className="rounded-[14px] bg-[var(--primary-soft)] px-4 py-3 text-[15px] font-semibold text-[var(--primary)]">News & Update</span>
              <h2 className="mt-7 max-w-[440px] text-[2.2rem] font-bold leading-tight tracking-[-0.05em]">5 Symptoms of Corona Virus that you should know</h2>
              <Link href="/updates" className="mt-7 inline-flex items-center gap-3 text-[2rem] font-bold tracking-[-0.04em] text-[var(--primary)]">
                Read More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>

        <article className="surface rounded-[28px] p-8">
          <div className="grid gap-6 md:grid-cols-[200px_minmax(0,1fr)] md:items-end">
            <div className="flex h-[220px] items-end justify-center rounded-[24px] bg-white">
              <div className="relative h-40 w-40">
                <div className="absolute left-5 top-6 h-6 w-14 rounded-full bg-[#ffe2e2]" />
                <div className="absolute right-6 top-2 h-7 w-16 rounded-full bg-[#ffeaea]" />
                <div className="absolute left-16 top-12 h-16 w-16 rounded-full bg-[var(--primary)]" />
                <div className="absolute left-2 bottom-0 h-20 w-12 rounded-t-[24px] bg-[#2b3589]" />
                <div className="absolute right-3 bottom-0 h-24 w-12 rounded-t-[24px] bg-[#4a43b8]" />
                <div className="absolute left-[52px] bottom-5 h-14 w-14 rounded-[18px] bg-white" />
              </div>
            </div>
            <div>
              <span className="rounded-[14px] bg-[#e6f6e9] px-4 py-3 text-[15px] font-semibold text-[var(--positive)]">Donate</span>
              <h2 className="mt-7 max-w-[470px] text-[2.2rem] font-bold leading-tight tracking-[-0.05em]">Donate 3rd world countries which are suffering</h2>
              <Link href="/about" className="mt-7 inline-flex items-center gap-3 text-[2rem] font-bold tracking-[-0.04em] text-[var(--positive)]">
                Donate Now <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
