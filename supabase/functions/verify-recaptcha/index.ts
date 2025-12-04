import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RECAPTCHA_SECRET = Deno.env.get('RECAPTCHA_SECRET_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'No token provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!RECAPTCHA_SECRET) {
      console.error('RECAPTCHA_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Verify token with Google
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${token}`
    })
    
    const data = await response.json()
    
    console.log('reCAPTCHA verification result:', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname
    })
    
    return new Response(
      JSON.stringify({
        success: data.success,
        score: data.score || 0,
        action: data.action || '',
        challenge_ts: data.challenge_ts,
        hostname: data.hostname,
        'error-codes': data['error-codes']
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
