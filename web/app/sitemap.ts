import type { MetadataRoute } from "next";

import { getCountries } from "@/lib/data/covid";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCountries();
  const staticRoutes = ["", "/countries", "/methodology", "/about", "/updates"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("hourly" as const) : ("daily" as const),
      priority: route === "" ? 1 : 0.8
    })),
    ...countries.map((country) => ({
      url: `${siteUrl}/countries/${country.slug}`,
      lastModified: new Date(country.sourceMeta.lastSynced),
      changeFrequency: "daily" as const,
      priority: 0.7
    }))
  ];
}
