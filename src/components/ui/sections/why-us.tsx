import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export function WhyUsSection() {
  useTranslation(); // Keep for potential future translations

  return (
    <section id="neden-unilancer" className="py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            neden{" "}
            <span className="relative inline-block text-[#5FC8DA]">
              unilancer
              <svg className="absolute -bottom-1 md:-bottom-3 left-0 w-full h-2 md:h-4" viewBox="0 0 200 20" fill="none">
                <path 
                  d="M5 12C30 5 50 18 80 10C110 2 130 16 160 8C175 4 190 14 195 10" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className="text-[#5FC8DA] animate-pulse"
                />
              </svg>
            </span>
            ?
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)] sm:auto-rows-[minmax(240px,auto)] md:auto-rows-[minmax(280px,auto)]">
          
          {/* 1. Kurumsal Kalite, Freelance Esnekliği (Tall Vertical - Left Column) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:col-span-1 md:row-span-2 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] bg-[#F0F4FF] dark:bg-zinc-900 p-5 sm:p-6 md:p-8 flex flex-col relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border border-indigo-100 dark:border-white/5 min-h-[380px] sm:min-h-[420px] md:min-h-0"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-20 mb-4 md:mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 md:mb-4 tracking-tight">Kurumsal Kalite, Freelance Esnekliği</h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Kurumsal disiplini freelance esnekliği ile birleştiriyoruz böylece yüksek standartlı iş üretimini, daha çevik ve erişilebilir bir modelle sunuyoruz.
              </p>
            </div>
            
            {/* Image at bottom */}
            <div className="flex-1 relative w-full min-h-[200px] md:min-h-0">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images/kurumsalfreelancer.webp" 
                 className="absolute left-0 w-full object-contain bg-transparent -top-16 md:top-auto md:-bottom-8" 
                 alt="Kurumsal Freelancer"
                 loading="lazy"
               />
            </div>
          </motion.div>

          {/* 2. Süper Yönetim (Wide Horizontal - Top Right) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="md:col-span-2 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] bg-[#FFF0F5] dark:bg-zinc-900 flex flex-col md:flex-row relative overflow-hidden group hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border border-pink-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20 flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Tüm Dijital İhtiyaçlar İçin Tek Kaynak</h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium">
                Dijital ihtiyaçlarınız değiştikçe yeni hizmet sağlayıcı aramazsınız; sürdürülebilir ve uzun vadeli bir strateji oluşturuyoruz
              </p>
            </div>
            
            <div className="relative w-full md:w-1/3 h-40 sm:h-48 md:h-auto md:mr-8">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/bandgrade.webp" 
                 className="absolute inset-0 object-cover w-full h-full hover:scale-105 transition-transform duration-700" 
                 alt="Project Management"
                 loading="lazy"
               />
            </div>
          </motion.div>

          {/* 3. Proje Yönetimi (Standard - Middle Right Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="md:col-span-1 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] bg-[#F0FFF4] dark:bg-zinc-900 p-5 sm:p-6 md:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-green-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20 pb-24 sm:pb-28 md:pb-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">Proje Yönetimi</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">Proje yöneticiniz, doğru freelance ekibi kurar ve süreci uçtan uca organize eder.</p>
            </div>
            <div className="absolute -bottom-20 md:-bottom-40 left-1/2 -translate-x-1/2 w-40 md:w-72 h-40 md:h-72 rotate-6 group-hover:rotate-0 group-hover:-bottom-12 md:group-hover:-bottom-24 transition-all duration-500">
               <div className="absolute inset-0 bg-green-400/10 rounded-lg blur-xl group-hover:scale-125 transition-transform duration-700" />
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images/projebildirimi.webp" 
                 className="relative object-contain w-full h-full rounded-lg shadow-xl transition-all duration-500 bg-transparent" 
                 alt="Project Management"
                 loading="lazy"
               />
            </div>
          </motion.div>

          {/* 4. Tek Muhatap (Standard - Middle Right Right) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            className="md:col-span-1 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] bg-[#EBF8FF] dark:bg-zinc-900 p-5 sm:p-6 md:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 border border-sky-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20 pb-20 sm:pb-24 md:pb-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">Tek Muhatap</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">Tüm süreçte tek muhatabınız var; sözleşme, fatura ve sorumluluk bizde toplanır.</p>
            </div>
            <div className="absolute -bottom-8 sm:-bottom-10 md:-bottom-20 left-1/2 -translate-x-1/2 w-28 sm:w-32 md:w-48 h-28 sm:h-32 md:h-48 group-hover:w-36 sm:group-hover:w-40 md:group-hover:w-56 group-hover:h-36 sm:group-hover:h-40 md:group-hover:h-56 group-hover:-bottom-4 sm:group-hover:-bottom-6 md:group-hover:-bottom-12 transition-all duration-500">
               <div className="absolute inset-0 bg-sky-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images/unilancerteklogo.webp" 
                 className="relative object-contain w-full h-full opacity-30 group-hover:opacity-100 transition-all duration-500" 
                 alt="Unilancer Logo"
                 loading="lazy"
               />
            </div>
          </motion.div>

          {/* 5. Sınırları Kaldırıyoruz (Wide - Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            className="md:col-span-2 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] bg-[#FFF4ED] dark:bg-zinc-900 flex flex-col md:flex-row relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 border border-orange-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            {/* Text Content */}
            <div className="relative z-20 flex-1 p-5 sm:p-6 md:p-8 md:py-10 flex flex-col justify-center order-1 md:order-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
                Beyin Göçü Yerine Hizmet İhracatı
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Gençlerimizi yurtdışına kaptırmak yerine, onların bilgisini dünyaya ihraç ediyoruz. Her proje, gerçek tecrübe ve yüksek katma değer demek.
              </p>
            </div>

            {/* Mobile: Side by side images */}
            <div className="flex md:hidden w-full h-28 sm:h-32 order-2">
               <div className="w-1/2 h-full overflow-hidden rounded-bl-[24px] sm:rounded-bl-[32px]">
                  <img 
                    src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvaradiki.webp" 
                    className="object-cover w-full h-full object-top" 
                    alt="Global Connection Left"
                    loading="lazy"
                  />
               </div>
               <div className="w-1/2 h-full overflow-hidden rounded-br-[24px] sm:rounded-br-[32px]">
                  <img 
                    src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvarad.webp" 
                    className="object-cover w-full h-full object-top" 
                    alt="Global Connection Right"
                    loading="lazy"
                  />
               </div>
            </div>

            {/* Desktop: Left Image */}
            <div className="hidden md:block w-full md:w-1/4 h-64 md:h-full order-2 md:order-1 md:rounded-l-[48px] overflow-hidden">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvaradiki.webp" 
                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 md:object-left" 
                 alt="Global Connection Left"
                 loading="lazy"
               />
            </div>

            {/* Desktop: Right Image */}
            <div className="hidden md:block w-full md:w-1/4 h-40 md:h-full order-2 md:order-3 md:rounded-r-[48px] overflow-hidden">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvarad.webp" 
                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 md:object-right" 
                 alt="Global Connection Right"
                 loading="lazy"
               />
            </div>
          </motion.div>

          {/* 6. İstatistiklerimiz (Standard - Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 rounded-[24px] sm:rounded-[32px] md:rounded-[48px] bg-[#F0F0FF] dark:bg-zinc-900 p-5 sm:p-6 md:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-purple-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20 h-full flex flex-col justify-center">
              <div className="flex md:block justify-around md:space-y-5">
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">120+</span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">başarılı proje</p>
                </div>
                
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">200+</span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">freelancer</p>
                </div>
                
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">30+</span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">dijital hizmet</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
