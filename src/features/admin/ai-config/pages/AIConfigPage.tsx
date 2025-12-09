import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  Settings,
  MessageSquare,
  Thermometer,
  Hash,
  Info,
  Loader2,
  Zap,
  Brain,
  Copy,
  Check,
  Code,
  Minimize2,
  FileJson
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../../lib/config/supabase';

interface AIConfig {
  id: string;
  config_key: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// JSON yapılı system prompt - daha organize ve AI için daha anlaşılır
const DEFAULT_SYSTEM_PROMPT = JSON.stringify({
  identity: {
    name: "DigiBot",
    role: "Unilancer Labs Dijital Asistan",
    personality: "Samimi, profesyonel, çözüm odaklı"
  },
  company: {
    name: "Unilancer Labs",
    description: "Dijital dönüşüm ve yazılım çözümleri sunan teknoloji şirketi",
    website: "unilancerlabs.com",
    contact: {
      email: "info@unilancerlabs.com",
      phone: "+90 xxx xxx xx xx"
    }
  },
  services: [
    { name: "Web Tasarım & Geliştirme", priceRange: "5.000₺ - 50.000₺+", duration: "2-8 hafta" },
    { name: "Dijital Pazarlama & SEO", priceRange: "3.000₺/ay - 15.000₺/ay", duration: "Aylık" },
    { name: "Sosyal Medya Yönetimi", priceRange: "2.500₺/ay - 10.000₺/ay", duration: "Aylık" },
    { name: "Marka Kimliği Tasarımı", priceRange: "4.000₺ - 25.000₺", duration: "2-4 hafta" },
    { name: "E-Ticaret Çözümleri", priceRange: "15.000₺ - 100.000₺+", duration: "4-12 hafta" },
    { name: "Mobil Uygulama", priceRange: "30.000₺ - 150.000₺+", duration: "8-16 hafta" }
  ],
  tasks: [
    "Dijital analiz raporlarını açıklamak ve yorumlamak",
    "Dijital skorları detaylı analiz etmek",
    "Kişiselleştirilmiş iyileştirme önerileri sunmak",
    "Unilancer Labs hizmetleri hakkında bilgi vermek",
    "Potansiyel müşterileri yönlendirmek"
  ],
  responseRules: {
    language: "Türkçe",
    tone: "Samimi ama profesyonel",
    maxLength: "200 kelime",
    format: "Markdown destekli (bold, liste)",
    mustInclude: ["Somut öneriler", "Aksiyon adımları"],
    avoid: ["Teknik jargon", "Belirsiz ifadeler", "Rakip firmalardan bahsetme"]
  },
  contextInstructions: "Kullanıcının dijital analiz raporu bağlamında yanıt ver. Skoru düşük alanlar için öncelikli öneriler sun."
}, null, 2);

const AVAILABLE_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Hızlı ve ekonomik', cost: '$' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'En gelişmiş model', cost: '$$$' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Güçlü ve hızlı', cost: '$$' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Temel model', cost: '$' },
];

const AIConfigPage: React.FC = () => {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  // Form state
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [isActive, setIsActive] = useState(true);

  // Fetch config from database
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('digibot_config')
        .select('*')
        .eq('config_key', 'default')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found (expected for first time)
        throw error;
      }

      if (data) {
        setConfig(data);
        setSystemPrompt(data.system_prompt);
        setModel(data.model);
        setTemperature(data.temperature);
        setMaxTokens(data.max_tokens);
        setIsActive(data.is_active);
      }
    } catch (error) {
      console.error('Config fetch error:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Track changes
  useEffect(() => {
    if (!config) {
      setHasChanges(true);
      return;
    }
    
    const changed = 
      systemPrompt !== config.system_prompt ||
      model !== config.model ||
      temperature !== config.temperature ||
      maxTokens !== config.max_tokens ||
      isActive !== config.is_active;
    
    setHasChanges(changed);
  }, [systemPrompt, model, temperature, maxTokens, isActive, config]);

  // Validate JSON
  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      setJsonError(null);
      return true;
    } catch (e: any) {
      setJsonError(e.message);
      return false;
    }
  };

  // Handle system prompt change with validation
  const handlePromptChange = (value: string) => {
    setSystemPrompt(value);
    validateJson(value);
  };

  // Format JSON
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(systemPrompt);
      setSystemPrompt(JSON.stringify(parsed, null, 2));
      setJsonError(null);
      toast.success('JSON formatlandı');
    } catch (e: any) {
      toast.error('Geçersiz JSON - formatlama yapılamadı');
    }
  };

  // Minify JSON
  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(systemPrompt);
      setSystemPrompt(JSON.stringify(parsed));
      setJsonError(null);
      toast.success('JSON sıkıştırıldı');
    } catch (e: any) {
      toast.error('Geçersiz JSON - sıkıştırma yapılamadı');
    }
  };

  // Save config
  const handleSave = async () => {
    // Validate JSON before saving
    if (!validateJson(systemPrompt)) {
      toast.error('Geçersiz JSON formatı - lütfen düzeltin');
      return;
    }

    setIsSaving(true);
    try {
      const configData = {
        config_key: 'default',
        system_prompt: systemPrompt,
        model,
        temperature,
        max_tokens: maxTokens,
        is_active: isActive,
        updated_at: new Date().toISOString()
      };

      if (config) {
        // Update existing
        const { error } = await supabase
          .from('digibot_config')
          .update(configData)
          .eq('id', config.id);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('digibot_config')
          .insert([configData]);
        
        if (error) throw error;
      }

      toast.success('AI ayarları kaydedildi!');
      await fetchConfig();
      setHasChanges(false);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Kaydetme hatası');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setModel('gpt-4o-mini');
    setTemperature(0.7);
    setMaxTokens(500);
    setIsActive(true);
    toast.info('Varsayılan değerler yüklendi');
  };

  // Copy system prompt
  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    toast.success('System prompt kopyalandı');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            DigiBot AI Ayarları
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI asistanın davranışını ve parametrelerini yapılandırın
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Varsayılana Dön
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Kaydet
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            Kaydedilmemiş değişiklikler var
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Prompt - Full Width */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileJson className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  System Prompt
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">JSON</span>
                </h3>
                <p className="text-xs text-slate-500">Yapılandırılmış AI konfigürasyonu</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleFormatJson}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="JSON Formatla"
              >
                <Code className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={handleMinifyJson}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="JSON Sıkıştır"
              >
                <Minimize2 className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={handleCopyPrompt}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Kopyala"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>
          <div className="p-4">
            <textarea
              value={systemPrompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              rows={20}
              className={`w-full px-4 py-3 bg-slate-900 dark:bg-slate-950 border rounded-xl text-sm text-emerald-400 dark:text-emerald-300 placeholder-slate-500 focus:outline-none focus:ring-2 resize-none font-mono leading-relaxed ${
                jsonError 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-slate-700 focus:ring-primary/50'
              }`}
              placeholder='{"identity": {...}, "services": [...], ...}'
              spellCheck={false}
            />
            {/* JSON Status */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {jsonError ? (
                  <span className="flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    JSON Hatası: {jsonError.slice(0, 50)}...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-500">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Geçerli JSON
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {systemPrompt.length} karakter
              </span>
            </div>
          </div>
        </div>

        {/* Model Settings - Sidebar */}
        <div className="space-y-6">
          {/* Model Selection */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Model</h3>
                <p className="text-xs text-slate-500">Kullanılacak AI modeli</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {AVAILABLE_MODELS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    model === m.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="model"
                      value={m.id}
                      checked={model === m.id}
                      onChange={(e) => setModel(e.target.value)}
                      className="sr-only"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{m.cost}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Temperature</h3>
                <p className="text-xs text-slate-500">Yaratıcılık seviyesi</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Tutarlı</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{temperature}</span>
                <span className="text-xs text-slate-500">Yaratıcı</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="mt-3 text-xs text-slate-500">
                {temperature <= 0.3 && '🎯 Çok tutarlı yanıtlar verir'}
                {temperature > 0.3 && temperature <= 0.7 && '⚖️ Dengeli ve doğal yanıtlar'}
                {temperature > 0.7 && '🎨 Yaratıcı ama değişken yanıtlar'}
              </p>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Hash className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Max Tokens</h3>
                <p className="text-xs text-slate-500">Yanıt uzunluğu limiti</p>
              </div>
            </div>
            <div className="p-4">
              <input
                type="number"
                min="100"
                max="2000"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="mt-2 text-xs text-slate-500">
                ~{Math.round(maxTokens * 0.75)} kelime yanıt (1 token ≈ 0.75 kelime)
              </p>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  <Zap className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">AI Aktif</h3>
                  <p className="text-xs text-slate-500">{isActive ? 'DigiBot çalışıyor' : 'DigiBot devre dışı'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <motion.div
                  animate={{ x: isActive ? 24 : 0 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Ayarlar Nasıl Çalışır?</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• <strong>System Prompt:</strong> AI'ın kişiliğini, bilgisini ve davranış kurallarını tanımlar</li>
              <li>• <strong>Temperature:</strong> Düşük değer = tutarlı yanıtlar, yüksek değer = yaratıcı yanıtlar</li>
              <li>• <strong>Max Tokens:</strong> Yanıtın maksimum uzunluğunu belirler (maliyet etkiler)</li>
              <li>• Değişiklikler kaydedildikten sonra tüm yeni konuşmalarda geçerli olur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConfigPage;
