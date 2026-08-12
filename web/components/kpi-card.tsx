import type { ReactNode } from "react";

import { formatCompactNumber } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  helper,
  delta,
  tone = "primary"
}: {
  title: string;
  value: number | null;
  helper: string;
  delta?: ReactNode;
  tone?: "primary" | "positive" | "negative" | "caution";
}) {
  const toneStyles = {
    primary: "text-[var(--primary)] bg-[var(--primary-soft)]",
    positive: "text-[var(--positive)] bg-[rgba(63,143,79,0.12)]",
    negative: "text-[var(--negative)] bg-[rgba(255,90,95,0.12)]",
    caution: "text-[var(--caution)] bg-[rgba(255,176,32,0.16)]"
  };

  const toneDots = {
    primary: "bg-[var(--primary)]",
    positive: "bg-[var(--positive)]",
    negative: "bg-[var(--negative)]",
    caution: "bg-[var(--caution)]"
  };

  const toneText = {
    primary: "text-[var(--primary)]",
    positive: "text-[var(--positive)]",
    negative: "text-[var(--negative)]",
    caution: "text-[var(--caution)]"
  };

  const sparkline = {
    primary: "M2 44 C 10 32, 14 30, 20 18 S 34 9, 42 13 S 54 24, 62 10",
    positive: "M2 44 C 8 36, 12 28, 18 34 S 28 50, 36 24 S 50 8, 62 10",
    negative: "M2 44 C 12 14, 18 32, 26 18 S 40 12, 48 20 S 56 24, 62 14",
    caution: "M2 44 C 10 30, 18 16, 28 18 S 42 22, 52 12 S 60 7, 62 8"
  };

  return (
    <article className="surface metric-gradient rounded-[26px] p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(31,41,55,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-[var(--text-secondary)]">{title}</p>
            <span className={`h-0 w-0 border-x-[7px] border-b-[10px] border-x-transparent ${tone === "positive" ? "rotate-180 border-b-[var(--positive)]" : `border-b-[var(--primary)]`}`} />
          </div>
          <p className="mt-5 text-[2.2rem] font-bold leading-none tracking-[-0.05em] text-[var(--foreground)] sm:text-[2.8rem]">
            {formatCompactNumber(value)}
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{helper}</p>
        </div>
        <div className="min-w-[92px] pt-1 text-right">
          <div className={`inline-flex rounded-[12px] px-2.5 py-1 text-[11px] font-semibold ${toneStyles[tone]}`}>{delta ?? "Stable"}</div>
          <svg viewBox="0 0 64 48" className="mt-4 h-16 w-24 overflow-visible">
            <defs>
              <linearGradient id={`fade-${tone}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className={toneText[tone]}>
              <path d={`${sparkline[tone]} L 62 48 L 2 48 Z`} fill={`url(#fade-${tone})`} />
              <path d={sparkline[tone]} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>
    </article>
  );
}
