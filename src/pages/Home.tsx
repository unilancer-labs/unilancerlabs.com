"use client";

import React, { useEffect, useState } from "react";
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

const getServices = (t: (key: string) => string) => [
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
const getAudience = (t: (key: string) => string) => [
  {
    id: "sme",
    titleKey: "home.forWhom.sme.title",
    descriptionKey: "home.forWhom.sme.description",
    tagKey: "home.forWhom.sme.tag",
    image:
      "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/kobigorseli.webp",
    imageAlt: "KOBİ ve işletme sahipleri",
  },
  {
    id: "startup",
    titleKey: "home.forWhom.agencies.title",
    descriptionKey: "home.forWhom.agencies.description",
    tagKey: "home.forWhom.agencies.tag",
    image:
      "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/startupgorseli.webp",
    imageAlt: "Startup ve teknoloji şirketleri",
  },
  {
    id: "students",
    titleKey: "home.forWhom.freelancers.title",
    descriptionKey: "home.forWhom.freelancers.description",
    tagKey: "home.forWhom.freelancers.tag",
    image:
      "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/universiteligorseli.webp",
    imageAlt: "Üniversiteli freelancer ekipleri",
  },
];


const getEmployerFaqs = (t: (key: string) => string) => [
  {
    qKey: "home.faq.employer.q1",
    aKey: "home.faq.employer.a1",
  },
  {
    qKey: "home.faq.employer.q2",
    aKey: "home.faq.employer.a2",
  },
  {
    qKey: "home.faq.employer.q3",
    aKey: "home.faq.employer.a3",
  },
  {
    qKey: "home.faq.employer.q4",
    aKey: "home.faq.employer.a4",
  },
  {
    qKey: "home.faq.employer.q5",
    aKey: "home.faq.employer.a5",
  },
];

const getFreelancerFaqs = (t: (key: string) => string) => [
  {
    qKey: "home.faq.freelancer.q1",
    aKey: "home.faq.freelancer.a1",
  },
  {
    qKey: "home.faq.freelancer.q2",
    aKey: "home.faq.freelancer.a2",
  },
  {
    qKey: "home.faq.freelancer.q3",
    aKey: "home.faq.freelancer.a3",
  },
  {
    qKey: "home.faq.freelancer.q4",
    aKey: "home.faq.freelancer.a4",
  },
  {
    qKey: "home.faq.freelancer.q5",
    aKey: "home.faq.freelancer.a5",
  },
];

const FaqItem = ({
  faq,
  index,
  t,
}: {
  faq: { qKey: string; aKey: string };
  index: number;
  t: (key: string) => string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
          isOpen
            ? "bg-white dark:bg-dark-light border-primary/30 dark:border-primary/30 shadow-lg shadow-primary/10"
            : "bg-white/80 dark:bg-dark-light/80 border-slate-200/70 dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-md"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4
              className={`font-semibold transition-colors duration-200 ${
                isOpen
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-800 dark:text-gray-200"
              }`}
            >
              {t(faq.qKey)}
            </h4>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isOpen
                ? "bg-primary/10 text-primary"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400"
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-0">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-4" />
                <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  {t(faq.aKey)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

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
  const audience = getAudience(t);
  const employerFaqs = getEmployerFaqs(t);
  const freelancerFaqs = getFreelancerFaqs(t);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const testimonials = [
    {
      quote:
        "Unilancer sayesinde MVP'mizi çok hızlı ve uygun maliyetle hayata geçirdik. Genç ekibin enerjisi ve teknik yetkinliği beklentimizin çok üzerindeydi.",
      name: "Ahmet Yılmaz",
      designation: "Kurucu Ortak, TechStart",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "E-ticaret sitemizi yenilemek için çalıştık. Hem profesyonel bir proje yönetimi hem de yaratıcı bir tasarım sundular. Satışlarımız %40 arttı.",
      name: "Zeynep Demir",
      designation: "Pazarlama Müdürü, ModaVibe",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Yoğun dönemlerimizde dış kaynak olarak Unilancer'ı kullanıyoruz. İş kalitesi ve teslimat süreleri konusunda çok başarılılar, sanki kendi ekibimiz gibiler.",
      name: "Caner Öztürk",
      designation: "Ajans Başkanı, CreativeWorks",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Sosyal medya içeriklerimiz için düzenli olarak çalışıyoruz. Gençlerin trendleri yakalaması ve dinamik bakış açısı markamıza büyük değer kattı.",
      name: "Elif Kaya",
      designation: "Marka Yöneticisi, FoodCo",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Aklımdaki mobil uygulama fikrini hayata geçirmek için doğru adresti. Teknik ekip çok ilgiliydi ve süreci şeffaf bir şekilde yönettiler.",
      name: "Murat Çelik",
      designation: "Girişimci",
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

  const forWhomTitleWords = "hem iş verenler hem de üniversiteli freelancerlar için tasarlandı".split(" ").map((word, index) => {
    // Highlighting "iş verenler" with a purple color
    if (index === 1 || index === 2) {
        return { text: word, className: "text-purple-500 dark:text-purple-400" };
    }
    // Highlighting "üniversiteli freelancerlar" with the primary color
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
          className="relative overflow-hidden min-h-[82vh] lg:min-h-screen flex items-center pt-24 pb-12 md:pt-32 md:pb-20"
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
                <motion.div variants={heroItemVariants} className="space-y-5 md:space-y-6">
                  <h1 className="text-[35px] md:text-[60px] font-bold leading-[1.15] tracking-tight text-slate-900 dark:text-white">
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

                  <p className="text-[16.5px] md:text-[20px] text-slate-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    {t("home.hero.mainDescription")}
                  </p>

                  <div className="inline-flex items-center text-left text-xs sm:text-sm text-slate-500 dark:text-gray-400 bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl px-4 py-2 mx-auto lg:mx-0 max-w-full shadow-sm backdrop-blur-sm">
                    <span className="mr-2.5 text-primary flex-shrink-0 text-lg">•</span>
                    <span className="leading-snug">{t("home.hero.servicesNote")}</span>
                  </div>
                </motion.div>

                <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
                  <motion.a
                    href="/project-request"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span>{t("home.hero.startProject")}</span>
                    <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.a>

                  <motion.button
                    onClick={() => setIsCalendlyOpen(true)}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white/80 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white rounded-xl font-bold text-sm sm:text-base hover:bg-white dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 group shadow-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span>{t("home.hero.getFreeReport")}</span>
                  </motion.button>
                </motion.div>

                <motion.div variants={heroItemVariants} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-gray-400 justify-center lg:justify-start">
                  <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>{t("home.hero.stats.projects")}</span>
                  <span className="hidden sm:inline text-slate-300 dark:text-white/20">|</span>
                  <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>{t("home.hero.stats.freelancers")}</span>
                </motion.div>
              </motion.div>

              {/* Sağ taraf – görsel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center lg:justify-end mt-6 lg:mt-0"
              >
                <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl group cursor-pointer">
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-primary/25 via-cyan-400/15 to-purple-500/25 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.img
                    src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/elsikisma.webp"
                    alt="Unilancer iş birliği"
                    className="relative w-full h-auto rounded-3xl shadow-2xl object-cover"
                    whileHover={{ scale: 1.05, rotateZ: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
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
                 İŞ BİRLİKLERİMİZ
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
          {/* Transition Divider */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
            <svg
              className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-white dark:fill-dark"
              ></path>
            </svg>
          </div>

          {/* Background Elements */}
          <div className="absolute inset-0 bg-slate-50/50 dark:bg-dark-light/20 -z-10" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10 relative z-10">
              <div className="text-center flex flex-col items-center">
                <div className="mb-2">
                   <GlitchyText text="digitAll" fontSize={36} />
                </div>
                <h2 className="text-[20px] sm:text-[24px] md:text-[29px] font-bold tracking-tight text-slate-900 dark:text-white mb-4 max-w-4xl leading-tight mx-auto px-2">
                  işletmenizi dijital dünyada öne çıkaracak çözümler
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
          </motion.div>
        </section>

        {/* KIMIN ICIN */}
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
                  imageAlt={t(item.imageAlt)}
                  title={t(item.titleKey)}
                  description={t(item.descriptionKey)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* NASIL CALISIR */}
        <HowItWorks />
        
        {/* ÜCRETSİZ DİJİTAL RAPOR - Premium CTA Section */}
        <section id="rapor" className="py-20 md:py-32 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA08_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA08_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Main CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Glow effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-400/20 to-primary/20 rounded-[2.5rem] blur-2xl opacity-60 dark:opacity-40" />
              
              {/* Card */}
              <div className="relative bg-white/80 dark:bg-dark-light/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                  {/* Left side - Icon & Visual */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
                      <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                        <Rocket className="w-14 h-14 md:w-16 md:h-16 text-white" />
                      </div>
                      {/* Floating dots */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="absolute top-1/2 -right-4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                  
                  {/* Right side - Content */}
                  <div className="flex-1 text-center lg:text-left space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-primary">{t("home.report.exportBadge")}</span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                      {t("home.report.title")}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {t("home.report.description")}
                    </p>
                    
                    {/* Features grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {[
                        t("home.report.check1"),
                        t("home.report.check2"),
                        t("home.report.check3"),
                        t("home.report.check4")
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 group">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA Button */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                      <motion.button
                        onClick={() => setIsCalendlyOpen(true)}
                        whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(95, 200, 218, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary hover:to-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/30 transition-all duration-300"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>{t("home.report.meetingTitle")}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                      
                      <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        {t("home.report.note")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Calendly Popup Modal */}
        {isCalendlyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCalendlyOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-dark-light rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsCalendlyOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-white" />
              </button>
              <div className="w-full h-full">
                <CalendlyInline />
              </div>
            </motion.div>
          </div>
        )}
        
        {/* BEYİN GÖÇÜ MARQUEE */}
        <section className="py-6 w-full">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
            <MarqueeAnimation
              direction="right"
              baseVelocity={-2}
              className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-900/20 dark:via-cyan-800/30 dark:to-blue-900/20 text-blue-700 dark:text-cyan-300 py-4 text-lg sm:text-xl md:text-2xl font-medium rounded-xl border border-blue-200/50 dark:border-blue-700/30 shadow-sm"
            >
              BEYİN GÖÇÜ YERİNE HİZMET İHRACATI • BEYİN GÖÇÜ YERİNE HİZMET İHRACATI • BEYİN GÖÇÜ YERİNE HİZMET İHRACATI
            </MarqueeAnimation>
          </div>
        </section>


        {/* NEDEN UNILANCER - BENTO GRID */}
        <section id="neden-unilancer" className="py-12 md:py-16 relative overflow-hidden">
           {/* Background Elements */}
           <div className="absolute inset-0 bg-slate-50/50 dark:bg-dark-light/20 -z-10" />
           <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2 pointer-events-none" />
           
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[24px] sm:text-[29px] md:text-[41.5px] font-bold tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6 px-2"
              >
                {t("home.why.title")}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[minmax(240px,auto)] md:auto-rows-[minmax(280px,auto)]">
              {/* Card 1: Selected Teams - Large (2 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 group relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 p-6 md:p-10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/10">
                    <Users className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h3 className="text-[18px] md:text-[24px] font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
                      {t("home.why.selectedTeams.title")}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-300 text-[15px] md:text-[16.5px] leading-relaxed max-w-lg">
                      {t("home.why.selectedTeams.description")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Project Management - Small (1 col) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-1 group relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 p-6 md:p-10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
              >
                 <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                 
                 <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/10">
                    <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h3 className="text-[18px] md:text-[24px] font-bold text-slate-900 dark:text-white mb-2 md:mb-3">
                      {t("home.why.projectManagement.title")}
                    </h3>
                    <p className="text-[15px] md:text-[16.5px] text-slate-600 dark:text-gray-300 leading-relaxed">
                      {t("home.why.projectManagement.description")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Pricing - Small (1 col) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-1 group relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 p-6 md:p-10 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/10">
                    <Coins className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h3 className="text-[18px] md:text-[24px] font-bold text-slate-900 dark:text-white mb-2 md:mb-3">
                      {t("home.why.pricing.title")}
                    </h3>
                    <p className="text-[15px] md:text-[16.5px] text-slate-600 dark:text-gray-300 leading-relaxed">
                      {t("home.why.pricing.description")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Digitalize - Large (2 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:col-span-2 group relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-slate-900 dark:bg-white/5 border border-slate-800 dark:border-white/10 p-6 md:p-10 text-white shadow-2xl hover:shadow-primary/20 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tl from-primary/30 to-purple-600/30 rounded-full blur-[80px] -mr-20 -mb-20 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 h-full flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                  <div className="flex-1">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10">
                      <Rocket className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <h3 className="text-[18px] md:text-[24px] font-bold mb-3 md:mb-4">
                      {t("home.why.digitalize.title")}
                    </h3>
                    <p className="text-slate-300 text-[15px] md:text-[16.5px] leading-relaxed max-w-lg">
                      {t("home.why.digitalize.description")}
                    </p>
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center w-40 h-40 relative">
                     <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                     <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center relative z-10 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-10 h-10 text-white fill-white" />
                     </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />

        {/* SSS */}
        <section id="sss" className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-blue-50/30 to-white/50 dark:from-dark dark:via-dark-light/50 dark:to-dark" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Sık Sorulan Sorular
                </span>
              </div>
              <h2 className="text-[24px] sm:text-[29px] md:text-[41.5px] font-bold text-slate-900 dark:text-white mb-4">
                {t("home.faq.title")}
              </h2>
              <p className="text-[15px] sm:text-[16.5px] md:text-[20px] text-slate-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
                {t("home.faq.description")}
              </p>
            </motion.div>

            <div className="grid gap-6 lg:gap-10 md:grid-cols-2">
              {/* İş Veren */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-2xl">💼</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    {t("home.faq.employers.title")}
                  </h3>
                </div>
                <div className="space-y-4">
                  {employerFaqs.map((faq, i) => (
                    <FaqItem key={i} faq={faq} index={i} t={t} />
                  ))}
                </div>
              </motion.div>

              {/* Freelancer */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    {t("home.faq.freelancers.title")}
                  </h3>
                </div>
                <div className="space-y-4">
                  {freelancerFaqs.map((faq, i) => (
                    <FaqItem key={i} faq={faq} index={i} t={t} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Calendly */}
        <section className="py-10 md:py-12 bg-slate-50/50 dark:bg-dark-light/30">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-6 md:mb-8 px-2">
              <h2 className="text-[24px] sm:text-[29px] md:text-[41.5px] font-bold text-slate-900 dark:text-white mb-3">
                {t("home.meeting.title")}
              </h2>
              <p className="text-[15px] sm:text-[16.5px] md:text-[20px] text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("home.meeting.description")}
              </p>
            </div>
            <CalendlyInline />
          </div>
        </section>

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
