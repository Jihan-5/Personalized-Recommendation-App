import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from "https://deno.land/x/openai/mod.ts";

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY')! });

serve(async (req) => {
  try {
    const { mode, query, filters } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    let items;

    if (query && query.trim() !== "") {
      // Semantic Search mode
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
      });
      const query_embedding = embeddingResponse.data[0].embedding;

      const { data, error } = await supabase.rpc('search_items', {
        query_embedding: query_embedding,
        match_threshold: 0.7, // Adjust as needed
        match_count: 20,
        query_mode: mode,
        max_price: filters?.max_price || 99999
      });

      if (error) throw error;
      items = data.map(item => ({...item, explanation: `This matches your search for "${query}".`}));

    } else {
      // Personalized Feed mode (no search query)
      // For a new user, this just returns recent items.
      // A real implementation would fetch user history and find related items.
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('mode', mode)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      items = data;
    }

    // TODO: A/B testing logic could go here to mix in different result sets
    // using the multi-armed bandit.

    return new Response(JSON.stringify({ items }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});