import type { SourceMeta } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function SourceBadge({ meta }: { meta: SourceMeta }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-white/75 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-[var(--foreground)]">Source: {meta.label}</span>
        <span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 text-xs font-medium text-[var(--primary)]">
          {meta.cadence}
        </span>
        {meta.fallback ? (
          <span className="rounded-full bg-[rgba(183,121,31,0.12)] px-2 py-1 text-xs font-medium text-[var(--caution)]">
            Fallback
          </span>
        ) : null}
      </div>
      <span className="text-[var(--muted)]">Last updated: {formatDateTime(meta.lastSynced)}</span>
      {meta.note ? <span className="text-[var(--muted)]">{meta.note}</span> : null}
    </div>
  );
}
