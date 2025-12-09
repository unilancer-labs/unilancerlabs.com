import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
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
  Play,
  Home,
  FileText,
  MessageCircle,
  Settings,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Users,
  Share2,
  Palette,
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  Award,
  AlertCircle,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';
import { generateDigiBotResponse, unilancerKnowledge } from '../data/unilancerKnowledge';
import { signOut } from '../lib/auth';
import { useTheme } from '../contexts/ThemeContext';

// Types
interface AnalysisResult {
  id: string;
  company_name: string;
  website_url: string;
  email: string;
  sector: string;
  location: string;
  digital_score: number;
  scores: {
    web_presence: number;
    social_media: number;
    brand_identity: number;
    digital_marketing: number;
    user_experience: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }[];
  detailed_report: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock data generator
const generateMockAnalysis = (companyName: string, websiteUrl: string, email: string): AnalysisResult => {
  const webScore = Math.floor(Math.random() * 30) + 50;
  const socialScore = Math.floor(Math.random() * 35) + 40;
  const brandScore = Math.floor(Math.random() * 25) + 55;
  const marketingScore = Math.floor(Math.random() * 30) + 45;
  const uxScore = Math.floor(Math.random() * 25) + 55;
  const overallScore = Math.round((webScore + socialScore + brandScore + marketingScore + uxScore) / 5);

  return {
    id: crypto.randomUUID(),
    company_name: companyName,
    website_url: websiteUrl,
    email: email,
    sector: "Teknoloji / E-ticaret",
    location: "İstanbul, Türkiye",
    digital_score: overallScore,
    scores: {
      web_presence: webScore,
      social_media: socialScore,
      brand_identity: brandScore,
      digital_marketing: marketingScore,
      user_experience: uxScore
    },
    summary: `${companyName}, dijital varlık açısından orta seviyede bir performans sergiliyor. Web sitesi temel gereksinimleri karşılıyor ancak modern kullanıcı deneyimi standartlarının gerisinde kalıyor. Sosyal medya varlığı mevcut ancak aktif ve stratejik bir içerik planlaması eksik. Marka kimliği tutarlı görünse de dijital kanallarda yeterince güçlü yansıtılmıyor. SEO ve dijital pazarlama alanında önemli iyileştirme fırsatları bulunuyor.`,
    strengths: [
      "Kurumsal kimlik ve logo tasarımı profesyonel görünüyor",
      "Web sitesinde temel bilgiler (iletişim, hakkımızda) mevcut",
      "SSL sertifikası aktif, temel güvenlik sağlanmış",
      "Mobil uyumlu tasarım mevcut",
      "Google My Business kaydı aktif"
    ],
    weaknesses: [
      "Sosyal medya hesapları düzensiz ve az takipçili",
      "Web sitesi yükleme hızı optimizasyona ihtiyaç duyuyor",
      "Blog veya içerik pazarlaması stratejisi yok",
      "SEO meta etiketleri ve yapılandırılmış veri eksik",
      "E-posta pazarlama altyapısı kurulmamış",
      "Müşteri yorumları ve sosyal kanıt yetersiz"
    ],
    recommendations: [
      {
        title: "Sosyal Medya Stratejisi Oluşturun",
        description: "Düzenli içerik takvimi, hedef kitle analizi ve etkileşim stratejisi ile sosyal medya varlığınızı güçlendirin. Haftada en az 3-4 paylaşım hedefleyin.",
        priority: "high",
        category: "social_media"
      },
      {
        title: "Web Sitesi Hızını Optimize Edin",
        description: "Görsel optimizasyonu, lazy loading ve caching stratejileri ile sayfa yükleme süresini 3 saniyenin altına düşürün.",
        priority: "high",
        category: "web"
      },
      {
        title: "SEO Çalışması Başlatın",
        description: "Anahtar kelime araştırması yapın, meta etiketleri optimize edin ve düzenli blog içerikleri ile organik trafiği artırın.",
        priority: "high",
        category: "marketing"
      },
      {
        title: "İçerik Pazarlaması Stratejisi",
        description: "Sektörünüzle ilgili değerli içerikler üreterek potansiyel müşterilerinize ulaşın ve uzmanlığınızı gösterin.",
        priority: "medium",
        category: "content"
      },
      {
        title: "E-posta Pazarlama Altyapısı",
        description: "Newsletter sistemi kurun, müşteri segmentasyonu yapın ve otomatik e-posta akışları oluşturun.",
        priority: "medium",
        category: "marketing"
      },
      {
        title: "Müşteri Yorumları Toplayın",
        description: "Google, sosyal medya ve web sitenizde müşteri yorumları toplayarak sosyal kanıt oluşturun.",
        priority: "medium",
        category: "brand"
      }
    ],
    detailed_report: `
# ${companyName} Dijital Varlık Analiz Raporu

## Yönetici Özeti
${companyName}, dijital dünyada var olmak için temel adımları atmış ancak rekabetçi bir dijital varlık için önemli geliştirmeler yapması gereken bir işletmedir. Genel dijital skorunuz ${overallScore}/100 olarak hesaplanmıştır.

## Web Sitesi Analizi
Web siteniz temel gereksinimleri karşılıyor. SSL sertifikası aktif ve mobil uyumlu bir tasarıma sahipsiniz. Ancak sayfa yükleme hızı, SEO optimizasyonu ve kullanıcı deneyimi açısından iyileştirme alanları mevcut.

## Sosyal Medya Değerlendirmesi  
Sosyal medya hesaplarınız mevcut ancak düzenli ve stratejik bir içerik planlaması eksik. Takipçi sayıları sektör ortalamasının altında ve etkileşim oranları düşük.

## Marka Kimliği
Kurumsal kimliğiniz profesyonel görünüyor. Logo ve renk paleti tutarlı kullanılmış. Ancak bu kimlik dijital kanallarda yeterince güçlü yansıtılmıyor.

## Dijital Pazarlama
SEO çalışması yapılmamış, Google Ads veya sosyal medya reklamları aktif değil. İçerik pazarlaması stratejisi bulunmuyor.

## Önerilen Aksiyon Planı
1. İlk 30 gün: Sosyal medya içerik takvimi oluşturun
2. 30-60 gün: Web sitesi hız optimizasyonu yapın
3. 60-90 gün: SEO temel çalışmalarını tamamlayın
4. 90+ gün: İçerik pazarlaması ve e-posta stratejisi başlatın
    `
  };
};

// Tab types
type TabType = 'overview' | 'details' | 'recommendations' | 'chat';

const Demo = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
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
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle form submission
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

    setIsAnalyzing(true);
    setCurrentStep('analyzing');
    setAnalysisProgress(0);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 12;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      const result = generateMockAnalysis(formData.company_name, cleanUrl, formData.email);
      setAnalysisResult(result);
      setCurrentStep('results');
      toast.success('Analiz tamamlandı!');
      
      // Initialize chat with welcome message
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: `Merhaba! 👋 Ben DigiBot, Unilancer Labs'ın dijital asistanıyım.\n\n${formData.company_name} için hazırlanan dijital analiz raporunuz hazır. Genel dijital skorunuz **${result.digital_score}/100** olarak hesaplandı.\n\nRaporunuz hakkında sorularınızı yanıtlayabilir, Unilancer Labs'ın size nasıl yardımcı olabileceği konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
        timestamp: new Date()
      }]);
      
      setIsAnalyzing(false);
    }, 5000);
  };

  // Skip to demo
  const handleSkipToDemo = () => {
    const demoResult = generateMockAnalysis('Demo Şirketi A.Ş.', 'https://example.com', 'demo@example.com');
    setAnalysisResult(demoResult);
    setCurrentStep('results');
    setFormData({
      company_name: 'Demo Şirketi A.Ş.',
      website_url: 'https://example.com',
      email: 'demo@example.com'
    });
    
    setChatMessages([{
      id: '1',
      role: 'assistant',
      content: `Merhaba! 👋 Ben DigiBot, Unilancer Labs'ın dijital asistanıyım.\n\nBu örnek bir dijital analiz raporudur. Genel dijital skor **${demoResult.digital_score}/100** olarak hesaplandı.\n\nRapor hakkında sorularınızı yanıtlayabilir, Unilancer Labs hizmetleri konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
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
    const question = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    setTimeout(() => {
      const response = generateDigiBotResponse(question, analysisResult);
      setChatMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
      setIsChatLoading(false);
    }, 800 + Math.random() * 600);
  };

  // Score helpers
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-500/5';
    if (score >= 60) return 'from-amber-500/20 to-amber-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return 'ring-emerald-500/30';
    if (score >= 60) return 'ring-amber-500/30';
    return 'ring-red-500/30';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (priority === 'medium') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'social_media': return Share2;
      case 'web': return Globe;
      case 'marketing': return TrendingUp;
      case 'content': return FileText;
      case 'brand': return Award;
      default: return Lightbulb;
    }
  };

  // Render score card
  const ScoreCard = ({ label, score, icon: Icon }: { label: string; score: number; icon: any }) => (
    <div className={`relative p-5 rounded-2xl bg-gradient-to-br ${getScoreBg(score)} border border-white/10 dark:border-white/5`}>
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-5 h-5 ${getScoreColor(score)}`} />
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{label}</p>
      <div className="mt-3 h-1.5 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Dijital Analiz Platformu | Unilancer Labs</title>
        <meta name="description" content="İşletmenizin dijital varlığını AI destekli analiz ile değerlendirin. Web sitesi, sosyal medya, marka kimliği ve dijital pazarlama skorlarınızı öğrenin." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
        {/* Admin Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                    Dijital Analiz Platformu
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unilancer Labs Admin
                  </p>
                </div>
              </div>

              {/* Nav Actions */}
              <div className="flex items-center gap-2">
                {/* Admin Panel Link */}
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Tema değiştir"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* Step 1: Form */}
          {currentStep === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center p-4 py-20"
            >
              <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Dijital Varlık Analizi
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    İşletmenizin dijital performansını yapay zeka ile analiz edin
                  </p>
                </div>

                {/* Form Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-xl"
                >
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Building2 className="w-4 h-4" />
                        İşletme Adı
                      </label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Şirketinizin adını girin"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Globe className="w-4 h-4" />
                        Web Sitesi
                      </label>
                      <input
                        type="text"
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="ornek.com"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Mail className="w-4 h-4" />
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@sirketiniz.com"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-light hover:to-blue-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                    >
                      <Sparkles className="w-5 h-5" />
                      Ücretsiz Analiz Başlat
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={handleSkipToDemo}
                      className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Örnek Raporu İncele
                    </button>
                  </div>
                </motion.div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: Zap, text: "AI Destekli Analiz" },
                    { icon: Shield, text: "Güvenli & Gizli" },
                    { icon: BarChart3, text: "Detaylı Rapor" },
                    { icon: MessageCircle, text: "Canlı Danışman" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Analyzing */}
          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md text-center">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="absolute inset-4 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="relative w-full h-full bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                    <Brain className="w-16 h-16 text-white animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Analiz Ediliyor
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {formData.website_url}
                </p>

                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 mb-8 overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                  />
                </div>
                
                <div className="space-y-3">
                  {[
                    { text: 'Web sitesi taranıyor', threshold: 0 },
                    { text: 'Sosyal medya analizi', threshold: 25 },
                    { text: 'Marka değerlendirmesi', threshold: 50 },
                    { text: 'Rapor hazırlanıyor', threshold: 75 }
                  ].map((step, i) => (
                    <motion.div
                      key={step.text}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: analysisProgress > step.threshold ? 1 : 0.3 }}
                      className="flex items-center justify-center gap-3 text-slate-600 dark:text-slate-400"
                    >
                      {analysisProgress > step.threshold + 25 ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      )}
                      {step.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results - Platform Dashboard */}
          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen"
            >
              {/* Top Bar */}
              <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-slate-900 dark:text-white">{analysisResult.company_name}</h1>
                      <p className="text-xs text-slate-500">{analysisResult.website_url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentStep('form');
                        setAnalysisResult(null);
                        setFormData({ company_name: '', website_url: '', email: '' });
                        setChatMessages([]);
                      }}
                      className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      ← Yeni Analiz
                    </button>
                    <a
                      href="/tr/iletisim"
                      className="px-4 py-2 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Uzman Desteği Al
                    </a>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-6 w-fit">
                  {[
                    { id: 'overview', label: 'Genel Bakış', icon: Home },
                    { id: 'details', label: 'Detaylı Rapor', icon: FileText },
                    { id: 'recommendations', label: 'Öneriler', icon: Lightbulb },
                    { id: 'chat', label: 'DigiBot', icon: MessageCircle }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Main Score */}
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className={`lg:col-span-1 p-8 rounded-3xl bg-gradient-to-br ${getScoreBg(analysisResult.digital_score)} border border-white/10 ring-1 ${getScoreRing(analysisResult.digital_score)}`}>
                          <div className="text-center">
                            <div className={`text-7xl font-bold ${getScoreColor(analysisResult.digital_score)} mb-2`}>
                              {analysisResult.digital_score}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">Dijital Skor</p>
                            <p className="text-xs text-slate-500 mt-1">100 üzerinden</p>
                          </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <ScoreCard label="Web Varlığı" score={analysisResult.scores.web_presence} icon={Globe} />
                          <ScoreCard label="Sosyal Medya" score={analysisResult.scores.social_media} icon={Share2} />
                          <ScoreCard label="Marka Kimliği" score={analysisResult.scores.brand_identity} icon={Palette} />
                          <ScoreCard label="Dijital Pazarlama" score={analysisResult.scores.digital_marketing} icon={TrendingUp} />
                          <ScoreCard label="Kullanıcı Deneyimi" score={analysisResult.scores.user_experience} icon={Users} />
                          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/10 border border-primary/20 flex flex-col items-center justify-center text-center">
                            <Bot className="w-6 h-6 text-primary mb-2" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">DigiBot ile konuş</p>
                            <button 
                              onClick={() => setActiveTab('chat')}
                              className="mt-2 text-xs text-primary font-medium"
                            >
                              Soru Sor →
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          Özet Değerlendirme
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {analysisResult.summary}
                        </p>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                          <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5" />
                            Güçlü Yönler
                          </h3>
                          <ul className="space-y-3">
                            {analysisResult.strengths.map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-emerald-700 dark:text-emerald-300">
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                            <ThumbsDown className="w-5 h-5" />
                            Geliştirilmesi Gerekenler
                          </h3>
                          <ul className="space-y-3">
                            {analysisResult.weaknesses.map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-red-700 dark:text-red-300">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border border-primary/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                              Dijital Dönüşümünüzü Başlatalım
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Unilancer Labs uzmanları size özel strateji oluşturabilir
                            </p>
                          </div>
                          <a
                            href="/tr/iletisim"
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-all whitespace-nowrap"
                          >
                            Ücretsiz Danışmanlık
                            <ArrowRight className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10"
                    >
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-400 leading-relaxed">
                          {analysisResult.detailed_report}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Recommendations Tab */}
                  {activeTab === 'recommendations' && (
                    <motion.div
                      key="recommendations"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {analysisResult.recommendations.map((rec, i) => {
                        const Icon = getCategoryIcon(rec.category);
                        return (
                          <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10">
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-xl bg-primary/10">
                                <Icon className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(rec.priority)}`}>
                                    {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                                  </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                  {rec.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Bu önerileri uygulamak için profesyonel destek almak ister misiniz?
                        </p>
                        <a
                          href="/tr/iletisim"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-all"
                        >
                          Uzman Desteği Al
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* Chat Tab */}
                  {activeTab === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                      {/* Chat Header */}
                      <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                              <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">DigiBot</h3>
                            <p className="text-xs text-slate-500">Unilancer Labs Dijital Asistan</p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              msg.role === 'user' 
                                ? 'bg-primary' 
                                : 'bg-gradient-to-br from-primary to-blue-600'
                            }`}>
                              {msg.role === 'user' ? (
                                <User className="w-5 h-5 text-white" />
                              ) : (
                                <Bot className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className={`max-w-[75%] p-4 rounded-2xl ${
                              msg.role === 'user' 
                                ? 'bg-primary text-white rounded-tr-sm' 
                                : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-slate-100 dark:bg-white/10 p-4 rounded-2xl rounded-tl-sm">
                              <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Quick Actions */}
                      <div className="px-4 py-2 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {['Skorumu açıkla', 'Önerileri göster', 'Fiyat bilgisi', 'İletişim'].map((action) => (
                            <button
                              key={action}
                              onClick={() => {
                                setChatInput(action);
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full whitespace-nowrap hover:bg-slate-100 dark:hover:bg-white/20 transition-colors"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-slate-200 dark:border-white/10">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="DigiBot'a bir soru sorun..."
                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="px-5 py-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Demo;
