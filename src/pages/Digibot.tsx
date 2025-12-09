import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import AuroraBackground from '../components/ui/effects/aurora-background';
import { Send, CheckCircle2, Users, ArrowUpRight, Sparkles, Zap, Brain, BarChart3, FileSearch } from 'lucide-react';

const Digibot = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  
  const fullText = "E-ticaret sitem için dijital strateji oluşturur musun?";
  const responseText = "Sektörünüzü analiz ettim. E-ticaret siteniz için 3 kritik alan belirledim: SEO optimizasyonu, sosyal medya entegrasyonu ve dönüşüm oranı iyileştirmesi. Hemen bir hizmet akışı oluşturuyorum...";
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'digiBot | Yapay Zeka Asistanı - Unilancer'
    : 'digiBot | AI Assistant - Unilancer';
  const seoDescription = currentLang === 'tr'
    ? 'digiBot, işletmelerin ve freelancerların hayatını kolaylaştıran yapay zeka destekli dijital asistan. İş süreçlerinizi otomatize edin, verimliliğinizi artırın.'
    : 'digiBot is an AI-powered digital assistant that makes life easier for businesses and freelancers. Automate your workflows, increase your productivity.';
  const canonicalUrl = `https://unilancerlabs.com/${currentLang}/digibot`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  // Typing animation
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;
    
    const typeText = () => {
      if (index <= fullText.length) {
        setTypingText(fullText.slice(0, index));
        index++;
        timeout = setTimeout(typeText, 80);
      } else {
        setTimeout(() => setShowResponse(true), 500);
      }
    };
    
    const startTyping = setTimeout(() => {
      typeText();
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(startTyping);
    };
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="digibot, yapay zeka, AI, chatbot, dijital asistan, otomasyon, verimlilik" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="tr" href="https://unilancerlabs.com/tr/digibot" />
        <link rel="alternate" hrefLang="en" href="https://unilancerlabs.com/en/digibot" />
      </Helmet>
      
      <div className="relative min-h-screen">
        {/* Background - Same as Home */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <AuroraBackground />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA10_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-70" />
        </div>

        <div className="relative z-10">
          <section className="relative overflow-hidden min-h-screen flex items-center pt-20 pb-10 sm:pt-24 sm:pb-12">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                
                {/* Left Side - Text Content */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1"
                >
                  {/* Title */}
                  <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
                    <h1 className="text-[48px] sm:text-[60px] md:text-[72px] lg:text-[90px] font-bold leading-[1] tracking-tight">
                      <span className="text-primary">digiBot</span>
                    </h1>

                    {/* Description Cards */}
                    <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">İşletmeler için</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                          Sektörünüzü analiz eder, kritik ihtiyaçları belirler ve uygun hizmet akışını kurar.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileSearch className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">Freelancerlar için</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                          Net brief oluşturur, standart süreçler ve otomatik görev akışları sağlar.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Waitlist Form */}
                  <motion.div variants={itemVariants} className="pt-2">
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <div className="relative flex-1 max-w-sm">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-6 h-6 object-contain" />
                          </div>
                          <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm"
                            required
                          />
                        </div>
                        <motion.button
                          type="submit"
                          className="inline-flex items-center justify-center px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>Haberdar Ol</span>
                          <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </motion.button>
                      </form>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl text-green-700 dark:text-green-400"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="font-medium text-sm">Kaydınız alındı! Yakında görüşmek üzere.</span>
                      </motion.div>
                    )}
                    
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 justify-center lg:justify-start">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-slate-700 dark:text-white">2,000+</span> kişi bekleme listesinde
                    </p>
                  </motion.div>
                </motion.div>

                {/* Right Side - Chat Interface Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative order-1 lg:order-2"
                >
                  {/* Chat Container */}
                  <div className="relative max-w-md mx-auto lg:ml-auto lg:mr-0">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-primary/20 dark:bg-primary/10 blur-3xl rounded-full opacity-50" />
                    
                    {/* Chat Window */}
                    <div className="relative bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md ring-2 ring-primary/20">
                            <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotkucuk.webp" alt="DigiBot" className="w-8 h-8 object-contain drop-shadow-sm" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">digiBot</h3>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs text-slate-500 dark:text-gray-400">Çevrimiçi</span>
                            </div>
                          </div>
                          <div className="ml-auto flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-primary">AI</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="p-5 space-y-4 min-h-[280px]">
                        {/* Bot Welcome */}
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/90 to-primary-dark flex items-center justify-center flex-shrink-0 shadow-sm">
                            <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-6 h-6 object-contain drop-shadow-sm" />
                          </div>
                          <div className="bg-slate-100 dark:bg-white/5 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                            <p className="text-sm text-slate-700 dark:text-gray-200">
                              Merhaba! 👋 Ben <span className="font-semibold text-primary">digiBot</span>, yapay zeka destekli dijital asistanınız. İşletmenizin ihtiyaçlarını analiz edip size en uygun hizmet akışını oluşturabilirim.
                            </p>
                          </div>
                        </div>
                        
                        {/* User Message */}
                        {typingText && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end"
                          >
                            <div className="bg-primary text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
                              <p className="text-sm">{typingText}<span className="animate-pulse">|</span></p>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Bot Response */}
                        {showResponse && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex gap-3"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/90 to-primary-dark flex items-center justify-center flex-shrink-0 shadow-sm">
                              <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-6 h-6 object-contain drop-shadow-sm" />
                            </div>
                            <div className="space-y-2 max-w-[85%]">
                              <div className="bg-slate-100 dark:bg-white/5 rounded-2xl rounded-tl-md px-4 py-3">
                                <p className="text-sm text-slate-700 dark:text-gray-200">
                                  {responseText}
                                </p>
                              </div>
                              {/* Quick Stats */}
                              <div className="flex flex-wrap gap-2">
                                <div className="px-3 py-1.5 bg-primary/10 rounded-lg">
                                  <span className="text-xs font-semibold text-primary">3 kritik alan</span>
                                </div>
                                <div className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">Akış oluşturuluyor</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Input Area */}
                      <div className="px-5 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white dark:bg-dark rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2.5">
                            <span className="text-sm text-slate-400">Mesajınızı yazın...</span>
                          </div>
                          <button className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Features */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      className="absolute -left-4 top-1/4 hidden lg:block"
                    >
                      <div className="px-3 py-2 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-slate-100 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium text-slate-700 dark:text-gray-300">AI Analiz</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                      className="absolute -right-4 bottom-1/3 hidden lg:block"
                    >
                      <div className="px-3 py-2 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-slate-100 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs font-medium text-slate-700 dark:text-gray-300">Otomatik Akış</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Digibot;
