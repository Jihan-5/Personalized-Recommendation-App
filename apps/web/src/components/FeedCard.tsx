"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Item } from '@/lib/types';
import { useState } from 'react';
import Dexie from 'dexie';

// Re-using the DB definition from the saved page
class SavedItemsDB extends Dexie {
  items!: Dexie.Table<Item, number>; 
  constructor() { super("SavedItemsDB"); this.version(1).stores({ items: '++id, title, description, tags' }); }
}
const db = new SavedItemsDB();

interface FeedCardProps {
  item: Item;
  isSavedPage?: boolean;
}

export default function FeedCard({ item, isSavedPage = false }: FeedCardProps) {
    const [isWhyThisVisible, setWhyThisVisible] = useState(false);

    const saveItem = async () => {
        try {
            await db.items.add(item);
            alert(`${item.title} saved!`);
        } catch (error) {
            console.error("Failed to save item:", error);
            alert("This item might already be saved.");
        }
    };
    
    const unsaveItem = async () => {
         try {
            if (item.id) {
                await db.items.delete(item.id);
                alert(`${item.title} removed from saved items.`);
            }
        } catch (error) {
            console.error("Failed to unsave item:", error);
        }
    }

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-card">
            <Link href={`/item/${item.id}`}>
                <Image
                    src={item.image_url || 'https://placehold.co/400x400'}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <h3 className="font-semibold truncate">
                    <Link href={`/item/${item.id}`}>{item.title}</Link>
                </h3>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="mt-3 flex justify-between items-center">
                    <button onClick={() => setWhyThisVisible(!isWhyThisVisible)} className="text-xs font-semibold text-primary hover:underline">
                        Why this?
                    </button>
                    {isSavedPage ? (
                        <button onClick={unsaveItem} className="text-xs font-semibold text-red-500 hover:underline">Unsave</button>
                    ) : (
                        <button onClick={saveItem} className="text-xs font-semibold text-blue-500 hover:underline">Save</button>
                    )}
                </div>
                {isWhyThisVisible && (
                    <div className="mt-2 p-2 text-xs bg-blue-50 border border-blue-200 rounded-md">
                        <p>{item.explanation || "This was recommended based on your recent activity and similar items you've shown interest in."}</p>
                    </div>
                )}
            </div>
        </div>
    );
}