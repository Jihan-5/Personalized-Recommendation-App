import { create } from 'zustand';

interface PriceFilter {
    min: number;
    max: number;
}

interface FilterState {
  searchTerm: string;
  filters: {
    price: PriceFilter;
    // Add other filters like category, rarity etc.
  };
  setSearchTerm: (term: string) => void;
  setPriceFilter: (price: PriceFilter) => void;
  resetFilters: () => void;
}

const initialState = {
    searchTerm: '',
    filters: {
        price: { min: 0, max: 1000 },
    }
};

export const useFiltersStore = create<FilterState>((set) => ({
  ...initialState,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPriceFilter: (price) => set((state) => ({ filters: { ...state.filters, price } })),
  resetFilters: () => set(initialState),
}));