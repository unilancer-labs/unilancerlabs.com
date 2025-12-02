import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function WhyUsSection() {
  useTranslation(); // Keep for potential future translations

  const features = [
    {
      title: "Tek Muhatap, Kurumsal Güvence",
      description: "Sözleşme, fatura ve tüm süreç tek elden yönetilir. Freelancer karmaşıklığına son.",
      className: "md:col-span-2",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      borderColor: "hover:border-blue-300 dark:hover:border-blue-500/30",
      image: "/images/why-us/1.png"
    },
    {
      title: "360° Dijital Çözümler",
      description: "Web, mobil, tasarım ve pazarlama tek çatı altında. Farklı ajanslarla uğraşmayın.",
      className: "md:col-span-2",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      borderColor: "hover:border-purple-300 dark:hover:border-purple-500/30",
      image: "/images/why-us/2.png"
    },
    {
      title: "Size Özel Yol Haritası",
      description: "Hazır paket değil, hedefe özel strateji. Her proje için benzersiz çözümler.",
      className: "md:col-span-2",
      bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
      borderColor: "hover:border-cyan-300 dark:hover:border-cyan-500/30",
      image: "/images/why-us/3.png"
    },
    {
      title: "Uçtan Uca Yönetim",
      description: "Profesyonel yöneticilerle fikirden teslimata kusursuz işleyiş. Sizin işiniz sadece onaylamak.",
      className: "md:col-span-3",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      borderColor: "hover:border-emerald-300 dark:hover:border-emerald-500/30",
      image: "/images/why-us/4.png"
    },
    {
      title: "Rekabetçi Fiyat",
      description: "Ajans kalitesi, öğrenci dinamizmi, erişilebilir bütçe. Kaliteden ödün vermeden tasarruf.",
      className: "md:col-span-3",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      borderColor: "hover:border-amber-300 dark:hover:border-amber-500/30",
      image: "/images/why-us/5.png"
    }
  ];

  return (
    <section id="neden-unilancer" className="py-16 md:py-28 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-200/50 dark:bg-slate-800/30 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            neden{" "}
            <span className="relative inline-block">
              unilancer
              <svg className="absolute -bottom-3 left-0 w-full h-4" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
                <path 
                  d="M5 12C30 5 50 18 80 10C110 2 130 16 160 8C175 4 190 14 195 10" 
                  stroke="#5FC8DA" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <circle cx="15" cy="10" r="3" fill="#5FC8DA" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
                <circle cx="100" cy="8" r="2.5" fill="#5FC8DA" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
                <circle cx="180" cy="12" r="3" fill="#5FC8DA" className="animate-bounce" style={{ animationDelay: '0.5s' }} />
              </svg>
            </span>
            ?
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 min-h-[220px]",
                feature.bgColor,
                feature.borderColor,
                feature.className
              )}
            >
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                {/* Content - positioned at bottom left */}
                <div className="max-w-[65%]">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Image Area - Transparent PNG positioned at right */}
              <div className="absolute top-1/2 -translate-y-1/2 right-4 w-32 h-32 md:w-40 md:h-40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Beyin Göçü Yerine Hizmet İhracatı Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <div className="rounded-[28px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Image instead of icon */}
                <div className="shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 transition-transform duration-500 group-hover:scale-110">
                    <img 
                      src="/images/why-us/globe.png" 
                      alt="Hizmet İhracatı"
                      className="w-full h-full object-contain drop-shadow-xl"
                      onError={(e) => {
                        // Fallback to emoji if image doesn't exist
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.innerHTML = '<span class="text-6xl md:text-7xl">🌍</span>';
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    <span className="line-through text-slate-400 dark:text-slate-500">Beyin Göçü</span>
                    {" "}
                    <span className="text-primary">Yerine</span>
                    {" "}
                    Hizmet İhracatı
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    Projenizle sadece işinizi büyütmeyin; genç yeteneklerin dünyaya açılmasına ve ülkemize değer katmasına destek olun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
