import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SourceBadge } from "@/components/source-badge";
import { getCountryHistory, getCountrySnapshot, getReportingUpdates } from "@/lib/data/covid";
import { siteUrl } from "@/lib/site";
import { formatCompactNumber, formatNumber, safeRatio } from "@/lib/utils";

type CountryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountrySnapshot(slug);

  if (!country) {
    return { title: "Country not found" };
  }

  return {
    title: `${country.name} COVID-19 Data: Cases, Recoveries, Deaths & Live Reporting`,
    description: `View the current COVID-19 snapshot for ${country.name}, including total cases, recoveries, deaths, active cases, daily change, and source-backed reporting details.`,
    alternates: { canonical: `/countries/${country.slug}` }
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = await getCountrySnapshot(slug);

  if (!country) {
    notFound();
  }

  const [updates, history] = await Promise.all([getReportingUpdates(), getCountryHistory(slug)]);
  const relatedUpdate = updates.find((update) => update.slug === country.slug) ?? null;
  const recoveryRatio = safeRatio(country.totalRecovered, country.totalCases);
  const fatalityRatio = safeRatio(country.totalDeaths, country.totalCases);
  const lastArchivePoint = history.at(-1) ?? null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Countries", item: `${siteUrl}/countries` },
      { "@type": "ListItem", position: 3, name: country.name, item: `${siteUrl}/countries/${country.slug}` }
    ]
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface rounded-[28px] p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
            <Link href="/" className="font-medium hover:text-[var(--primary)]">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/countries" className="font-medium hover:text-[var(--primary)]">
              Countries
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{country.name}</span>
          </div>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-[14px] bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary)]">
                Live country detail
              </div>
              <h1 className="mt-4 text-[2.7rem] font-bold tracking-[-0.05em]">{country.name} COVID-19 Overview</h1>
              <p className="mt-3 max-w-2xl text-lg text-[var(--text-secondary)]">
                A current snapshot of cases, recoveries, deaths, active cases, and reporting metrics for {country.name}.
              </p>
            </div>

            <div className="soft-panel rounded-[22px] px-5 py-4">
              <div className="text-sm text-[var(--text-tertiary)]">Today cases</div>
              <div className="mt-1 text-2xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.todayCases)}</div>
            </div>
          </div>
        </div>

        <SourceBadge meta={country.sourceMeta} />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Cases", country.totalCases, "bg-[var(--primary-soft)] text-[var(--primary)]"],
          ["Recovered", country.totalRecovered, "bg-[rgba(52,199,89,0.12)] text-[var(--positive)]"],
          ["Active Cases", country.activeCases, "bg-[rgba(255,176,32,0.16)] text-[var(--caution)]"],
          ["Total Deaths", country.totalDeaths, "bg-[rgba(255,90,95,0.12)] text-[var(--negative)]"]
        ].map(([label, value, tone]) => (
          <article key={label} className="surface rounded-[24px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[var(--text-secondary)]">{label}</div>
                <div className="mt-4 text-[2.35rem] font-bold leading-none tracking-[-0.05em]">{formatCompactNumber(value as number | null)}</div>
              </div>
              <div className={`rounded-[14px] px-3 py-2 text-xs font-semibold ${tone}`}>{label}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="space-y-6">
          <div className="surface rounded-[28px] p-6">
            <h2 className="text-[1.95rem] font-bold tracking-[-0.04em]">Current reporting snapshot</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">New cases</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.todayCases)}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">New deaths</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.todayDeaths)}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">New recoveries</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.todayRecovered)}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">Critical cases</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.criticalCases)}</div>
              </div>
            </div>
          </div>

          <div className="surface rounded-[28px] p-6">
            <h2 className="text-[1.95rem] font-bold tracking-[-0.04em]">Relevant live indicators</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">Recovery ratio</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{recoveryRatio !== null ? `${(recoveryRatio * 100).toFixed(1)}%` : "N/A"}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">Fatality ratio</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{fatalityRatio !== null ? `${(fatalityRatio * 100).toFixed(2)}%` : "N/A"}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">Cases per million</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.casesPerMillion)}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-5 py-5">
                <div className="text-sm text-[var(--text-tertiary)]">Deaths per million</div>
                <div className="mt-2 text-3xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.deathsPerMillion)}</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface rounded-[28px] p-6">
            <h2 className="text-[1.9rem] font-bold tracking-[-0.04em]">Country profile</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <dt className="text-[var(--text-secondary)]">Population</dt>
                <dd className="font-semibold">{formatNumber(country.population)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <dt className="text-[var(--text-secondary)]">Region</dt>
                <dd className="font-semibold">{country.continent ?? "Not reported"}</dd>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <dt className="text-[var(--text-secondary)]">Tests</dt>
                <dd className="font-semibold">{formatCompactNumber(country.tests)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <dt className="text-[var(--text-secondary)]">ISO 2 / ISO 3</dt>
                <dd className="font-semibold">{country.iso2 ?? "--"} / {country.iso3 ?? "--"}</dd>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <dt className="text-[var(--text-secondary)]">Archive context</dt>
                <dd className="font-semibold">{lastArchivePoint ? lastArchivePoint.date : "Not available"}</dd>
              </div>
            </dl>
          </div>

          <div className="surface rounded-[28px] p-6">
            <h2 className="text-[1.9rem] font-bold tracking-[-0.04em]">Reporting note</h2>
            {relatedUpdate ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                  <div className="text-sm text-[var(--text-tertiary)]">{relatedUpdate.metricLabel}</div>
                  <div className="mt-1 text-2xl font-bold tracking-[-0.04em]">{formatCompactNumber(relatedUpdate.metricValue)}</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{relatedUpdate.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{relatedUpdate.summary}</p>
                </div>
                <Link href="/updates" className="inline-flex rounded-[14px] bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)]">
                  Open updates page
                </Link>
              </div>
            ) : (
              <p className="mt-6 text-sm text-[var(--text-secondary)]">No separate live note is available for this country in the current refresh window.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
