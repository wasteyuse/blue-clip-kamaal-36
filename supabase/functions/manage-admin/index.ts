
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

    // Check if user is an admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('is_approved')
      .eq('id', user.id)
      .single()

    if (!profile?.is_approved) {
      throw new Error('Unauthorized - Admin access required')
    }

    const { action, title, type, fileUrl, description, submissionId } = await req.json()

    if (action === 'add-asset') {
      const { error: assetError } = await supabaseClient
        .from('assets')
        .insert([
          { 
            title, 
            type, 
            file_url: fileUrl, 
            description 
          }
        ])

      if (assetError) {
        throw assetError
      }

      return new Response(
        JSON.stringify({ message: 'Asset added successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (action === 'approve-submission') {
      // Get submission details
      const { data: submission, error: submissionError } = await supabaseClient
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .single()

      if (submissionError) {
        throw submissionError
      }

      const updateData: any = { status: 'approved' }
      
      if (submission.type === 'product') {
        updateData.affiliate_link = `https://wrvkgerfvxijlvxzstnc.supabase.co/aff/${submissionId}`
      }

      const { error: updateError } = await supabaseClient
        .from('submissions')
        .update(updateData)
        .eq('id', submissionId)

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({ message: 'Submission approved successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Invalid action')
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
