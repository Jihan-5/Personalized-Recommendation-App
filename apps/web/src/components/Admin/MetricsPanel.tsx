"use client";

interface Metrics {
    latency_p95: number;
    latency_p99: number;
    cost_per_1k_recs: number;
}

interface FraudFlag {
    id: number;
    user_id: string;
    reason: string;
    created_at: string;
}

interface MetricsPanelProps {
    metrics: Metrics | null | undefined;
    fraudFlags: FraudFlag[] | null | undefined;
}

export default function MetricsPanel({ metrics, fraudFlags }: MetricsPanelProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">System Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Latency p95</p>
                <p className="text-2xl font-bold">{metrics?.latency_p95?.toFixed(2) ?? 'N/A'} ms</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Latency p99</p>
                <p className="text-2xl font-bold">{metrics?.latency_p99?.toFixed(2) ?? 'N/A'} ms</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Cost / 1k Recs</p>
                <p className="text-2xl font-bold">${metrics?.cost_per_1k_recs?.toFixed(4) ?? 'N/A'}</p>
            </div>
        </div>
        <div>
            <h3 className="font-semibold text-lg mb-2">Recent Fraud/Safety Flags</h3>
            {fraudFlags && fraudFlags.length > 0 ? (
                 <ul className="space-y-2">
                     {fraudFlags.map(flag => (
                         <li key={flag.id} className="text-sm p-2 bg-red-100 text-red-800 rounded-md">
                             <strong>Reason:</strong> {flag.reason} | <strong>User:</strong> {flag.user_id.substring(0, 12)}... | <strong>Time:</strong> {new Date(flag.created_at).toLocaleString()}
                         </li>
                     ))}
                 </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No recent flags.</p>
            )}
        </div>
    </div>
  );
}