import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HistoryChart } from "@/components/history-chart";
import { SourceBadge } from "@/components/source-badge";
import { getCountryHistory, getCountrySnapshot } from "@/lib/data/covid";
import { formatNumber } from "@/lib/utils";

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

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface rounded-[28px] p-8">
          <div className="text-sm font-medium text-[var(--text-tertiary)]">Back to dashboard / Countries / {country.name}</div>
          <h1 className="mt-4 text-[2.4rem] font-bold tracking-[-0.04em]">{country.name} COVID-19 Overview</h1>
          <p className="mt-3 max-w-2xl text-lg text-[var(--text-secondary)]">Snapshot metrics and historical reporting for {country.name}.</p>
        </div>

        <SourceBadge meta={country.sourceMeta} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Cases", country.totalCases],
          ["Total Recovered", country.totalRecovered],
          ["Active Cases", country.activeCases],
          ["Total Deaths", country.totalDeaths]
        ].map(([label, value]) => (
          <article key={label} className="surface rounded-[24px] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">{label}</div>
            <div className="mt-3 text-3xl font-semibold">{formatNumber(value as number | null)}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_340px]">
        <HistoryChart data={history} />

        <aside className="space-y-5">
          <div className="surface rounded-[28px] p-5">
            <h2 className="text-xl font-semibold">Source details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">Current snapshot</dt>
                <dd className="font-medium">{country.sourceMeta.label}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">Historical trend</dt>
                <dd className="font-medium">{historySource}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">Reporting cadence</dt>
                <dd className="font-medium">{country.sourceMeta.cadence}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">Definition</dt>
                <dd className="font-medium">Active cases = total cases - recovered - deaths</dd>
              </div>
            </dl>
          </div>

          <div className="surface rounded-[28px] p-5">
            <h2 className="text-xl font-semibold">Country profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">Population</dt>
                <dd className="font-medium">{formatNumber(country.population)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">Region</dt>
                <dd className="font-medium">{country.continent ?? "Not reported"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">ISO 2</dt>
                <dd className="font-medium">{country.iso2 ?? "Not reported"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-secondary)]">ISO 3</dt>
                <dd className="font-medium">{country.iso3 ?? "Not reported"}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
