import { motion } from "framer-motion";
import { 
  Globe,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function WhyUsSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: "Tek Muhatap, Kurumsal Güvence",
      description: "Sözleşme, fatura ve tüm süreç tek elden yönetilir.",
      className: "md:col-span-2",
      color: "blue",
      image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Microsoft-3D-Fluent-Emojis/master/Emojis/Objects/Shield.png",
      imageClass: "w-40 h-40 -bottom-4 -right-4 rotate-[-10deg]"
    },
    {
      title: "360° Dijital Çözümler",
      description: "Web, mobil, tasarım ve pazarlama tek çatı altında.",
      className: "md:col-span-2",
      color: "purple",
      image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Microsoft-3D-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png",
      imageClass: "w-40 h-40 bottom-0 right-0 translate-x-4 translate-y-4"
    },
    {
      title: "Size Özel Yol Haritası",
      description: "Hazır paket değil, hedefe özel strateji.",
      className: "md:col-span-2",
      color: "cyan",
      image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Microsoft-3D-Fluent-Emojis/master/Emojis/Travel%20and%20places/Compass.png",
      imageClass: "w-36 h-36 bottom-2 right-2 rotate-12"
    },
    {
      title: "Uçtan Uca Yönetim",
      description: "Profesyonel yöneticilerle fikirden teslimata kusursuz işleyiş.",
      className: "md:col-span-3",
      color: "emerald",
      image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Microsoft-3D-Fluent-Emojis/master/Emojis/People/Handshake.png",
      imageClass: "w-48 h-48 -bottom-6 -right-6"
    },
    {
      title: "Rekabetçi Fiyat",
      description: "Ajans kalitesi, öğrenci dinamizmi, erişilebilir bütçe.",
      className: "md:col-span-3",
      color: "amber",
      image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Microsoft-3D-Fluent-Emojis/master/Emojis/Objects/Money%20bag.png",
      imageClass: "w-44 h-44 -bottom-4 -right-4"
    }
  ];

  return (
    <section id="neden-unilancer" className="py-12 md:py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            {t("home.why.title", "Neden Unilancer?")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Az laf, çok iş. Projeniz için en doğru adres.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 transition-all duration-500 hover:shadow-xl hover:border-primary/20",
                feature.className
              )}
            >
              {/* Content */}
              <div className="relative z-10 max-w-[65%]">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Subtle Gradient Blob */}
              <div className={`absolute bottom-0 right-0 w-64 h-64 bg-${feature.color}-500/10 rounded-full blur-[80px] -mr-10 -mb-10 transition-opacity duration-500`} />

              {/* 3D Image */}
              <div className={cn("absolute transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3", feature.imageClass)}>
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-contain drop-shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Impact Strip - Redesigned (Minimal & Clean) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="w-full rounded-[32px] border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-8 md:p-12 relative">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              {/* Icon Box */}
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/5">
                <Globe className="w-8 h-8 text-slate-900 dark:text-white" />
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Beyin Göçü Değil, Hizmet İhracatı
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  Projenizle sadece işinizi büyütmeyin; genç yeteneklerin dünyaya açılmasına ve ülkemize değer katmasına destek olun.
                </p>
              </div>

              {/* Badge */}
              <div className="shrink-0">
                 <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-default">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Sosyal Etki
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
