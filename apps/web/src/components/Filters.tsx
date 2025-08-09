"use client";

import { useFiltersStore } from "@/store/useFilters";
import { useDebouncedCallback } from 'use-debounce';

export default function Filters() {
    const { filters, setPriceFilter } = useFiltersStore();
    
    // Debounce the slider to avoid excessive re-renders/API calls while dragging
    const debouncedSetPrice = useDebouncedCallback((value) => {
        setPriceFilter({ min: filters.price.min, max: value });
    }, 200);

    return (
        <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
            <span className="font-semibold text-sm">Filters:</span>
            <div className="flex items-center space-x-2">
                <label htmlFor="max-price" className="text-sm">Max Price:</label>
                 <input
                    id="max-price"
                    type="range"
                    min="0"
                    max="1000" // Adjust max price as needed
                    step="10"
                    defaultValue={filters.price.max}
                    onChange={(e) => debouncedSetPrice(parseInt(e.target.value))}
                    className="w-48"
                />
                <span className="text-sm w-12 text-right">${filters.price.max}</span>
            </div>
            {/* Add more filters here (e.g., category, rarity) */}
        </div>
    );
}