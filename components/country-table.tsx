"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { CountrySnapshot } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

type SortKey = "cases" | "deaths" | "recovered" | "active";

export function CountryTable({ countries }: { countries: CountrySnapshot[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("cases");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return countries
      .filter((country) => country.name.toLowerCase().includes(normalizedQuery))
      .sort((left, right) => {
        const pairs = {
          cases: [left.totalCases, right.totalCases],
          deaths: [left.totalDeaths, right.totalDeaths],
          recovered: [left.totalRecovered ?? -1, right.totalRecovered ?? -1],
          active: [left.activeCases ?? -1, right.activeCases ?? -1]
        } satisfies Record<SortKey, [number, number]>;

        return pairs[sortKey][1] - pairs[sortKey][0];
      });
  }, [countries, query, sortKey]);

  return (
    <div className="surface rounded-[28px] p-6">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Countries</h2>
          <p className="text-sm text-[var(--text-secondary)]">Search and compare country-level COVID-19 reporting.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="soft-panel flex min-w-[260px] items-center rounded-[16px] px-4 py-3">
            <span className="sr-only">Search countries</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by country name"
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            />
          </label>

          <div className="soft-panel flex rounded-[16px] p-1">
            {(["cases", "deaths", "recovered", "active"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSortKey(value)}
                className={cn(
                  "rounded-[12px] px-3 py-2 text-sm font-semibold capitalize transition",
                  sortKey === value ? "bg-[var(--primary)] text-white" : "text-[var(--text-secondary)]"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-[var(--text-tertiary)]">
              <th className="px-3 py-2 font-medium">Country</th>
              <th className="px-3 py-2 font-medium">Cases</th>
              <th className="px-3 py-2 font-medium">Recovered</th>
              <th className="px-3 py-2 font-medium">Active</th>
              <th className="px-3 py-2 font-medium">Deaths</th>
              <th className="px-3 py-2 font-medium">View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((country) => (
              <tr key={country.slug} className="rounded-[20px] bg-[var(--surface-soft)] transition hover:bg-[var(--primary-soft)]/40">
                <td className="rounded-l-2xl px-3 py-4 font-medium">
                  <div className="flex items-center gap-3">
                    {country.flagUrl ? (
                      <img src={country.flagUrl} alt="" className="h-5 w-7 rounded-sm object-cover shadow-[0_4px_12px_rgba(31,41,55,0.12)]" />
                    ) : null}
                    <div>
                      <div>{country.name}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">{country.continent ?? "Region unavailable"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">{formatNumber(country.totalCases)}</td>
                <td className="px-3 py-4">{formatNumber(country.totalRecovered)}</td>
                <td className="px-3 py-4">{formatNumber(country.activeCases)}</td>
                <td className="px-3 py-4">{formatNumber(country.totalDeaths)}</td>
                <td className="rounded-r-2xl px-3 py-4">
                  <Link
                    href={`/countries/${country.slug}`}
                    className="inline-flex rounded-[14px] bg-[var(--primary-soft)] px-3 py-2 font-semibold text-[var(--primary)] transition hover:opacity-90"
                  >
                    View country
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[var(--border)] px-6 py-12 text-center">
            <p className="text-lg font-medium">No data available for this selection.</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Try another country or clear the current filters.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
