import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Monitor,
  Box,
  ShoppingCart,
  Target,
  BrainCircuit,
  Code2,
  PaintBucket,
  Palette,
} from "lucide-react";
import { LogosCarousel } from "../components/ui/sections/logos-carousel";
import { HowItWorks } from "../components/ui/sections/how-it-works";
import { useTranslation } from "../hooks/useTranslation";
import { useScrollDepth } from "../hooks/useScrollDepth";
import CalendlyModal from "../components/modals/CalendlyModal";
import AudienceCard from "../components/ui/core/audience-card";
import AnimatedText from "../components/ui/effects/animated-text";
import AuroraBackground from '../components/ui/effects/aurora-background';
import { GlitchyText } from "../components/ui/glitchy-text";
import { ServiceCarousel, type Service } from "../components/ui/core/services-card";
import { CTASection } from "../components/ui/cta-with-rectangle";
import { FaqSection } from "../components/ui/sections/faq-section";
import { WhyUsSection } from "../components/ui/sections/why-us";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";
import { trackCTAClick } from "../lib/analytics";

const getTestimonials = () => [
  {
    quote: "Unilancer ekibiyle çalışmak harika bir deneyimdi. Web sitemizi modern ve kullanıcı dostu bir şekilde yeniden tasarladılar.",
    name: "Mehmet Yılmaz",
    designation: "CEO, TechStart",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
  },
  {
    quote: "E-ticaret projemizi zamanında ve bütçe dahilinde teslim ettiler. Satışlarımız %150 arttı!",
    name: "Ayşe Kaya",
    designation: "Kurucu, ModaStore",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
  },
  {
    quote: "Yapay zeka chatbot çözümleri müşteri hizmetlerimizi tamamen dönüştürdü. Müşteri memnuniyetimiz %40 arttı.",
    name: "Can Özdemir",
    designation: "CTO, FinTech Solutions",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
  },
  {
    quote: "3D ve AR deneyimleri ile ürün kataloğumuzu hayata geçirdik. Müşterilerimiz artık ürünleri evlerinde deneyimleyebiliyor.",
    name: "Zeynep Demir",
    designation: "Pazarlama Direktörü, MobilyaPlus",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500&auto=format&fit=crop",
  },
];

const getAudience = () => [
  {
    id: "sme",
    titleKey: "home.forWhom.sme.title",
    descriptionKey: "home.forWhom.sme.description",
    tagKey: "home.forWhom.sme.tag",
    image:
      "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/kobigorseli.webp",
    imageAltKey: "home.forWhom.sme.imageAlt",
  },
  {
    id: "startup",
    titleKey: "home.forWhom.agencies.title",
    descriptionKey: "home.forWhom.agencies.description",
    tagKey: "home.forWhom.agencies.tag",
    image:
      "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/startupgorseli.webp",
    imageAltKey: "home.forWhom.agencies.imageAlt",
  },
  {
    id: "students",
    titleKey: "home.forWhom.freelancers.title",
    descriptionKey: "home.forWhom.freelancers.description",
    tagKey: "home.forWhom.freelancers.tag",
    image:
      "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/universiteligorseli.webp",
    imageAltKey: "home.forWhom.freelancers.imageAlt",
  },
];

const Home = () => {
  const { t } = useTranslation();
  const audience = getAudience();
  const testimonials = getTestimonials();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  
  // Analytics: Track scroll depth
  useScrollDepth();

  // Başlık için 3 satır: Türkiye'nin / Üniversiteli Freelancer / Ekosistemi
  const mainTitleTop = t("home.hero.mainTitle");
  const highlightFull = t("home.hero.mainTitleHighlight");

  const words = highlightFull.split(" ");
  let mainTitleBottom = "";
  let mainTitleCenter = highlightFull;

  if (words.length > 1) {
    mainTitleBottom = words[words.length - 1];
    mainTitleCenter = words.slice(0, -1).join(" ");
  }

  const heroContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const heroItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  // Get translated "for whom" title and split it into styled words
  const forWhomTitle = t("home.forWhom.title", "hem iş verenler hem de üniversiteli freelancerlar için tasarlandı");
  const forWhomTitleWords = forWhomTitle.split(" ").map((word, index) => {
    // Highlighting words 2-3 (employers) with purple
    if (index === 1 || index === 2) {
        return { text: word, className: "text-purple-500 dark:text-purple-400" };
    }
    // Highlighting words 6-7 (freelancers) with primary color
    if (index === 5 || index === 6) {
        return { text: word, className: "text-primary dark:text-primary" };
    }
    return { text: word };
  });

  // Memoized services array to prevent unnecessary re-renders
  const digitAllServices = useMemo<Service[]>(() => [
    {
      number: "01",
      title: t("service.webDesign", "Web & Mobil Tasarım"),
      description: t("home.services.web.desc", "Modern ve responsive web siteleri, mobil uygulamalar ve kullanıcı dostu arayüzler tasarlıyoruz."),
      icon: Monitor,
      gradient: "from-cyan-400 to-blue-600",
      slug: "web-tasarim",
    },
    {
      number: "02",
      title: t("service.3dAr", "3D & AR"),
      description: t("home.services.3dar.desc", "Artırılmış gerçeklik ve 3D teknolojileri ile işletmenizi sanal ortama taşıyoruz."),
      icon: Box,
      gradient: "from-purple-500 to-indigo-600",
      slug: "3d-ar",
    },
    {
      number: "03",
      title: t("service.ecommerce", "E-Ticaret Çözümleri"),
      description: t("home.services.ecommerce.desc", "Online satış platformları, ödeme sistemleri ve stok yönetimi ile e-ticaret sitenizi kuruyor ve yönetiyoruz."),
      icon: ShoppingCart,
      gradient: "from-emerald-400 to-teal-600",
      slug: "e-ticaret-cozumleri",
    },
    {
      number: "04",
      title: t("service.marketing", "Dijital Pazarlama"),
      description: t("home.services.marketing.desc", "SEO, sosyal medya yönetimi, içerik pazarlama ve Google Ads ile markanızı büyütüyoruz."),
      icon: Target,
      gradient: "from-orange-400 to-red-600",
      slug: "pazarlama-reklam",
    },
    {
      number: "05",
      title: t("service.ai", "Yapay Zeka Çözümleri"),
      description: t("home.services.ai.desc", "AI destekli chatbot'lar, otomasyon sistemleri ve akıllı veri analitiği ile işlerinizi optimize ediyoruz."),
      icon: BrainCircuit,
      gradient: "from-violet-500 to-fuchsia-600",
      slug: "yapay-zeka-digibot",
    },
    {
      number: "06",
      title: t("service.development", "Yazılım Geliştirme"),
      description: t("home.services.development.desc", "Özel yazılımlar, API entegrasyonları ve backend sistemleri ile dijital altyapınızı güçlendiriyoruz."),
      icon: Code2,
      gradient: "from-blue-500 to-indigo-600",
      slug: "yazilim-gelistirme",
    },
    {
      number: "07",
      title: t("service.branding", "Marka Kimliği"),
      description: t("home.services.branding.desc", "Logo tasarımı, kurumsal kimlik, marka rehberi ve görsel iletişim stratejileri oluşturuyoruz."),
      icon: PaintBucket,
      gradient: "from-pink-500 to-rose-600",
      slug: "kurumsal-kimlik-marka",
    },
    {
      number: "08",
      title: t("service.graphics", "Grafik Tasarım"),
      description: t("home.services.graphics.desc", "Sosyal medya görselleri, reklam tasarımları, broşürler ve tüm görsel ihtiyaçlarınız için profesyonel tasarımlar."),
      icon: Palette,
      gradient: "from-amber-400 to-orange-600",
      slug: "grafik-tasarim",
    },
  ], [t]);

  // SEO meta data
  const seoTitle = t('seo.home.title', 'Unilancer | Türkiye\'nin En İyi Dijital Ajansı - Web Tasarım, Yazılım, AI');
  const seoDescription = t('seo.home.description', 'Web tasarım, yazılım geliştirme, 3D/AR, e-ticaret, dijital pazarlama ve yapay zeka çözümleri. Genç yeteneklerle işletmenizi dijital dünyada öne çıkarın. Ücretsiz teklif alın!');
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const canonicalUrl = `https://unilancerlabs.com/${currentLang}`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="web tasarım, yazılım geliştirme, 3D modelleme, AR, e-ticaret, dijital pazarlama, yapay zeka, chatbot, kurumsal kimlik, grafik tasarım, SEO, İstanbul, Türkiye, dijital ajans, freelancer, genç yetenek" />
        <meta name="author" content="Unilancer" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancerlabs.com/tr" />
        <link rel="alternate" hrefLang="en" href="https://unilancerlabs.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://unilancerlabs.com/tr" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancerlabs.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancerlabs.com/og-image.jpg" />
        
        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Unilancer",
            "alternateName": "Unilancer Labs",
            "url": "https://unilancerlabs.com",
            "logo": "https://unilancerlabs.com/logo.png",
            "description": seoDescription,
            "foundingDate": "2023",
            "founders": [
              {
                "@type": "Person",
                "name": "Unilancer Team"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Şehit Muhtar, Mis Sk. No:24",
              "addressLocality": "Beyoğlu",
              "addressRegion": "İstanbul",
              "postalCode": "34435",
              "addressCountry": "TR"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+90-506-152-32-55",
              "contactType": "customer service",
              "email": "info@unilancerlabs.com",
              "availableLanguage": ["Turkish", "English"]
            },
            "sameAs": [
              "https://www.instagram.com/unilancerlabs/",
              "https://www.linkedin.com/company/unilancer-labs",
              "https://www.tiktok.com/@unilancerlabs"
            ],
            "areaServed": {
              "@type": "Country",
              "name": "Turkey"
            },
            "knowsAbout": [
              "Web Development",
              "Mobile App Development",
              "UI/UX Design",
              "3D Modeling",
              "Augmented Reality",
              "E-commerce",
              "Digital Marketing",
              "SEO",
              "Artificial Intelligence",
              "Chatbot Development",
              "Brand Identity",
              "Graphic Design"
            ]
          })}
        </script>
        
        {/* WebSite Schema for Search */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Unilancer",
            "alternateName": "Unilancer Labs",
            "url": "https://unilancerlabs.com",
            "description": seoDescription,
            "inLanguage": ["tr-TR", "en-US"],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://unilancerlabs.com/tr/blog?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* SiteNavigationElement Schema for Sitelinks */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": currentLang === 'tr' ? "Hizmetler" : "Services",
                "description": currentLang === 'tr' ? "Web tasarım, yazılım, 3D/AR, e-ticaret ve dijital pazarlama hizmetleri" : "Web design, software, 3D/AR, e-commerce and digital marketing services",
                "url": `https://unilancerlabs.com/${currentLang}/${currentLang === 'tr' ? 'hizmetler' : 'services'}`
              },
              {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": currentLang === 'tr' ? "Hakkımızda" : "About Us",
                "description": currentLang === 'tr' ? "Unilancer hakkında bilgi edinin" : "Learn about Unilancer",
                "url": `https://unilancerlabs.com/${currentLang}/${currentLang === 'tr' ? 'hakkimizda' : 'about'}`
              },
              {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": "Blog",
                "description": currentLang === 'tr' ? "Dijital dünya hakkında içerikler" : "Content about the digital world",
                "url": `https://unilancerlabs.com/${currentLang}/blog`
              },
              {
                "@type": "SiteNavigationElement",
                "position": 4,
                "name": currentLang === 'tr' ? "Portfolyo" : "Portfolio",
                "description": currentLang === 'tr' ? "Tamamladığımız projeler" : "Our completed projects",
                "url": `https://unilancerlabs.com/${currentLang}/${currentLang === 'tr' ? 'portfolyo' : 'portfolio'}`
              },
              {
                "@type": "SiteNavigationElement",
                "position": 5,
                "name": currentLang === 'tr' ? "İletişim" : "Contact",
                "description": currentLang === 'tr' ? "Bizimle iletişime geçin" : "Get in touch with us",
                "url": `https://unilancerlabs.com/${currentLang}/${currentLang === 'tr' ? 'iletisim' : 'contact'}`
              },
              {
                "@type": "SiteNavigationElement",
                "position": 6,
                "name": currentLang === 'tr' ? "Teklif Al" : "Get Quote",
                "description": currentLang === 'tr' ? "Projeniz için ücretsiz teklif alın" : "Get a free quote for your project",
                "url": `https://unilancerlabs.com/${currentLang}/${currentLang === 'tr' ? 'teklif-al' : 'project-request'}`
              }
            ]
          })}
        </script>
      </Helmet>
      
    <div className="relative min-h-screen">
      {/* Arka plan */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA10_1px,transparent_1px),linear_gradient(to_bottom,#5FC8DA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-70" />
      </div>

      <div className="relative z-10">
        {/* HERO */}
        <section
          id="hero"
          className="relative overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[750px] flex items-center pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-28 md:pb-20"
        >
          <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              {/* Sol taraf */}
              <motion.div
                variants={heroContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 lg:space-y-8 text-center lg:text-left"
              >
                <motion.div variants={heroItemVariants} className="space-y-4 md:space-y-6">
                  <h1 className="text-[28px] sm:text-[35px] md:text-[50px] lg:text-[60px] font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                    <span className="block">{mainTitleTop}</span>
                    {mainTitleCenter && (
                      <span className="block mt-1">
                        <span className="relative inline-block text-primary dark:text-primary lg:whitespace-nowrap">
                          {mainTitleCenter}
                          <svg
                            className="absolute -bottom-1.5 sm:-bottom-3 left-0 w-full h-2.5 sm:h-4 text-primary"
                            viewBox="0 0 200 12"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M0,7 Q50,0 100,7 T200,7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </span>
                    )}
                    {mainTitleBottom && (
                      <span className="block">{mainTitleBottom}</span>
                    )}
                  </h1>

                  <p className="text-[15px] sm:text-[16.5px] md:text-[20px] text-slate-600 dark:text-gray-300 leading-relaxed max-w-md sm:max-w-lg mx-auto lg:mx-0">
                    {t("home.hero.mainDescription")}
                  </p>

                  <div className="inline-flex items-center text-left text-xs sm:text-sm text-slate-500 dark:text-gray-400 bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 py-2.5 mx-auto lg:mx-0 max-w-full shadow-sm backdrop-blur-sm">
                    <span className="mr-2.5 text-primary flex-shrink-0 text-lg">•</span>
                    <span className="leading-snug">{t("home.hero.servicesNote")}</span>
                  </div>
                </motion.div>

                <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2 justify-center lg:justify-start px-2 sm:px-0">
                  <motion.a
                    href="/project-request"
                    onClick={() => trackCTAClick('start_project', 'hero', '/project-request')}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-3.5 min-h-[48px] bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span>{t("home.hero.startProject")}</span>
                    <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.a>

                  <motion.button
                    onClick={() => {
                      trackCTAClick('get_free_report', 'hero', 'calendly_modal');
                      setIsCalendlyOpen(true);
                    }}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-3.5 min-h-[48px] bg-white/80 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white rounded-xl font-bold text-sm sm:text-base hover:bg-white dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 group shadow-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span>{t("home.hero.getFreeReport")}</span>
                  </motion.button>
                </motion.div>

                <motion.div variants={heroItemVariants} className="flex flex-row items-center gap-x-3 sm:gap-x-4 gap-y-2 pt-1 sm:pt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-gray-400 justify-center lg:justify-start">
                  <span className="flex items-center"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mr-1.5 sm:mr-2"></span>{t("home.hero.stats.projects")}</span>
                  <span className="text-slate-300 dark:text-white/20">|</span>
                  <span className="flex items-center"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mr-1.5 sm:mr-2"></span>{t("home.hero.stats.freelancers")}</span>
                </motion.div>
              </motion.div>

              {/* Sağ taraf – görsel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center lg:justify-end mt-4 lg:mt-0"
              >
                <div className="relative w-full max-w-[300px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl group cursor-pointer">
                  <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-primary/25 via-cyan-400/15 to-purple-500/25 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/elsikisma.webp"
                    alt="Unilancer iş birliği - Dijital ajans ekip çalışması"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    width={600}
                    height={450}
                    className="relative w-full h-auto rounded-3xl shadow-2xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PARTNERLER - Moved and Redesigned */}
        <section className="w-full py-8 relative z-20">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="text-center md:text-left shrink-0">
               <p className="text-sm md:text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                 {t("home.partners.title", "İŞ BİRLİKLERİMİZ")}
               </p>
            </div>
            
            {/* Vertical Separator */}
            <div className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent" />

            <div className="flex-1 w-full overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_100%)]">
               <LogosCarousel 
                 className="py-0" 
                 imageClassName="grayscale invert dark:invert-0 opacity-60 transition-all duration-300" 
               />
            </div>
          </div>
        </section>

        {/* HİZMETLERİMİZ - DigitAll Services */}
        <section id="hizmetlerimiz" className="relative py-12 md:py-16 overflow-hidden">
          <div>
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-14 relative z-10">
              <div className="text-center flex flex-col items-center">
                <div className="mb-3">
                   <GlitchyText text="digitAll" fontSize={36} />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 max-w-4xl leading-tight mx-auto px-2">
                  {t("home.services.headline", "işletmenizi dijital dünyada öne çıkaracak çözümler")}
                </h2>
              </div>
            </div>

            <ServiceCarousel services={digitAllServices} />
          </div>
        </section>        {/* NASIL CALISIR */}
        <HowItWorks />

        {/* KIMIN ICIN */}
        <section id="kimin-icin" className="py-12 md:py-16">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center px-2">
                <AnimatedText
                    as="h2"
                    className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
                    words={forWhomTitleWords}
                />
            </div>

            <div className="mt-12 md:mt-16 grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {audience.map((item, index) => (
                <AudienceCard
                  key={item.id}
                  index={index}
                  image={item.image}
                  imageAlt={t(item.imageAltKey)}
                  title={t(item.titleKey)}
                  description={t(item.descriptionKey)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* MÜŞTERİ YORUMLARI - TESTIMONIALS */}
        <AnimatedTestimonials testimonials={testimonials} autoplay />

        {/* NEDEN UNILANCER - MODERN BENTO GRID */}
        <WhyUsSection />

        {/* SSS */}
        <FaqSection />

        {/* CTA Section */}
        <CTASection />

        {/* Calendly Modal */}
        <CalendlyModal
          isOpen={isCalendlyOpen}
          onClose={() => setIsCalendlyOpen(false)}
        />
      </div>
    </div>
    </>
  );
};

export default Home;
