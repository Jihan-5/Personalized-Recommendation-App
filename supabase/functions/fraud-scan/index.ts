import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// This is a simplified stub for a fraud detection function.
// A real system would have more complex logic.
serve(async (req) => {
  try {
    const { user_id, session_id } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Example rule: Check for more than 10 clicks in the last minute.
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();

    const { data: recentClicks, error: queryError } = await supabaseAdmin
        .from('user_events')
        .select('id', { count: 'exact' })
        .eq('user_id', user_id)
        .eq('event_type', 'click')
        .gte('created_at', oneMinuteAgo);
    
    if (queryError) throw queryError;
    
    if (recentClicks.length > 10) {
        // Flag user for high click velocity
        await supabaseAdmin.from('fraud_signals').insert({
            user_id,
            session_id,
            reason: 'high_click_velocity',
            metadata: { click_count: recentClicks.length }
        });
    }

    return new Response(JSON.stringify({ status: 'scan_complete' }), {
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