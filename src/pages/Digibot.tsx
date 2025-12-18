import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DigibotHero } from '../components/ui/digibot-hero';
import { CheckCircle2, Users, ArrowUpRight, Linkedin, Twitter, Instagram, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/config/supabase';
import { DIGIBOT_LOGO } from '../lib/config/constants';

const Digibot = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'digiBot | Yapay Zeka Asistanı - Unilancer'
    : 'digiBot | AI Assistant - Unilancer';
  const seoDescription = currentLang === 'tr'
    ? 'digiBot, işletmelerin ve freelancerların hayatını kolaylaştıran yapay zeka destekli dijital asistan. İş süreçlerinizi otomatize edin, verimliliğinizi artırın.'
    : 'digiBot is an AI-powered digital assistant that makes life easier for businesses and freelancers. Automate your workflows, increase your productivity.';
  const canonicalUrl = `https://unilancerlabs.com/${currentLang}/digibot`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from('digibot_waitlist')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
      
      if (existingEmail) {
        setIsSubmitted(true);
        return;
      }
      
      // Insert new waitlist entry
      const { error: insertError } = await supabase
        .from('digibot_waitlist')
        .insert({
          email: email.toLowerCase(),
          source: 'digibot_landing',
          created_at: new Date().toISOString(),
        });
      
      if (insertError) {
        // If table doesn't exist, still show success (graceful degradation)
        if (insertError.code === '42P01') {
          console.warn('Waitlist table does not exist yet');
          setIsSubmitted(true);
          return;
        }
        throw insertError;
      }
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error saving to waitlist:', err);
      setError(
        currentLang === 'tr'
          ? 'Bir hata oluştu. Lütfen tekrar deneyin.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
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
                  <img src={DIGIBOT_LOGO} alt="DigiBot" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                </div>
                <input
                  type="email"
                  placeholder={currentLang === 'tr' ? 'E-posta adresiniz' : 'Your email address'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  aria-label={currentLang === 'tr' ? 'E-posta adresiniz' : 'Your email address'}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm disabled:opacity-50"
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{currentLang === 'tr' ? 'Haberdar Ol' : 'Get Notified'}</span>
                    <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2 sm:mt-0">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
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
