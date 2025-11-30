"use client";

import { ArrowLeft, ArrowRight, Quote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

// Memoized testimonial card for better performance
const TestimonialImage = memo(function TestimonialImage({ 
  testimonial, 
  isActive, 
  index 
}: { 
  testimonial: Testimonial; 
  isActive: boolean; 
  index: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0.7,
        scale: isActive ? 1 : 0.95,
        zIndex: isActive ? 999 : 1,
        rotate: isActive ? 0 : (index % 2 === 0 ? 5 : -5),
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0 origin-bottom"
    >
      <img
        src={testimonial.src}
        alt={testimonial.name}
        width={500}
        height={500}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full rounded-[1.5rem] object-cover object-center shadow-2xl border border-white/20 dark:border-white/10"
      />
    </motion.div>
  );
});

export const AnimatedTestimonials = memo(function AnimatedTestimonials({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  return (
    <div className={cn("py-12 md:py-24 bg-slate-50/50 dark:bg-dark-light/20 relative overflow-hidden", className)}>
      {/* Background Pattern - static, no animation */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#5FC8DA 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6">
            {t('home.testimonials.title', 'Başarı Hikayelerimiz')}
          </h2>
          <p className="text-base md:text-xl text-slate-600 dark:text-gray-300 leading-relaxed px-2">
            {t('home.testimonials.subtitle', 'Unilancer ile çalışan markaların ve girişimlerin deneyimleri')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="relative h-[280px] sm:h-[350px] md:h-[450px] w-full max-w-[400px] sm:max-w-[500px] mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[2rem] blur-3xl -z-10 transform rotate-6 scale-110" />
            {testimonials.map((testimonial, index) => (
              <TestimonialImage
                key={testimonial.src}
                testimonial={testimonial}
                isActive={index === active}
                index={index}
              />
            ))}
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="mb-6 md:mb-8">
                  <Quote className="w-10 h-10 md:w-12 md:h-12 text-primary/20 mb-4 md:mb-6" />
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 dark:text-white leading-relaxed">
                    {testimonials[active].quote}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
                    {testimonials[active].name}
                  </h3>
                  <p className="text-base md:text-lg text-primary font-medium">
                    {testimonials[active].designation}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-4 mt-10">
              <button
                onClick={handlePrev}
                className="h-12 w-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group/button hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-sm"
              >
                <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-gray-300 group-hover/button:text-white transition-colors" />
              </button>
              <button
                onClick={handleNext}
                className="h-12 w-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group/button hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-sm"
              >
                <ArrowRight className="h-6 w-6 text-slate-600 dark:text-gray-300 group-hover/button:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
