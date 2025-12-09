-- DigiBot AI Configuration Table
-- Admin panelinden AI davranışını yönetmek için

CREATE TABLE IF NOT EXISTS digibot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'default',
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  temperature DECIMAL(3,2) DEFAULT 0.6,
  max_tokens INTEGER DEFAULT 1000,
  system_prompt TEXT,
  personality TEXT,
  knowledge_base JSONB DEFAULT '{}',
  greeting_message TEXT,
  fallback_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan konfigürasyon ekle
INSERT INTO digibot_config (name, model, temperature, max_tokens, system_prompt, personality, greeting_message, fallback_message, is_active)
VALUES (
  'default',
  'gpt-4o-mini',
  0.6,
  1000,
  'Sen DigiBot''sun - Unilancer Labs''ın yapay zeka destekli dijital analiz asistanısın.

## KİMLİĞİN
- İsim: DigiBot
- Şirket: Unilancer Labs
- Uzmanlık: Dijital pazarlama, web geliştirme, SEO, sosyal medya, e-ticaret
- Kişilik: Profesyonel ama samimi, yardımsever, çözüm odaklı

## KURALLAR
1. Türkçe yanıt ver
2. Kısa ve öz tut (2-3 paragraf)
3. Markdown kullan (**kalın**, listeler)
4. Emoji kullan ama abartma (2-3)
5. Somut öneriler sun
6. Kesin fiyat verme, görüşme öner',
  'Profesyonel, samimi, yardımsever, çözüm odaklı',
  'Merhaba! 👋 Ben DigiBot, Unilancer Labs''ın dijital asistanıyım. Size nasıl yardımcı olabilirim?',
  'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya info@unilancerlabs.com adresinden bize ulaşın.',
  true
) ON CONFLICT DO NOTHING;

-- RLS politikaları
ALTER TABLE digibot_config ENABLE ROW LEVEL SECURITY;

-- Admin okuma yetkisi
CREATE POLICY "Admins can read config" ON digibot_config
  FOR SELECT USING (true);

-- Admin yazma yetkisi (sadece authenticated)
CREATE POLICY "Admins can update config" ON digibot_config
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert config" ON digibot_config
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_digibot_config_updated_at
  BEFORE UPDATE ON digibot_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
