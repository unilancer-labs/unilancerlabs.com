import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Send, CheckCircle2, Zap, Brain, Users, MessageSquare, Mic, Paperclip } from 'lucide-react';

const Digibot = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {/* Light mode gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA10_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-50" />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex-grow flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="font-semibold tracking-wide text-sm">YAPAY ZEKA DEVRİMİ</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Geleceğin <br />
              <span className="text-primary">
                Dijital Asistanı
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
              Hem işletmelerin hem de freelancerların hayatını kolaylaştıracak devrimsel bir çözüm. Digibot, iş süreçlerinizi optimize eden ve verimliliğinizi artıran akıllı yol arkadaşınız.
            </p>

            {/* Waitlist Form */}
            <div className="max-w-md mb-12">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all pr-36 shadow-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center"
                  >
                    Haberdar Ol
                    <Send className="w-4 h-4 ml-2" />
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center text-green-600 dark:text-green-400"
                >
                  <CheckCircle2 className="w-6 h-6 mr-3" />
                  <span className="font-medium">Teşekkürler! Sizi en kısa sürede haberdar edeceğiz.</span>
                </motion.div>
              )}
              <p className="mt-4 text-sm text-slate-500 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                İlk erişim hakkı kazanan 100 kişiden biri olun.
              </p>
            </div>

            {/* Feature Teasers */}
            <div className="grid grid-cols-3 gap-6 border-t border-slate-200 dark:border-white/10 pt-8">
              <div>
                <Brain className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Akıllı Öğrenme</h3>
                <p className="text-xs text-slate-500">Sürekli gelişen altyapı</p>
              </div>
              <div>
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Herkes İçin</h3>
                <p className="text-xs text-slate-500">İşletme ve Freelancer dostu</p>
              </div>
              <div>
                <Bot className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Oto-Asistan</h3>
                <p className="text-xs text-slate-500">7/24 aktif destek</p>
              </div>
            </div>
          </motion.div>

          {/* Visual Content - AI Chat Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing Orb behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 dark:bg-primary/30 rounded-full blur-[80px] animate-pulse" />
            
            {/* Main Chat Interface */}
            <motion.div 
              className="relative z-10 w-full max-w-[420px] bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden"
              animate={{ 
                y: [-10, 10, -10],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">Digibot</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-500">Her zaman aktif</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 space-y-4 min-h-[320px]">
                {/* Bot Message */}
                <motion.div 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-slate-700 dark:text-white/90">Merhaba! 👋 Ben Digibot, yapay zeka asistanınız. Size nasıl yardımcı olabilirim?</p>
                  </div>
                </motion.div>

                {/* User Message */}
                <motion.div 
                  className="flex items-start gap-3 justify-end"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="bg-primary rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-white">Bu haftaki toplantılarımı listeler misin?</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center shrink-0 shadow-md">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                {/* Bot Response with Typing */}
                <motion.div 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-slate-700 dark:text-white/90 mb-2">Tabii! Bu haftaki toplantıların:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs bg-white dark:bg-white/10 rounded-lg px-3 py-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-slate-600 dark:text-white/80">Pazartesi 10:00 - Proje Toplantısı</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-white dark:bg-white/10 rounded-lg px-3 py-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-slate-600 dark:text-white/80">Çarşamba 14:00 - Müşteri Görüşmesi</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Chat Input */}
              <div className="px-4 py-4 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 rounded-2xl px-4 py-3">
                  <Paperclip className="w-5 h-5 text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Mesajınızı yazın..." 
                    className="flex-1 bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 outline-none"
                    disabled
                  />
                  <Mic className="w-5 h-5 text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-primary/30 transition-all">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 md:right-0 bg-white dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl z-20"
              animate={{ y: [5, -5, 5], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium text-slate-700 dark:text-white">1.2M+ Mesaj</span>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-2 -left-4 md:left-0 bg-white dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl z-20"
              animate={{ y: [-5, 5, -5], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-white">%99.9 Uptime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Digibot;
