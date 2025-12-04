import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFICATION_EMAIL = 'info@unilancerlabs.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface EmailPayload {
  type: string
  record: Record<string, any>
}

// Email içeriği oluştur
function createEmailContent(type: string, record: Record<string, any>): { subject: string; html: string; toEmail?: string } {
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })
  
  switch (type) {
    case 'contact_submissions':
      return {
        subject: `📬 Yeni İletişim Mesajı - ${record.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📬 Yeni İletişim Mesajı</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Ad Soyad:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${record.email}">${record.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Konu:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Mesaj:</td>
                  <td style="padding: 10px 0;">${record.message}</td>
                </tr>
              </table>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Gönderim: ${timestamp}</p>
            </div>
          </div>
        `
      }

    case 'newsletter_subscriptions':
      return {
        subject: `📰 Yeni Bülten Abonesi`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📰 Yeni Bülten Abonesi</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <p style="font-size: 16px;"><strong>Email:</strong> <a href="mailto:${record.email}">${record.email}</a></p>
              <p style="font-size: 14px; color: #666;">Kaynak: ${record.source || 'footer'}</p>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Kayıt: ${timestamp}</p>
            </div>
          </div>
        `
      }

    case 'project_requests':
      return {
        subject: `🚀 Yeni Proje Talebi - ${record.company_name || record.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚀 Yeni Proje Talebi</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Firma:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.company_name || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">İsim:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${record.email}">${record.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.phone || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Bütçe:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.budget || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Detay:</td>
                  <td style="padding: 10px 0;">${record.description || record.message || '-'}</td>
                </tr>
              </table>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Gönderim: ${timestamp}</p>
            </div>
          </div>
        `
      }

    case 'freelancer_applications':
      return {
        subject: `👨‍💻 Yeni Freelancer Başvurusu - ${record.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">👨‍💻 Yeni Freelancer Başvurusu</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Ad Soyad:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${record.email}">${record.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.phone || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Üniversite:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.university || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Bölüm:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${record.department || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Beceriler:</td>
                  <td style="padding: 10px 0;">${Array.isArray(record.skills) ? record.skills.join(', ') : (record.skills || '-')}</td>
                </tr>
              </table>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Başvuru: ${timestamp}</p>
            </div>
          </div>
        `
      }

    // Freelancer durum değişikliği bildirimi (başvurana gönderilir)
    case 'freelancer_status_update':
      const freelancerStatusMap: Record<string, { text: string; color: string; emoji: string }> = {
        'reviewing': { text: 'İnceleniyor', color: '#3B82F6', emoji: '🔍' },
        'interview': { text: 'Mülakat Aşamasına Geçti', color: '#8B5CF6', emoji: '📅' },
        'accepted': { text: 'Kabul Edildi', color: '#22C55E', emoji: '✅' },
        'approved': { text: 'Onaylandı', color: '#22C55E', emoji: '✅' },
        'rejected': { text: 'Reddedildi', color: '#EF4444', emoji: '❌' },
      }
      const fStatus = freelancerStatusMap[record.status] || { text: record.status, color: '#6B7280', emoji: '📋' }
      
      return {
        subject: `${fStatus.emoji} Başvuru Durumunuz Güncellendi - Unilancer`,
        toEmail: record.email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">${fStatus.emoji} Başvuru Durumu Güncellendi</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <p style="font-size: 16px;">Merhaba <strong>${record.name}</strong>,</p>
              <p style="font-size: 14px; color: #666;">Freelancer başvurunuzun durumu güncellenmiştir.</p>
              
              <div style="background: ${fStatus.color}15; border-left: 4px solid ${fStatus.color}; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${fStatus.color};">
                  ${fStatus.emoji} ${fStatus.text}
                </p>
              </div>
              
              ${record.status === 'accepted' || record.status === 'approved' ? `
                <p style="font-size: 14px; color: #666;">Tebrikler! Başvurunuz kabul edildi. En kısa sürede sizinle iletişime geçeceğiz.</p>
              ` : record.status === 'interview' ? `
                <p style="font-size: 14px; color: #666;">Başvurunuz değerlendirildi ve mülakat aşamasına geçtiniz. Yakında sizinle iletişime geçeceğiz.</p>
              ` : record.status === 'rejected' ? `
                <p style="font-size: 14px; color: #666;">Başvurunuz için teşekkür ederiz. Maalesef şu an için ekibimize uygun bir pozisyon bulamadık. Gelecekte yeni fırsatlar için sizi tekrar değerlendirmekten mutluluk duyarız.</p>
              ` : `
                <p style="font-size: 14px; color: #666;">Başvurunuz inceleniyor. Gelişmeler hakkında sizi bilgilendireceğiz.</p>
              `}
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #888; font-size: 12px;">
                Bu email Unilancer tarafından otomatik olarak gönderilmiştir.<br>
                <a href="https://unilancerlabs.com" style="color: #5FC8DA;">unilancerlabs.com</a>
              </p>
            </div>
          </div>
        `
      }

    // Proje durum değişikliği bildirimi (müşteriye gönderilir)
    case 'project_status_update':
      const projectStatusMap: Record<string, { text: string; color: string; emoji: string }> = {
        'reviewing': { text: 'İnceleniyor', color: '#3B82F6', emoji: '🔍' },
        'in-progress': { text: 'Başladı', color: '#8B5CF6', emoji: '🚀' },
        'completed': { text: 'Tamamlandı', color: '#22C55E', emoji: '✅' },
        'cancelled': { text: 'İptal Edildi', color: '#EF4444', emoji: '❌' },
      }
      const pStatus = projectStatusMap[record.status] || { text: record.status, color: '#6B7280', emoji: '📋' }
      
      return {
        subject: `${pStatus.emoji} Proje Talebiniz Güncellendi - Unilancer`,
        toEmail: record.email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">${pStatus.emoji} Proje Durumu Güncellendi</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <p style="font-size: 16px;">Merhaba <strong>${record.name}</strong>,</p>
              <p style="font-size: 14px; color: #666;">Proje talebinizin durumu güncellenmiştir.</p>
              
              <div style="background: ${pStatus.color}15; border-left: 4px solid ${pStatus.color}; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${pStatus.color};">
                  ${pStatus.emoji} ${pStatus.text}
                </p>
              </div>
              
              ${record.status === 'in-progress' ? `
                <p style="font-size: 14px; color: #666;">Harika haber! Projeniz başladı. Ekibimiz şu anda projeniz üzerinde çalışıyor.</p>
              ` : record.status === 'completed' ? `
                <p style="font-size: 14px; color: #666;">Tebrikler! Projeniz başarıyla tamamlandı. Birlikte çalıştığımız için teşekkür ederiz.</p>
              ` : record.status === 'cancelled' ? `
                <p style="font-size: 14px; color: #666;">Proje talebiniz iptal edilmiştir. Sorularınız için bizimle iletişime geçebilirsiniz.</p>
              ` : `
                <p style="font-size: 14px; color: #666;">Proje talebiniz inceleniyor. Gelişmeler hakkında sizi bilgilendireceğiz.</p>
              `}
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #888; font-size: 12px;">
                Bu email Unilancer tarafından otomatik olarak gönderilmiştir.<br>
                <a href="https://unilancerlabs.com" style="color: #5FC8DA;">unilancerlabs.com</a>
              </p>
            </div>
          </div>
        `
      }

    default:
      return {
        subject: `🔔 Yeni Bildirim - ${type}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5FC8DA 0%, #4BA8B8 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Yeni Bildirim</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
              <p><strong>Tür:</strong> ${type}</p>
              <pre style="background: #fff; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(record, null, 2)}</pre>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">Zaman: ${timestamp}</p>
            </div>
          </div>
        `
      }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()
    const { type, record } = payload

    console.log('Received notification request:', { type, record })

    if (!type || !record) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing type or record' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { subject, html, toEmail } = createEmailContent(type, record)
    
    // Determine recipient: use toEmail for status updates, otherwise use admin notification email
    const recipient = toEmail || NOTIFICATION_EMAIL

    // Resend API ile email gönder
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Unilancer <noreply@unilancerlabs.com>',
        to: [recipient],
        subject: subject,
        html: html,
      }),
    })

    const emailResult = await emailResponse.json()
    console.log('Resend API response:', emailResult)

    if (!emailResponse.ok) {
      console.error('Resend API error:', emailResult)
      return new Response(
        JSON.stringify({ success: false, error: emailResult.message || 'Email send failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Email notification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
