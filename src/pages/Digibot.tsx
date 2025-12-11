import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DigibotHero } from '../components/ui/digibot-hero';
import { CheckCircle2, Users, ArrowUpRight, Linkedin, Twitter, Instagram } from 'lucide-react';

const Digibot = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
      
      <DigibotHero
        imageSrc="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibotefendi.webp"
        imageAlt="digiBot - AI Dijital Asistan"
        logoSrc="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotkucuk.webp"
        overlayText={{
          part1: 'digiBot',
          part2: 'Yakında',
        }}
        mainText="Sektörünüzü analiz eder, kritik ihtiyaçları belirler ve uygun hizmet akışını otomatik olarak kurar. İşletmeniz için akıllı dijital asistan."
        showFooter
        socialLinks={[
          { icon: Linkedin, href: 'https://linkedin.com/company/unilancer' },
          { icon: Twitter, href: 'https://twitter.com/unilancerlabs' },
          { icon: Instagram, href: 'https://instagram.com/unilancerlabs' },
        ]}
        locationText="Teknopark İstanbul"
      >
        {/* Waitlist Form */}
        <div className="mt-6 sm:mt-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <div className="relative flex-1 max-w-xs sm:max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <img src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotuyuk.webp" alt="DigiBot" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                </div>
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group"
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
              className="inline-flex items-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl text-green-700 dark:text-green-400"
            >
              <CheckCircle2 className="w-5 h-5 mr-2 sm:mr-3 flex-shrink-0" />
              <span className="font-medium text-sm">Kaydınız alındı! Yakında görüşmek üzere.</span>
            </motion.div>
          )}
          
          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 justify-center lg:justify-start">
            <Users className="w-4 h-4" />
            <span className="font-medium text-slate-700 dark:text-white">2,000+</span> kişi bekleme listesinde
          </p>
        </div>
      </DigibotHero>
    </>
  );
};

export default Digibot;
