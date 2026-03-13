import { csvParse } from "d3-dsv";
import { z } from "zod";

import type { CountrySeriesPoint, CountrySnapshot, GlobalSummary, ReportingUpdate, SourceMeta } from "@/lib/types";
import { slugifyCountry } from "@/lib/utils";

const DISEASE_REVALIDATE_SECONDS = 60 * 20;
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
    active: z.number().nullable().optional(),
    critical: z.number().nullable().optional(),
    tests: z.number().nullable().optional(),
    casesPerOneMillion: z.number().nullable().optional(),
    deathsPerOneMillion: z.number().nullable().optional()
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

function liveMeta(updated: number): SourceMeta {
  return {
    source: "disease_sh",
    label: "disease.sh",
    cadence: "near-real-time",
    lastSynced: asIsoString(updated),
    note: "Dashboard, country pages, and reporting notes are generated from disease.sh current COVID-19 endpoints."
  };
}

function whoFallbackMeta(): SourceMeta {
  return {
    source: "who",
    label: "WHO",
    cadence: "weekly",
    lastSynced: new Date().toISOString(),
    fallback: true,
    note: "WHO weekly downloadable data is used only as a resilience fallback when the live source is unavailable."
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
    criticalCases: country.critical ?? null,
    tests: country.tests ?? null,
    casesPerMillion: country.casesPerOneMillion ?? null,
    deathsPerMillion: country.deathsPerOneMillion ?? null,
    sourceMeta: liveMeta(country.updated)
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
    sourceMeta: whoFallbackMeta(),
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
      criticalCases: null,
      tests: null,
      casesPerMillion: null,
      deathsPerMillion: null,
      sourceMeta: whoFallbackMeta()
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
      sourceMeta: liveMeta(data.updated),
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

    return data
      .map(toCountrySnapshot)
      .filter((country) => Boolean(country.name));
  } catch {
    return getWhoFallbackCountries();
  }
}

export async function getCountrySnapshot(slug: string) {
  const countries = await getCountries();
  return countries.find((country) => country.slug === slug) ?? null;
}

export async function getCountryHistory(slug: string): Promise<CountrySeriesPoint[]> {
  const country = await getCountrySnapshot(slug);

  if (!country) {
    return [];
  }

  const response = await fetch(`https://disease.sh/v3/covid-19/historical/${encodeURIComponent(country.name)}?lastdays=all`, {
    next: { revalidate: DISEASE_REVALIDATE_SECONDS }
  });

  if (!response.ok) {
    return [];
  }

  const json = z
    .object({
      timeline: z.object({
        cases: z.record(z.string(), z.number()).optional().default({}),
        deaths: z.record(z.string(), z.number()).optional().default({})
      })
    })
    .parse(await response.json());

  return Object.keys(json.timeline.cases)
    .map((key) => {
      const [month, day, year] = key.split("/");
      const fullYear = year.length === 2 ? `20${year}` : year;
      const date = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      return {
        date,
        cases: json.timeline.cases[key] ?? null,
        deaths: json.timeline.deaths[key] ?? null,
        source: "disease_sh" as const
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getReportingUpdates(): Promise<ReportingUpdate[]> {
  const [global, countries] = await Promise.all([getGlobalSummary(), getCountries()]);

  const caseLeaders = [...countries]
    .filter((country) => (country.todayCases ?? 0) > 0)
    .sort((a, b) => (b.todayCases ?? 0) - (a.todayCases ?? 0))
    .slice(0, 4)
    .map((country) => ({
      id: `cases-${country.slug}`,
      slug: country.slug,
      title: `${country.name} reported the highest case increase`,
      summary: `${country.name} added ${country.todayCases ?? 0} newly reported cases in the latest live snapshot.`,
      metricLabel: "New cases",
      metricValue: country.todayCases,
      secondaryLabel: "Total cases",
      secondaryValue: country.totalCases,
      tone: "primary" as const,
      publishedAt: country.sourceMeta.lastSynced,
      sourceMeta: country.sourceMeta
    }));

  const deathLeaders = [...countries]
    .filter((country) => (country.todayDeaths ?? 0) > 0)
    .sort((a, b) => (b.todayDeaths ?? 0) - (a.todayDeaths ?? 0))
    .slice(0, 3)
    .map((country) => ({
      id: `deaths-${country.slug}`,
      slug: country.slug,
      title: `${country.name} showed the largest death change`,
      summary: `${country.name} recorded ${country.todayDeaths ?? 0} newly reported deaths in the latest live refresh.`,
      metricLabel: "New deaths",
      metricValue: country.todayDeaths,
      secondaryLabel: "Total deaths",
      secondaryValue: country.totalDeaths,
      tone: "negative" as const,
      publishedAt: country.sourceMeta.lastSynced,
      sourceMeta: country.sourceMeta
    }));

  const globalNote: ReportingUpdate = {
    id: "global-snapshot",
    slug: null,
    title: "Global live reporting snapshot",
    summary: `The latest global refresh shows ${global.todayCases ?? 0} new cases and ${global.todayDeaths ?? 0} new deaths across currently reporting countries.`,
    metricLabel: "Affected countries",
    metricValue: global.affectedCountries,
    secondaryLabel: "Global cases",
    secondaryValue: global.totalCases,
    tone: "info",
    publishedAt: global.sourceMeta.lastSynced,
    sourceMeta: global.sourceMeta
  };

  return [globalNote, ...caseLeaders, ...deathLeaders];
}

export async function getSourceCatalog() {
  const global = await getGlobalSummary();

  return [
    global.sourceMeta,
    {
      source: "disease_sh" as const,
      label: "disease.sh historical",
      cadence: "daily" as const,
      lastSynced: global.sourceMeta.lastSynced,
      note: "Historical context is pulled from the same public source when the archive endpoint is available."
    }
  ];
}
