"use client";

import { ArrowLeft, ArrowRight, Quote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className={cn("py-12 md:py-16 bg-slate-50/50 dark:bg-dark-light/20 relative overflow-hidden", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#5FC8DA 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center text-xs sm:text-sm text-primary font-medium bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Müşteri Deneyimleri
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6"
          >
            Başarı Hikayelerimiz
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-slate-600 dark:text-gray-300 leading-relaxed px-2"
          >
            Unilancer ile çalışan markaların ve girişimlerin deneyimleri
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="relative h-[280px] sm:h-[350px] md:h-[450px] w-full max-w-[400px] sm:max-w-[500px] mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[2rem] blur-3xl -z-10 transform rotate-6 scale-110" />
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-[1.5rem] object-cover object-center shadow-2xl border border-white/20 dark:border-white/10"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <div className="mb-6 md:mb-8">
                <Quote className="w-10 h-10 md:w-12 md:h-12 text-primary/20 mb-4 md:mb-6" />
                <motion.p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 dark:text-white leading-relaxed">
                  {testimonials[active].quote.split(" ").map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: 0.02 * index,
                      }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.p>
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

            <div className="flex gap-4 mt-10">
              <button
                onClick={handlePrev}
                className="h-12 w-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group/button hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-sm"
              >
                <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-gray-300 group-hover/button:text-white group-hover/button:rotate-12 transition-all duration-300" />
              </button>
              <button
                onClick={handleNext}
                className="h-12 w-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group/button hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-sm"
              >
                <ArrowRight className="h-6 w-6 text-slate-600 dark:text-gray-300 group-hover/button:text-white group-hover/button:-rotate-12 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
