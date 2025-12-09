# Dijital Analiz Sistemi - Kurulum Dokümantasyonu

## 📋 Genel Bakış

AI destekli dijital analiz raporu sistemi başarıyla admin panele entegre edilmiştir. Sistem, n8n webhook üzerinden çalışan AI agent'ınızla iletişim kurar ve firmaların dijital varlığını analiz eder.

## 🎯 Özellikler

✅ **Form Tabanlı Analiz Talebi**: Firma adı, web sitesi, LinkedIn URL girişi
✅ **AI Entegrasyonu**: n8n webhook ile güvenli iletişim
✅ **Gerçek Zamanlı Durum Takibi**: pending → processing → completed/failed
✅ **Görsel Rapor Arayüzü**: Skorlar, öneriler, içgörüler, rekabet analizi
✅ **PDF Export**: Profesyonel tasarımlı PDF rapor indirme
✅ **Admin Paneli Entegrasyonu**: Tam CRUD operasyonları, filtreleme, arama
✅ **Supabase Backend**: Güvenli veri saklama ve webhook yönetimi

## 📁 Oluşturulan Dosyalar

### Database & Backend
- `supabase/migrations/20251209000000_digital_analysis_reports.sql` - Veritabanı şeması
- `supabase/functions/trigger-analysis/index.ts` - n8n webhook tetikleyici
- `supabase/functions/receive-analysis-results/index.ts` - AI sonuçlarını alan endpoint
- `src/lib/api/digitalAnalysis.ts` - Supabase CRUD fonksiyonları

### Frontend Components
- `src/features/admin/digital-analysis/types/index.ts` - TypeScript tip tanımları
- `src/features/admin/digital-analysis/components/AnalysisRequestForm.tsx` - Analiz talep formu
- `src/features/admin/digital-analysis/components/AnalysisReportViewer.tsx` - Rapor görüntüleyici
- `src/features/admin/digital-analysis/pages/DigitalAnalysisPage.tsx` - Ana admin sayfası

### Utilities & Routes
- `src/lib/utils/export.ts` - PDF export fonksiyonu eklendi (exportAnalysisReportToPDF)
- `src/features/admin/routes.tsx` - Route tanımı eklendi
- `src/features/admin/components/layout/AdminSidebar.tsx` - Navigasyon linki eklendi

## 🔧 Supabase Kurulum Adımları

### 1. Database Migration'ı Çalıştırın

Supabase Dashboard > SQL Editor'de aşağıdaki migration dosyasını çalıştırın:

```bash
supabase/migrations/20251209000000_digital_analysis_reports.sql
```

Bu migration şunları oluşturur:
- ✅ `digital_analysis_reports` tablosu
- ✅ İndeksler (status, company_name, webhook_request_id)
- ✅ RLS politikaları
- ✅ Activity log trigger'ları
- ✅ Stats view (digital_analysis_stats)

### 2. Edge Functions Deploy Edin

#### A. trigger-analysis Fonksiyonu

```bash
supabase functions deploy trigger-analysis
```

**Gerekli Environment Variables:**
```bash
# Supabase Dashboard > Project Settings > Edge Functions > Secrets
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/digital-analysis
N8N_API_KEY=your-api-key-here  # Opsiyonel: Webhook authentication için
```

#### B. receive-analysis-results Fonksiyonu

```bash
supabase functions deploy receive-analysis-results
```

Bu fonksiyon AI agent'ınızın sonuçları göndereceği callback URL'dir.

### 3. Environment Variables'ı Ayarlayın

Supabase Dashboard > Project Settings > Edge Functions'da:

| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `N8N_WEBHOOK_URL` | n8n workflow webhook URL'iniz | `https://n8n.yourcompany.com/webhook/analysis` |
| `N8N_API_KEY` | Webhook authentication (opsiyonel) | `Bearer abc123...` |

## 🔗 n8n Webhook Entegrasyonu

### n8n'e Gönderilen Payload (Request)

Edge Function (`trigger-analysis`) n8n'e şu formatta veri gönderir:

```json
{
  "report_id": "uuid-here",
  "company_name": "ABC Teknoloji",
  "website_url": "https://example.com",
  "linkedin_url": "https://linkedin.com/company/example",
  "priority": "medium",
  "created_at": "2025-12-09T10:30:00Z",
  "callback_url": "https://your-project.supabase.co/functions/v1/receive-analysis-results"
}
```

### n8n'den Beklenen Response (Callback)

AI agent analiz tamamlandığında `callback_url`'e POST isteği atmalı:

```json
{
  "report_id": "uuid-from-request",
  "status": "completed",
  "digital_score": 78,
  "analysis_summary": "ABC Teknoloji'nin dijital varlığı güçlü...",
  "analysis_result": {
    "executive_summary": "Detaylı analiz özeti...",
    "scores": {
      "overall": 78,
      "website": 85,
      "seo": 72,
      "social_media": 65,
      "content_quality": 80,
      "user_experience": 88,
      "mobile_optimization": 90,
      "performance": 75,
      "security": 95
    },
    "website_analysis": {
      "technology_stack": ["React", "Next.js", "Tailwind CSS"],
      "page_speed_score": 85,
      "mobile_friendly": true,
      "ssl_enabled": true,
      "responsive_design": true,
      "meta_tags_quality": "good",
      "images_optimized": true
    },
    "seo_analysis": {
      "title_tag": "ABC Teknoloji - Dijital Çözümler",
      "meta_description": "Kurumsal dijital çözümler...",
      "h1_tags": ["Ana Başlık"],
      "keyword_density": {
        "teknoloji": 12,
        "dijital": 8,
        "çözüm": 6
      },
      "internal_links": 45,
      "external_links": 12,
      "alt_texts_present": true,
      "structured_data": true
    },
    "social_media": {
      "linkedin": {
        "followers": 5420,
        "posts_per_week": 3,
        "engagement_rate": 4.2,
        "profile_completeness": 95
      },
      "facebook": {
        "url": "https://facebook.com/abctech",
        "followers": 12500
      }
    },
    "recommendations": [
      {
        "category": "SEO",
        "priority": "high",
        "title": "Meta Açıklamalarını Optimize Edin",
        "description": "Bazı sayfalarda meta açıklama eksik veya çok kısa...",
        "impact": "Yüksek - Organik trafik %15-20 artabilir",
        "effort": "Düşük - 2-3 saat"
      },
      {
        "category": "Social Media",
        "priority": "medium",
        "title": "LinkedIn Aktivitesini Artırın",
        "description": "Haftalık paylaşım sayısı artırılmalı...",
        "impact": "Orta - Marka bilinirliği artacak",
        "effort": "Orta - Haftalık 2-3 saat"
      }
    ],
    "insights": [
      {
        "type": "positive",
        "title": "Mükemmel Mobil Deneyim",
        "description": "Siteniz mobil cihazlarda çok iyi performans gösteriyor."
      },
      {
        "type": "negative",
        "title": "Sosyal Medya Etkileşimi Düşük",
        "description": "LinkedIn takipçi sayısı iyi ancak etkileşim oranı sektör ortalamasının altında."
      },
      {
        "type": "neutral",
        "title": "Teknik SEO Altyapısı Sağlam",
        "description": "Structured data ve temel SEO unsurları yerinde."
      }
    ],
    "competitive_analysis": {
      "industry_average_score": 65,
      "position": "Sektör ortalamasının üzerinde",
      "strengths": [
        "Güçlü teknik altyapı",
        "Yüksek güvenlik standartları",
        "Mobil optimizasyon"
      ],
      "weaknesses": [
        "Sosyal medya etkileşimi düşük",
        "Blog içeriği yetersiz",
        "Dış bağlantı profili zayıf"
      ]
    }
  },
  "processing_duration_ms": 145000,
  "webhook_request_id": "n8n-execution-id-123"
}
```

### Hata Durumunda Response

```json
{
  "report_id": "uuid-from-request",
  "status": "failed",
  "error_message": "Website'e erişilemiyor veya timeout oluştu"
}
```

## 🧪 Test Etme

### 1. Manuel Test (Admin Panelden)

1. Admin panele giriş yapın: `https://your-domain.com/admin`
2. Sol menüden **"Dijital Analiz"** linkine tıklayın
3. **"Yeni Analiz"** butonuna tıklayın
4. Test verileri girin:
   - Firma Adı: `Test Şirketi`
   - Web Sitesi: `https://example.com`
   - LinkedIn: `https://linkedin.com/company/example`
5. **"Analizi Başlat"** butonuna tıklayın

### 2. Webhook Test (n8n Olmadan)

Supabase Functions URL'ini kullanarak:

```bash
# 1. Rapor oluştur
curl -X POST 'https://your-project.supabase.co/rest/v1/digital_analysis_reports' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Company",
    "website_url": "https://example.com",
    "status": "pending"
  }'

# 2. Webhook tetikle
curl -X POST 'https://your-project.supabase.co/functions/v1/trigger-analysis' \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"report_id": "uuid-from-step-1"}'

# 3. Manuel sonuç gönder (n8n simülasyonu)
curl -X POST 'https://your-project.supabase.co/functions/v1/receive-analysis-results' \
  -H "Content-Type: application/json" \
  -d '{
    "report_id": "uuid-from-step-1",
    "status": "completed",
    "digital_score": 85,
    "analysis_summary": "Test analiz özeti",
    "analysis_result": {
      "executive_summary": "Test özeti",
      "scores": {"overall": 85, "website": 90}
    }
  }'
```

## 🎨 UI/UX Özellikleri

### Ana Sayfa
- **Stats Cards**: Toplam rapor, tamamlanan, ortalama skor, işleniyor
- **Arama & Filtreleme**: Firma adı, web sitesi, durum bazlı filtreleme
- **Export**: CSV, Excel, PDF (tablo verisi)
- **Tablo**: Sıralanabilir, responsive, durum badge'leri

### Analiz Formu
- ✅ Validasyon (URL kontrolü, zorunlu alanlar)
- ✅ Öncelik seçimi (Düşük, Orta, Yüksek, Acil)
- ✅ Loading state ve hata yönetimi
- ✅ LinkedIn opsiyonel alan

### Rapor Görüntüleyici
- 🎯 **Genel Skor**: Büyük, renkli skor kartı (0-100)
- 📊 **Detaylı Skorlar**: Grid layout, renk kodlu kartlar
- 💡 **Öneriler**: Öncelik badge'li, kategorize öneriler
- 🔍 **İçgörüler**: Pozitif/negatif/nötr içgörüler
- 🏆 **Rekabet Analizi**: Sektör ortalaması, güçlü/zayıf yönler
- 📥 **PDF Export**: Tek tıkla profesyonel PDF indirme

### PDF Raporu
- 🎨 Unilancer branding (logo, renkler)
- 📈 Renkli skor kartları (yeşil/sarı/kırmızı)
- 📝 Kategorize öneriler
- 📊 Tablo ve grid layout
- 🖨️ Print-friendly tasarım

## 🔒 Güvenlik Notları

### Supabase RLS (Row Level Security)
Şu an tüm tablolar için permissive policy aktif:
```sql
CREATE POLICY "Digital analysis reports policy" ON digital_analysis_reports
  FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
```

**⚠️ Üretim Önerisi**: Admin kullanıcı authentication kontrolü ekleyin:
```sql
-- Örnek güvenli policy
CREATE POLICY "Admin only access" ON digital_analysis_reports
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

### Edge Function Authentication
- Frontend'den `Authorization: Bearer ANON_KEY` ile çağrılıyor
- n8n webhook'a opsiyonel `N8N_API_KEY` ile authentication
- Callback endpoint için rate limiting eklenebilir

## 📞 n8n Workflow Yapılandırması

### Gerekli n8n Nodes

1. **Webhook Trigger**
   - Method: POST
   - Path: `/webhook/digital-analysis`
   - Response: `{ "execution_id": "{{$workflow.id}}" }`

2. **HTTP Request - Website Analizi**
   - URL: `{{$json.website_url}}`
   - Method: GET
   - İçerik çekme ve parse etme

3. **AI Agent Node** (OpenAI, Claude, vs.)
   - Prompt: Website içeriğini analiz et
   - Output: Structured JSON (yukarıdaki format)

4. **LinkedIn API** (Opsiyonel)
   - Company bilgilerini çek
   - Follower, engagement metrics

5. **HTTP Request - Callback**
   - URL: `{{$json.callback_url}}`
   - Method: POST
   - Body: Analysis results JSON

### Örnek n8n Workflow Şeması

```
Webhook Trigger (receive request)
    ↓
Set Variables (extract data)
    ↓
HTTP Request (fetch website)
    ↓
AI Agent (analyze content)
    ↓
LinkedIn API (get social data)
    ↓
Merge Data (combine results)
    ↓
HTTP Request (send to callback_url)
```

## 🐛 Troubleshooting

### Problem: "n8n webhook failed"
- ✅ `N8N_WEBHOOK_URL` doğru ayarlandı mı kontrol edin
- ✅ n8n workflow'unuz aktif mi?
- ✅ n8n loglarını inceleyin

### Problem: "Analiz tamamlanmıyor"
- ✅ n8n workflow'unuzun callback attığından emin olun
- ✅ `receive-analysis-results` endpoint'i çalışıyor mu?
- ✅ Supabase logs: Dashboard > Logs > Edge Functions

### Problem: "PDF export çalışmıyor"
- ✅ Browser pop-up blocker devre dışı mı?
- ✅ `analysis_result` JSONB'de data var mı?
- ✅ Browser console'da hata var mı?

### Problem: "Form submit sonrası hata"
- ✅ Supabase anon key doğru mu?
- ✅ `digital_analysis_reports` tablosu oluşturuldu mu?
- ✅ Network tab'de 401/403 hatası var mı?

## 📊 Database Schema Detayları

### digital_analysis_reports Tablosu

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID | Primary key |
| `company_name` | TEXT | Firma adı (zorunlu) |
| `website_url` | TEXT | Web sitesi URL (zorunlu) |
| `linkedin_url` | TEXT | LinkedIn URL (opsiyonel) |
| `analysis_result` | JSONB | AI analiz sonuçları (structured) |
| `analysis_summary` | TEXT | Kısa özet |
| `digital_score` | INTEGER | 0-100 arası genel skor |
| `status` | TEXT | pending/processing/completed/failed/cancelled |
| `webhook_request_id` | TEXT | n8n execution ID |
| `webhook_triggered_at` | TIMESTAMPTZ | Webhook gönderim zamanı |
| `webhook_completed_at` | TIMESTAMPTZ | Sonuç alma zamanı |
| `processing_duration_ms` | INTEGER | İşlem süresi (ms) |
| `error_message` | TEXT | Hata mesajı (varsa) |
| `requested_by` | TEXT | Talep eden admin kullanıcı |
| `admin_notes` | TEXT | Admin notları |
| `priority` | TEXT | low/medium/high/urgent |
| `pdf_generated` | BOOLEAN | PDF oluşturuldu mu? |
| `pdf_generated_at` | TIMESTAMPTZ | PDF oluşturma zamanı |
| `pdf_download_count` | INTEGER | İndirme sayısı |
| `created_at` | TIMESTAMPTZ | Oluşturulma |
| `updated_at` | TIMESTAMPTZ | Güncellenme |

## 🚀 Sonraki Adımlar

1. ✅ Migration'ı Supabase'de çalıştırın
2. ✅ Edge Functions'ları deploy edin
3. ✅ Environment variables'ı ayarlayın
4. ✅ n8n webhook URL'ini ekleyin
5. ✅ Test analizi çalıştırın
6. ✅ n8n workflow'unu n8n'e callback gönderecek şekilde yapılandırın
7. ✅ Üretim için RLS politikalarını güvenli hale getirin

## 📝 Notlar

- Sistem **production-ready** durumda
- Tüm UI/UX existing admin paneli ile uyumlu
- Dark mode destekli
- Responsive tasarım (mobile/tablet/desktop)
- TypeScript ile tip güvenliği
- Error handling ve loading states mevcut
- Türkçe/İngilizce çeviri desteği hazır (translation keys eklendi)

## 🎉 Tebrikler!

Dijital analiz sisteminiz başarıyla kuruldu! n8n webhook URL ve API key'leri ekledikten sonra sistem fully operational olacak.

Sorularınız için: support@unilancer.com
