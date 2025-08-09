// This is a placeholder for your Supabase generated types.
// You would typically generate this file using:
// npx supabase gen types typescript --project-id <your-project-id> --schema public > apps/web/src/lib/types.ts
// For now, we define the core types manually.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      items: {
        Row: Item;
        Insert: Partial<Item>;
        Update: Partial<Item>;
      };
      // ... other tables like ab_experiments, fraud_signals
    };
    Views: {
      // ... your views
    };
    Functions: {
      // ... your functions
    };
  };
}


export type Mode = "NFT" | "Shopping" | "Media";

export interface Item {
    id: number;
    created_at: string;
    title: string;
    description: string;
    image_url: string;
    price: number;
    mode: Mode;
    tags: string[];
    // vector field is not typically sent to client
    explanation?: string; // Added for "Why This?" feature
}