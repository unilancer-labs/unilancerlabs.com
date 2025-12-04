import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target, Eye, Sparkles, Rocket, Globe2, Heart, Briefcase } from 'lucide-react';
import TeamSection from '../components/ui/TeamSection';

const About = () => {
  
  // SEO meta data
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const seoTitle = currentLang === 'tr' 
    ? 'Hakkımızda | Unilancer - Türkiye\'nin Genç Yetenek Platformu'
    : 'About Us | Unilancer - Turkey\'s Young Talent Platform';
  const seoDescription = currentLang === 'tr'
    ? 'Unilancer, Türkiye\'nin en yetenekli üniversite öğrencileri ve mezunları ile işletmeleri buluşturan yeni nesil dijital ajans. Vizyonumuz ve misyonumuz.'
    : 'Unilancer is a next-generation digital agency connecting Turkey\'s most talented university students and graduates with businesses. Our vision and mission.';
  const canonicalUrl = `https://unilancer.co/${currentLang}/hakkimizda`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="unilancer, hakkımızda, genç yetenek, üniversite öğrencisi, freelancer, dijital ajans, İstanbul, vizyon, misyon" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="tr" href="https://unilancer.co/tr/hakkimizda" />
        <link rel="alternate" hrefLang="en" href="https://unilancer.co/en/about" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://unilancer.co/og-about.jpg" />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://unilancer.co/og-about.jpg" />
        
        {/* AboutPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": seoTitle,
            "description": seoDescription,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "Organization",
              "name": "Unilancer",
              "description": seoDescription,
              "url": "https://unilancer.co",
              "logo": "https://unilancer.co/logo.png",
              "foundingDate": "2023",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Şehit Muhtar, Mis Sk. No:24",
                "addressLocality": "Beyoğlu",
                "addressRegion": "İstanbul",
                "postalCode": "34435",
                "addressCountry": "TR"
              }
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
                "name": currentLang === 'tr' ? "Hakkımızda" : "About",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>

    <div className="relative min-h-screen dark-hero-page">
      {/* Arka plan */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-[#0d0d0d]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA08_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-50" />
      </div>

      <div className="relative z-10">
      {/* HERO SECTION WITH VIDEO & MOTTO - Always Dark Theme */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-dark dark-hero-section">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
              <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
              >
                <source src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/IMG_3968%20(2)%20(1).mp4" type="video/mp4" />
              </video>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full py-8 md:py-12">
              <div className="mx-auto flex max-w-[1340px] flex-col px-4 sm:px-6 lg:px-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mx-auto max-w-4xl text-center"
                  >
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Vizyon 2026</span>
                      </div>
                      
                      <h1 className="max-w-4xl mx-auto text-balance text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white mb-8">
                          Beyin Göçü Yerine <br/>
                          <span className="text-primary">Hizmet İhracatı</span>
                      </h1>
                      
                      <p className="mt-8 max-w-3xl mx-auto text-balance text-lg md:text-xl text-slate-200 leading-relaxed">
                          Unilancer, Türkiye'nin üniversiteli freelancerlarından oluşan seçili ekiplerle işletmelere yönetilen dijital hizmetler sunan bir ekosistemdir.
                      </p>
                  </motion.div>
              </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute -bottom-1 left-0 right-0 z-20">
            <svg 
              viewBox="0 0 1440 80" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-16 md:h-20"
              preserveAspectRatio="none"
            >
              <path 
                d="M0 80V60C120 40 240 20 360 20C480 20 600 40 720 50C840 60 960 60 1080 50C1200 40 1320 20 1380 10L1440 0V80H0Z" 
                className="fill-white dark:fill-[#0d0d0d]"
              />
            </svg>
          </div>
      </section>

      {/* SECTION 2: HİKAYEMİZ */}
      <section className="relative pt-8 md:pt-12 pb-16 md:pb-24 overflow-hidden">

        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Team Photo at Top */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[16/9] md:aspect-[21/9]">
                <img 
                  src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/ekiparkaplan.webp" 
                  alt="Unilancer Ekibi"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-4">
                    <Heart className="w-4 h-4" />
                    <span>Hikayemiz</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-2xl">
                    Bir Üniversite Sırasından <span className="text-primary">Doğan Vizyon</span>
                  </h2>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Story Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-16"
          >
              <p className="text-xl font-medium text-slate-900 dark:text-white">
                Unilancer, <span className="text-primary font-bold">2021 yılında</span>, henüz üniversite sıralarındayken hem okuyup hem üretmek isteyen bir grup öğrencinin ortak sancısıyla kuruldu.
              </p>
              
              <p>
                O günlerde yaşadığımız maddi zorluklar ve <span className="font-semibold text-slate-900 dark:text-white">"henüz tecrübesizsiniz"</span> denilerek reddedilen iş başvuruları, bizi sadece şikayet etmekten öteye, kendi çözümümüzü üretmeye itti.
              </p>
              
              <p>
                Sektörde genç yeteneklerin "tecrübesizlik" bariyerine takıldığını, işverenlerin ise "güven" sorunu yaşadığını gördük.
              </p>

              <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-xl">
                <p className="text-lg font-semibold text-slate-900 dark:text-white italic">
                  "Öyle bir sistem kuralım ki; öğrenciler okuluna devam ederken gerçek projelerle deneyim kazansın, firmalar ise kurumsal güvenceyle hizmet alsın"
                </p>
              </div>

              <p className="text-lg">
                O gün kurduğumuz hayal, bugün <span className="font-bold text-primary">15 kişilik çekirdek ekibi</span> ve <span className="font-bold text-primary">200 kişilik</span> dev bir hizmet ağına sahip, <span className="font-semibold text-slate-900 dark:text-white">Teknopark İstanbul'da</span> teknoloji geliştiren bir anonim şirkete dönüştü.
              </p>
          </motion.div>

          {/* Vision and Mission Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mission Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-slate-50 dark:bg-dark-light p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-white/10 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Misyonumuz</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Neden buradayız?</p>
                  </div>
                </div>
                <div className="text-base text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                  <p className="font-medium text-slate-800 dark:text-slate-200">Türkiye'deki üniversiteli yeteneklerin potansiyelini açığa çıkararak:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Beyin göçü yerine hizmet ihracatını güçlendirmek</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>KOBİ'lere erişilebilir bütçelerle kurumsal kalite sunmak</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Gençlerin "tecrübe yok" duvarını ilk günden yıkacak projelerle kariyerlerine başlamalarını sağlamak</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-slate-50 dark:bg-dark-light p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-white/10 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Vizyonumuz</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Nereye gidiyoruz?</p>
                  </div>
                </div>
                <div className="text-base text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                  <p className="font-medium text-slate-800 dark:text-slate-200">İşletmelerin dijital dönüşümünde, ajans ve freelancer pazar yerlerine alternatif, "üniversiteli freelancer temelli global bir hizmet markası" olmak.</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Türkiye'nin önde gelen üniversitelerinde fiziksel Freelance Merkezleri kurmak</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>On binlerce üniversiteli genci gerçek projelerle buluşturmak</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: EKİBİMİZ - First 4 Members */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <TeamSection limit={4} />
        </div>
      </section>

      {/* SECTION 4: MANIFESTO - Görsel Sol, Yazı Sağ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Sol - Görsel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/hakkimizda1.webp" 
                  alt="Unilancer Manifesto"
                  loading="lazy"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                    <Globe2 className="w-4 h-4" />
                    <span>Manifesto</span>
                  </div>
                </div>
              </div>
              {/* Dekoratif element */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-3xl bg-primary/10 dark:bg-primary/5" />
            </motion.div>

            {/* Sağ - Yazı */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                Beyin Göçü Yerine <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600">Hizmet İhracatı</span>
              </h2>

              <p className="text-xl font-medium text-slate-900 dark:text-white">
                Bizim için Unilancer sadece bir iş modeli değil, <span className="text-primary font-bold">bir eko-sosyal kalkınma hareketidir.</span>
              </p>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Türkiye'nin parlak gençlerinin, yeteneklerini sergilemek için <span className="font-semibold text-slate-900 dark:text-white">ülkelerini terk etmek zorunda olmadıklarına</span> inanıyoruz.
              </p>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Unilancer modeliyle; genç yetenekleri <span className="font-semibold text-slate-900 dark:text-white">fiziksel olarak burada tutup</span>, ürettikleri <span className="font-bold text-primary">dijital değeri dünyaya satmayı</span> hedefliyoruz.
              </p>

              <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-xl mt-8">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  Hindistan ve Bangladeş gibi ülkelerin domine ettiği küresel freelance pazarında, <span className="text-primary">Türk gençlerinin kalitesiyle</span> yeni ve güçlü bir alternatif oluşturmak.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: İŞ MODELİMİZ - Yazı Sol, Görsel Sağ */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Sol - Yazı */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                <Briefcase className="w-4 h-4" />
                <span>İş Modelimiz</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                Ajans Disiplini, <br/>
                <span className="text-primary">Freelance Esnekliği</span>
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Unilancer, alışılagelmiş freelance sitelerinden veya hantal ajans yapılarından farklıdır. 
                Biz, <span className="text-primary font-bold">Yönetilen Freelance Ekosistemi (Managed Freelance)</span> modelini uyguluyoruz.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800/30">
                  <span className="text-xl">❌</span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Ne Değiliz?</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Sizi yüzlerce ilan arasında yalnız bırakan bir pazar yeri değiliz.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800/30">
                  <span className="text-xl">✅</span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Neyiz?</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">PM rehberliğinde, seçilmiş üniversiteli ekiplerle çalışan çözüm ortağınızız.</p>
                  </div>
                </div>
              </div>

              <p className="text-base text-slate-600 dark:text-slate-300 italic">
                Siz işinize odaklanın, biz dijital süreçlerinizi yönetelim.
              </p>
            </motion.div>

            {/* Sağ - Görsel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/hakkimizda2.webp" 
                  alt="Unilancer İş Modeli"
                  loading="lazy"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-medium">
                    Tek muhatap, tek fatura, <span className="text-primary">kalite garantisi</span>
                  </p>
                </div>
              </div>
              {/* Dekoratif element */}
              <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full rounded-3xl bg-primary/10 dark:bg-primary/5" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CTA - KAPANIŞ */}
      <section className="py-16 md:py-24 relative overflow-hidden">

        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              Geleceği <span className="text-primary">Birlikte Tasarlayalım</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              İster dijitalleşmek isteyen bir KOBİ olun, ister dünyaya açılmak isteyen bir yetenek... 
              <span className="font-semibold text-slate-900 dark:text-white"> Unilancer Labs</span>, Web 3.0 çağına ve geleceğin iş modellerine giden köprünüzdür.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="h-16 rounded-full px-10 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 group">
                <Link to="/tr/proje-talebi" className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Hizmet Almak İstiyorum</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="h-16 rounded-full px-10 text-lg border-2 hover:bg-slate-50 dark:hover:bg-white/5 group">
                <Link to="/tr/basvuru" className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  <span>Freelancer Olarak Katıl</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      </div>
    </div>
    </>
  );
};

export default About;
