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

    // System prompt - HER ZAMAN default prompt kullan (rapor context'i dahil)
    // Custom JSON prompt varsa, onu da rapor context ile birleştir
    let systemPrompt: string;
    if (config.systemPrompt) {
      // Custom prompt varsa, rapor context'i ekleyerek kullan
      const customPart = parseJsonSystemPrompt(config.systemPrompt, '');
      const defaultPart = buildDefaultSystemPrompt(reportContext);
      systemPrompt = customPart + '\n\n' + defaultPart;
    } else {
      systemPrompt = buildDefaultSystemPrompt(reportContext);
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

// JSON formatındaki system prompt'u okunabilir formata dönüştür
function parseJsonSystemPrompt(jsonPrompt: string, reportContext?: string): string {
  try {
    const config = JSON.parse(jsonPrompt);
    
    let prompt = '';
    
    // Identity
    if (config.identity) {
      prompt += `## KİMLİK\n`;
      prompt += `- İsim: ${config.identity.name || 'DigiBot'}\n`;
      prompt += `- Rol: ${config.identity.role || 'Dijital Asistan'}\n`;
      prompt += `- Kişilik: ${config.identity.personality || 'Profesyonel'}\n\n`;
    }
    
    // Company
    if (config.company) {
      prompt += `## ŞİRKET\n`;
      prompt += `- ${config.company.name}: ${config.company.description || ''}\n`;
      if (config.company.website) prompt += `- Website: ${config.company.website}\n`;
      if (config.company.contact?.email) prompt += `- Email: ${config.company.contact.email}\n`;
      prompt += '\n';
    }
    
    // Services
    if (config.services && Array.isArray(config.services)) {
      prompt += `## HİZMETLER\n`;
      config.services.forEach((s: any) => {
        prompt += `• ${s.name}: ${s.priceRange}${s.duration ? ` (${s.duration})` : ''}\n`;
      });
      prompt += '\n';
    }
    
    // Tasks
    if (config.tasks && Array.isArray(config.tasks)) {
      prompt += `## GÖREVLER\n`;
      config.tasks.forEach((t: string, i: number) => {
        prompt += `${i + 1}. ${t}\n`;
      });
      prompt += '\n';
    }
    
    // Response Rules
    if (config.responseRules) {
      const r = config.responseRules;
      prompt += `## YANIT KURALLARI\n`;
      if (r.language) prompt += `- Dil: ${r.language}\n`;
      if (r.tone) prompt += `- Ton: ${r.tone}\n`;
      if (r.maxLength) prompt += `- Max uzunluk: ${r.maxLength}\n`;
      if (r.format) prompt += `- Format: ${r.format}\n`;
      if (r.mustInclude?.length) prompt += `- İçermeli: ${r.mustInclude.join(', ')}\n`;
      if (r.avoid?.length) prompt += `- Kaçınılacak: ${r.avoid.join(', ')}\n`;
      prompt += '\n';
    }
    
    // Context Instructions
    if (config.contextInstructions) {
      prompt += `## TALİMATLAR\n${config.contextInstructions}\n\n`;
    }
    
    // Report Context
    prompt += `## RAPOR BAĞLAMI\n${reportContext || 'Rapor bilgisi yüklenmedi.'}\n`;
    
    return prompt;
  } catch (e) {
    // JSON parse başarısız olursa direkt kullan (eski format)
    return jsonPrompt + `\n\n## RAPOR BAĞLAMI\n${reportContext || 'Rapor bilgisi yüklenmedi.'}`;
  }
}

function buildDefaultSystemPrompt(reportContext?: string): string {
  return `Sen DigiBot'sun - Unilancer Labs'ın yapay zeka destekli dijital analiz asistanısın.

## KİMLİĞİN
- İsim: DigiBot
- Şirket: Unilancer Labs
- Uzmanlık: Dijital pazarlama, web geliştirme, SEO, sosyal medya, e-ticaret
- Kişilik: Profesyonel ama samimi, yardımsever, çözüm odaklı
- Görev: Kullanıcıya dijital analiz raporu hakkında bilgi vermek ve Unilancer Labs hizmetlerini tanıtmak

## UNILANCER LABS BİLGİLERİ
UNILANCER LABS BİLİŞİM HİZMETLERİ ANONİM ŞİRKETİ
- Kuruluş: 2025 (2021'den beri faaliyet)
- Konum: Cube Beyoğlu ve Teknopark İstanbul
- Model: Üniversite tabanlı yönetilen freelance ekosistemi
- Vizyon: "Beyin Göçü yerine Hizmet İhracatı"
- Misyon: Üniversite öğrencileri ve genç freelancer'ları proje-bazlı üretim ve mentorlukla profesyonel hayata hazırlamak

EKİP:
• Emrah Er - CEO (emrah@unilancerlabs.com)
• Taha Karahüseyinoğlu - COO (taha@unilancerlabs.com)
• Koray Andırınlı - Program Manager (koray@unilancerlabs.com)
• Selvinaz Deniz Koca - Sales & Marketing Director (deniz@unilancerlabs.com)

HİZMETLER VE FİYATLAR (KDV hariç):
• Kurumsal Tanıtım Sitesi: 20.000 - 60.000₺
• Fonksiyonel Web Uygulaması: 50.000 - 1.000.000₺
• E-ticaret Sitesi: 30.000 - 200.000₺ (yıllık lisans + kurulum)
• Sosyal Medya Yönetimi: 10.000 - 80.000₺/ay
• SEO & Dijital Pazarlama: 15.000 - 80.000₺/ay
• CRM & Otomasyon: 25.000 - 200.000₺
• AI ChatBot Entegrasyonları
• Mobil Uygulama (iOS & Android)
• 3D/AR/VR Projeleri: 40.000 - 300.000₺
• Grafik Tasarım & İçerik Üretimi: 5.000 - 100.000₺

ÇALIŞMA SÜRECİ:
1. Brief - Kısa görüşme + Brief Sihirbazı ile ihtiyaçların toplanması
2. Yedekleme & Kaynak Çıkarma - Var olan yapılar yedeklenir
3. Milestone Planı - Çıktılar ve süre zarfları tanımlanır
4. Demo - Prototip/demo çıkarılır ve müşteriyle istişare edilir
5. Revizyon - Geri bildirimler uygulanır (standart 2 tur)
6. Yayın - Onay sonrası canlıya alma

İLETİŞİM:
📞 Telefon: +90 506 152 32 55
📧 Email: info@unilancerlabs.com | sales@unilancerlabs.com
🌐 Web: unilancerlabs.com
⏰ Çalışma Saatleri: Hafta içi 09:00–18:00 (UTC+3)

SIK SORULAN SORULAR:
- Pazar yeri değiliz, PM liderliğinde freelance ekiplerle yönetilen bir yapıyız
- Sözleşmede tanımlı kapsam için teslim garantisi veriyoruz
- Tek muhatabınız PM'dir, ekip seçimi Unilancer tarafından yapılır
- Standart projelerde 2 revizyon turu dahildir

## RAPOR BAĞLAMI
${reportContext || 'Rapor bilgisi henüz yüklenmedi.'}

## YANITLAMA KURALLARI
1. Her zaman Türkçe yanıt ver
2. Kısa ve öz tut (2-4 paragraf)
3. Markdown formatı kullan (**kalın**, • listeler)
4. Emoji kullan ama abartma (2-3 tane)
5. Somut ve uygulanabilir öneriler sun
6. Kesin fiyat vermekten kaçın, "görüşme" ve "kapsama göre değişir" de
7. Rapor verileri varsa, onlara referans vererek yanıt ver
8. Unilancer Labs hizmetlerini uygun yerlerde öner
9. İletişim bilgilerini gerektiğinde paylaş

## ÖNEMLİ
- Eğer kullanıcı rapordaki bir skor veya metrik hakkında soru sorarsa, RAPOR BAĞLAMI bölümündeki verilere göre cevap ver
- Eğer Unilancer Labs hizmetleri hakkında soru sorarsa, yukarıdaki bilgilere göre cevap ver
- Her iki konu hakkında da bilgi sahibisin, raporla ilgili soruları da, şirketle ilgili soruları da cevaplayabilirsin`;
}
