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
    negative: "text-[var(--negative)] bg-[rgba(155,44,44,0.12)]",
    caution: "text-[var(--caution)] bg-[rgba(183,121,31,0.12)]"
  };

  return (
    <article className="surface metric-gradient rounded-[28px] p-6">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${toneStyles[tone]}`}>
        {title}
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold sm:text-4xl">{formatCompactNumber(value)}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{helper}</p>
        </div>
        {delta ? <div className="text-right text-sm text-[var(--muted)]">{delta}</div> : null}
      </div>
    </article>
  );
}
