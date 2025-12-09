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
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Users,
  Share2,
  Palette,
  Award,
  AlertCircle,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  X,
  Minus,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { generateDigiBotResponse } from '../data/unilancerKnowledge';
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
type TabType = 'overview' | 'details' | 'recommendations';

const Demo = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    email: ''
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'analyzing' | 'results'>('form');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
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
      
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: `Merhaba! 👋 Ben DigiBot, Unilancer Labs'ın dijital asistanıyım.\n\n${formData.company_name} için hazırlanan dijital analiz raporunuz hazır. Genel dijital skorunuz **${result.digital_score}/100** olarak hesaplandı.\n\nRaporunuz hakkında sorularınızı yanıtlayabilir, Unilancer Labs'ın size nasıl yardımcı olabileceği konusunda bilgi verebilirim.\n\nNasıl yardımcı olabilirim?`,
        timestamp: new Date()
      }]);
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
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgLight = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { text: 'Mükemmel', emoji: '🎯' };
    if (score >= 60) return { text: 'Gelişmekte', emoji: '📈' };
    return { text: 'İyileştirme Gerekli', emoji: '⚠️' };
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (priority === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
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

  // Circular Score Gauge Component
  const CircularGauge = ({ score, size = 160 }: { score: number; size?: number }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={getScoreStroke(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${circumference - offset} ${circumference}` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl font-bold ${getScoreColor(score)}`}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
    );
  };

  // Score Card Component
  const ScoreCard = ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) => (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`p-4 rounded-xl border ${getScoreBgLight(score)} transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-1.5 rounded-lg ${score >= 80 ? 'bg-emerald-100 dark:bg-emerald-800/30' : score >= 60 ? 'bg-amber-100 dark:bg-amber-800/30' : 'bg-red-100 dark:bg-red-800/30'}`}>
          <Icon className={`w-4 h-4 ${getScoreColor(score)}`} />
        </div>
        <span className={`text-xl font-bold tabular-nums ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</p>
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full rounded-full ${getProgressColor(score)}`}
        />
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Dijital Analiz | Unilancer Labs</title>
        <meta name="description" content="İşletmenizin dijital varlığını AI destekli analiz ile değerlendirin." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-dark transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-dark-light border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Dijital Analiz</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* Form Step */}
          {currentStep === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Dijital Varlık Analizi
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    İşletmenizin dijital performansını analiz edin
                  </p>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        İşletme Adı
                      </label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Şirketinizin adı"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-dark-light border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                        Web Sitesi
                      </label>
                      <input
                        type="text"
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="ornek.com"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-dark-light border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@sirketiniz.com"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-dark-light border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Analizi Başlat
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={handleSkipToDemo}
                      className="w-full py-2 bg-slate-100 dark:bg-dark-light hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Demo Raporu Görüntüle
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    { icon: Zap, text: "AI" },
                    { icon: Shield, text: "Güvenli" },
                    { icon: BarChart3, text: "Detaylı" },
                    { icon: MessageCircle, text: "Destek" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analyzing Step */}
          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xs text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Analiz Ediliyor
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  {formData.website_url}
                </p>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-5 overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                  />
                </div>
                
                <div className="space-y-2">
                  {[
                    { text: 'Web sitesi taranıyor', threshold: 0 },
                    { text: 'Sosyal medya analizi', threshold: 25 },
                    { text: 'Marka değerlendirmesi', threshold: 50 },
                    { text: 'Rapor hazırlanıyor', threshold: 75 }
                  ].map((step) => (
                    <motion.div
                      key={step.text}
                      animate={{ opacity: analysisProgress > step.threshold ? 1 : 0.4 }}
                      className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400"
                    >
                      {analysisProgress > step.threshold + 25 ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      )}
                      {step.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sub Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-light">
                <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
                  <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {[
                      { id: 'overview', label: 'Genel', icon: Home },
                      { id: 'details', label: 'Rapor', icon: FileText },
                      { id: 'recommendations', label: 'Öneriler', icon: Lightbulb }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentStep('form');
                        setAnalysisResult(null);
                        setFormData({ company_name: '', website_url: '', email: '' });
                        setChatMessages([]);
                        setIsChatOpen(false);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Yeni
                    </button>
                    <a
                      href="/tr/iletisim"
                      className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Destek Al
                    </a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-w-6xl mx-auto px-4 py-5">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      {/* Score Section */}
                      <div className="grid lg:grid-cols-3 gap-5">
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                          <div className="flex flex-col items-center">
                            <CircularGauge score={analysisResult.digital_score} />
                            <div className="mt-3 text-center">
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Dijital Skor</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBgLight(analysisResult.digital_score)}`}>
                                {getScoreLabel(analysisResult.digital_score).emoji} {getScoreLabel(analysisResult.digital_score).text}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <ScoreCard label="Web Varlığı" score={analysisResult.scores.web_presence} icon={Globe} />
                          <ScoreCard label="Sosyal Medya" score={analysisResult.scores.social_media} icon={Share2} />
                          <ScoreCard label="Marka Kimliği" score={analysisResult.scores.brand_identity} icon={Palette} />
                          <ScoreCard label="Dijital Pazarlama" score={analysisResult.scores.digital_marketing} icon={TrendingUp} />
                          <ScoreCard label="Kullanıcı Deneyimi" score={analysisResult.scores.user_experience} icon={Users} />
                          
                          <motion.div 
                            whileHover={{ y: -2 }}
                            onClick={() => setIsChatOpen(true)}
                            className="p-4 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 cursor-pointer transition-all hover:border-primary/50"
                          >
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <Bot className="w-5 h-5 text-primary mb-1" />
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">DigiBot</p>
                              <p className="text-[10px] text-primary mt-0.5">Soru Sor →</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Özet Değerlendirme
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {analysisResult.summary}
                        </p>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-white dark:bg-dark-card rounded-xl border border-emerald-200 dark:border-emerald-800/50 p-5">
                          <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4" />
                            Güçlü Yönler
                          </h3>
                          <ul className="space-y-2">
                            {analysisResult.strengths.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white dark:bg-dark-card rounded-xl border border-red-200 dark:border-red-800/50 p-5">
                          <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4" />
                            Geliştirilmesi Gerekenler
                          </h3>
                          <ul className="space-y-2">
                            {analysisResult.weaknesses.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-red-700 dark:text-red-300 p-2 rounded-lg bg-red-50 dark:bg-red-900/10">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="bg-white dark:bg-dark-card rounded-xl border border-primary/30 p-5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                              Dijital Dönüşümünüzü Başlatalım
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Uzman ekibimiz size özel strateji oluşturabilir
                            </p>
                          </div>
                          <a
                            href="/tr/iletisim"
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                          >
                            Danışmanlık Al
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                    >
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <div className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400">
                          {analysisResult.detailed_report}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'recommendations' && (
                    <motion.div
                      key="recommendations"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {analysisResult.recommendations.map((rec, i) => {
                        const Icon = getCategoryIcon(rec.category);
                        return (
                          <div key={i} className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{rec.title}</h3>
                                  <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getPriorityColor(rec.priority)}`}>
                                    {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{rec.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="bg-white dark:bg-dark-card rounded-xl border border-primary/30 p-5 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                          Bu önerileri uygulamak için profesyonel destek alın
                        </p>
                        <a
                          href="/tr/iletisim"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Uzman Desteği Al
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating DigiBot Button */}
              <AnimatePresence>
                {!isChatOpen && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-5 right-5 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center z-50"
                  >
                    <Bot className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* DigiBot Chat Window */}
              <AnimatePresence>
                {isChatOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={`fixed bottom-5 right-5 z-50 bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden ${
                      isChatMinimized ? 'w-64' : 'w-80 sm:w-96'
                    }`}
                  >
                    {/* Chat Header */}
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-light flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">DigiBot</h3>
                          <p className="text-[10px] text-emerald-500">Çevrimiçi</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button 
                          onClick={() => setIsChatMinimized(!isChatMinimized)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                        <button 
                          onClick={() => setIsChatOpen(false)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>
                    </div>

                    {!isChatMinimized && (
                      <>
                        {/* Messages */}
                        <div className="h-72 overflow-y-auto p-3 space-y-2.5">
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary'
                              }`}>
                                {msg.role === 'user' ? (
                                  <User className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                                ) : (
                                  <Bot className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${
                                msg.role === 'user' 
                                  ? 'bg-primary text-white' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                              }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex gap-2">
                              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                                <div className="flex gap-1">
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-3 py-1.5 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex gap-1 overflow-x-auto no-scrollbar">
                            {['Skorumu açıkla', 'Fiyat', 'İletişim'].map((action) => (
                              <button
                                key={action}
                                onClick={() => {
                                  setChatInput(action);
                                  setTimeout(() => handleSendMessage(), 100);
                                }}
                                className="px-2 py-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Mesaj yazın..."
                              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={isChatLoading || !chatInput.trim()}
                              className="px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Demo;
