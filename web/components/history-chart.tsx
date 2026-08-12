"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { CountrySeriesPoint } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

export function HistoryChart({ data }: { data: CountrySeriesPoint[] }) {
  return (
    <div className="surface rounded-[28px] p-6">
      <div className="border-b border-[var(--border)] pb-4">
        <h2 className="text-xl font-semibold">Historical trend</h2>
        <p className="text-sm text-[var(--text-secondary)]">Line chart view for long-run case and death reporting.</p>
      </div>

      <div className="h-[320px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" minTickGap={48} tickFormatter={(value) => formatDate(value)} stroke="#98A2B3" tick={{ fontSize: 12 }} />
            <YAxis stroke="#98A2B3" tickFormatter={(value) => formatNumber(Number(value))} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatNumber(typeof value === "number" ? value : Number(value))}
              labelFormatter={(value) => formatDate(value)}
              contentStyle={{ borderRadius: 18, border: "1px solid #EEF1F5", boxShadow: "0 16px 40px rgba(31,41,55,0.08)" }}
            />
            <Line type="monotone" dataKey="cases" stroke="#FF5A5F" strokeWidth={3} dot={false} name="Cases" />
            <Line type="monotone" dataKey="deaths" stroke="#FFB020" strokeWidth={3} dot={false} name="Deaths" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
