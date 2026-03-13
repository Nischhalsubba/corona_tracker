import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HistoryChart } from "@/components/history-chart";
import { SourceBadge } from "@/components/source-badge";
import { getCountryHistory, getCountrySnapshot } from "@/lib/data/covid";
import { formatCompactNumber, formatNumber } from "@/lib/utils";

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
    title: `${country.name} COVID-19 Data: Cases, Recoveries, Deaths & Trends`,
    description: `View the latest reported COVID-19 data for ${country.name}, including cases, recoveries, deaths, active cases, and historical trends.`,
    alternates: { canonical: `/countries/${country.slug}` }
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = await getCountrySnapshot(slug);

  if (!country) {
    notFound();
  }

  const history = await getCountryHistory(slug);
  const historySource = history[0]?.source === "owid" ? "Our World in Data" : country.sourceMeta.label;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: "https://example.com/" },
      { "@type": "ListItem", position: 2, name: "Countries", item: "https://example.com/countries" },
      { "@type": "ListItem", position: 3, name: country.name, item: `https://example.com/countries/${country.slug}` }
    ]
  };

  const metrics = [
    { label: "Total Cases", value: country.totalCases, tone: "text-[var(--primary)] bg-[var(--primary-soft)]" },
    { label: "Recovered", value: country.totalRecovered, tone: "text-[var(--positive)] bg-[rgba(52,199,89,0.12)]" },
    { label: "Active Cases", value: country.activeCases, tone: "text-[var(--caution)] bg-[rgba(255,176,32,0.16)]" },
    { label: "Total Deaths", value: country.totalDeaths, tone: "text-[var(--negative)] bg-[rgba(255,90,95,0.12)]" }
  ];

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
                Country detail
              </div>
              <h1 className="mt-4 text-[2.7rem] font-bold tracking-[-0.05em]">{country.name} COVID-19 Overview</h1>
              <p className="mt-3 max-w-2xl text-lg text-[var(--text-secondary)]">
                Snapshot metrics, source context, and historical reporting for {country.name}.
              </p>
            </div>

            <div className="soft-panel rounded-[22px] px-5 py-4">
              <div className="text-sm text-[var(--text-tertiary)]">Population</div>
              <div className="mt-1 text-2xl font-bold tracking-[-0.04em]">{formatCompactNumber(country.population)}</div>
            </div>
          </div>
        </div>

        <SourceBadge meta={country.sourceMeta} />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="surface rounded-[24px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[var(--text-secondary)]">{metric.label}</div>
                <div className="mt-4 text-[2.35rem] font-bold leading-none tracking-[-0.05em]">{formatCompactNumber(metric.value)}</div>
              </div>
              <div className={`rounded-[14px] px-3 py-2 text-xs font-semibold ${metric.tone}`}>{metric.label}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
        <HistoryChart data={history} />

        <aside className="space-y-6">
          <div className="surface rounded-[28px] p-6">
            <h2 className="text-[1.9rem] font-bold tracking-[-0.04em]">Source details</h2>
            <div className="mt-6 space-y-4">
              <div className="soft-panel rounded-[20px] px-4 py-4">
                <div className="text-sm text-[var(--text-tertiary)]">Current snapshot</div>
                <div className="mt-1 font-semibold">{country.sourceMeta.label}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-4 py-4">
                <div className="text-sm text-[var(--text-tertiary)]">Historical trend</div>
                <div className="mt-1 font-semibold">{historySource}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-4 py-4">
                <div className="text-sm text-[var(--text-tertiary)]">Reporting cadence</div>
                <div className="mt-1 font-semibold capitalize">{country.sourceMeta.cadence}</div>
              </div>
              <div className="soft-panel rounded-[20px] px-4 py-4">
                <div className="text-sm text-[var(--text-tertiary)]">Definition</div>
                <div className="mt-1 font-semibold">Active cases = total cases - recovered - deaths</div>
              </div>
            </div>
          </div>

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
                <dt className="text-[var(--text-secondary)]">ISO 2</dt>
                <dd className="font-semibold">{country.iso2 ?? "Not reported"}</dd>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-[var(--surface-soft)] px-4 py-4">
                <dt className="text-[var(--text-secondary)]">ISO 3</dt>
                <dd className="font-semibold">{country.iso3 ?? "Not reported"}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
