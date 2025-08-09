// apps/web/src/components/Admin/MetricsPanel.tsx
"use client";

type Metric = { name: string; value: number | string };
type FraudFlag = { id: number; rule?: string; created_at?: string; [k: string]: any };

export default function MetricsPanel({
  metrics,
  fraudFlags,
}: {
  metrics?: Metric[] | null;
  fraudFlags?: FraudFlag[] | null;
}) {
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <h2 className="text-xl font-semibold">System Metrics</h2>

      <div className="grid gap-2 md:grid-cols-2">
        {(metrics ?? []).map((m, i) => (
          <div key={i} className="rounded border p-3">
            <div className="text-sm text-muted-foreground">{m.name}</div>
            <div className="text-2xl font-bold">{m.value}</div>
          </div>
        ))}
        {(!metrics || metrics.length === 0) && (
          <div className="text-sm text-muted-foreground">No metrics available.</div>
        )}
      </div>

      <h3 className="text-lg font-medium mt-4">Recent Fraud Signals</h3>
      <ul className="list-disc pl-5 space-y-1">
        {(fraudFlags ?? []).map((f) => (
          <li key={f.id} className="text-sm">
            {f.rule ?? "Flag"} — {f.created_at ?? "unknown time"}
          </li>
        ))}
        {(!fraudFlags || fraudFlags.length === 0) && (
          <li className="text-sm text-muted-foreground">No recent flags.</li>
        )}
      </ul>
    </section>
  );
}
