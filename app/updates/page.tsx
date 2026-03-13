import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates & Reporting Notes",
  description: "Read reporting notes, source changes, and methodology updates for the COVID-19 Tracker.",
  alternates: { canonical: "/updates" }
};

const updates = [
  {
    title: "Multi-source dashboard baseline",
    date: "2026-03-13",
    body: "Current cards use disease.sh, country trend lines prefer OWID, and WHO remains the official weekly reference layer."
  },
  {
    title: "Trust labels added across core views",
    date: "2026-03-13",
    body: "Every data-heavy section now surfaces source, last updated time, and reporting cadence directly in the interface."
  }
];

export default function UpdatesPage() {
  return (
    <div className="space-y-8">
      <section className="surface rounded-[28px] p-8">
        <h1 className="text-[2.4rem] font-bold tracking-[-0.04em]">Updates &amp; Reporting Notes</h1>
        <p className="mt-3 max-w-3xl text-lg text-[var(--text-secondary)]">Product updates, source changes, and reporting notes.</p>
      </section>

      <section className="space-y-4">
        {updates.map((update) => (
          <article key={update.title} className="surface rounded-[28px] p-6">
            <div className="text-sm font-medium text-[var(--text-tertiary)]">{update.date}</div>
            <h2 className="mt-2 text-2xl font-semibold">{update.title}</h2>
            <p className="mt-3 text-[var(--text-secondary)]">{update.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
