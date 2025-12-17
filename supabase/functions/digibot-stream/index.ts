// DigiBot Streaming Chat - SSE (Server-Sent Events) ile streaming yanıtlar
// Token Optimizasyonlu + Rate Limiting + Maliyet Takibi
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

// ============================================================
// TOKEN FİYATLANDIRMA ($ per 1M tokens) - Aralık 2024
// ============================================================
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
};

// ============================================================
// RATE LIMITING - Session başına dakikada max istek
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = { maxRequests: 20, windowMs: 60000 }; // 20 istek/dakika

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

    // ==========================================
    // RATE LIMITING - Kötüye kullanımı önle
    // ==========================================
    const now = Date.now();
    const rateKey = `${sessionId}`;
    const rateData = rateLimitMap.get(rateKey);
    
    if (rateData) {
      if (now < rateData.resetTime) {
        if (rateData.count >= RATE_LIMIT.maxRequests) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
          );
        }
        rateData.count++;
      } else {
        rateLimitMap.set(rateKey, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
      }
    } else {
      rateLimitMap.set(rateKey, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
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
      maxTokens: aiConfig?.max_tokens || 800, // Optimizasyon: 1000 -> 800
      systemPrompt: aiConfig?.system_prompt || null,
    };

    // ==========================================
    // CONVERSATION HISTORY - Token Optimizasyonu
    // ==========================================
    // Sadece son 6 mesaj al (15 yerine) - token tasarrufu
    const { data: history } = await supabase
      .from('report_chat_conversations')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false }) // En yeniden eskiye
      .limit(6);

    // İlk mesaj mı kontrol et (context optimizasyonu için)
    const isFirstMessage = !history || history.length === 0;

    // Build messages array
    const messages: ChatMessage[] = [];

    // ==========================================
    // SYSTEM PROMPT - İlk mesaj vs Devam mesajı
    // ==========================================
    let systemPrompt: string;
    if (config.systemPrompt) {
      const knowledgeBase = parseKnowledgeBase(config.systemPrompt);
      // İlk mesajda full context, sonrakilerde compact
      const behaviorRules = isFirstMessage 
        ? buildBehaviorPrompt(reportContext)
        : buildCompactBehaviorPrompt(reportContext);
      systemPrompt = knowledgeBase + '\n\n' + behaviorRules;
    } else {
      systemPrompt = isFirstMessage 
        ? buildFullDefaultPrompt(reportContext)
        : buildCompactDefaultPrompt(reportContext);
    }
    messages.push({ role: 'system', content: systemPrompt });

    // Add history (tersine çevir - en eski mesaj önce olmalı)
    if (history && history.length > 0) {
      const reversedHistory = [...history].reverse();
      for (const msg of reversedHistory) {
        if (msg.role !== 'system') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // ==========================================
    // TOKEN SAYIMI - Input tokens tahmini
    // ==========================================
    const estimatedInputTokens = estimateTokens(messages);

    // Save user message
    await supabase.from('report_chat_conversations').insert({
      report_id: reportId,
      session_id: sessionId,
      viewer_id: viewerId || null,
      role: 'user',
      content: message,
      tokens_used: Math.ceil(message.length / 4), // Yaklaşık token
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
                  // ==========================================
                  // TOKEN SAYIMI & MALİYET HESAPLAMA
                  // ==========================================
                  const estimatedOutputTokens = Math.ceil(fullResponse.length / 4);
                  const totalTokens = estimatedInputTokens + estimatedOutputTokens;
                  
                  // Maliyet hesapla
                  const pricing = MODEL_PRICING[config.model] || MODEL_PRICING['gpt-4o-mini'];
                  const costUsd = (estimatedInputTokens * pricing.input + estimatedOutputTokens * pricing.output) / 1_000_000;

                  // Save complete response with token info
                  await supabase.from('report_chat_conversations').insert({
                    report_id: reportId,
                    session_id: sessionId,
                    viewer_id: viewerId || null,
                    role: 'assistant',
                    content: fullResponse,
                    tokens_used: totalTokens,
                  });

                  // Analytics'e maliyet kaydet
                  await supabase.from('report_analytics').insert({
                    report_id: reportId,
                    viewer_id: viewerId || null,
                    event_type: 'chat_completion',
                    event_data: {
                      session_id: sessionId,
                      input_tokens: estimatedInputTokens,
                      output_tokens: estimatedOutputTokens,
                      total_tokens: totalTokens,
                      estimated_cost_usd: costUsd,
                      model: config.model,
                      is_first_message: isFirstMessage,
                    },
                  }).catch(() => {}); // Analytics hatası chat'i durdurmasın

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

// ============================================================
// PROMPT FONKSİYONLARI - Token Optimizasyonlu
// ============================================================

/**
 * Admin panelindeki JSON'u BİLGİ TABANI olarak parse eder
 * Sadece şirket bilgileri, hizmetler, fiyatlar - davranış kuralları YOK
 */
function parseKnowledgeBase(jsonPrompt: string): string {
  try {
    const data = JSON.parse(jsonPrompt);
    const parts: string[] = [];
    
    parts.push('## UNILANCER LABS BİLGİ TABANI\n');

    // support_info array'ini işle
    if (data.support_info && Array.isArray(data.support_info)) {
      for (const section of data.support_info) {
        if (!section.section) continue;
        
        const sectionName = section.section;
        
        // Şirket Kimliği
        if (sectionName.includes('Şirket Kimliği') || sectionName.includes('İletişim')) {
          if (section.legal) {
            parts.push(`### Şirket: ${section.legal.full_legal_name || section.legal.brand_name}`);
          }
          if (section.phones?.length) {
            parts.push(`📞 ${section.phones[0].number} (${section.phones[0].hours || 'Hafta içi 09:00-18:00'})`);
          }
          if (section.emails?.length) {
            section.emails.forEach((e: any) => parts.push(`📧 ${e.type}: ${e.email}`));
          }
          if (section.officers?.length) {
            parts.push('\n**Ekip:**');
            section.officers.forEach((o: any) => parts.push(`• ${o.name} - ${o.title} (${o.email})`));
          }
        }
        
        // Hakkımızda
        if (sectionName === 'Hakkımızda' || sectionName === 'Genel Tanıtım') {
          if (section.details?.length) {
            parts.push(`\n### ${sectionName}`);
            section.details.slice(0, 4).forEach((d: string) => parts.push(`• ${d}`));
          }
        }
        
        // Hizmetler
        if (sectionName === 'Hizmetler') {
          if (section.items?.length) {
            parts.push('\n### Hizmetler');
            section.items.forEach((s: any) => {
              parts.push(`• **${s.name}**: ${s.description || ''}`);
            });
          }
        }
        
        // DigitAll Fiyatlandırma
        if (sectionName.includes('DigitAll') || sectionName.includes('Katalog')) {
          if (section.items?.length) {
            parts.push('\n### Fiyat Aralıkları (KDV Hariç)');
            section.items.forEach((item: any) => {
              const min = item.price_range?.min_try || '';
              const max = item.price_range?.max_try || '';
              const period = item.price_range?.period ? ` (${item.price_range.period})` : '';
              parts.push(`• **${item.name}**: ${min.toLocaleString('tr-TR')} - ${max.toLocaleString('tr-TR')}₺${period}`);
            });
          }
        }
        
        // Süreçler
        if (sectionName === 'Süreç' || sectionName === 'Süreçler') {
          if (section.flow?.length) {
            parts.push('\n### Çalışma Süreci');
            section.flow.forEach((step: any, i: number) => {
              parts.push(`${i + 1}. **${step.adım}**: ${step.açıklama}`);
            });
          }
          if (section.processes?.length) {
            parts.push('\n### Süreçler');
            section.processes.forEach((p: any) => {
              parts.push(`• **${p.name}**: ${p.steps?.join(' → ') || ''}`);
            });
          }
        }
        
        // SSS - Müşteri
        if (sectionName.includes('SSS') && sectionName.includes('Müşteri')) {
          if (section.faqs?.length) {
            parts.push('\n### SSS (Müşteri)');
            section.faqs.slice(0, 5).forEach((faq: any) => {
              parts.push(`**S:** ${faq.q}\n**C:** ${faq.a}`);
            });
          }
        }
        
        // Politikalar
        if (sectionName === 'Politikalar') {
          if (section.policies) {
            parts.push('\n### Politikalar');
            const p = section.policies;
            if (p.sla) parts.push(`• Yanıt süresi: ${p.sla.response_time_hours?.standart || 24} saat`);
            if (p.revisions) parts.push(`• Revizyon: ${p.revisions.standard_rounds || 2} tur`);
            if (p.payments) parts.push(`• Ödeme: ${p.payments.model || 'Milestone bazlı'}`);
          }
        }
      }
    }
    
    return parts.join('\n');
  } catch (e) {
    // JSON parse başarısız - metin olarak döndür
    return `## BİLGİ TABANI\n${jsonPrompt.substring(0, 2000)}...`;
  }
}

/**
 * DAVRANIŞ KURALLARI + RAPOR BAĞLAMI
 * Admin JSON'dan bağımsız, sadece nasıl davranacağını belirler
 * Token tasarruflu - sadece kritik kurallar
 */
function buildBehaviorPrompt(reportContext?: string): string {
  return `## DİGİBOT - UNİLANCER LABS ASİSTANI

### Kim Sin?
Sen DigiBot'sun - Unilancer Labs'ın yapay zeka destekli asistanısın. Unilancer Labs adına konuşuyorsun. Profesyonel, samimi ve çözüm odaklısın. Senli konuş.

### Unilancer Labs Nedir?
Unilancer Labs bir dijital ajans DEĞİL, yönetilen freelance platformudur. Farkımız:
- Freelance modelini yapay zeka ve PM yönetimiyle profesyonelleştiriyoruz
- Üretici kitlemiz üniversite öğrencileri ve genç yetenekler
- Tek muhatap PM ile teslim garantisi sağlıyoruz
- Vizyon: "Beyin Göçü yerine Hizmet İhracatı"

### Görevlerin
1. Rapordaki verileri analiz et, mantık yürüt ve çıkarımlar yap
2. Skorları yorumla (70+ iyi, 40-70 orta, <40 düşük)
3. Sorunların kök nedenlerini tespit et
4. Somut, önceliklendirilmiş aksiyon öner
5. Unilancer Labs'ın nasıl yardımcı olabileceğini belirt

### Yanıt Formatı
- Türkçe, maksimum 2-3 paragraf (KISA TUT)
- Markdown: **kalın**, listeler
- Emoji KULLANMA
- Her yanıtta bir sonraki adım öner

### Yasaklar
- Kesin fiyat verme, aralık ver
- "Bilmiyorum" deme
- Uzun cevap verme
- Emoji kullanma

### İletişim
Tel: +90 506 152 32 55 | E-posta: sales@unilancerlabs.com

## RAPOR VERİLERİ (ANALİZ ET, ÇIKARIM YAP)
${reportContext || 'Rapor bilgisi henüz yüklenmedi.'}`;
}

/**
 * FULL DEFAULT PROMPT - Admin'de hiç prompt yoksa kullanılır
 * Bilgi tabanı + Davranış kuralları birlikte
 */
function buildFullDefaultPrompt(reportContext?: string): string {
  return `Sen DigiBot'sun - Unilancer Labs'ın yapay zeka destekli asistanısın. Unilancer Labs adına konuşuyorsun.

## UNİLANCER LABS NEDİR?
Dijital ajans DEĞİL, yönetilen freelance platformu.
- Freelance modelini AI + PM yönetimiyle profesyonelleştiriyoruz
- Üretici kitle: Üniversite öğrencileri ve genç yetenekler
- Tek muhatap PM ile teslim garantisi
- Vizyon: "Beyin Göçü yerine Hizmet İhracatı"

## EKİP
- Emrah Er - CEO (emrah@unilancerlabs.com)
- Taha Karahüseyinoğlu - COO (taha@unilancerlabs.com)
- Koray Andırınlı - Program Manager
- Selvinaz Deniz Koca - Sales & Marketing Director

## HİZMETLER (KDV Hariç)
- Kurumsal Web: 20.000-60.000 TL
- E-Ticaret: 30.000-200.000 TL
- Web Uygulaması: 50.000-1.000.000 TL
- Sosyal Medya: 10.000-80.000 TL/ay
- SEO: 15.000-80.000 TL/ay
- CRM/Otomasyon: 25.000-200.000 TL
- 3D/AR/VR: 40.000-300.000 TL

## İLETİŞİM
Tel: +90 506 152 32 55
E-posta: sales@unilancerlabs.com | info@unilancerlabs.com
Web: unilancerlabs.com
Saat: Hafta ici 09:00-18:00

## DAVRANIŞ KURALLARI
- Türkçe, maksimum 2-3 paragraf
- Emoji kullanma
- Rapor verilerinden çıkarım yap
- Skorları yorumla (70+ iyi, 40-70 orta, <40 düşük)
- Kesin fiyat verme, aralık ver
- Her yanıtta aksiyon öner

## RAPOR VERİLERİ
${reportContext || 'Rapor bilgisi henüz yüklenmedi.'}`;
}

/**
 * COMPACT DAVRANIŞ - Devam mesajları için (çok kısa, token tasarrufu)
 */
function buildCompactBehaviorPrompt(reportContext?: string): string {
  return `## KURALLAR
DigiBot - Unilancer Labs asistanı. Unilancer Labs adına konuş. Türkçe, kısa (2-3 paragraf max), emoji yok. Rapor verilerinden çıkarım yap, aksiyon öner. Kesin fiyat yok, aralık ver.
Tel: +90 506 152 32 55 | sales@unilancerlabs.com

## RAPOR
${reportContext || 'Rapor yok.'}`;
}

/**
 * COMPACT DEFAULT - Admin'de prompt yoksa, devam mesajları için
 */
function buildCompactDefaultPrompt(reportContext?: string): string {
  return `DigiBot - Unilancer Labs asistanı. Unilancer Labs adına konuş. Türkçe, kısa (2-3 paragraf), emoji yok. Çıkarım yap, aksiyon öner.
Tel: +90 506 152 32 55 | sales@unilancerlabs.com

## RAPOR
${reportContext || 'Rapor yok.'}`;
}

/**
 * Token sayısını tahmin et (yaklaşık 4 karakter = 1 token)
 */
function estimateTokens(messages: ChatMessage[]): number {
  let total = 0;
  for (const msg of messages) {
    total += Math.ceil(msg.content.length / 4);
    total += 4; // role ve format overhead
  }
  return total;
}
