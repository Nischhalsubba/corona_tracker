import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteName, siteUrl } from "@/lib/site";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName}: Global Cases, Recoveries, Deaths & Country Trends`,
    template: `%s | ${siteName}`
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
            <main className="w-full px-4 py-5 sm:px-5 lg:px-6 lg:py-5 xl:px-7">{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
