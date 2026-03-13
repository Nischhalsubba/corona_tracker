"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { WorldMap as SvgWorldMap } from "react-svg-worldmap";
import type { ISOCode } from "react-svg-worldmap";

import type { CountrySnapshot } from "@/lib/types";
import { formatCompactNumber, formatNumber } from "@/lib/utils";

export function WorldMap({ countries }: { countries: CountrySnapshot[] }) {
  const router = useRouter();
  const topCountries = countries.slice(0, 3);

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
          value: country.totalCases ?? 0
        })),
    [countries]
  );

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
        <div className="relative overflow-hidden rounded-[24px] bg-[#fff5f6] p-4">
          <Link
            href="/countries"
            className="absolute left-5 top-5 z-10 flex h-14 w-14 items-center justify-center rounded-[12px] bg-white shadow-[0_10px_24px_rgba(31,41,55,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,41,55,0.12)]"
            aria-label="Open countries"
          >
            <SearchIcon className="h-6 w-6 text-[var(--primary)]" />
          </Link>

          <div className="absolute right-6 top-6 z-10 flex flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_10px_24px_rgba(31,41,55,0.08)]">
            <Link
              href="/countries"
              className="flex h-12 w-10 items-center justify-center border-b border-[var(--border)] text-lg text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              aria-label="Browse countries"
            >
              +
            </Link>
            <Link
              href="/updates"
              className="flex h-12 w-10 items-center justify-center border-b border-[var(--border)] text-lg text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              aria-label="Open updates"
            >
              -
            </Link>
            <Link
              href="/methodology"
              className="flex h-12 w-10 items-center justify-center text-lg text-[var(--primary)] transition hover:bg-[var(--surface-soft)]"
              aria-label="Open methodology"
            >
              ↑
            </Link>
          </div>

          <SvgWorldMap
            color="#ff5a5f"
            size="responsive"
            data={mapData}
            tooltipTextFunction={({ countryCode, countryName, countryValue }) => {
              const country = countriesByIso2.get(countryCode.toUpperCase());
              return `${countryName}: ${formatNumber(typeof countryValue === "number" ? countryValue : null)} | ${country?.sourceMeta.label ?? "Not reported"}`;
            }}
            onClickFunction={({ countryCode }) => {
              const country = countriesByIso2.get(countryCode.toUpperCase());
              if (country) {
                router.push(`/countries/${country.slug}`);
              }
            }}
            styleFunction={({ countryCode, countryValue }) => {
              const country = countriesByIso2.get(countryCode.toUpperCase());
              if (!country) {
                return { fill: "#f8d9db", cursor: "default" };
              }

              const value = typeof countryValue === "number" ? countryValue : 0;
              if (value > 50_000_000) {
                return { fill: "#ff373d", cursor: "pointer" };
              }
              if (value > 10_000_000) {
                return { fill: "#ff7b7f", cursor: "pointer" };
              }

              return { fill: "#f7c7ca", cursor: "pointer" };
            }}
          />
        </div>

        <div>
          <h3 className="mb-4 text-[2rem] font-bold tracking-[-0.04em]">Top Countries</h3>
          <div className="space-y-6">
            {topCountries.map((country, index) => {
              const accents = [
                { color: "#ff5a5f", bg: "#fff1f1", pct: "26%" },
                { color: "#34c759", bg: "#effaf2", pct: "17%" },
                { color: "#6c63c8", bg: "#f1f0ff", pct: "9%" }
              ][index]!;

              return (
                <Link
                  key={country.slug}
                  href={`/countries/${country.slug}`}
                  className="soft-panel flex items-center gap-4 rounded-[22px] px-4 py-5 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_34px_rgba(31,41,55,0.08)]"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--border)] bg-white">
                    <div
                      className="flex h-[56px] w-[56px] items-center justify-center rounded-full border text-sm font-bold"
                      style={{ borderColor: accents.color, color: accents.color, backgroundColor: accents.bg }}
                    >
                      {accents.pct}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[1.1rem] font-bold">{country.name}</div>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
                      <span>Affected - {formatCompactNumber(country.totalCases)}</span>
                      <span>Recovered - {formatCompactNumber(country.totalRecovered)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
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
