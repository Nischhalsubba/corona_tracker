export type SourceId = "disease_sh" | "owid" | "who";
export type Cadence = "near-real-time" | "daily" | "weekly";

export type SourceMeta = {
  source: SourceId;
  label: string;
  cadence: Cadence;
  lastSynced: string;
  note?: string;
  fallback?: boolean;
};

export type GlobalSummary = {
  sourceMeta: SourceMeta;
  totalCases: number;
  totalRecovered: number | null;
  totalDeaths: number;
  activeCases: number | null;
  todayCases: number | null;
  todayDeaths: number | null;
  todayRecovered: number | null;
  affectedCountries: number | null;
};

export type CountrySnapshot = {
  slug: string;
  iso2: string | null;
  iso3: string | null;
  name: string;
  continent: string | null;
  population: number | null;
  flagUrl: string | null;
  totalCases: number;
  totalRecovered: number | null;
  totalDeaths: number;
  activeCases: number | null;
  todayCases: number | null;
  todayDeaths: number | null;
  todayRecovered: number | null;
  sourceMeta: SourceMeta;
};

export type CountrySeriesPoint = {
  date: string;
  cases: number | null;
  deaths: number | null;
  source: SourceId;
};
