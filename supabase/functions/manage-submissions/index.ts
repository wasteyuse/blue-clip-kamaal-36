
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid token')
    }

    const { action, submissionId, status, reason, type, contentUrl, assetUsed } = await req.json()

    if (action === 'submit') {
      // Check if user is a creator
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('is_creator')
        .eq('id', user.id)
        .single()

      if (!profile?.is_creator) {
        throw new Error('Only creators can submit content')
      }

      const { error: submitError } = await supabaseClient
        .from('submissions')
        .insert([
          {
            user_id: user.id,
            type,
            content_url: contentUrl,
            asset_used: assetUsed,
            status: 'pending',
            views: 0,
            earnings: 0
          }
        ])

      if (submitError) {
        throw submitError
      }

      console.log(`New content submitted by user ${user.id}: ${type}, using asset: ${assetUsed || 'none'}`)

      return new Response(
        JSON.stringify({ message: 'Content submitted successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (action === 'update-status') {
      // Check if user is an admin
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .single()

      if (!profile?.is_approved) {
        throw new Error('Only admins can update submission status')
      }

      const updateData: any = { status }
      
      // Add rejection reason if provided
      if (status === 'rejected' && reason) {
        updateData.reason = reason
      }

      const { error: updateError } = await supabaseClient
        .from('submissions')
        .update(updateData)
        .eq('id', submissionId)

      if (updateError) {
        throw updateError
      }

      // Create transaction record for rejected submissions to notify users
      if (status === 'rejected') {
        // Get the submission to find the user_id
        const { data: submission } = await supabaseClient
          .from('submissions')
          .select('user_id')
          .eq('id', submissionId)
          .single()
          
        if (submission) {
          // Add a notification transaction
          await supabaseClient
            .from('transactions')
            .insert({
              user_id: submission.user_id,
              amount: 0,
              type: 'notification',
              status: 'completed',
              source: `Submission ${submissionId} was rejected: ${reason || 'No reason provided'}`
            })
        }
      }

      console.log(`Submission ${submissionId} status updated to ${status} by admin ${user.id}`)

      return new Response(
        JSON.stringify({ message: 'Submission status updated successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Invalid action')
  } catch (error) {
    console.error('Error in manage-submissions function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
