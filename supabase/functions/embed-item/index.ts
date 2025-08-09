import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from "https://deno.land/x/openai/mod.ts";

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY')! });

serve(async (req) => {
  try {
    const { record } = await req.json();
    const { id, title, description, tags } = record;

    // Create a text string to embed
    const content = `Title: ${title}. Description: ${description}. Tags: ${tags?.join(', ')}`;

    // Generate embedding with OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Store the embedding in Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabaseAdmin
      .from('items')
      .update({ embedding })
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ message: `Embedding created for item ${id}` }), {
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