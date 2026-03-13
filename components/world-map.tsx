"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { WorldMap as SvgWorldMap } from "react-svg-worldmap";
import type { ISOCode } from "react-svg-worldmap";

import type { CountrySnapshot } from "@/lib/types";
import { formatDateTime, formatNumber } from "@/lib/utils";

type MetricKey = "totalCases" | "totalDeaths" | "totalRecovered" | "activeCases";

const metricLabel: Record<MetricKey, string> = {
  totalCases: "Cases",
  totalDeaths: "Deaths",
  totalRecovered: "Recovered",
  activeCases: "Active"
};

export function WorldMap({ countries }: { countries: CountrySnapshot[] }) {
  const router = useRouter();
  const [metric, setMetric] = useState<MetricKey>("totalCases");
  const [hoveredCountry, setHoveredCountry] = useState<CountrySnapshot | null>(null);

  const countriesByIso2 = useMemo(
    () => new Map(countries.filter((country) => country.iso2).map((country) => [country.iso2 as string, country])),
    [countries]
  );

  const mapData = useMemo(
    () =>
      countries
        .filter((country) => country.iso2)
        .map((country) => ({
          country: country.iso2 as ISOCode,
          value: country[metric] ?? 0
        })),
    [countries, metric]
  );

  return (
    <section className="surface rounded-[28px] p-6">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[1.7rem] font-bold tracking-[-0.03em]">COVID-19 affected areas</h2>
          <p className="text-sm text-[var(--text-secondary)]">Hover to view country details. Click a country to open its detail page.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(metricLabel) as MetricKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`rounded-[14px] px-4 py-2 text-sm font-semibold transition ${
                metric === key ? "bg-[var(--primary)] text-white shadow-[0_12px_24px_rgba(255,90,95,0.22)]" : "soft-panel text-[var(--text-secondary)]"
              }`}
            >
              {metricLabel[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 pt-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-[24px] bg-[var(--surface-soft)] p-4">
          <SvgWorldMap
            color="#ff5a5f"
            size="responsive"
            data={mapData}
            tooltipTextFunction={({ countryCode, countryName, countryValue }) => {
              const country = countriesByIso2.get(countryCode.toUpperCase());
              return `${countryName}: ${formatNumber(typeof countryValue === "number" ? countryValue : null)} | Source: ${country?.sourceMeta.label ?? "Not reported"}`;
            }}
            onClickFunction={({ countryCode }) => {
              const country = countriesByIso2.get(countryCode.toUpperCase());
              if (country) {
                router.push(`/countries/${country.slug}`);
              }
            }}
            styleFunction={(context) => {
              const country = countriesByIso2.get(context.countryCode.toUpperCase());
              return {
                fill: country ? undefined : "#f2f3f7",
                cursor: country ? "pointer" : "default"
              };
            }}
          />
          <div className="mt-4 grid gap-2 rounded-[20px] bg-white p-3 text-sm text-[var(--text-secondary)]">
            {countries.slice(0, 5).map((country) => (
              <button
                key={country.slug}
                type="button"
                onMouseEnter={() => setHoveredCountry(country)}
                onFocus={() => setHoveredCountry(country)}
                onClick={() => router.push(`/countries/${country.slug}`)}
                className="flex items-center justify-between rounded-[16px] px-3 py-3 text-left transition hover:bg-[var(--primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                <span>{country.name}</span>
                <span className="font-semibold text-[var(--foreground)]">{formatNumber(country[metric])}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="surface rounded-[24px] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Legend</h3>
            <div className="mt-4 h-3 rounded-full bg-gradient-to-r from-[#ffe7e8] to-[#ff5a5f]" />
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
              <span>Less affected</span>
              <span>Most affected</span>
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Metric: {metricLabel[metric]}. Map and list views remain paired so insights are not map-only.
            </p>
          </div>

          <div className="surface rounded-[24px] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Country details</h3>
            {hoveredCountry ? (
              <div className="mt-4 space-y-2">
                <p className="text-xl font-semibold">{hoveredCountry.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{hoveredCountry.continent ?? "Region unavailable"}</p>
                <dl className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--text-secondary)]">{metricLabel[metric]}</dt>
                    <dd className="font-medium">{formatNumber(hoveredCountry[metric])}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--text-secondary)]">Source</dt>
                    <dd className="font-medium">{hoveredCountry.sourceMeta.label}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--text-secondary)]">Last updated</dt>
                    <dd className="font-medium">{formatDateTime(hoveredCountry.sourceMeta.lastSynced)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--text-secondary)]">Move across the map or the list to inspect country totals and source metadata.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
