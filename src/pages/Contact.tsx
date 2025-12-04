import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Mail, Phone, MapPin, Send,
  MessageSquare, ExternalLink, Sparkles, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useRecaptcha } from '../hooks/useRecaptcha';
import { submitContactForm } from '../lib/api/contact';
import { trackFormSubmission } from '../lib/analytics';
import { trackContact, trackFormSubmit, trackLead } from '../lib/gtm';

const Contact = () => {
  const { t } = useTranslation();
  const { validateSubmission, isLoaded: recaptchaLoaded } = useRecaptcha();
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'İletişim | Unilancer - Bize Ulaşın, Projenizi Hayata Geçirelim'
    : 'Contact | Unilancer - Get in Touch, Let\'s Bring Your Project to Life';
  const seoDescription = currentLang === 'tr'
    ? 'Unilancer ile iletişime geçin. Proje talepleriniz, iş birlikleri ve sorularınız için bize ulaşın. İstanbul, Beyoğlu - Cube. Tel: +90 506 152 32 55'
    : 'Contact Unilancer. Reach out for project requests, collaborations, and inquiries. Istanbul, Beyoğlu - Cube. Tel: +90 506 152 32 55';
  const canonicalUrl = `https://unilancer.co/${currentLang}/iletisim`;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Validate with reCAPTCHA (permissive - allows submission on any error)
      const recaptchaResult = await validateSubmission('contact_form', 0.3);
      
      if (!recaptchaResult.valid) {
        setErrorMessage(recaptchaResult.error || t('contact.error.spam_detected', 'Spam algılandı. Lütfen tekrar deneyin.'));
        setSubmitStatus('error');
        trackFormSubmission('contact', false);
        setIsSubmitting(false);
        return;
      }
      
      // Submit form
      const result = await submitContactForm({
        ...formData,
        recaptcha_score: recaptchaResult.score,
      });
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        trackFormSubmission('contact', true);
        
        // GTM DataLayer: Track for Meta Pixel & Google Ads
        trackFormSubmit('contact_form', 'Contact Form', true);
        trackContact('form');
        trackLead('contact', { lead_type: 'contact_inquiry' });
      } else {
        setErrorMessage(result.error || t('contact.error.generic', 'Bir hata oluştu. Lütfen tekrar deneyin.'));
        setSubmitStatus('error');
        trackFormSubmission('contact', false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(t('contact.error.generic', 'Bir hata oluştu. Lütfen tekrar deneyin.'));
      setSubmitStatus('error');
      trackFormSubmission('contact', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="iletişim, contact, unilancer, proje talebi, iş birliği, İstanbul, Beyoğlu, dijital ajans" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancer.co/tr/iletisim" />
        <link rel="alternate" hrefLang="en" href="https://unilancer.co/en/contact" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancer.co/og-contact.jpg" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancer.co/og-contact.jpg" />
        
        {/* ContactPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": seoTitle,
            "description": seoDescription,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "Unilancer",
              "description": seoDescription,
              "url": "https://unilancer.co",
              "logo": "https://unilancer.co/logo.png",
              "image": "https://unilancer.co/og-image.jpg",
              "telephone": "+90-506-152-32-55",
              "email": "info@unilancerlabs.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Şehit Muhtar, Mis Sk. No:24",
                "addressLocality": "Beyoğlu",
                "addressRegion": "İstanbul",
                "postalCode": "34435",
                "addressCountry": "TR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "41.03473",
                "longitude": "28.97772"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              "priceRange": "$$"
            }
          })}
        </script>
        
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": currentLang === 'tr' ? "Ana Sayfa" : "Home",
                "item": `https://unilancer.co/${currentLang}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": currentLang === 'tr' ? "İletişim" : "Contact",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>

    <div className="min-h-screen bg-white dark:bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{t('contact.bize_ulaşın', 'Bize Ulaşın')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              {t('contact.projelerinizi', 'Projelerinizi')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{t('contact.hayata_geçirelim', 'Hayata Geçirelim')}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('contact.sorularınız_proje_talepleriniz', 'Sorularınız, proje talepleriniz veya iş birlikleri için bizimle iletişime geçin. Ekibimiz en kısa sürede size dönüş yapacaktır.')}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('contact.mesaj_gönderin', 'Mesaj Gönderin')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                      placeholder={t('contact.placeholder.name', 'Adınız Soyadınız')}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                      placeholder={t('contact.placeholder.email', 'ornek@sirket.com')}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder={t('contact.placeholder.subject', 'Proje, İş Birliği vb.')}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                    placeholder={t('contact.placeholder.message', 'Size nasıl yardımcı olabiliriz?')}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-green-700 dark:text-green-400 text-sm">
                        {t('contact.success', 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')}
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</p>
                    </motion.div>
                  )}
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center space-x-2 font-semibold text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t('contact.form.sending', 'Gönderiliyor...')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t('contact.form.submit')}</span>
                      </>
                    )}
                  </motion.button>
                  
                  {/* reCAPTCHA Badge Notice */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                    {t('contact.recaptcha_notice', 'Bu site reCAPTCHA tarafından korunmaktadır.')}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Info Cards */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('contact.info.title', 'İletişim Bilgileri')}</h3>
              <div className="space-y-6">
                <a 
                  href="mailto:info@unilancerlabs.com"
                  className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('contact.info.email')}</h4>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">info@unilancerlabs.com</p>
                  </div>
                </a>
                
                <a 
                  href="tel:+905061523255"
                  className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('contact.info.phone')}</h4>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">+90 506 152 32 55</p>
                  </div>
                </a>

                <div className="flex items-start space-x-4 p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('contact.info.address')}</h4>
                    <p className="text-base text-slate-900 dark:text-white leading-relaxed">
                      Şehit Muhtar, Mis Sk. No:24<br />
                      34435 Beyoğlu/İstanbul<br />
                      Cube Beyoğlu
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
                <motion.a
                  href="https://wa.me/+905061523255"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold">{t('contact.whatsapp', "WhatsApp'tan Yazın")}</span>
                  <ExternalLink className="w-5 h-5 opacity-80" />
                </motion.a>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 h-[300px] relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.3663197525847!2d28.97772937668711!3d41.03473017134433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76cf3c5e80d90f!2sCube%20Beyo%C4%9Flu!5e0!3m2!1str!2str!4v1707997561783!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <a 
                href="https://maps.app.goo.gl/QjP8fXWYP5awy7qK8"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white dark:bg-dark text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {t('contact.open_in_map', 'Haritada Aç')}
              </a>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;