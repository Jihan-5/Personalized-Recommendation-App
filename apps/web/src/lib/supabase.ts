import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Avoid build-time crashes when env vars are not provided by using safe fallbacks.
// At runtime, you should set real NEXT_PUBLIC_SUPABASE_URL/ANON_KEY.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);