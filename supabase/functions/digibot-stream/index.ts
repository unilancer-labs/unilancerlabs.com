// DigiBot Streaming Chat - SSE (Server-Sent Events) ile streaming yanıtlar
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  reportId: string;
  sessionId: string;
  message: string;
  reportContext?: string;
  viewerId?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { reportId, sessionId, message, reportContext, viewerId }: ChatRequest = await req.json();

    if (!reportId || !sessionId || !message) {
      throw new Error('Missing required fields');
    }

    // Get AI config from database (if exists)
    const { data: aiConfig } = await supabase
      .from('digibot_config')
      .select('*')
      .eq('is_active', true)
      .single();

    const config = {
      model: aiConfig?.model || Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
      temperature: aiConfig?.temperature || 0.6,
      maxTokens: aiConfig?.max_tokens || 1000,
      systemPrompt: aiConfig?.system_prompt || null,
    };

    // Get conversation history
    const { data: history } = await supabase
      .from('report_chat_conversations')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(15);

    // Build messages array
    const messages: ChatMessage[] = [];

    // System prompt - use custom or default
    const systemPrompt = config.systemPrompt || buildDefaultSystemPrompt(reportContext);
    messages.push({ role: 'system', content: systemPrompt });

    // Add history
    if (history && history.length > 0) {
      for (const msg of history) {
        if (msg.role !== 'system') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Save user message
    await supabase.from('report_chat_conversations').insert({
      report_id: reportId,
      session_id: sessionId,
      viewer_id: viewerId || null,
      role: 'user',
      content: message,
      tokens_used: 0,
    });

    // Call OpenAI with streaming
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: true,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    // Create a TransformStream to process the SSE data
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openaiResponse.body!.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Save complete response to database
                  await supabase.from('report_chat_conversations').insert({
                    report_id: reportId,
                    session_id: sessionId,
                    viewer_id: viewerId || null,
                    role: 'assistant',
                    content: fullResponse,
                    tokens_used: 0,
                  });
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }

                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content || '';
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function buildDefaultSystemPrompt(reportContext?: string): string {
  return `Sen DigiBot'sun - Unilancer Labs'ın yapay zeka destekli dijital analiz asistanısın.

## KİMLİĞİN
- İsim: DigiBot
- Şirket: Unilancer Labs
- Uzmanlık: Dijital pazarlama, web geliştirme, SEO, sosyal medya, e-ticaret
- Kişilik: Profesyonel ama samimi, yardımsever, çözüm odaklı

## UNILANCER LABS
- Kuruluş: 2025 (2021'den beri faaliyet)
- Konum: İstanbul (Beyoğlu ve Teknopark)
- Model: Üniversite tabanlı yönetilen freelance ekosistemi
- Vizyon: "Beyin Göçü yerine Hizmet İhracatı"

HİZMETLER:
• Web Tasarım & Geliştirme (20K-60K₺)
• E-ticaret Çözümleri (30K-200K₺)
• Mobil Uygulama (iOS & Android)
• Sosyal Medya Yönetimi (10K-80K₺/ay)
• SEO & Dijital Pazarlama (15K-80K₺/ay)
• AI ChatBot Entegrasyonları
• 3D/AR/VR Projeleri

İLETİŞİM: +90 506 152 32 55 | info@unilancerlabs.com

## RAPOR BAĞLAMI
${reportContext || 'Rapor bilgisi yüklenmedi.'}

## KURALLAR
1. Türkçe yanıt ver
2. Kısa ve öz tut (2-3 paragraf)
3. Markdown kullan (**kalın**, listeler)
4. Emoji kullan ama abartma (2-3)
5. Somut öneriler sun
6. Kesin fiyat verme, görüşme öner`;
}
