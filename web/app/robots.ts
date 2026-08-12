import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/countries", "/methodology", "/about", "/updates"],
        disallow: ["/api/", "/_next/"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
