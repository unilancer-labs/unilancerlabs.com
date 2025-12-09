import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { report_id } = await req.json()

    if (!report_id) {
      throw new Error('report_id is required')
    }

    // Fetch the report details
    const { data: report, error: reportError } = await supabaseClient
      .from('digital_analysis_reports')
      .select('*')
      .eq('id', report_id)
      .single()

    if (reportError) throw reportError

    // Update status to processing
    await supabaseClient
      .from('digital_analysis_reports')
      .update({ 
        status: 'processing',
        webhook_triggered_at: new Date().toISOString()
      })
      .eq('id', report_id)

    // Get n8n webhook URL and credentials from environment variables
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    const n8nApiKey = Deno.env.get('N8N_API_KEY') // Optional: if webhook requires auth

    if (!n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL environment variable is not set')
    }

    // Prepare payload for n8n webhook
    const webhookPayload = {
      report_id: report.id,
      company_name: report.company_name,
      website_url: report.website_url,
      linkedin_url: report.linkedin_url,
      priority: report.priority,
      created_at: report.created_at,
      // Callback URL for n8n to send results back
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/receive-analysis-results`
    }

    // Call n8n webhook
    const webhookHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add API key if configured
    if (n8nApiKey) {
      webhookHeaders['Authorization'] = `Bearer ${n8nApiKey}`
    }

    const webhookResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify(webhookPayload),
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      throw new Error(`n8n webhook failed: ${webhookResponse.status} - ${errorText}`)
    }

    const webhookResult = await webhookResponse.json()

    // Store webhook request ID if provided
    if (webhookResult.execution_id || webhookResult.workflow_id) {
      await supabaseClient
        .from('digital_analysis_reports')
        .update({ 
          webhook_request_id: webhookResult.execution_id || webhookResult.workflow_id
        })
        .eq('id', report_id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Analysis webhook triggered successfully',
        webhook_result: webhookResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in trigger-analysis function:', error)

    // Try to update report status to failed
    if (error.report_id) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )
        
        await supabaseClient
          .from('digital_analysis_reports')
          .update({ 
            status: 'failed',
            error_message: error.message,
            webhook_completed_at: new Date().toISOString()
          })
          .eq('id', error.report_id)
      } catch (updateError) {
        console.error('Error updating report status:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
