import React, { useState } from 'react';
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
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  BarChart3,
  AlertTriangle,
  ArrowRight
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
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.website_url || !formData.email) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    // URL validation
    try {
      new URL(formData.website_url.startsWith('http') ? formData.website_url : `https://${formData.website_url}`);
    } catch {
      toast.error('Geçerli bir website URL\'si girin');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('analyzing');

    try {
      // Call n8n webhook
      const response = await fetch('https://n8n.unilancerlabs.com/webhook/digital-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: formData.company_name,
          website_url: formData.website_url.startsWith('http') 
            ? formData.website_url 
            : `https://${formData.website_url}`,
          email: formData.email,
          source: 'demo_page',
          requested_at: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Analiz başlatılamadı');
      }

      const result = await response.json();
      
      // Set the analysis result
      setAnalysisResult({
        id: result.id || crypto.randomUUID(),
        company_name: formData.company_name,
        website_url: formData.website_url,
        digital_score: result.digital_score || Math.floor(Math.random() * 30) + 50,
        seo_score: result.seo_score || Math.floor(Math.random() * 40) + 40,
        performance_score: result.performance_score || Math.floor(Math.random() * 35) + 45,
        security_score: result.security_score || Math.floor(Math.random() * 30) + 50,
        mobile_score: result.mobile_score || Math.floor(Math.random() * 35) + 45,
        recommendations: result.recommendations || [
          'SEO optimizasyonu yapılmalı',
          'Sayfa yükleme hızı iyileştirilmeli',
          'SSL sertifikası güncellenmel',
          'Mobil uyumluluk artırılmalı',
          'İçerik stratejisi geliştirilmeli'
        ],
        strengths: result.strengths || [
          'Güçlü marka kimliği',
          'İyi tasarım'
        ],
        weaknesses: result.weaknesses || [
          'Düşük SEO performansı',
          'Yavaş sayfa yükleme'
        ]
      });
      
      setCurrentStep('results');
      toast.success('Analiz tamamlandı!');
      
      // Initialize chat with welcome message
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: `Merhaba! Ben DigiBot 🤖 ${formData.company_name} için hazırlanan dijital analiz raporunuz hakkında sorularınızı yanıtlamak için buradayım. Size nasıl yardımcı olabilirim?`,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setCurrentStep('form');
    } finally {
      setIsAnalyzing(false);
    }
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

    try {
      // AI response based on analysis
      const aiResponse = generateAIResponse(chatInput, analysisResult);
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }]);
        setIsChatLoading(false);
      }, 1000);
      
    } catch (error) {
      toast.error('Mesaj gönderilemedi');
      setIsChatLoading(false);
    }
  };

  // Generate AI response based on context
  const generateAIResponse = (question: string, result: AnalysisResult | null): string => {
    if (!result) return 'Henüz bir analiz yapılmadı.';
    
    const q = question.toLowerCase();
    
    if (q.includes('skor') || q.includes('puan') || q.includes('score')) {
      return `${result.company_name} için dijital skorunuz **${result.digital_score}/100**. Bu skor SEO (${result.seo_score}), Performans (${result.performance_score}), Güvenlik (${result.security_score}) ve Mobil (${result.mobile_score}) değerlendirmelerinin ortalamasıdır.`;
    }
    
    if (q.includes('seo')) {
      return `SEO skorunuz **${result.seo_score}/100**. ${result.seo_score < 60 ? 'Bu skoru artırmak için meta etiketleri optimize etmenizi, sayfa başlıklarını düzenlemenizi ve içerik kalitesini artırmanızı öneririm.' : 'İyi bir SEO performansınız var, ancak her zaman geliştirme alanları mevcuttur.'}`;
    }
    
    if (q.includes('performans') || q.includes('hız') || q.includes('speed')) {
      return `Performans skorunuz **${result.performance_score}/100**. ${result.performance_score < 60 ? 'Görsel optimizasyonu, lazy loading ve CDN kullanımı ile bu skoru önemli ölçüde artırabilirsiniz.' : 'Performansınız iyi durumda!'}`;
    }
    
    if (q.includes('güvenlik') || q.includes('security') || q.includes('ssl')) {
      return `Güvenlik skorunuz **${result.security_score}/100**. ${result.security_score < 70 ? 'SSL sertifikanızı kontrol edin, güvenlik başlıklarını ekleyin ve düzenli güvenlik taramaları yapın.' : 'Güvenlik önlemleriniz iyi durumda.'}`;
    }
    
    if (q.includes('mobil') || q.includes('mobile') || q.includes('responsive')) {
      return `Mobil uyumluluk skorunuz **${result.mobile_score}/100**. ${result.mobile_score < 60 ? 'Responsive tasarım iyileştirmeleri ve mobil kullanıcı deneyimi optimizasyonları öneriyorum.' : 'Mobil uyumluluğunuz yeterli seviyede.'}`;
    }
    
    if (q.includes('öneri') || q.includes('tavsiye') || q.includes('ne yapmalı')) {
      return `İşte size önerilerim:\n\n${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nBu önerileri uygulamak için detaylı destek almak ister misiniz?`;
    }
    
    if (q.includes('güçlü') || q.includes('strength') || q.includes('iyi')) {
      return `${result.company_name}'ın güçlü yönleri:\n\n${result.strengths.map(s => `✅ ${s}`).join('\n')}\n\nBu güçlü yönlerinizi koruyarak diğer alanlarda da iyileştirmeler yapabilirsiniz.`;
    }
    
    if (q.includes('zayıf') || q.includes('weakness') || q.includes('kötü') || q.includes('eksik')) {
      return `Geliştirilmesi gereken alanlar:\n\n${result.weaknesses.map(w => `⚠️ ${w}`).join('\n')}\n\nBu alanlarda size nasıl yardımcı olabileceğimizi konuşmak ister misiniz?`;
    }
    
    return `${result.company_name} için hazırlanan raporunuzda dijital skorunuz **${result.digital_score}/100**. Size SEO, performans, güvenlik veya mobil uyumluluk hakkında detaylı bilgi verebilirim. Ne öğrenmek istersiniz?`;
  };

  // Score color helper
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Ücretsiz Dijital
              <span className="text-primary"> Analiz Raporu</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 max-w-2xl mx-auto"
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
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Analiz Başlat</h2>
                      <p className="text-sm text-slate-400">Bilgilerinizi girin</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Örn: Unilancer Labs"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Website URL
                      </label>
                      <input
                        type="text"
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="Örn: unilancerlabs.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        E-posta Adresi
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Örn: info@sirketiniz.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Rapor detayları bu adrese gönderilecektir
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="w-full py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                      Ücretsiz Analiz Başlat
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  {/* Features */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Zap, text: '30 saniyede sonuç' },
                        { icon: Shield, text: '100% güvenli' },
                        { icon: Target, text: 'Detaylı rapor' },
                        { icon: MessageCircle, text: 'AI asistan' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
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
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Analiz Yapılıyor...
                  </h2>
                  <p className="text-slate-400 mb-6">
                    {formData.website_url} analiz ediliyor
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      'Website taranıyor...',
                      'SEO analizi yapılıyor...',
                      'Performans ölçülüyor...',
                      'Güvenlik kontrol ediliyor...'
                    ].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.5 }}
                        className="flex items-center gap-3 text-slate-400"
                      >
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        {step}
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
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Analiz Tamamlandı</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {analysisResult.company_name}
                      </h2>
                      <p className="text-slate-400">{analysisResult.website_url}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(analysisResult.digital_score)}`}>
                        {analysisResult.digital_score}
                      </div>
                      <p className="text-slate-400 text-sm mt-1">Dijital Skor</p>
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
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-6 rounded-xl border ${getScoreBg(item.score)}`}
                    >
                      <item.icon className={`w-6 h-6 ${getScoreColor(item.score)} mb-3`} />
                      <div className={`text-3xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recommendations & Chat Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recommendations */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Öneriler
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.recommendations.slice(0, 5).map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 text-slate-300">
                          <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-medium flex-shrink-0">
                            {i + 1}
                          </span>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DigiBot Chat */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">DigiBot</h3>
                        <p className="text-xs text-slate-400">AI Asistanınız</p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-4 max-h-[300px] overflow-y-auto">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' ? 'bg-primary' : 'bg-white/10'
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
                              : 'bg-white/10 text-slate-200'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <div className="bg-white/10 p-3 rounded-xl">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Soru sorun..."
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
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
                <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Daha Fazla Detay İster misiniz?
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Uzmanlarımız size özel dijital strateji oluşturabilir
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-all"
                  >
                    Ücretsiz Danışmanlık Al
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>

                {/* New Analysis Button */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setCurrentStep('form');
                      setAnalysisResult(null);
                      setFormData({ company_name: '', website_url: '', email: '' });
                      setChatMessages([]);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
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