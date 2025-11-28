import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, ArrowLeft, FileSearch, FileText, Settings, Rocket } from 'lucide-react';

const DashedArrow = ({ direction }: { direction: 'right' | 'down' | 'left' }) => {
  const isRight = direction === 'right';
  const isDown = direction === 'down';
  const isLeft = direction === 'left';

  return (
    <div className={`absolute hidden md:flex items-center justify-center pointer-events-none z-20
      ${isRight ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' : ''}
      ${isDown ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' : ''}
      ${isLeft ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2' : ''}
    `}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-dark-light border-2 border-dashed border-primary text-primary shadow-lg shadow-primary/20
        ${isRight ? '' : ''}
      `}>
        {isRight && <ArrowRight className="w-6 h-6" />}
        {isDown && <ArrowDown className="w-6 h-6" />}
        {isLeft && <ArrowLeft className="w-6 h-6" />}
      </div>
    </div>
  );
};

const StepCard = ({ 
  title, 
  description, 
  icon: Icon, 
  image,
  index,
  className,
  arrow,
  zIndex
}: { 
  step: string, 
  title: string, 
  description: string, 
  icon: React.ElementType, 
  image?: string,
  index: number,
  className?: string,
  arrow?: 'right' | 'down' | 'left' | null,
  zIndex?: number
}) => {
  // Border logic for 2x2 grid on desktop
  // Mobile: All have bottom border except last
  // Desktop: 
  // 0 (TL): Right & Bottom
  // 1 (TR): Bottom
  // 2 (BR): None (Visually last step)
  // 3 (BL): Right (Visually 3rd step)

  const borderClasses = `
    border-slate-100 dark:border-white/5
    ${index === 0 ? 'md:border-r md:border-b border-b' : ''}
    ${index === 1 ? 'md:border-b border-b' : ''}
    ${index === 2 ? 'border-b md:border-b-0' : ''}
    ${index === 3 ? 'md:border-r border-b-0' : ''}
  `;

  return (
    <div
      style={{ zIndex }}
      className={`relative bg-white/95 dark:bg-dark-light/95 backdrop-blur-sm p-6 md:p-12 flex flex-col items-start gap-4 md:gap-6 group transition-all duration-300 hover:bg-white dark:hover:bg-dark-light ${borderClasses} ${className}`}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Dashed Arrow Connector */}
      {arrow && <DashedArrow direction={arrow} />}

      {/* Animated Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: index * 0.15 }}
        className="w-full"
      >
        {/* Header with Icon */}
        <div className="w-full flex items-center justify-between mb-4 md:mb-6">
           <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/10">
              <Icon className="w-6 h-6 md:w-7 md:h-7" />
           </div>
           <span className="text-3xl md:text-4xl font-black text-slate-100 dark:text-white/5 select-none group-hover:text-primary/10 transition-colors duration-300">
              0{index + 1}
           </span>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base font-medium">
            {description}
          </p>
        </div>

        {/* Optional Image */}
        {image && (
          <div className="w-full mt-4 relative z-10 rounded-2xl overflow-hidden shadow-lg">
              <img src={image} alt={title} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const HowItWorks = () => {
  const steps = [
    {
      step: "ADIM 1",
      title: "Analiz ve Yol Haritası",
      description: "İhtiyacınızı dinliyoruz, Digibot’la dijital analiz raporunuzu çıkarıp yol haritanızı oluşturuyoruz.",
      icon: FileSearch
    },
    {
      step: "ADIM 2",
      title: "Teklif ve Planlama",
      description: "İş kapsamını, süreyi ve bütçeyi netleştiriyoruz. Onayınızdan sonra sözleşme ve faturalama dahil tüm resmi süreçler, tek muhatapla ilerliyor.",
      icon: FileText
    },
    {
      step: "ADIM 3",
      title: "Üretim ve Raporlama",
      description: "Proje yöneticimiz üniversiteli ekibi kuruyor, siz ilerlemeyi düzenli raporlarla takip ediyorsunuz.",
      icon: Settings
    },
    {
      step: "ADIM 4",
      title: "Teslimat ve Destek",
      description: "Çıktılar kalite kontrolden geçiyor, proje zamanında teslim ediliyor; gerektiğinde destek vermeyi sürdürüyoruz.",
      icon: Rocket
    }
  ];

  return (
    <section id="nasil-calisir" className="py-8 md:py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-dark-light/20 -z-10" />
      
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-6 md:mb-12 px-2">
          <h2 className="text-[24px] sm:text-[29px] md:text-[41px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-4 md:mb-6">
            <span className="text-primary">unilancer</span> ile dijitalleşmek <span className="relative inline-block">
              çok kolay
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="relative mt-20 md:mt-60 isolate">
          {/* Process Image - Behind and Shifted Up */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none -translate-y-32 md:-translate-y-96">
            <img 
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/ekiptopluseffaf.webp" 
              alt="" 
              className="w-[100%] h-[100%] object-contain max-w-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-slate-200 dark:bg-white/10 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]">
            {steps.map((step, index) => {
              // Determine grid position for snake layout
              // 0 (TL) -> 1 (TR)
              // 3 (BL) <- 2 (BR)
              
              let gridClass = "";
              let arrow: 'right' | 'down' | 'left' | null = null;
              let zIndex = 0;

              if (index === 0) {
                // Step 1: TL
                arrow = 'right';
                zIndex = 40;
              } else if (index === 1) {
                // Step 2: TR
                arrow = 'down';
                zIndex = 30;
              } else if (index === 2) {
                // Step 3: BR (Visually bottom right)
                gridClass = "md:col-start-2 md:row-start-2";
                arrow = 'left';
                zIndex = 20;
              } else if (index === 3) {
                // Step 4: BL (Visually bottom left)
                gridClass = "md:col-start-1 md:row-start-2";
                arrow = null; // Last step
                zIndex = 10;
              }

              return (
                <StepCard 
                  key={index}
                  index={index}
                  className={gridClass}
                  arrow={arrow}
                  zIndex={zIndex}
                  {...step}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};