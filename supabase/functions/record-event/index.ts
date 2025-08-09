import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { event } = await req.json(); // e.g., { user_id, event_type, item_id, ... }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabaseAdmin.from('user_events').insert(event);

    if (error) throw error;

    // You could also trigger other functions from here, like fraud detection.
    if (event.event_type === 'click') {
        // Maybe check for high click velocity
        // await supabaseAdmin.functions.invoke('fraud-scan', { body: { user_id: event.user_id }});
    }

    return new Response(JSON.stringify({ success: true }), {
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