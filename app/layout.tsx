import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "COVID-19 Tracker: Global Cases, Recoveries, Deaths & Country Trends",
    template: "%s | COVID-19 Tracker"
  },
  description:
    "Track COVID-19 cases, recoveries, deaths, and country trends in one dashboard. Explore global metrics, country rankings, historical charts, and transparent data sources.",
  openGraph: {
    title: "COVID-19 Tracker",
    description:
      "Global and country-level COVID-19 reporting with source labels, update cadence, and historical trend views.",
    type: "website"
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bodyFont.variable}>
      <body>
        <div className="dashboard-shell">
          <SiteHeader />
          <div className="content-shell">
            <main className="w-full px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
