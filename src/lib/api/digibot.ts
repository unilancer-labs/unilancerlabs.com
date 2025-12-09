/**
 * DigiBot API - Edge Function çağrıları (Streaming destekli)
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  tokensUsed?: number;
}

/**
 * DigiBot'a mesaj gönderir ve AI yanıtı alır (non-streaming fallback)
 */
export async function sendDigiBotMessage(
  reportId: string,
  sessionId: string,
  message: string,
  reportContext: string,
  viewerId?: string
): Promise<ChatResponse> {
  try {
    console.log('[DigiBot] Sending message to AI...', { reportId, sessionId, message: message.substring(0, 50) });
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/report-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        reportId,
        sessionId,
        message,
        reportContext,
        viewerId,
      }),
    });

    const data = await response.json();
    console.log('[DigiBot] Response received:', { success: data.success, hasMessage: !!data.message, error: data.error });
    
    if (!response.ok) {
      console.error('[DigiBot] API error:', response.status, data);
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }
    
    return data;
  } catch (error) {
    console.error('[DigiBot] Network error:', error);
    return { 
      success: false, 
      error: 'Bağlantı hatası. Lütfen tekrar deneyin.' 
    };
  }
}

/**
 * DigiBot Streaming - karakter karakter yanıt alır
 */
export async function sendDigiBotMessageStream(
  reportId: string,
  sessionId: string,
  message: string,
  reportContext: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  viewerId?: string
): Promise<void> {
  try {
    console.log('[DigiBot] Starting streaming message...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/digibot-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        reportId,
        sessionId,
        message,
        reportContext,
        viewerId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[DigiBot] Stream error:', response.status, errorData);
      onError(errorData.error || `HTTP ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('Stream reader not available');
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            console.log('[DigiBot] Stream complete');
            onComplete();
            return;
          }

          try {
            const json = JSON.parse(data);
            if (json.content) {
              onChunk(json.content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    console.error('[DigiBot] Stream network error:', error);
    onError('Bağlantı hatası. Lütfen tekrar deneyin.');
  }
}

/**
 * Rapor verilerinden bağlam oluşturur (AI için)
 */
export function buildReportContext(analysisResult: any): string {
  if (!analysisResult) return '';

  const { 
    company_name, 
    digital_score, 
    scores, 
    strengths, 
    weaknesses, 
    recommendations,
    summary 
  } = analysisResult;

  return `
ŞİRKET: ${company_name}
GENEL DİJİTAL SKOR: ${digital_score}/100

DETAYLI SKORLAR:
- Web Varlığı: ${scores?.web_presence || 'N/A'}/100
- Sosyal Medya: ${scores?.social_media || 'N/A'}/100
- Marka Kimliği: ${scores?.brand_identity || 'N/A'}/100
- Dijital Pazarlama: ${scores?.digital_marketing || 'N/A'}/100
- Kullanıcı Deneyimi: ${scores?.user_experience || 'N/A'}/100

ÖZET:
${summary || 'Özet mevcut değil.'}

GÜÇLÜ YÖNLER:
${strengths?.map((s: string) => `• ${s}`).join('\n') || '• Bilgi mevcut değil'}

ZAYIF YÖNLER:
${weaknesses?.map((w: string) => `• ${w}`).join('\n') || '• Bilgi mevcut değil'}

ÖNCELİKLİ ÖNERİLER:
${recommendations?.slice(0, 5).map((r: any) => `• [${r.priority?.toUpperCase() || 'ORTA'}] ${r.title}: ${r.description}`).join('\n') || '• Öneri mevcut değil'}
`.trim();
}

/**
 * Markdown formatını HTML'e çevirir (basit versiyon)
 */
export function parseMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet points
    .replace(/^• /gm, '<span class="inline-block w-2 h-2 bg-current rounded-full mr-2 opacity-60"></span>')
    .replace(/^- /gm, '<span class="inline-block w-2 h-2 bg-current rounded-full mr-2 opacity-60"></span>')
    // Line breaks
    .replace(/\n/g, '<br/>');
}
