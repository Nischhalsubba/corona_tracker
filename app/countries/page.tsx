import type { Metadata } from "next";

import { CountryTable } from "@/components/country-table";
import { SourceBadge } from "@/components/source-badge";
import { getCountries } from "@/lib/data/covid";

export const metadata: Metadata = {
  title: "Countries",
  description:
    "Browse country-level COVID-19 reporting with searchable rankings, quick comparisons, and direct access to country detail pages.",
  alternates: {
    canonical: "/countries"
  }
};

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface rounded-[32px] p-8">
          <h1 className="text-4xl font-bold tracking-tight">Countries</h1>
          <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
            Search and compare country-level COVID-19 reporting with indexable detail pages.
          </p>
        </div>
        <SourceBadge meta={countries[0]?.sourceMeta ?? { source: "who", label: "WHO", cadence: "weekly", lastSynced: new Date().toISOString() }} />
      </section>

      <CountryTable countries={countries} />
    </div>
  );
}
