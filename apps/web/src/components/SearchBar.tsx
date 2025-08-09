"use client";

import { useState } from 'react';
import { useFiltersStore } from '@/store/useFilters';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const { setSearchTerm } = useFiltersStore();
  const [localSearch, setLocalSearch] = useState('');

  const debouncedSetSearch = useDebouncedCallback((value) => {
    setSearchTerm(value);
  }, 300); // 300ms debounce delay

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search for anything in plain English..."
        value={localSearch}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border rounded-full bg-card"
      />
    </div>
  );
}