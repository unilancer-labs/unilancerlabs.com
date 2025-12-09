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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use service role for server-side updates
    )

    const payload = await req.json()

    const { 
      report_id,
      analysis_result,
      analysis_summary,
      digital_score,
      webhook_request_id,
      status,
      error_message,
      processing_duration_ms
    } = payload

    if (!report_id) {
      throw new Error('report_id is required')
    }

    // Calculate processing duration if not provided
    const { data: existingReport } = await supabaseClient
      .from('digital_analysis_reports')
      .select('webhook_triggered_at')
      .eq('id', report_id)
      .single()

    let calculatedDuration = processing_duration_ms
    if (!calculatedDuration && existingReport?.webhook_triggered_at) {
      const startTime = new Date(existingReport.webhook_triggered_at).getTime()
      const endTime = Date.now()
      calculatedDuration = endTime - startTime
    }

    // Update the report with analysis results
    const { data, error } = await supabaseClient
      .from('digital_analysis_reports')
      .update({
        status: status || 'completed',
        analysis_result: analysis_result,
        analysis_summary: analysis_summary,
        digital_score: digital_score,
        webhook_request_id: webhook_request_id,
        webhook_completed_at: new Date().toISOString(),
        processing_duration_ms: calculatedDuration,
        error_message: error_message
      })
      .eq('id', report_id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Analysis results received and stored successfully',
        data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in receive-analysis-results function:', error)

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
