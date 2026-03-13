import type { MetadataRoute } from "next";

import { getCountries } from "@/lib/data/covid";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCountries();
  const staticRoutes = ["", "/countries", "/methodology", "/about", "/updates"];

  return [
    ...staticRoutes.map((route) => ({
      url: `https://example.com${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("hourly" as const) : ("daily" as const),
      priority: route === "" ? 1 : 0.8
    })),
    ...countries.map((country) => ({
      url: `https://example.com/countries/${country.slug}`,
      lastModified: new Date(country.sourceMeta.lastSynced),
      changeFrequency: "daily" as const,
      priority: 0.7
    }))
  ];
}
