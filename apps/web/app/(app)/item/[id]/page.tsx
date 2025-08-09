"use client";

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import TrendSpark from '@/components/TrendSpark';
import FeedCard from '@/components/FeedCard';
import { Item } from '@/lib/types';

const fetchItemData = async (itemId: string) => {
    const { data: item, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

    if (itemError) throw new Error('Item not found');

    // Fetch summary (could be pre-generated and stored)
    const { data: summaryData } = await supabase.functions.invoke('summarize-item', {
        body: { description: item.description },
    });
    
    // Fetch similar items using the RPC function
    const { data: similarItems, error: similarError } = await supabase
      .rpc('get_similar_items', { item_id_in: item.id, match_count: 5 });

    if (similarError) {
        console.error("Error fetching similar items:", similarError);
    }
    
    return { item, summary: summaryData?.summary, similarItems };
};

export default function ItemPage() {
    const params = useParams();
    const itemId = params.id as string;

    const { data, isLoading, error } = useQuery({
        queryKey: ['item', itemId],
        queryFn: () => fetchItemData(itemId),
        enabled: !!itemId, // only run query if itemId is available
    });

    if (isLoading) return <div className="p-4 text-center">Loading item details...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error loading item.</div>;
    if (!data || !data.item) return <div className="p-4 text-center">Item not found.</div>;

    const { item, summary, similarItems } = data;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                    <Image
                        src={item.image_url || 'https://placehold.co/600x400'}
                        alt={item.title}
                        width={600}
                        height={600}
                        className="rounded-lg shadow-lg w-full"
                    />
                </div>
                <div className="flex flex-col space-y-4">
                    <h1 className="text-4xl font-bold">{item.title}</h1>
                    <p className="text-xl text-muted-foreground">{item.mode === 'NFT' ? 'Floor Price' : 'Price'}: <span className="font-semibold text-foreground">${item.price?.toFixed(2)}</span></p>
                    <div className="py-4">
                        <h3 className="font-semibold mb-2">AI Summary</h3>
                        <p className="text-base p-4 bg-secondary rounded-md">{summary || item.description}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Price Trend (7d)</h3>
                        <div className="h-24">
                           <TrendSpark />
                        </div>
                    </div>
                    <button className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Follow Collection</button>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold mb-6">Similar Items</h2>
                {similarItems && similarItems.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {similarItems.map((similarItem: Item) => (
                            <FeedCard key={similarItem.id} item={similarItem} />
                        ))}
                    </div>
                ) : (
                    <p>No similar items found.</p>
                )}
            </div>
        </div>
    );
}