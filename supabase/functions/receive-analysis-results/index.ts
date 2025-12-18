import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to parse JSON from AI output with markers
function parseAIOutput(text: string): { json: any; plainText: string } {
  let json = null
  let plainText = ''

  // Try to extract JSON between markers
  const jsonMatch = text.match(/---JSON_START---([\s\S]*?)---JSON_END---/)
  if (jsonMatch && jsonMatch[1]) {
    try {
      json = JSON.parse(jsonMatch[1].trim())
    } catch (e) {
      console.log('Failed to parse JSON from markers:', e)
    }
  }

  // Try to extract plain text between markers
  const textMatch = text.match(/---TEXT_START---([\s\S]*?)---TEXT_END---/)
  if (textMatch && textMatch[1]) {
    plainText = textMatch[1].trim()
  } else {
    // If no text markers, use the full text (excluding JSON part)
    plainText = text.replace(/---JSON_START---[\s\S]*?---JSON_END---/, '').trim()
  }

  return { json, plainText }
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

    let rawPayload = await req.json()
    
    // n8n bazen array olarak gönderebilir, ilk elemanı al
    const payload = Array.isArray(rawPayload) ? rawPayload[0] : rawPayload
    
    console.log('Is array:', Array.isArray(rawPayload))
    console.log('Received payload keys:', Object.keys(payload))
    console.log('Received payload:', JSON.stringify(payload, null, 2).substring(0, 2000))

    // Support multiple payload formats from n8n
    let report_id = payload.report_id
    let analysis_result = payload.analysis_result
    let analysis_summary = payload.analysis_summary
    let digital_score = payload.digital_score
    let webhook_request_id = payload.webhook_request_id
    let status = payload.status
    let error_message = payload.error_message
    let processing_duration_ms = payload.processing_duration_ms
    let plain_text_report = payload.plain_text_report

    // Try to find report_id from various locations
    if (!report_id) {
      report_id = payload.body?.report_id || 
                  payload.data?.report_id || 
                  payload.input?.body?.report_id ||
                  payload.originalInput?.body?.report_id
    }

    // Check if we have raw AI text output that needs parsing
    const aiText = payload.text || payload.message?.content || payload.output?.text || payload.response
    if (aiText && typeof aiText === 'string' && aiText.includes('---JSON_START---')) {
      console.log('Detected AI output with markers, parsing...')
      const parsed = parseAIOutput(aiText)
      
      if (parsed.json) {
        report_id = report_id || parsed.json.report_id
        digital_score = parsed.json.digital_score || parsed.json.dijital_skor
        analysis_result = parsed.json.analysis_result || parsed.json
        analysis_summary = parsed.json.analysis_summary
        status = parsed.json.status || 'completed'
      }
      
      if (parsed.plainText) {
        plain_text_report = parsed.plainText
      }
    }

    // Handle n8n format with dijital_skor, firma_adi, agri_1, etc. (legacy support)
    if (!analysis_result && (payload.dijital_skor !== undefined || payload.firma_adi || payload.text)) {
      console.log('Detected legacy n8n format, transforming...')
      
      // Get report_id from nested body if available
      if (!report_id && payload.body?.report_id) {
        report_id = payload.body.report_id
      }
      
      digital_score = payload.dijital_skor || payload.digital_score || 0
      
      // Transform n8n output to our format
      analysis_result = {
        text: payload.text || '',
        firma_adi: payload.firma_adi || payload.company_name || '',
        dijital_skor: digital_score,
        pain_points: [
          { issue: payload.agri_1 || '', solution: '', service: '' },
          { issue: payload.agri_2 || '', solution: '', service: '' },
          { issue: payload.agri_3 || '', solution: '', service: '' }
        ].filter(p => p.issue),
        strengths: payload.strengths || [],
        weaknesses: payload.weaknesses || [],
        recommendations: payload.recommendations || [],
        executive_summary: payload.text?.substring(0, 500) || ''
      }
      
      analysis_summary = payload.text?.substring(0, 500) || ''
      status = 'completed'
    }

    // Handle new structured format from updated prompt (includes Turkish fields from n8n)
    const hasNewFormat = payload.scores || payload.website_analysis || payload.seo_analysis || 
                         payload.guclu_yonler || payload.hizmet_paketleri || payload.stratejik_yol_haritasi
    
    // ==========================================
    // YENİ JSON FORMATI DESTEĞİ (2024 v2)
    // ==========================================
    const hasNewFormatV2 = payload.firma_karti || payload.performans || payload.yol_haritasi || 
                           payload.hizmet_onerileri || payload.tespitler || payload.sonuc ||
                           payload.analysis_result?.firma_karti || payload.analysis_result?.yol_haritasi
    
    if (hasNewFormatV2) {
      console.log('Detected NEW v2 format with firma_karti, performans, yol_haritasi...')
      
      // Önce analysis_result içinden veya doğrudan payload'dan al
      const src = payload.analysis_result || payload
      
      analysis_result = {
        // ==========================================
        // YENİ ALANLAR
        // ==========================================
        firma_karti: src.firma_karti || {
          firma_adi: payload.firma_adi || payload.company_name,
          website: payload.website,
          sektor: payload.sektor,
          is_modeli: payload.is_modeli,
          hedef_kitle: payload.hedef_kitle,
          firma_tanitimi: payload.firma_tanitimi
        },
        performans: src.performans,
        seo: src.seo,
        ui_ux: src.ui_ux,
        sektor_analiz: src.sektor || src.sektor_bilgi,
        yol_haritasi: src.yol_haritasi,
        hizmet_onerileri: src.hizmet_onerileri || payload.hizmet_onerileri,
        sonuc: src.sonuc,
        tespitler: src.tespitler || payload.tespitler,
        social_media_yeni: src.social_media,
        
        // Yeni format güçlü yönler ve geliştirilmesi gerekenler
        guclu_yonler: src.guclu_yonler || payload.guclu_yonler || [],
        gelistirilmesi_gereken: src.gelistirilmesi_gereken || payload.gelistirilmesi_gereken || [],
        
        // Skorlar
        scores: src.scores || payload.scores,
        digital_score: src.digital_score || payload.digital_score || payload.dijital_skor,
        
        // Özet alanları
        executive_summary: src.executive_summary || payload.executive_summary,
        analysis_summary: src.analysis_summary || payload.analysis_summary,
        plain_text_report: src.plain_text_report || payload.plain_text_report || payload.text,
        text: payload.text,
        
        // Flatten edilmiş skorlar (kolay erişim)
        overall_score: payload.overall_score || src.scores?.overall,
        website_score: payload.website_score || src.scores?.website,
        seo_score: payload.seo_score || src.scores?.seo,
        social_media_score: payload.social_media_score || src.scores?.social_media,
        performance_score: payload.performance_score || src.scores?.performance,
        mobile_score: payload.mobile_score || src.scores?.mobile,
        security_score: payload.security_score || src.scores?.security,
        ux_score: payload.ux_score || src.scores?.user_experience,
        
        // Flatten yol haritası
        vizyon: src.yol_haritasi?.vizyon || payload.vizyon,
        acil_7gun: src.yol_haritasi?.acil_7gun || payload.acil_7gun,
        kisa_30gun: src.yol_haritasi?.kisa_30gun || payload.kisa_30gun,
        orta_90gun: src.yol_haritasi?.orta_90gun || payload.orta_90gun,
        uzun_1yil: src.yol_haritasi?.uzun_1yil || payload.uzun_1yil,
        
        // Ağrı noktaları ve güçlü yön başlıkları
        agri_1: payload.agri_1,
        agri_2: payload.agri_2,
        agri_3: payload.agri_3,
        guclu_yon_1: payload.guclu_yon_1,
        guclu_yon_2: payload.guclu_yon_2,
        guclu_yon_3: payload.guclu_yon_3,
        
        // İstatistikler
        istatistikler: src.istatistikler || payload.istatistikler,
        
        // Technical status (performans'tan türetilebilir)
        technical_status: src.technical_status || payload.technical_status || {
          ssl_status: payload.technical_status?.ssl_status,
          mobile_score: src.performans?.mobil?.skor || src.scores?.mobile || 0,
          desktop_score: src.performans?.desktop?.skor || src.scores?.performance || 0,
          lcp_mobile: src.performans?.lcp_mobil,
          lcp_desktop: src.performans?.lcp_desktop
        },
        
        // ==========================================
        // ESKİ FORMAT ALANLARI (Geriye dönük uyumluluk)
        // ==========================================
        firma_adi: payload.firma_adi || src.firma_karti?.firma_adi,
        sektor: payload.sektor || src.firma_karti?.sektor || src.sektor_analiz?.ana,
        musteri_kitlesi: payload.hedef_kitle || src.firma_karti?.hedef_kitle,
        firma_tanitimi: payload.firma_tanitimi || src.firma_karti?.firma_tanitimi,
        ui_ux_degerlendirmesi: src.ui_ux?.izlenim,
        
        // Eski format için dönüştürülmüş alanlar
        gelistirilmesi_gereken_alanlar: (src.gelistirilmesi_gereken || payload.gelistirilmesi_gereken || []).map((item: any) => ({
          baslik: item.baslik,
          mevcut_durum: item.mevcut,
          neden_onemli: item.sorun,
          cozum_onerisi: item.cozum,
          beklenen_etki: item.maliyet ? `Maliyet: ${item.maliyet}` : '',
          oncelik: item.oncelik,
          tahmini_sure: item.sure
        })),
        
        stratejik_yol_haritasi: src.yol_haritasi ? {
          vizyon: src.yol_haritasi.vizyon,
          ilk_30_gun: [
            ...(src.yol_haritasi.acil_7gun || []).map((a: any) => ({ aksiyon: a.is, neden: a.neden, nasil: a.sorumlu || '' })),
            ...(src.yol_haritasi.kisa_30gun || []).map((a: any) => ({ aksiyon: a.is, neden: a.neden, nasil: a.sorumlu || '' }))
          ],
          '30_90_gun': (src.yol_haritasi.orta_90gun || []).map((a: any) => ({ aksiyon: a.is, neden: a.neden, nasil: a.sorumlu || '' })),
          '90_365_gun': (src.yol_haritasi.uzun_1yil || []).map((a: any) => ({ aksiyon: a.is, neden: a.neden, nasil: a.sorumlu || '' }))
        } : undefined,
        
        hizmet_paketleri: (src.hizmet_onerileri || payload.hizmet_onerileri || []).map((h: any) => ({
          paket_adi: h.paket,
          aciklama: '',
          kapsam: h.kapsam || [],
          oncelik: '',
          tahmini_sure: h.sure,
          beklenen_sonuc: h.sonuc
        })),
        
        onemli_tespitler: (src.tespitler || payload.tespitler || []).map((t: any) => ({
          tip: t.tip,
          tespit: t.baslik,
          detay: t.detay
        })),
        
        sonraki_adim: src.sonuc ? {
          cta_mesaji: src.sonuc.cta,
          iletisim_onerisi: src.sonuc.degerlendirme
        } : undefined,
        
        // Boş arrayler için default
        strengths: payload.strengths || [],
        weaknesses: payload.weaknesses || [],
        recommendations: payload.recommendations || []
      }
      
      digital_score = src.digital_score || src.scores?.overall || payload.digital_score || payload.dijital_skor || 0
      analysis_summary = src.analysis_summary || payload.analysis_summary || src.executive_summary
      status = 'completed'
      
      console.log('New v2 format captured:', {
        firma_karti: !!analysis_result.firma_karti,
        performans: !!analysis_result.performans,
        seo: !!analysis_result.seo,
        ui_ux: !!analysis_result.ui_ux,
        yol_haritasi: !!analysis_result.yol_haritasi,
        hizmet_onerileri: (analysis_result.hizmet_onerileri || []).length,
        tespitler: (analysis_result.tespitler || []).length,
        guclu_yonler: (analysis_result.guclu_yonler || []).length,
        gelistirilmesi_gereken: (analysis_result.gelistirilmesi_gereken || []).length,
        digital_score
      })
    } else if (hasNewFormat) {
      console.log('Detected new structured format with Turkish fields...')
      analysis_result = {
        // English fields
        executive_summary: payload.executive_summary || analysis_summary,
        scores: payload.scores,
        website_analysis: payload.website_analysis,
        seo_analysis: payload.seo_analysis,
        social_media: payload.social_media,
        compliance: payload.compliance,
        recommendations: payload.recommendations || [],
        pain_points: payload.pain_points || [],
        insights: payload.insights || [],
        competitive_analysis: payload.competitive_analysis,
        design_analysis: payload.design_analysis,
        crm_readiness: payload.crm_readiness,
        email_suggestions: payload.email_suggestions,
        plain_text_report: plain_text_report,
        
        // Turkish fields from n8n
        firma_adi: payload.firma_adi,
        sektor: payload.sektor,
        ulke: payload.ulke,
        musteri_kitlesi: payload.musteri_kitlesi,
        firma_tanitimi: payload.firma_tanitimi,
        ui_ux_degerlendirmesi: payload.ui_ux_degerlendirmesi,
        guclu_yonler: payload.guclu_yonler || [],
        gelistirilmesi_gereken_alanlar: payload.gelistirilmesi_gereken_alanlar || [],
        hizmet_paketleri: payload.hizmet_paketleri || [],
        stratejik_yol_haritasi: payload.stratejik_yol_haritasi,
        sektor_ozel_oneriler: payload.sektor_ozel_oneriler || [],
        rekabet_analizi: payload.rekabet_analizi,
        onemli_tespitler: payload.onemli_tespitler || [],
        technical_status: payload.technical_status,
        legal_compliance: payload.legal_compliance,
        sonraki_adim: payload.sonraki_adim,
        strengths: payload.strengths || [],
        weaknesses: payload.weaknesses || []
      }
      digital_score = payload.scores?.overall || payload.dijital_skor || payload.digital_score || 0
      status = 'completed'
      console.log('Turkish fields captured:', {
        guclu_yonler: (payload.guclu_yonler || []).length,
        gelistirme: (payload.gelistirilmesi_gereken_alanlar || []).length,
        hizmet_paketleri: (payload.hizmet_paketleri || []).length
      })
    }

    if (!report_id) {
      console.error('No report_id found in payload')
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

    // CRITICAL: Normalize status to expected values
    const normalizedStatus = (() => {
      const s = (status || '').toString().toLowerCase().trim()
      if (['completed', 'done', 'success', 'finished'].includes(s)) return 'completed'
      if (['failed', 'error'].includes(s)) return 'failed'
      if (['processing', 'running', 'pending'].includes(s)) return 'processing'
      return 'completed' // Default to completed if we have results
    })()
    
    console.log('Status normalization:', status, '->', normalizedStatus)

    // CRITICAL: Ensure analysis_result is an object, not a string
    let finalAnalysisResult = analysis_result
    if (typeof analysis_result === 'string') {
      console.log('analysis_result is a string, attempting to parse...')
      try {
        finalAnalysisResult = JSON.parse(analysis_result)
        console.log('Successfully parsed analysis_result string to object')
      } catch (e) {
        console.error('Failed to parse analysis_result string:', e)
        // Wrap the string in an object so it's still usable
        finalAnalysisResult = { raw_text: analysis_result, parse_error: true }
      }
    }
    
    // Validate analysis_result is not empty
    if (!finalAnalysisResult || (typeof finalAnalysisResult === 'object' && Object.keys(finalAnalysisResult).length === 0)) {
      console.warn('analysis_result is empty or null, creating minimal structure')
      finalAnalysisResult = {
        executive_summary: analysis_summary || 'Analiz tamamlandı',
        scores: { overall: digital_score || 0 },
        _empty_result: true
      }
    }

    console.log('Final analysis_result keys:', Object.keys(finalAnalysisResult))

    // Update the report with analysis results
    const { data, error } = await supabaseClient
      .from('digital_analysis_reports')
      .update({
        status: normalizedStatus,
        analysis_result: finalAnalysisResult,
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
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
