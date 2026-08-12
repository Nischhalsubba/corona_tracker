import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugifyCountry(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function getCountrySlugCandidates(name: string, iso2?: string | null, iso3?: string | null) {
  const base = slugifyCountry(name);
  const values = new Set<string>([base]);

  if (iso2) {
    values.add(slugifyCountry(iso2));
  }

  if (iso3) {
    values.add(slugifyCountry(iso3));
  }

  const aliases: Record<string, string[]> = {
    usa: ["united-states", "united-states-of-america", "us", "u-s-a", "america"],
    "s-korea": ["south-korea", "republic-of-korea", "korea-south"],
    uk: ["united-kingdom", "great-britain", "britain"],
    uae: ["united-arab-emirates"],
    drc: ["democratic-republic-of-the-congo"]
  };

  for (const alias of aliases[base] ?? []) {
    values.add(alias);
  }

  return [...values];
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Not reported";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 1
  }).format(value);
}

export function formatCompactNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Not reported";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function safeRatio(numerator: number | null, denominator: number | null) {
  if (!numerator || !denominator || denominator <= 0) {
    return null;
  }

  return numerator / denominator;
}
