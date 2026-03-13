"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { CountrySeriesPoint } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

export function HistoryChart({ data }: { data: CountrySeriesPoint[] }) {
  return (
    <div className="surface rounded-[32px] p-5">
      <div className="border-b border-[var(--border)] pb-4">
        <h2 className="text-xl font-semibold">Historical trend</h2>
        <p className="text-sm text-[var(--muted)]">Line chart view for long-run case and death reporting.</p>
      </div>

      <div className="h-[320px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" minTickGap={48} tickFormatter={(value) => formatDate(value)} stroke="#5e6a62" tick={{ fontSize: 12 }} />
            <YAxis stroke="#5e6a62" tickFormatter={(value) => formatNumber(Number(value))} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatNumber(typeof value === "number" ? value : Number(value))}
              labelFormatter={(value) => formatDate(value)}
              contentStyle={{ borderRadius: 18, border: "1px solid rgba(16, 36, 24, 0.1)" }}
            />
            <Line type="monotone" dataKey="cases" stroke="#0f766e" strokeWidth={3} dot={false} name="Cases" />
            <Line type="monotone" dataKey="deaths" stroke="#9b2c2c" strokeWidth={3} dot={false} name="Deaths" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
