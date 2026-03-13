import { csvParse } from "d3-dsv";
import { z } from "zod";

import type { CountrySeriesPoint, CountrySnapshot, GlobalSummary, SourceMeta } from "@/lib/types";
import { slugifyCountry } from "@/lib/utils";

const DISEASE_REVALIDATE_SECONDS = 60 * 20;
const OWID_REVALIDATE_SECONDS = 60 * 60 * 12;
const WHO_REVALIDATE_SECONDS = 60 * 60 * 24;

const diseaseGlobalSchema = z.object({
  updated: z.number(),
  cases: z.number(),
  todayCases: z.number().nullable().optional(),
  deaths: z.number(),
  todayDeaths: z.number().nullable().optional(),
  recovered: z.number().nullable().optional(),
  todayRecovered: z.number().nullable().optional(),
  active: z.number().nullable().optional(),
  affectedCountries: z.number().nullable().optional()
});

const diseaseCountriesSchema = z.array(
  z.object({
    updated: z.number(),
    country: z.string(),
    countryInfo: z.object({
      iso2: z.string().nullable().optional(),
      iso3: z.string().nullable().optional(),
      flag: z.string().nullable().optional()
    }),
    continent: z.string().nullable().optional(),
    population: z.number().nullable().optional(),
    cases: z.number(),
    todayCases: z.number().nullable().optional(),
    deaths: z.number(),
    todayDeaths: z.number().nullable().optional(),
    recovered: z.number().nullable().optional(),
    todayRecovered: z.number().nullable().optional(),
    active: z.number().nullable().optional()
  })
);

type DiseaseCountry = z.infer<typeof diseaseCountriesSchema>[number];

async function fetchJson<T>(url: string, revalidate: number, schema: z.ZodType<T>) {
  const response = await fetch(url, { next: { revalidate } });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}`);
  }

  return schema.parse(await response.json());
}

async function fetchText(url: string, revalidate: number) {
  const response = await fetch(url, { next: { revalidate } });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}`);
  }

  return response.text();
}

function asIsoString(value: string | number | Date) {
  return new Date(value).toISOString();
}

function diseaseMeta(updated: number): SourceMeta {
  return {
    source: "disease_sh",
    label: "disease.sh",
    cadence: "near-real-time",
    lastSynced: asIsoString(updated),
    note: "Current snapshot cards are sourced from disease.sh."
  };
}

function whoMeta(): SourceMeta {
  return {
    source: "who",
    label: "WHO",
    cadence: "weekly",
    lastSynced: new Date().toISOString(),
    fallback: true,
    note: "WHO downloadable data is used as the official weekly fallback."
  };
}

function owidMeta(lastSynced: string): SourceMeta {
  return {
    source: "owid",
    label: "Our World in Data",
    cadence: "daily",
    lastSynced: asIsoString(lastSynced),
    note: "Historical country trends prefer OWID time-series data."
  };
}

function parseNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function toCountrySnapshot(country: DiseaseCountry): CountrySnapshot {
  return {
    slug: slugifyCountry(country.country),
    iso2: country.countryInfo.iso2 ?? null,
    iso3: country.countryInfo.iso3 ?? null,
    name: country.country,
    continent: country.continent ?? null,
    population: country.population ?? null,
    flagUrl: country.countryInfo.flag ?? null,
    totalCases: country.cases,
    totalRecovered: country.recovered ?? null,
    totalDeaths: country.deaths,
    activeCases: country.active ?? null,
    todayCases: country.todayCases ?? null,
    todayDeaths: country.todayDeaths ?? null,
    todayRecovered: country.todayRecovered ?? null,
    sourceMeta: diseaseMeta(country.updated)
  };
}

async function getWhoRows() {
  const csv = await fetchText(
    "https://srhdpeuwpubsa.blob.core.windows.net/whdh/COVID/WHO-COVID-19-global-table-data.csv",
    WHO_REVALIDATE_SECONDS
  );
  return csvParse(csv);
}

async function getWhoFallbackGlobal(): Promise<GlobalSummary> {
  const rows = await getWhoRows();
  const row = rows.find((item) => item["Name"] === "Global");

  if (!row) {
    throw new Error("WHO global row missing");
  }

  return {
    sourceMeta: whoMeta(),
    totalCases: parseNumber(row["Cases - cumulative total"]) ?? 0,
    totalRecovered: null,
    totalDeaths: parseNumber(row["Deaths - cumulative total"]) ?? 0,
    activeCases: null,
    todayCases: parseNumber(row["Cases - newly reported in last 24 hours"]),
    todayDeaths: parseNumber(row["Deaths - newly reported in last 24 hours"]),
    todayRecovered: null,
    affectedCountries: rows.length - 1
  };
}

async function getWhoFallbackCountries(): Promise<CountrySnapshot[]> {
  const rows = await getWhoRows();
  return rows
    .filter((row) => row["Name"] && row["Name"] !== "Global")
    .map((row) => ({
      slug: slugifyCountry(row["Name"]!),
      iso2: null,
      iso3: null,
      name: row["Name"]!,
      continent: row["WHO Region"] || null,
      population: null,
      flagUrl: null,
      totalCases: parseNumber(row["Cases - cumulative total"]) ?? 0,
      totalRecovered: null,
      totalDeaths: parseNumber(row["Deaths - cumulative total"]) ?? 0,
      activeCases: null,
      todayCases: parseNumber(row["Cases - newly reported in last 24 hours"]),
      todayDeaths: parseNumber(row["Deaths - newly reported in last 24 hours"]),
      todayRecovered: null,
      sourceMeta: whoMeta()
    }))
    .sort((a, b) => b.totalCases - a.totalCases);
}

export async function getGlobalSummary(): Promise<GlobalSummary> {
  try {
    const data = await fetchJson(
      "https://disease.sh/v3/covid-19/all",
      DISEASE_REVALIDATE_SECONDS,
      diseaseGlobalSchema
    );

    return {
      sourceMeta: diseaseMeta(data.updated),
      totalCases: data.cases,
      totalRecovered: data.recovered ?? null,
      totalDeaths: data.deaths,
      activeCases: data.active ?? null,
      todayCases: data.todayCases ?? null,
      todayDeaths: data.todayDeaths ?? null,
      todayRecovered: data.todayRecovered ?? null,
      affectedCountries: data.affectedCountries ?? null
    };
  } catch {
    return getWhoFallbackGlobal();
  }
}

export async function getCountries(): Promise<CountrySnapshot[]> {
  try {
    const data = await fetchJson(
      "https://disease.sh/v3/covid-19/countries?sort=cases",
      DISEASE_REVALIDATE_SECONDS,
      diseaseCountriesSchema
    );

    return data.map(toCountrySnapshot);
  } catch {
    return getWhoFallbackCountries();
  }
}

export async function getCountrySnapshot(slug: string) {
  const countries = await getCountries();
  return countries.find((country) => country.slug === slug) ?? null;
}

async function getOwidCsv() {
  const urls = [
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",
    "https://covid.ourworldindata.org/data/owid-covid-data.csv"
  ];

  for (const url of urls) {
    try {
      return await fetchText(url, OWID_REVALIDATE_SECONDS);
    } catch {
      // Try next URL.
    }
  }

  throw new Error("Unable to fetch OWID historical data");
}

async function getDiseaseHistoryFallback(countryName: string): Promise<CountrySeriesPoint[]> {
  const response = await fetch(
    `https://disease.sh/v3/covid-19/historical/${encodeURIComponent(countryName)}?lastdays=all`,
    { next: { revalidate: OWID_REVALIDATE_SECONDS } }
  );

  if (!response.ok) {
    throw new Error("Historical fallback failed");
  }

  const json = z
    .object({
      timeline: z.object({
        cases: z.record(z.string(), z.number()),
        deaths: z.record(z.string(), z.number())
      })
    })
    .parse(await response.json());

  return Object.keys(json.timeline.cases)
    .map((key) => {
      const [month, day, year] = key.split("/");
      const date = `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      return {
        date,
        cases: json.timeline.cases[key] ?? null,
        deaths: json.timeline.deaths[key] ?? null,
        source: "disease_sh" as const
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getCountryHistory(slug: string): Promise<CountrySeriesPoint[]> {
  const country = await getCountrySnapshot(slug);

  if (!country) {
    return [];
  }

  if (!country.iso3) {
    return getDiseaseHistoryFallback(country.name);
  }

  try {
    const csv = await getOwidCsv();
    const rows = csvParse(csv);
    const series = rows
      .filter((row) => row["iso_code"] === country.iso3)
      .map((row) => ({
        date: row["date"]!,
        cases: parseNumber(row["total_cases"]),
        deaths: parseNumber(row["total_deaths"]),
        source: "owid" as const
      }))
      .filter((row) => row.date && (row.cases !== null || row.deaths !== null))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (series.length > 0) {
      return series;
    }
  } catch {
    // Use fallback below.
  }

  return getDiseaseHistoryFallback(country.name);
}

export async function getSourceCatalog() {
  const global = await getGlobalSummary();

  return [global.sourceMeta, owidMeta(new Date().toISOString()), whoMeta()];
}
