import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function WhyUsSection() {
  useTranslation(); // Keep for potential future translations

  return (
    <section id="neden-unilancer" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            neden{" "}
            <span className="relative inline-block text-[#5FC8DA]">
              unilancer
              <svg className="absolute -bottom-4 left-0 w-full h-6" viewBox="0 0 200 20" fill="none">
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
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Kurumsal hizmeti freelancer esnekliği ile birleştiriyoruz.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
          
          {/* 1. Kurumsal Kalite, Freelance Esnekliği (Tall Vertical - Left Column) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-1 md:row-span-2 rounded-[48px] bg-[#F0F4FF] dark:bg-zinc-900 p-8 flex flex-col relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border border-indigo-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-20 mb-8">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Kurumsal Kalite, Freelance Esnekliği</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Kurumsal disiplini freelance esnekliği ile birleştiriyoruz böylece yüksek standartlı iş üretimini, daha çevik ve erişilebilir bir modelle sunuyoruz.
              </p>
            </div>
            
            {/* Image at bottom */}
            <div className="flex-1 relative w-full">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images/kurumsalfreelancer.webp" 
                 className="absolute -bottom-8 left-0 w-full object-contain bg-transparent" 
                 alt="Kurumsal Freelancer"
               />
            </div>
          </motion.div>

          {/* 2. Süper Yönetim (Wide Horizontal - Top Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 rounded-[48px] bg-[#FFF0F5] dark:bg-zinc-900 flex flex-col md:flex-row relative overflow-hidden group hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border border-pink-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20 flex-1 p-8 md:pl-8 md:pr-8 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Tüm Dijital İhtiyaçlar İçin Tek Kaynak</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
                Dijital ihtiyaçlarınız değiştikçe yeni hizmet sağlayıcı aramazsınız; sürdürülebilir ve uzun vadeli bir strateji oluşturuyoruz
              </p>
            </div>
            
            <div className="relative w-full md:w-1/3 h-64 md:h-auto md:mr-8">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/bandgrade.webp" 
                 className="absolute inset-0 object-cover w-full h-full hover:scale-110 transition-transform duration-700" 
                 alt="Project Management"
               />
            </div>
          </motion.div>

          {/* 3. Proje Yönetimi (Standard - Middle Right Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 rounded-[48px] bg-[#F0FFF4] dark:bg-zinc-900 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-green-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Proje Yönetimi</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Proje yöneticiniz, doğru freelance ekibi kurar ve süreci uçtan uca organize eder.</p>
            </div>
            <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-72 h-72 rotate-6 group-hover:rotate-0 group-hover:-bottom-24 transition-all duration-500">
               <div className="absolute inset-0 bg-green-400/10 rounded-lg blur-xl group-hover:scale-125 transition-transform duration-700" />
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images/projebildirimi.webp" 
                 className="relative object-contain w-full h-full rounded-lg shadow-xl transition-all duration-500 bg-transparent" 
                 alt="Project Management"
               />
            </div>
          </motion.div>

          {/* 4. Tek Muhatap (Standard - Middle Right Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 rounded-[48px] bg-[#EBF8FF] dark:bg-zinc-900 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 border border-sky-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tek Muhatap</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Tüm süreçte tek muhatabınız var; sözleşme, fatura ve sorumluluk bizde toplanır.</p>
            </div>
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-48 group-hover:w-56 group-hover:h-56 group-hover:-bottom-12 transition-all duration-500">
               <div className="absolute inset-0 bg-sky-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images/unilancerteklogo.webp" 
                 className="relative object-contain w-full h-full opacity-30 group-hover:opacity-100 transition-all duration-500" 
                 alt="Unilancer Logo"
               />
            </div>
          </motion.div>

          {/* 5. Sınırları Kaldırıyoruz (Wide - Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 rounded-[48px] bg-[#FFF4ED] dark:bg-zinc-900 flex flex-col md:flex-row relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 border border-orange-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="w-full md:w-1/4 h-64 md:h-full order-2 md:order-1 md:rounded-l-[48px] overflow-hidden">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvaradiki.webp" 
                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 md:object-left" 
                 alt="Global Connection Left"
               />
            </div>

            <div className="relative z-20 flex-1 p-8 md:px-8 md:py-10 flex flex-col justify-center order-1 md:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Beyin Göçü Yerine Hizmet İhracatı
              </h3>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Gençlerimizi yurtdışına kaptırmak yerine, onların bilgisini dünyaya ihraç ediyoruz. Her proje, gerçek tecrübe ve yüksek katma değer demek.
              </p>
            </div>

            <div className="w-full md:w-1/4 h-64 md:h-full order-3 md:rounded-r-[48px] overflow-hidden">
               <img 
                 src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/genclerduvarad.webp" 
                 className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 md:object-right" 
                 alt="Global Connection Right"
               />
            </div>
          </motion.div>

          {/* 6. İstatistiklerimiz (Standard - Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 rounded-[48px] bg-[#F0F0FF] dark:bg-zinc-900 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-purple-100 dark:border-white/5"
          >
            {/* Dark Mode Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500" />

            <div className="relative z-20 h-full flex flex-col justify-center">
              <div className="space-y-5">
                <div className="text-center">
                  <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">120+</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">başarıyla tamamlanan proje</p>
                </div>
                
                <div className="text-center">
                  <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">200+</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">yetenekli freelancer ağı</p>
                </div>
                
                <div className="text-center">
                  <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">30+</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">farklı dijital hizmet</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
