import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight, Linkedin, Twitter, Instagram, Github } from 'lucide-react';
import { usePrivacyTerms } from './ui/modals/privacy-terms-provider';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { openPrivacyPolicy, openTerms } = usePrivacyTerms();
  const { t } = useTranslation();

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 to-slate-100 dark:from-dark dark:to-dark-light border-t border-slate-200 dark:border-white/10">
      {/* Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent opacity-30" />
      </div>

      {/* Content */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link 
              to="/" 
              className="inline-block group"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/Unilancer%20logo%202.webp"
                  alt="Unilancer"
                  className="h-8 w-auto relative"
                />
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {t('footer.description', 'Modern teknolojiler ve yaratıcı çözümlerle işletmenizi dijital dünyada öne çıkarıyoruz.')}
            </p>
            <div className="flex items-center space-x-4">
              {[
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Github, href: 'https://github.com' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative group"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <social.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors relative" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6 text-lg text-slate-900 dark:text-white">{t('footer.quickLinks', 'Hızlı Bağlantılar')}</h3>
            <ul className="space-y-4">
              {[
                { to: '/portfolio', label: t('footer.portfolio', 'Portfolyo') },
                { to: '/services', label: t('footer.services', 'Hizmetler') },
                { to: '/about', label: t('footer.about', 'Hakkımızda') },
                { to: '/blog', label: t('footer.blog', 'Blog') }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="group relative inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span className="relative">
                      <span className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative">{link.label}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-6 text-lg text-slate-900 dark:text-white">{t('footer.contact', 'İletişim')}</h3>
            <div className="space-y-4">
              <a 
                href="mailto:contact@unilancerlabs.com" 
                className="flex items-start space-x-3 group"
              >
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  contact@unilancerlabs.com
                </span>
              </a>
              <a 
                href="tel:+902125550000" 
                className="flex items-start space-x-3 group"
              >
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  +90 212 555 0000
                </span>
              </a>
              <a 
                href="https://maps.google.com/?q=Cube+Beyoğlu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start space-x-3 group"
              >
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Cube Beyoğlu<br />
                  İstiklal Caddesi, Beyoğlu<br />
                  34435 İstanbul, Türkiye
                </span>
              </a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent rounded-xl blur-lg opacity-50" />
            <div className="relative">
              <h3 className="font-semibold mb-6 text-lg text-slate-900 dark:text-white">{t('footer.newsletter', 'Bülten')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {t('footer.newsletterDesc', 'Güncel teknoloji haberlerini ve blog yazılarımızı takip edin.')}
              </p>
              <form className="space-y-3">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary-light/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <input
                    type="email"
                    placeholder={t('footer.emailPlaceholder', 'E-posta adresiniz')}
                    className="relative w-full bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors text-sm text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">{t('footer.subscribe', 'Abone Ol')}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="relative border-t border-slate-200 dark:border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Unilancer Labs. {t('footer.rights', 'Tüm hakları saklıdır.')}
            </p>
            <div className="flex items-center space-x-6">
              <button
                onClick={openPrivacyPolicy}
                className="text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
              >
                {t('footer.privacyPolicy', 'Gizlilik Politikası')}
              </button>
              <button
                onClick={openTerms}
                className="text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
              >
                {t('footer.termsOfService', 'Kullanım Koşulları')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;