"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Monitor,
  Box,
  ShoppingCart,
  Target,
  BrainCircuit,
  Code2,
  PaintBucket,
  Palette,
  Users,
  ShieldCheck,
  Coins,
  Rocket,
  Zap,
  Calendar,
  X,
  CheckCircle2,
} from "lucide-react";
import { LogosCarousel } from "../components/ui/sections/logos-carousel";
import { HowItWorks } from "../components/ui/sections/how-it-works";
import { MarqueeAnimation } from "../components/ui/effects/marquee-effect";
import { useTranslation } from "../hooks/useTranslation";
import CalendlyModal from "../components/modals/CalendlyModal";
import AudienceCard from "../components/ui/core/audience-card";
import AnimatedText from "../components/ui/effects/animated-text";
import AuroraBackground from '../components/ui/effects/aurora-background';
import { GlitchyText } from "../components/ui/glitchy-text";
import {
  ServiceCarousel,
  type Service,
} from "../components/ui/core/services-card";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";
import { CTASection } from "../components/ui/cta-with-rectangle";
import { FaqSection } from "../components/ui/sections/faq-section";
import { WhyUsSection } from "../components/ui/sections/why-us";

const getServices = () => [
  {
    titleKey: "home.services.website.title",
    emoji: "💻",
    descriptionKey: "home.services.website.description",
  },
  {
    titleKey: "home.services.ecommerce.title",
    emoji: "🛒",
    descriptionKey: "home.services.ecommerce.description",
  },
  {
    titleKey: "home.services.graphics.title",
    emoji: "🎨",
    descriptionKey: "home.services.graphics.description",
  },
  {
    titleKey: "home.services.mobile.title",
    emoji: "📱",
    descriptionKey: "home.services.mobile.description",
  },
  {
    titleKey: "home.services.marketing.title",
    emoji: "📢",
    descriptionKey: "home.services.marketing.description",
  },
  {
    titleKey: "home.services.3dar.title",
    emoji: "🍔",
    descriptionKey: "home.services.3dar.description",
  },
  {
    titleKey: "home.services.ai.title",
    emoji: "🤖",
    descriptionKey: "home.services.ai.description",
  },
];

// Kimin için kartları – senin görsellerinle
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

const CalendlyInline = () => {
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    ) as HTMLScriptElement | null;

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="h-[560px] md:h-[650px] w-full">
      <div
        className="calendly-inline-widget w-full h-full"
        data-url="https://calendly.com/taha-unilancerlabs/30min"
        style={{ minWidth: "320px", height: "100%" }}
      />
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const audience = getAudience();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  // Testimonials with translation keys
  const testimonials = [
    {
      quote: t("home.testimonials.1.quote", "Unilancer sayesinde MVP'mizi çok hızlı ve uygun maliyetle hayata geçirdik. Genç ekibin enerjisi ve teknik yetkinliği beklentimizin çok üzerindeydi."),
      name: t("home.testimonials.1.name", "Ahmet Yılmaz"),
      designation: t("home.testimonials.1.designation", "Kurucu Ortak, TechStart"),
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("home.testimonials.2.quote", "E-ticaret sitemizi yenilemek için çalıştık. Hem profesyonel bir proje yönetimi hem de yaratıcı bir tasarım sundular. Satışlarımız %40 arttı."),
      name: t("home.testimonials.2.name", "Zeynep Demir"),
      designation: t("home.testimonials.2.designation", "Pazarlama Müdürü, ModaVibe"),
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("home.testimonials.3.quote", "Yoğun dönemlerimizde dış kaynak olarak Unilancer'ı kullanıyoruz. İş kalitesi ve teslimat süreleri konusunda çok başarılılar, sanki kendi ekibimiz gibiler."),
      name: t("home.testimonials.3.name", "Caner Öztürk"),
      designation: t("home.testimonials.3.designation", "Ajans Başkanı, CreativeWorks"),
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("home.testimonials.4.quote", "Sosyal medya içeriklerimiz için düzenli olarak çalışıyoruz. Gençlerin trendleri yakalaması ve dinamik bakış açısı markamıza büyük değer kattı."),
      name: t("home.testimonials.4.name", "Elif Kaya"),
      designation: t("home.testimonials.4.designation", "Marka Yöneticisi, FoodCo"),
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote: t("home.testimonials.5.quote", "Aklımdaki mobil uygulama fikrini hayata geçirmek için doğru adresti. Teknik ekip çok ilgiliydi ve süreci şeffaf bir şekilde yönettiler."),
      name: t("home.testimonials.5.name", "Murat Çelik"),
      designation: t("home.testimonials.5.designation", "Girişimci"),
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

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

  return (
    <div className="relative min-h-screen">
      {/* Arka plan */}
      <div className="fixed inset-0 z-0">
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA10_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-70" />
      </div>

      <div className="relative z-10">
        {/* HERO */}
        <section
          id="hero"
          className="relative overflow-hidden min-h-[600px] lg:min-h-[750px] flex items-center pt-24 pb-12 md:pt-32 md:pb-20"
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

                  <div className="inline-flex items-center text-left text-[11px] sm:text-sm text-slate-500 dark:text-gray-400 bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 mx-auto lg:mx-0 max-w-full shadow-sm backdrop-blur-sm">
                    <span className="mr-2.5 text-primary flex-shrink-0 text-lg">•</span>
                    <span className="leading-snug">{t("home.hero.servicesNote")}</span>
                  </div>
                </motion.div>

                <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-1 sm:pt-2 justify-center lg:justify-start px-2 sm:px-0">
                  <motion.a
                    href="/project-request"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-[13px] sm:text-base transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span>{t("home.hero.startProject")}</span>
                    <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.a>

                  <motion.button
                    onClick={() => setIsCalendlyOpen(true)}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 bg-white/80 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white rounded-xl font-bold text-[13px] sm:text-base hover:bg-white dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 group shadow-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span>{t("home.hero.getFreeReport")}</span>
                  </motion.button>
                </motion.div>

                <motion.div variants={heroItemVariants} className="flex flex-row items-center gap-x-3 sm:gap-x-4 gap-y-2 pt-1 sm:pt-2 text-[11px] sm:text-sm font-medium text-slate-500 dark:text-gray-400 justify-center lg:justify-start">
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
                className="flex justify-center lg:justify-end mt-6 lg:mt-0"
              >
                <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl group cursor-pointer">
                  <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-primary/25 via-cyan-400/15 to-purple-500/25 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/elsikisma.webp"
                    alt="Unilancer iş birliği"
                    loading="eager"
                    decoding="async"
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
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10 relative z-10">
              <div className="text-center flex flex-col items-center">
                <div className="mb-2">
                   <GlitchyText text="digitAll" fontSize={36} />
                </div>
                <h2 className="text-[20px] sm:text-[24px] md:text-[29px] font-bold tracking-tight text-slate-900 dark:text-white mb-4 max-w-4xl leading-tight mx-auto px-2">
                  {t("home.services.headline", "işletmenizi dijital dünyada öne çıkaracak çözümler")}
                </h2>
              </div>
            </div>

            <ServiceCarousel
              services={(() => {
                const digitAllServices: Service[] = [
                  {
                    number: "01",
                    title: t("service.webDesign", "Web & Mobil Tasarım"),
                    description: t(
                      "home.services.web.desc",
                      "Modern ve responsive web siteleri, mobil uygulamalar ve kullanıcı dostu arayüzler tasarlıyoruz."
                    ),
                    icon: Monitor,
                    gradient: "from-cyan-400 to-blue-600",
                  },
                  {
                    number: "02",
                    title: t("service.3dAr", "3D & AR"),
                    description: t(
                      "home.services.3dar.desc",
                      "Artırılmış gerçeklik ve 3D teknolojileri ile işletmenizi sanal ortama taşıyoruz."
                    ),
                    icon: Box,
                    gradient: "from-purple-500 to-indigo-600",
                  },
                  {
                    number: "03",
                    title: t("service.ecommerce", "E-Ticaret Çözümleri"),
                    description: t(
                      "home.services.ecommerce.desc",
                      "Online satış platformları, ödeme sistemleri ve stok yönetimi ile e-ticaret sitenizi kuruyor ve yönetiyoruz."
                    ),
                    icon: ShoppingCart,
                    gradient: "from-emerald-400 to-teal-600",
                  },
                  {
                    number: "04",
                    title: t("service.marketing", "Dijital Pazarlama"),
                    description: t(
                      "home.services.marketing.desc",
                      "SEO, sosyal medya yönetimi, içerik pazarlama ve Google Ads ile markanızı büyütüyoruz."
                    ),
                    icon: Target,
                    gradient: "from-orange-400 to-red-600",
                  },
                  {
                    number: "05",
                    title: t("service.ai", "Yapay Zeka Çözümleri"),
                    description: t(
                      "home.services.ai.desc",
                      "AI destekli chatbot'lar, otomasyon sistemleri ve akıllı veri analitiği ile işlerinizi optimize ediyoruz."
                    ),
                    icon: BrainCircuit,
                    gradient: "from-violet-500 to-fuchsia-600",
                  },
                  {
                    number: "06",
                    title: t("service.development", "Yazılım Geliştirme"),
                    description: t(
                      "home.services.development.desc",
                      "Özel yazılımlar, API entegrasyonları ve backend sistemleri ile dijital altyapınızı güçlendiriyoruz."
                    ),
                    icon: Code2,
                    gradient: "from-blue-500 to-indigo-600",
                  },
                  {
                    number: "07",
                    title: t("service.branding", "Marka Kimliği"),
                    description: t(
                      "home.services.branding.desc",
                      "Logo tasarımı, kurumsal kimlik, marka rehberi ve görsel iletişim stratejileri oluşturuyoruz."
                    ),
                    icon: PaintBucket,
                    gradient: "from-pink-500 to-rose-600",
                  },
                  {
                    number: "08",
                    title: t("service.graphics", "Grafik Tasarım"),
                    description: t(
                      "home.services.graphics.desc",
                      "Sosyal medya görselleri, reklam tasarımları, broşürler ve tüm görsel ihtiyaçlarınız için profesyonel tasarımlar."
                    ),
                    icon: Palette,
                    gradient: "from-amber-400 to-orange-600",
                  },
                ];
                return digitAllServices;
              })()}
              />
          </div>
        </section>        {/* KIMIN ICIN */}
        <section id="kimin-icin" className="py-10 md:py-16">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center px-2">
                <AnimatedText
                    as="h2"
                    className="text-[22px] sm:text-[28px] md:text-[41.47px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
                    words={forWhomTitleWords}
                />
            </div>

            <div className="mt-10 md:mt-14 grid gap-6 md:gap-x-8 md:gap-y-12 md:grid-cols-2 lg:grid-cols-3">
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

        {/* NASIL CALISIR */}
        <HowItWorks />
        
        {/* BEYİN GÖÇÜ MARQUEE */}
        <section className="py-6 w-full">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
            <MarqueeAnimation
              direction="right"
              baseVelocity={-2}
              className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-900/20 dark:via-cyan-800/30 dark:to-blue-900/20 text-blue-700 dark:text-cyan-300 py-4 text-lg sm:text-xl md:text-2xl font-medium rounded-xl border border-blue-200/50 dark:border-blue-700/30 shadow-sm"
            >
              {`${t("home.marquee.brainDrain", "BEYİN GÖÇÜ YERİNE HİZMET İHRACATI")} • ${t("home.marquee.brainDrain", "BEYİN GÖÇÜ YERİNE HİZMET İHRACATI")} • ${t("home.marquee.brainDrain", "BEYİN GÖÇÜ YERİNE HİZMET İHRACATI")}`}
            </MarqueeAnimation>
          </div>
        </section>


        {/* NEDEN UNILANCER - MODERN BENTO GRID */}
        <WhyUsSection />

        {/* TESTIMONIALS */}
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />

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
  );
};

export default Home;
