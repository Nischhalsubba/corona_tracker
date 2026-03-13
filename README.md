# Corona Tracker

Multi-source COVID-19 tracker built with Next.js App Router and TypeScript.

## Overview

This app is designed as a public, SEO-friendly COVID-19 data product rather than a single-page dashboard. It uses:

- `disease.sh` for current global and country snapshots
- `OWID` for historical country trend lines
- `WHO` as the official weekly fallback/reference layer
- internal Next.js route handlers to normalize upstream payloads before they reach the UI

## Routes

- `/` dashboard
- `/countries` searchable country index
- `/countries/[slug]` country detail pages
- `/updates` reporting notes
- `/methodology` source and cadence documentation
- `/about` product scope and limitations

Internal API routes:

- `/api/covid/global`
- `/api/covid/countries`
- `/api/covid/country/[slug]`
- `/api/covid/history/[slug]`
- `/api/covid/sources`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Zod
- Recharts
- react-simple-maps

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development mode:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000`

## Notes

- Every major data view exposes source and last updated information.
- WHO data is labeled as weekly and not presented as live.
- Historical charts prefer OWID and fall back to disease.sh historical data when needed.
