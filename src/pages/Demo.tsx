import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Globe, 
  Mail, 
  Building2, 
  Loader2, 
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Send,
  Bot,
  User,
  Sparkles,
  BarChart3,
  ArrowRight,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

// Types
interface AnalysisResult {
  id: string;
  company_name: string;
  website_url: string;
  digital_score: number;
  seo_score: number;
  performance_score: number;
  security_score: number;
  mobile_score: number;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock data for demo
const generateMockAnalysis = (companyName: string, websiteUrl: string): AnalysisResult => ({
  id: crypto.randomUUID(),
  company_name: companyName,
  website_url: websiteUrl,
  digital_score: Math.floor(Math.random() * 25) + 55,
  seo_score: Math.floor(Math.random() * 30) + 45,
  performance_score: Math.floor(Math.random() * 25) + 50,
  security_score: Math.floor(Math.random() * 20) + 60,
  mobile_score: Math.floor(Math.random() * 30) + 45,
  recommendations: [
    'Meta etiketleri ve sayfa başlıkları optimize edilmeli',
    'Görsel boyutları küçültülerek sayfa hızı artırılmalı',
    'SSL sertifikası ve güvenlik başlıkları kontrol edilmeli',
    'Mobil responsive tasarım iyileştirilmeli',
    'İçerik stratejisi ve blog yazıları eklenmeli',
    'Sosyal medya entegrasyonu güçlendirilmeli'
  ],
  strengths: [
    'Güçlü marka kimliği',
    'Temiz ve modern tasarım',
    'Aktif sosyal medya varlığı'
  ],
  weaknesses: [
    'SEO optimizasyonu yetersiz',
    'Sayfa yükleme süresi yüksek',
    'Mobil deneyim geliştirilebilir'
  ]
});

const Demo = () => {
  const { t } = useTranslation();
  
  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    email: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'analyzing' | 'results'>('form');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle form submission (Mock mode)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.website_url || !formData.email) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    let cleanUrl = formData.website_url;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    try {
      new URL(cleanUrl);
    } catch {
      toast.error('Geçerli bir website URL\'si girin');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('analyzing');
    setAnalysisProgress(0);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      const result = generateMockAnalysis(formData.company_name, cleanUrl);
      setAnalysisResult(result);
      setCurrentStep('results');
      toast.success('Analiz tamamlandı!');
      
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: `Merhaba! 👋 Ben DigiBot, ${formData.company_name} için hazırlanan dijital analiz raporunuz hakkında sorularınızı yanıtlamak için buradayım.\n\nDijital skorunuz **${result.digital_score}/100** olarak hesaplandı. Size SEO, performans, güvenlik veya mobil uyumluluk hakkında detaylı bilgi verebilirim.\n\nNe öğrenmek istersiniz?`,
        timestamp: new Date()
      }]);
      
      setIsAnalyzing(false);
    }, 4000);
  };

  // Skip to demo
  const handleSkipToDemo = () => {
    const demoResult = generateMockAnalysis('Demo Şirketi', 'https://example.com');
    setAnalysisResult(demoResult);
    setCurrentStep('results');
    setFormData({
      company_name: 'Demo Şirketi',
      website_url: 'https://example.com',
      email: 'demo@example.com'
    });
    
    setChatMessages([{
      id: '1',
      role: 'assistant',
      content: `Merhaba! 👋 Ben DigiBot, Demo Şirketi için hazırlanan örnek dijital analiz raporunuz hakkında sorularınızı yanıtlamak için buradayım.\n\nDijital skorunuz **${demoResult.digital_score}/100** olarak hesaplandı. Size SEO, performans, güvenlik veya mobil uyumluluk hakkında detaylı bilgi verebilirim.\n\nNe öğrenmek istersiniz?`,
      timestamp: new Date()
    }]);
  };

  // Handle chat message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput, analysisResult);
      setChatMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsChatLoading(false);
    }, 800 + Math.random() * 700);
  };

  // Generate AI response
  const generateAIResponse = (question: string, result: AnalysisResult | null): string => {
    if (!result) return 'Henüz bir analiz yapılmadı.';
    
    const q = question.toLowerCase();
    
    if (q.includes('skor') || q.includes('puan') || q.includes('score') || q.includes('genel')) {
      return `📊 **${result.company_name}** için dijital skorunuz **${result.digital_score}/100**.\n\nBu skor aşağıdaki değerlendirmelerin ortalamasıdır:\n• SEO: ${result.seo_score}/100\n• Performans: ${result.performance_score}/100\n• Güvenlik: ${result.security_score}/100\n• Mobil: ${result.mobile_score}/100\n\nDetaylı bilgi için "SEO nasıl iyileştirilir?" veya "performans önerileri" diye sorabilirsiniz.`;
    }
    
    if (q.includes('seo')) {
      return `🔍 **SEO Analizi**\n\nSkorunuz: **${result.seo_score}/100**\n\n${result.seo_score < 60 ? '⚠️ SEO performansınız geliştirilmeli.' : '✅ SEO performansınız yeterli seviyede.'}\n\n**Öneriler:**\n• Meta etiketleri optimize edin\n• Sayfa başlıklarını düzenleyin\n• Alt text'leri ekleyin\n• URL yapısını iyileştirin\n• İçerik kalitesini artırın`;
    }
    
    if (q.includes('performans') || q.includes('hız') || q.includes('speed') || q.includes('yavaş')) {
      return `⚡ **Performans Analizi**\n\nSkorunuz: **${result.performance_score}/100**\n\n${result.performance_score < 60 ? '⚠️ Sayfa hızınız düşük.' : '✅ Performansınız kabul edilebilir seviyede.'}\n\n**İyileştirme Önerileri:**\n• Görselleri optimize edin (WebP formatı)\n• Lazy loading kullanın\n• CSS/JS dosyalarını minify edin\n• CDN kullanın\n• Browser caching aktif edin`;
    }
    
    if (q.includes('güvenlik') || q.includes('security') || q.includes('ssl') || q.includes('https')) {
      return `🔒 **Güvenlik Analizi**\n\nSkorunuz: **${result.security_score}/100**\n\n${result.security_score < 70 ? '⚠️ Güvenlik önlemlerinizi güçlendirmeniz önerilir.' : '✅ Güvenlik seviyeniz iyi.'}\n\n**Kontrol Listesi:**\n• SSL sertifikası aktif mi?\n• HTTPS yönlendirmesi var mı?\n• Security headers ekli mi?\n• İçerik güvenlik politikası (CSP) var mı?`;
    }
    
    if (q.includes('mobil') || q.includes('mobile') || q.includes('responsive') || q.includes('telefon')) {
      return `📱 **Mobil Uyumluluk Analizi**\n\nSkorunuz: **${result.mobile_score}/100**\n\n${result.mobile_score < 60 ? '⚠️ Mobil deneyim iyileştirilmeli.' : '✅ Mobil uyumluluğunuz yeterli.'}\n\n**Öneriler:**\n• Responsive breakpoint'leri kontrol edin\n• Touch-friendly butonlar kullanın\n• Font boyutlarını optimize edin\n• Mobil menü deneyimini iyileştirin`;
    }
    
    if (q.includes('öneri') || q.includes('tavsiye') || q.includes('ne yapmalı') || q.includes('iyileştir')) {
      return `💡 **Öncelikli Öneriler**\n\n${result.recommendations.slice(0, 5).map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n🎯 En düşük skorunuza odaklanarak başlamanızı öneririm.`;
    }
    
    if (q.includes('güçlü') || q.includes('strength') || q.includes('iyi') || q.includes('artı')) {
      return `✨ **Güçlü Yönleriniz**\n\n${result.strengths.map(s => `✅ ${s}`).join('\n')}\n\nBu güçlü yönlerinizi pazarlama stratejinizde öne çıkarabilirsiniz!`;
    }
    
    if (q.includes('zayıf') || q.includes('weakness') || q.includes('kötü') || q.includes('eksik')) {
      return `⚠️ **Geliştirilmesi Gereken Alanlar**\n\n${result.weaknesses.map(w => `• ${w}`).join('\n')}\n\nBu alanları iyileştirerek dijital skorunuzu artırabilirsiniz.`;
    }

    if (q.includes('merhaba') || q.includes('selam') || q.includes('hey')) {
      return `Merhaba! 👋 Size nasıl yardımcı olabilirim?\n\nŞunları sorabilirsiniz:\n• "Genel skorumu açıkla"\n• "SEO nasıl iyileştirilir?"\n• "Performans önerileri"\n• "Güçlü yönlerim neler?"`;
    }

    if (q.includes('teşekkür') || q.includes('sağol') || q.includes('thanks')) {
      return `Rica ederim! 😊 Başka bir sorunuz varsa yardımcı olmaktan memnuniyet duyarım.`;
    }
    
    return `${result.company_name} için dijital skorunuz **${result.digital_score}/100**.\n\nSize yardımcı olabileceğim konular:\n• 📊 Genel skor analizi\n• 🔍 SEO değerlendirmesi\n• ⚡ Performans önerileri\n• 🔒 Güvenlik kontrolü\n• 📱 Mobil uyumluluk\n\nHangi konuda detaylı bilgi istersiniz?`;
  };

  // Score color helpers
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <>
      <Helmet>
        <title>Ücretsiz Dijital Analiz | Unilancer</title>
        <meta name="description" content="Ücretsiz dijital analiz raporu alın. Web sitenizin SEO, performans, güvenlik ve mobil uyumluluk skorlarını öğrenin." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {/* Header */}
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">AI Destekli Analiz</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Ücretsiz Dijital
              <span className="text-primary"> Analiz Raporu</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Web sitenizin dijital performansını yapay zeka ile analiz edin.
              SEO, hız, güvenlik ve mobil uyumluluk skorlarınızı öğrenin.
            </motion.p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-24">
          <AnimatePresence mode="wait">
            {/* Step 1: Form */}
            {currentStep === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl mx-auto"
              >
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analiz Başlat</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Bilgilerinizi girin</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Örn: Unilancer Labs"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Website URL
                      </label>
                      <input
                        type="text"
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="Örn: unilancerlabs.com"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        E-posta Adresi
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Örn: info@sirketiniz.com"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        required
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Rapor detayları bu adrese gönderilecektir
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="w-full py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      Ücretsiz Analiz Başlat
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  {/* Skip to Demo */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={handleSkipToDemo}
                      className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Örnek Raporu Gör (Demo)
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-2">
                      Form doldurmadan örnek raporu inceleyebilirsiniz
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Zap, text: '30 saniyede sonuç' },
                        { icon: Shield, text: '100% güvenli' },
                        { icon: Target, text: 'Detaylı rapor' },
                        { icon: Bot, text: 'AI asistan' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <item.icon className="w-4 h-4 text-primary" />
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Analyzing */}
            {currentStep === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-xl mx-auto"
              >
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center shadow-xl dark:shadow-none">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Analiz Yapılıyor...
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {formData.website_url} analiz ediliyor
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 mb-6">
                    <motion.div 
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { text: 'Website taranıyor...', threshold: 0 },
                      { text: 'SEO analizi yapılıyor...', threshold: 25 },
                      { text: 'Performans ölçülüyor...', threshold: 50 },
                      { text: 'Güvenlik kontrol ediliyor...', threshold: 75 }
                    ].map((step, i) => (
                      <motion.div
                        key={step.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: analysisProgress > step.threshold ? 1 : 0.3, x: 0 }}
                        transition={{ delay: i * 0.3 }}
                        className="flex items-center gap-3 text-slate-600 dark:text-slate-400 justify-center"
                      >
                        {analysisProgress > step.threshold + 25 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        )}
                        {step.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {currentStep === 'results' && analysisResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Main Score Card */}
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-none">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Analiz Tamamlandı</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {analysisResult.company_name}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">{analysisResult.website_url}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(analysisResult.digital_score)}`}>
                        {analysisResult.digital_score}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dijital Skor</p>
                    </div>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'SEO', score: analysisResult.seo_score, icon: TrendingUp },
                    { label: 'Performans', score: analysisResult.performance_score, icon: Zap },
                    { label: 'Güvenlik', score: analysisResult.security_score, icon: Shield },
                    { label: 'Mobil', score: analysisResult.mobile_score, icon: Target }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-6 rounded-xl border ${getScoreBg(item.score)} bg-white dark:bg-transparent`}
                    >
                      <item.icon className={`w-6 h-6 ${getScoreColor(item.score)} mb-3`} />
                      <div className={`text-3xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recommendations & Chat */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recommendations */}
                  <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-none">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Öneriler
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.recommendations.slice(0, 5).map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                          <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-medium flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DigiBot Chat */}
                  <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-xl dark:shadow-none">
                    <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-3 bg-slate-50 dark:bg-white/5">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">DigiBot</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">AI Asistanınız</p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-4 max-h-[350px] overflow-y-auto">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'
                          }`}>
                            {msg.role === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className={`max-w-[80%] p-3 rounded-xl ${
                            msg.role === 'user' 
                              ? 'bg-primary text-white' 
                              : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <div className="bg-slate-100 dark:bg-white/10 p-3 rounded-xl">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Soru sorun..."
                          className="flex-1 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={isChatLoading || !chatInput.trim()}
                          className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 border border-primary/20 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Daha Fazla Detay İster misiniz?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Uzmanlarımız size özel dijital strateji oluşturabilir
                  </p>
                  <a
                    href="/tr/iletisim"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-all"
                  >
                    Ücretsiz Danışmanlık Al
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>

                {/* New Analysis */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setCurrentStep('form');
                      setAnalysisResult(null);
                      setFormData({ company_name: '', website_url: '', email: '' });
                      setChatMessages([]);
                      setAnalysisProgress(0);
                    }}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                  >
                    ← Yeni analiz yap
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Demo;
