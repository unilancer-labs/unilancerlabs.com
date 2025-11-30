import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Send, CheckCircle2, Zap, Brain, Users } from 'lucide-react';
import AuroraBackground from '../components/ui/effects/aurora-background';

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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
       {/* Background from Home.tsx */}
      <div className="fixed inset-0 z-0">
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA10_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-70" />
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

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Geleceğin <br />
              <span className="text-primary">
                Dijital Asistanı
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
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
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all pr-36"
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
                  className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center text-green-400"
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
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <Brain className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-white font-semibold mb-1">Akıllı Öğrenme</h3>
                <p className="text-xs text-slate-500">Sürekli gelişen altyapı</p>
              </div>
              <div>
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-white font-semibold mb-1">Herkes İçin</h3>
                <p className="text-xs text-slate-500">İşletme ve Freelancer dostu</p>
              </div>
              <div>
                <Bot className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-white font-semibold mb-1">Oto-Asistan</h3>
                <p className="text-xs text-slate-500">7/24 aktif destek</p>
              </div>
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing Orbs behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            
            {/* Main Image */}
            <motion.img 
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibotefendi.webp"
              alt="Digibot AI"
              className="relative z-10 w-full max-w-[500px] drop-shadow-2xl"
              animate={{ 
                y: [-20, 20, -20],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />

            {/* Floating Chat Interface (New) */}
            <motion.div 
              className="absolute top-10 -right-4 md:-right-12 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl z-20 w-64"
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-white/10 rounded-lg rounded-tl-none p-2 text-xs text-white/90">
                  Merhaba! Size nasıl yardımcı olabilirim?
                </div>
              </div>
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-primary/20 rounded-lg rounded-tr-none p-2 text-xs text-white/90">
                  Proje takvimimi düzenle.
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
              </div>
            </motion.div>

            {/* Floating System Status */}
            <motion.div 
              className="absolute bottom-20 -left-4 md:-left-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-white font-mono">System Online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Digibot;
