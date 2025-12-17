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
 * Rapor verilerinden zengin bağlam oluşturur (AI için)
 * Tüm rapor detaylarını yapılandırılmış şekilde gönderir
 */
export function buildReportContext(analysisResult: any): string {
  if (!analysisResult) return '';

  const { 
    company_name, 
    website_url,
    email,
    sector,
    location,
    digital_score, 
    crm_readiness_score,
    scores, 
    strengths, 
    weaknesses, 
    recommendations,
    summary,
    executive_summary,
    sector_summary,
    technical_status,
    social_media,
    compliance,
    pain_points,
    roadmap,
    ui_ux_review,
    // Turkish fields
    guclu_yonler,
    gelistirilmesi_gereken_alanlar,
    onemli_tespitler,
    sektor_ozel_oneriler
  } = analysisResult;

  // Helper to safely get string value
  const safeString = (val: any) => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') return val.url || JSON.stringify(val);
    return 'N/A';
  };

  // Build technical status section
  const technicalSection = technical_status ? `
TEKNİK DURUM:
- SSL Sertifikası: ${technical_status.ssl_enabled || technical_status.ssl ? 'Aktif ✓' : 'Yok ✗'}
- Mobil Performans: ${technical_status.mobile_score || 'N/A'}/100
- Masaüstü Performans: ${technical_status.desktop_score || 'N/A'}/100
- LCP (Yüklenme): Mobil ${technical_status.lcp_mobile || 'N/A'}s, Masaüstü ${technical_status.lcp_desktop || 'N/A'}s
- Tasarım Skoru: ${technical_status.design_score || 'N/A'}/10
` : '';

  // Build social media section
  const socialSection = social_media ? `
SOSYAL MEDYA:
- Website: ${safeString(social_media.website)}
- LinkedIn: ${safeString(social_media.linkedin)}
- Instagram: ${safeString(social_media.instagram)}
- Facebook: ${safeString(social_media.facebook)}
- Twitter/X: ${safeString(social_media.twitter)}
- YouTube: ${safeString(social_media.youtube)}
- AI Analizi: ${social_media.ai_analysis || 'Analiz mevcut değil'}
` : '';

  // Build compliance section
  const complianceSection = compliance ? `
YASAL UYUMLULUK:
- KVKK Aydınlatma Metni: ${compliance.kvkk ? 'Var ✓' : 'Yok ✗ (KRİTİK!)'}
- Çerez Politikası: ${compliance.cookie_policy ? 'Var ✓' : 'Yok ✗'}
- ETBİS Kaydı: ${compliance.etbis ? 'Var ✓' : 'Yok ✗'}
` : '';

  // Build pain points section
  const painPointsSection = pain_points && pain_points.length > 0 ? `
TESPİT EDİLEN SORUNLAR VE ÇÖZÜMLER:
${pain_points.map((p: any, i: number) => `${i + 1}. SORUN: ${p.issue || ''}
   ÇÖZÜM: ${p.solution || ''}
   HİZMET: ${p.service || ''}`).join('\n')}
` : '';

  // Build roadmap section
  const roadmapSection = roadmap && roadmap.length > 0 ? `
DİJİTAL DÖNÜŞÜM YOL HARİTASI:
${roadmap.map((r: any) => `- [${r.category?.toUpperCase() || 'GENEL'}] ${r.title}: ${r.description}`).join('\n')}
` : '';

  // Build UI/UX section
  const uiuxSection = ui_ux_review ? `
UI/UX DEĞERLENDİRMESİ:
- Genel Skor: ${ui_ux_review.overall_score || 'N/A'}/100
- Tasarım: ${ui_ux_review.design_score || 'N/A'}/100
- Kullanılabilirlik: ${ui_ux_review.usability_score || 'N/A'}/100
- Mobil: ${ui_ux_review.mobile_score || 'N/A'}/100
- Performans: ${ui_ux_review.performance_score || 'N/A'}/100
- Değerlendirme: ${ui_ux_review.overall_assessment || 'N/A'}
` : '';

  // Combine strengths from multiple sources
  const allStrengths = [...(strengths || []), ...(guclu_yonler || [])];
  const allWeaknesses = [...(weaknesses || []), ...(gelistirilmesi_gereken_alanlar || [])];

  return `
══════════════════════════════════════════════════════════════════
DİJİTAL ANALİZ RAPORU - ${company_name || 'Bilinmiyor'}
══════════════════════════════════════════════════════════════════

FİRMA BİLGİLERİ:
- Şirket: ${company_name || 'N/A'}
- Website: ${website_url || 'N/A'}
- E-posta: ${email || 'N/A'}
- Sektör: ${sector || 'Genel'}
- Lokasyon: ${location || 'Türkiye'}

SKORLAR:
- Genel Dijital Skor: ${digital_score || 0}/100
- CRM Hazırlık: ${crm_readiness_score || 'N/A'}/5
- Web Varlığı: ${scores?.web_presence ?? scores?.website ?? 'N/A'}/100
- Sosyal Medya: ${scores?.social_media ?? 'N/A'}/100
- Marka Kimliği: ${scores?.brand_identity ?? 'N/A'}/100
- Dijital Pazarlama: ${scores?.digital_marketing ?? scores?.seo ?? 'N/A'}/100
- Kullanıcı Deneyimi: ${scores?.user_experience ?? 'N/A'}/100

YÖNETİCİ ÖZETİ:
${executive_summary || summary || 'Mevcut değil.'}

SEKTÖR ANALİZİ:
${sector_summary || sektor_ozel_oneriler?.join(' ') || 'Sektör analizi mevcut değil.'}
${technicalSection}${socialSection}${complianceSection}
GÜÇLÜ YÖNLER:
${allStrengths.length > 0 ? allStrengths.map((s: string) => `✓ ${s}`).join('\n') : '• Bilgi mevcut değil'}

ZAYIF YÖNLER / GELİŞTİRİLMESİ GEREKENLER:
${allWeaknesses.length > 0 ? allWeaknesses.map((w: string) => `✗ ${w}`).join('\n') : '• Bilgi mevcut değil'}

ÖNEMLİ TESPİTLER:
${onemli_tespitler && onemli_tespitler.length > 0 ? onemli_tespitler.map((t: string) => `• ${t}`).join('\n') : 'Tespit mevcut değil.'}
${painPointsSection}${roadmapSection}${uiuxSection}
ÖNCELİKLİ ÖNERİLER:
${recommendations && recommendations.length > 0 ? recommendations.map((r: any, i: number) => `${i + 1}. [${(r.priority || 'ORTA').toUpperCase()}] ${r.title || ''}
   ${r.description || ''}
   Kategori: ${r.category || 'Genel'}`).join('\n\n') : '• Öneri mevcut değil'}

══════════════════════════════════════════════════════════════════
NOT: Bu rapor ${company_name || 'firma'} için hazırlanmış dijital analiz raporudur.
DigiBot bu rapora tam erişime sahiptir ve tüm detayları bilmektedir.
══════════════════════════════════════════════════════════════════
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
