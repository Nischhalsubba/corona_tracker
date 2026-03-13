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
    <section className="surface rounded-[32px] p-5">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Global spread by country</h2>
          <p className="text-sm text-[var(--muted)]">Hover to view country details. Click a country to open its detail page.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(metricLabel) as MetricKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                metric === key ? "bg-[var(--primary)] text-white" : "bg-white text-[var(--muted)]"
              }`}
            >
              {metricLabel[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 pt-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-white p-3">
          <SvgWorldMap
            color="#0f766e"
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
                fill: country ? undefined : "#e7ebdf",
                cursor: country ? "pointer" : "default"
              };
            }}
          />
          <div className="mt-3 grid gap-2 rounded-2xl border border-dashed border-[var(--border)] p-3 text-sm text-[var(--muted)]">
            {countries.slice(0, 5).map((country) => (
              <button
                key={country.slug}
                type="button"
                onMouseEnter={() => setHoveredCountry(country)}
                onFocus={() => setHoveredCountry(country)}
                onClick={() => router.push(`/countries/${country.slug}`)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-[var(--primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                <span>{country.name}</span>
                <span>{formatNumber(country[metric])}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[28px] border border-[var(--border)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Legend</h3>
            <div className="mt-4 h-3 rounded-full bg-gradient-to-r from-[#d5ddd1] to-[#0f766e]" />
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Less affected</span>
              <span>Most affected</span>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Metric: {metricLabel[metric]}. Map and list views remain paired so insights are not map-only.
            </p>
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Tooltip</h3>
            {hoveredCountry ? (
              <div className="mt-4 space-y-2">
                <p className="text-xl font-semibold">{hoveredCountry.name}</p>
                <p className="text-sm text-[var(--muted)]">{hoveredCountry.continent ?? "Region unavailable"}</p>
                <dl className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--muted)]">{metricLabel[metric]}</dt>
                    <dd className="font-medium">{formatNumber(hoveredCountry[metric])}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--muted)]">Source</dt>
                    <dd className="font-medium">{hoveredCountry.sourceMeta.label}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--muted)]">Last updated</dt>
                    <dd className="font-medium">{formatDateTime(hoveredCountry.sourceMeta.lastSynced)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">Move across the map to inspect country totals and source metadata.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
