"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import ExperimentsPanel from '@/components/Admin/ExperimentsPanel';
import MetricsPanel from '@/components/Admin/MetricsPanel';

const fetchAdminData = async () => {
    // In a real app, these would be separate, more complex queries.
    // We'll simulate fetching combined data for simplicity.
    const { data: experiments, error: expError } = await supabase
        .from('ab_experiments')
        .select('*');

    const { data: metrics, error: metError } = await supabase
        .rpc('get_system_metrics');

    const { data: fraud, error: fraudError } = await supabase
        .from('fraud_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
    if (expError || metError || fraudError) {
        console.error(expError || metError || fraudError);
        throw new Error('Failed to fetch admin data');
    }
    
    return { experiments, metrics, fraud };
};


export default function AdminPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['adminData'],
        queryFn: fetchAdminData,
    });

    if (isLoading) return <div className="p-4">Loading admin dashboard...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <MetricsPanel metrics={data?.metrics} fraudFlags={data?.fraud} />
            <ExperimentsPanel experiments={data?.experiments} />
        </div>
    );
}