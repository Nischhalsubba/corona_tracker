"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { WorldMap as SvgWorldMap } from "react-svg-worldmap";
import type { ISOCode } from "react-svg-worldmap";

import type { CountrySnapshot } from "@/lib/types";
import { formatCompactNumber, formatNumber, safeRatio } from "@/lib/utils";

export function WorldMap({ countries }: { countries: CountrySnapshot[] }) {
  const topCountries = countries.slice(0, 3);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(topCountries[0]?.slug ?? null);
  const [zoom, setZoom] = useState(1);

  const countriesByIso2 = useMemo(
    () => new Map(countries.filter((country) => country.iso2).map((country) => [country.iso2 as string, country])),
    [countries]
  );

  const filteredCountries = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return countries.slice(0, 8);
    }

    return countries
      .filter((country) => country.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 8);
  }, [countries, deferredQuery]);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.slug === selectedSlug) ?? topCountries[0] ?? null,
    [countries, selectedSlug, topCountries]
  );

  useEffect(() => {
    if (!selectedCountry && topCountries[0]) {
      setSelectedSlug(topCountries[0].slug);
    }
  }, [selectedCountry, topCountries]);

  const mapData = useMemo(
    () =>
      countries
        .filter((country) => country.iso2)
        .map((country) => ({
          country: country.iso2 as ISOCode,
          value: country.totalCases ?? 0
        })),
    [countries]
  );

  function selectCountry(country: CountrySnapshot) {
    setSelectedSlug(country.slug);
    setQuery(country.name);
  }

  function zoomIn() {
    setZoom((value) => Math.min(2.2, Number((value + 0.2).toFixed(1))));
  }

  function zoomOut() {
    setZoom((value) => Math.max(1, Number((value - 0.2).toFixed(1))));
  }

  function resetMap() {
    setZoom(1);
    setQuery("");
  }

  return (
    <section className="surface rounded-[28px] p-6">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-[2rem] font-bold tracking-[-0.04em]">COVID - 19 Affected Areas</h2>
        <div className="flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <span className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-[6px] bg-[var(--primary)]" />
            Most Affected
          </span>
          <span className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-[6px] bg-[#ff8d90]" />
            Less Affected
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_420px]">
        <div className="relative overflow-hidden rounded-[24px] p-4" style={{ backgroundColor: "var(--primary-soft)" }}>
          <div className="absolute left-5 top-5 z-10 w-[252px] max-w-[calc(100%-96px)] rounded-[16px] border border-[var(--border)] p-3 shadow-[0_10px_24px_rgba(31,41,55,0.08)]" style={{ backgroundColor: "var(--surface)" }}>
            <label className="flex items-center gap-3 rounded-[12px] px-3 py-3" style={{ backgroundColor: "var(--surface-soft)" }}>
              <SearchIcon className="h-5 w-5 text-[var(--primary)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search country on map"
                className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
                aria-label="Search country on map"
              />
            </label>
            {query.trim() ? (
              <div className="mt-3 space-y-2">
                {filteredCountries.length > 0 ? (
                  filteredCountries.slice(0, 4).map((country) => (
                    <button
                      key={country.slug}
                      type="button"
                      onClick={() => selectCountry(country)}
                      className="flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-left text-sm hover:-translate-y-0.5"
                      style={{ backgroundColor: "var(--surface-soft)" }}
                    >
                      <span>{country.name}</span>
                      <span style={{ color: "var(--text-tertiary)" }}>{formatCompactNumber(country.totalCases)}</span>
                    </button>
                  ))
                ) : (
                  <div className="rounded-[12px] px-3 py-3 text-sm" style={{ backgroundColor: "var(--surface-soft)", color: "var(--text-secondary)" }}>
                    No matching country found.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="absolute right-6 top-6 z-10 flex flex-col overflow-hidden rounded-[12px] border border-[var(--border)] shadow-[0_10px_24px_rgba(31,41,55,0.08)]" style={{ backgroundColor: "var(--surface)" }}>
            <button
              type="button"
              onClick={zoomIn}
              className="flex h-12 w-10 items-center justify-center border-b border-[var(--border)] text-lg text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={zoomOut}
              className="flex h-12 w-10 items-center justify-center border-b border-[var(--border)] text-lg text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              aria-label="Zoom out"
            >
              -
            </button>
            <button
              type="button"
              onClick={resetMap}
              className="flex h-12 w-10 items-center justify-center text-sm font-semibold text-[var(--primary)] hover:bg-[var(--surface-soft)]"
              aria-label="Reset map"
            >
              1x
            </button>
          </div>

          {selectedCountry ? (
            <div className="absolute bottom-5 left-5 z-10 max-w-[290px] rounded-[18px] border border-[var(--border)] p-4 shadow-[0_14px_32px_rgba(31,41,55,0.12)]" style={{ backgroundColor: "var(--surface)" }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-[var(--text-tertiary)]">Selected country</div>
                  <div className="mt-1 text-lg font-bold">{selectedCountry.name}</div>
                </div>
                <Link
                  href={`/countries/${selectedCountry.slug}`}
                  className="rounded-[12px] bg-[var(--primary-soft)] px-3 py-2 text-xs font-semibold text-[var(--primary)]"
                >
                  Open
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <MetricCard label="Cases" value={formatCompactNumber(selectedCountry.totalCases)} />
                <MetricCard label="Deaths" value={formatCompactNumber(selectedCountry.totalDeaths)} />
                <MetricCard label="Recovered" value={formatCompactNumber(selectedCountry.totalRecovered)} />
                <MetricCard label="Active" value={formatCompactNumber(selectedCountry.activeCases)} />
              </div>
            </div>
          ) : null}

          <div
            className="transition duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center"
            }}
          >
            <SvgWorldMap
              color="#ff5a5f"
              size="responsive"
              data={mapData}
              richInteraction
              regionClassName="tracker-map-region"
              tooltipBgColor="#162033"
              tooltipTextColor="#ffffff"
              tooltipTextFunction={({ countryCode, countryName, countryValue }) => {
                const country = countriesByIso2.get(countryCode.toUpperCase());
                return `${countryName} | Cases ${formatNumber(typeof countryValue === "number" ? countryValue : null)} | Recovered ${formatNumber(country?.totalRecovered)} | Deaths ${formatNumber(country?.totalDeaths)} | Active ${formatNumber(country?.activeCases)} | Today ${formatNumber(country?.todayCases)}`;
              }}
              onClickFunction={({ countryCode }) => {
                const country = countriesByIso2.get(countryCode.toUpperCase());
                if (country) {
                  selectCountry(country);
                }
              }}
              styleFunction={({ countryCode, countryValue }) => {
                const country = countriesByIso2.get(countryCode.toUpperCase());
                if (!country) {
                  return { fill: "#f8d9db", cursor: "default" };
                }

                const isSelected = selectedCountry?.iso2?.toUpperCase() === countryCode.toUpperCase();
                const value = typeof countryValue === "number" ? countryValue : 0;
                let fill = "#f7c7ca";

                if (value > 50_000_000) {
                  fill = "#ff373d";
                } else if (value > 10_000_000) {
                  fill = "#ff7b7f";
                }

                return {
                  fill,
                  cursor: "pointer",
                  stroke: isSelected ? "#162033" : "#ffffff",
                  strokeWidth: isSelected ? 2.2 : 0.7,
                  opacity: isSelected ? 1 : 0.94
                };
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-[2rem] font-bold tracking-[-0.04em]">Top Countries</h3>
          <div className="space-y-6">
            {topCountries.map((country, index) => {
              const accents = [
                { color: "#ff5a5f", bg: "#fff1f1" },
                { color: "#34c759", bg: "#effaf2" },
                { color: "#6c63c8", bg: "#f1f0ff" }
              ][index]!;
              const ratio = safeRatio(country.totalRecovered, country.totalCases);

              return (
                <button
                  key={country.slug}
                  type="button"
                  onClick={() => selectCountry(country)}
                  className="soft-panel flex w-full items-center gap-4 rounded-[22px] px-4 py-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(31,41,55,0.08)]"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--border)]" style={{ backgroundColor: "var(--surface)" }}>
                    <div
                      className="flex h-[56px] w-[56px] items-center justify-center rounded-full border text-sm font-bold"
                      style={{ borderColor: accents.color, color: accents.color, backgroundColor: accents.bg }}
                    >
                      {ratio !== null ? `${Math.round(ratio * 100)}%` : "N/A"}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[1.1rem] font-bold">{country.name}</div>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
                      <span>Affected - {formatCompactNumber(country.totalCases)}</span>
                      <span>Deaths - {formatCompactNumber(country.totalDeaths)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] px-3 py-3" style={{ backgroundColor: "var(--surface-soft)" }}>
      <div className="text-[var(--text-tertiary)]">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
