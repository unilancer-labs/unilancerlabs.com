import React, { memo, useMemo } from 'react';
import { FileSearch, FileText, Settings, Rocket } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';



const StepCard = memo(({ 
  title, 
  description, 
  icon: Icon, 
  image,
  index,
  displayNumber,
  className,
  zIndex
}: { 
  step: string, 
  title: string, 
  description: string, 
  icon: React.ElementType, 
  image?: string,
  index: number,
  displayNumber: number,
  className?: string,
  zIndex?: number
}) => {
  const borderClasses = useMemo(() => {
    let classes = 'border-slate-100 dark:border-white/5 ';
    if (index === 0) classes += 'md:border-r md:border-b border-b';
    if (index === 1) classes += 'md:border-b border-b';
    if (index === 2) classes += 'border-b md:border-b-0';
    if (index === 3) classes += 'md:border-r border-b-0';
    return classes;
  }, [index]);

  return (
    <div
      style={{ zIndex, contain: 'layout style paint' }}
      className={`relative bg-white/95 dark:bg-dark-light/95 p-5 sm:p-6 md:p-12 flex flex-col items-start gap-4 md:gap-6 group transition-colors duration-300 hover:bg-white dark:hover:bg-dark-light ${borderClasses} ${className}`}
    >
      {/* Hover Gradient - simplified */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Content Wrapper */}
      <div className="w-full">
        {/* Header with Icon */}
        <div className="w-full flex items-center justify-between mb-4 md:mb-6">
           <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
           </div>
           <span className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-200 dark:text-white/10 select-none group-hover:text-primary/20 transition-colors duration-300">
              0{displayNumber}
           </span>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <h3 className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base font-medium">
            {description}
          </p>
        </div>

        {/* Optional Image */}
        {image && (
          <div className="w-full mt-4 relative z-10 rounded-2xl overflow-hidden shadow-lg">
              <img src={image} alt={title} className="w-full h-auto object-cover" loading="lazy" decoding="async" />
          </div>
        )}
      </div>
    </div>
  );
});

export const HowItWorks = memo(function HowItWorks() {
  const { t } = useTranslation();
  
  const steps = useMemo(() => [
    {
      step: t('howItWorks.step1.label', 'ADIM 1'),
      title: t('howItWorks.step1.title', 'Analiz ve Yol Haritası'),
      description: t('howItWorks.step1.description', "İhtiyacınızı dinliyoruz, digiBot'la dijital analiz raporunuzu çıkarıp yol haritanızı oluşturuyoruz."),
      icon: FileSearch,
      displayNumber: 1
    },
    {
      step: t('howItWorks.step2.label', 'ADIM 2'),
      title: t('howItWorks.step2.title', 'Teklif ve Planlama'),
      description: t('howItWorks.step2.description', 'İş kapsamını, süreyi ve bütçeyi netleştiriyoruz. Onayınızdan sonra sözleşme ve faturalama dahil tüm resmi süreçler, tek muhatapla ilerliyor.'),
      icon: FileText,
      displayNumber: 2
    },
    {
      step: t('howItWorks.step4.label', 'ADIM 4'),
      title: t('howItWorks.step4.title', 'Teslimat ve Destek'),
      description: t('howItWorks.step4.description', 'Çıktılar kalite kontrolden geçiyor, proje zamanında teslim ediliyor; gerektiğinde destek vermeyi sürdürüyoruz.'),
      icon: Rocket,
      displayNumber: 4
    },
    {
      step: t('howItWorks.step3.label', 'ADIM 3'),
      title: t('howItWorks.step3.title', 'Üretim ve Raporlama'),
      description: t('howItWorks.step3.description', 'Proje yöneticimiz üniversiteli ekibi kuruyor, siz ilerlemeyi düzenli raporlarla takip ediyorsunuz.'),
      icon: Settings,
      displayNumber: 3
    }
  ], [t]);

  // Memoize grid config to prevent recalculation (no arrows)
  const gridConfig = useMemo(() => [
    { zIndex: 40, gridClass: '' },
    { zIndex: 30, gridClass: '' },
    { zIndex: 20, gridClass: 'md:col-start-2 md:row-start-2' },
    { zIndex: 10, gridClass: 'md:col-start-1 md:row-start-2' }
  ], []);

  return (
    <section id="nasil-calisir" className="py-12 md:py-16 relative overflow-hidden" style={{ contain: 'content' }}>
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-0 md:mb-12 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-4 md:mb-6">
            <span className="text-primary">unilancer</span> {t('howItWorks.title.with', 'ile dijitalleşmek')} <span className="relative inline-block">
              {t('howItWorks.title.easy', 'çok kolay')}
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-primary" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="relative mt-0 md:mt-60 isolate">
          {/* Mobile: Image above grid - overlapping with first card */}
          <div className="md:hidden flex justify-center -mb-6 relative z-0">
            <img 
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/ekiptopluseffaf.webp" 
              alt="" 
              className="w-[95%] max-w-[360px] object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Desktop: Process Image - Behind and Shifted Up */}
          <div className="absolute inset-0 -z-10 hidden md:flex items-center justify-center pointer-events-none -translate-y-96" style={{ contentVisibility: 'auto' }}>
            <img 
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/ekiptopluseffaf.webp" 
              alt="" 
              className="w-[100%] h-[100%] object-contain max-w-none"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-slate-200 dark:bg-white/10 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10"
            style={{ 
              boxShadow: '0 -20px 60px -15px rgba(0,0,0,0.2)',
              contain: 'layout style'
            }}
          >
            {steps.map((step, index) => (
              <StepCard 
                key={index}
                index={index}
                displayNumber={step.displayNumber}
                className={gridConfig[index].gridClass}
                zIndex={gridConfig[index].zIndex}
                {...step}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
