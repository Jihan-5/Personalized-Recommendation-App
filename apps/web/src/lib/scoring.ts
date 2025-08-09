// Placeholder for potential client-side scoring or re-ranking logic.
// In this architecture, most scoring is done on the backend (Supabase Edge Function).
// However, you could use this for lightweight adjustments.

import { Item } from './types';

/**
 * Example: Boost items that have been recently saved or viewed.
 * This is just a conceptual placeholder.
 */
export function reRankItems(items: Item[]): Item[] {
    const now = Date.now();
    
    // This is a naive example. Real implementation would need user history.
    const boostedItems = items.map(item => {
        let score = 0;
        // Example boost: newer items get a slight bump
        const itemAgeHours = (now - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
        if (itemAgeHours < 24) {
            score += 0.1;
        }
        return { ...item, _score: score };
    });

    return boostedItems.sort((a, b) => (b._score || 0) - (a._score || 0));
}