
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { submissionId, isAffiliate } = await req.json()
    
    if (!submissionId) {
      throw new Error('Submission ID is required')
    }

    const { data: submission, error: fetchError } = await supabaseClient
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError) throw fetchError
    if (!submission) throw new Error('Submission not found')

    // Only process if submission is approved
    if (submission.status !== 'approved') {
      return new Response(
        JSON.stringify({ 
          status: 'ignored', 
          message: 'Submission not approved' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Update views count
    const newViews = (submission.views || 0) + 1
    
    // Calculate earnings based on content type and whether it's an affiliate view
    let earnings = submission.earnings || 0
    
    if (isAffiliate) {
      // Affiliate views earn more
      earnings += 0.5 // ₹0.50 per affiliate view
    } else {
      // Regular views earn ₹1 per 1000 views
      earnings = (newViews / 1000)
    }

    const { error: updateError } = await supabaseClient
      .from('submissions')
      .update({
        views: newViews,
        earnings: earnings,
      })
      .eq('id', submissionId)

    if (updateError) throw updateError

    // Update creator's total earnings
    if (submission.user_id) {
      const { error: profileError } = await supabaseClient.rpc('increment_user_earnings', {
        user_id_param: submission.user_id,
        amount_param: earnings - (submission.earnings || 0) // Only increment the difference
      })

      if (profileError) throw profileError
    }
    
    // Create a transaction record if earnings increased
    if (earnings > (submission.earnings || 0)) {
      const earningsDifference = earnings - (submission.earnings || 0)
      
      if (earningsDifference > 0) {
        const { error: transactionError } = await supabaseClient
          .from('transactions')
          .insert({
            user_id: submission.user_id,
            amount: earningsDifference,
            type: 'earning',
            status: 'completed',
            source: `Content ID: ${submissionId} (${isAffiliate ? 'Affiliate' : 'Regular'} View)`
          })
          
        if (transactionError) console.error('Failed to create transaction record:', transactionError)
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        views: newViews, 
        earnings: earnings 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in track-view function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
