import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/countries", "/methodology", "/about", "/updates"],
        disallow: ["/api/", "/_next/"]
      }
    ],
    sitemap: "https://example.com/sitemap.xml"
  };
}
