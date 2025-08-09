"use client";

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Dexie from 'dexie';
import { Item } from '@/lib/types';
import FeedCard from '@/components/FeedCard';

// Define the database
class SavedItemsDB extends Dexie {
  items!: Dexie.Table<Item, number>; 

  constructor() {
    super("SavedItemsDB");
    this.version(1).stores({
      items: '++id, title, description, tags' // Index title, desc, and tags for searching
    });
  }
}

const db = new SavedItemsDB();

export default function SavedPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const savedItems = useLiveQuery(async () => {
        if (!searchQuery) {
            return db.items.toArray();
        }
        // Basic keyword search across indexed fields
        const lowerCaseQuery = searchQuery.toLowerCase();
        return db.items.filter(item => 
            item.title.toLowerCase().includes(lowerCaseQuery) ||
            (item.description?.toLowerCase().includes(lowerCaseQuery) ?? false)
        ).toArray();
    }, [searchQuery]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Saved Items (Offline)</h1>
            <p className="text-muted-foreground mb-6">
                These items are stored in your browser and are available even when you're offline.
            </p>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search your saved items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded-md bg-card"
                />
            </div>

            {savedItems && savedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {savedItems.map((item) => (
                        <FeedCard key={item.id} item={item} isSavedPage />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground mt-8">
                    {searchQuery ? 'No saved items match your search.' : 'You have no saved items yet.'}
                </p>
            )}
        </div>
    );
}