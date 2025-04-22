
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    // Get all submissions by this user
    const { data: submissions, error: fetchError } = await supabaseClient
      .from('submissions')
      .select('views')
      .eq('user_id', user_id);

    if (fetchError) throw fetchError;
    
    // Calculate total views
    const totalViews = submissions?.reduce((sum, submission) => sum + (submission.views || 0), 0) || 0;
    
    // Update the profile
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        total_views: totalViews 
      })
      .eq('id', user_id);

    if (updateError) throw updateError;
    
    return new Response(
      JSON.stringify({ success: true, totalViews }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-incremented-views function:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
