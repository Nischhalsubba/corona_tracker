import type { SourceMeta } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function SourceBadge({ meta }: { meta: SourceMeta }) {
  return (
    <div className="surface flex flex-col gap-2 rounded-[24px] px-5 py-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-[var(--foreground)]">Source: {meta.label}</span>
        <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
          {meta.cadence}
        </span>
        {meta.fallback ? (
          <span className="rounded-full bg-[rgba(255,176,32,0.16)] px-3 py-1 text-xs font-semibold text-[var(--caution)]">
            Fallback
          </span>
        ) : null}
      </div>
      <span className="text-[var(--text-secondary)]">Last updated: {formatDateTime(meta.lastSynced)}</span>
      {meta.note ? <span className="text-[var(--text-tertiary)]">{meta.note}</span> : null}
    </div>
  );
}
