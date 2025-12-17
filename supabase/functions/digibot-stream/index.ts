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

    // System prompt - Token tasarruflu yapı:
    // Admin JSON = Bilgi Tabanı (şirket, hizmetler, fiyatlar)
    // Kod = Davranış Kuralları (nasıl cevap verecek) + Rapor Context
    let systemPrompt: string;
    if (config.systemPrompt) {
      // Admin'de prompt varsa: Bilgi tabanı + Davranış kuralları
      const knowledgeBase = parseKnowledgeBase(config.systemPrompt);
      const behaviorRules = buildBehaviorPrompt(reportContext);
      systemPrompt = knowledgeBase + '\n\n' + behaviorRules;
    } else {
      // Admin'de prompt yoksa: Full default prompt
      systemPrompt = buildFullDefaultPrompt(reportContext);
    }
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
  return `## DİGİBOT DAVRANIŞ KURALLARI

### Kim Sin?
Sen DigiBot'sun - Unilancer Labs'ın dijital analiz asistanı. Profesyonel ama samimi, çözüm odaklı. Senli konuş.

### Görevlerin
1. Rapordaki verileri yorumla ve açıkla
2. Skorların ne anlama geldiğini anlat (70+ iyi, 40-70 orta, <40 düşük)
3. Somut, uygulanabilir aksiyon öner
4. Düşük skorlarda bile motive edici ol

### Yanıt Formatı
- Türkçe yaz, 2-4 paragraf
- Markdown: **kalın**, • listeler
- 2-3 emoji (📊 📈 ✅ 💡 🎯)
- Her yanıt sonunda bir aksiyon öner
- RAPOR BAĞLAMI'na referans ver

### Yasaklar
❌ Kesin fiyat verme - aralık ver, görüşme öner
❌ "Bilmiyorum" deme
❌ Çok uzun cevap
❌ Türkçe dışı dil

### Fiyat Soruları İçin
Aralık ver + "Net fiyat için kapsam belirlenmeli" + İletişim bilgisi
📞 +90 506 152 32 55 | 📧 sales@unilancerlabs.com

## RAPOR BAĞLAMI (BU VERİLERE GÖRE CEVAP VER)
${reportContext || 'Rapor bilgisi henüz yüklenmedi.'}`;
}

/**
 * FULL DEFAULT PROMPT - Admin'de hiç prompt yoksa kullanılır
 * Bilgi tabanı + Davranış kuralları birlikte
 */
function buildFullDefaultPrompt(reportContext?: string): string {
  return `Sen DigiBot'sun - Unilancer Labs'ın dijital analiz asistanısın.

## KİMLİK
- Şirket: Unilancer Labs Bilişim Hizmetleri A.Ş.
- Model: Üniversite tabanlı yönetilen freelance ekosistemi
- Vizyon: "Beyin Göçü yerine Hizmet İhracatı"
- Fark: Pazar yeri değil, PM liderliğinde teslim garantili yapı

## EKİP
• Emrah Er - CEO (emrah@unilancerlabs.com)
• Taha Karahüseyinoğlu - COO (taha@unilancerlabs.com)
• Koray Andırınlı - Program Manager
• Selvinaz Deniz Koca - Sales & Marketing Director

## HİZMETLER (KDV Hariç)
• Kurumsal Web: 20.000-60.000₺
• E-Ticaret: 30.000-200.000₺
• Web Uygulaması: 50.000-1.000.000₺
• Sosyal Medya: 10.000-80.000₺/ay
• SEO: 15.000-80.000₺/ay
• CRM/Otomasyon: 25.000-200.000₺
• 3D/AR/VR: 40.000-300.000₺

## İLETİŞİM
📞 +90 506 152 32 55
📧 sales@unilancerlabs.com | info@unilancerlabs.com
🌐 unilancerlabs.com
⏰ Hafta içi 09:00-18:00

## DAVRANIŞ
- Türkçe, 2-4 paragraf, Markdown
- Skorları yorumla (70+ iyi, 40-70 orta, <40 düşük)
- Somut aksiyon öner
- Kesin fiyat verme, aralık ver
- Her yanıt sonunda aksiyon öner

## RAPOR BAĞLAMI
${reportContext || 'Rapor bilgisi henüz yüklenmedi.'}`;
}
