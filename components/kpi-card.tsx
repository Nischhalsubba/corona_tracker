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

  return (
    <article className="surface metric-gradient rounded-[24px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${toneDots[tone]}`} />
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{title}</p>
          </div>
          <p className="mt-4 text-[2.25rem] font-bold leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.7rem]">
            {formatCompactNumber(value)}
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{helper}</p>
        </div>
        <div className={`rounded-[14px] px-3 py-2 text-xs font-semibold ${toneStyles[tone]}`}>{delta ?? "Stable"}</div>
      </div>
    </article>
  );
}
