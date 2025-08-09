"use client";

interface Experiment {
    id: number;
    name: string;
    variant: string;
    exposures: number;
    clicks: number;
    created_at: string;
}

interface ExperimentsPanelProps {
    experiments: Experiment[] | null | undefined;
}

export default function ExperimentsPanel({ experiments }: ExperimentsPanelProps) {
    if (!experiments) return <div>No experiment data available.</div>;

    // Aggregate data by experiment name
    const aggregated = experiments.reduce((acc, curr) => {
        if (!acc[curr.name]) {
            acc[curr.name] = [];
        }
        acc[curr.name].push(curr);
        return acc;
    }, {} as Record<string, Experiment[]>);

    return (
        <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">A/B Experiments</h2>
            <div className="space-y-6">
                {Object.entries(aggregated).map(([name, variants]) => (
                    <div key={name}>
                        <h3 className="font-semibold text-lg mb-2">{name}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-2">Variant</th>
                                        <th className="p-2">Exposures</th>
                                        <th className="p-2">Clicks</th>
                                        <th className="p-2">CTR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map(variant => (
                                        <tr key={variant.id} className="border-b">
                                            <td className="p-2">{variant.variant}</td>
                                            <td className="p-2">{variant.exposures}</td>
                                            <td className="p-2">{variant.clicks}</td>
                                            <td className="p-2">
                                                {variant.exposures > 0 ? ((variant.clicks / variant.exposures) * 100).toFixed(2) : '0.00'}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}