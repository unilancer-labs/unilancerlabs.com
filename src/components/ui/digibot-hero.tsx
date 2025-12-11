import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuroraBackground from '@/components/ui/effects/aurora-background';

// Define the props interface for type safety and reusability
interface DigibotHeroProps {
  logoText?: string;
  logoSrc?: string;
  navLinks?: { label: string; href: string }[];
  mainText: string;
  readMoreLink?: string;
  readMoreLabel?: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks?: { icon: LucideIcon; href: string }[];
  locationText?: string;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  children?: React.ReactNode;
}

// Helper component for navigation links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-slate-600 dark:text-gray-400 transition-colors hover:text-primary"
  >
    {children}
  </a>
);

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-gray-400 transition-colors hover:text-primary">
    <Icon className="h-5 w-5" />
  </a>
);

// The main reusable Hero Section component styled for Unilancer
export const DigibotHero = ({
  logoText,
  logoSrc,
  navLinks = [],
  mainText,
  readMoreLink,
  readMoreLabel = 'Daha Fazla',
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks = [],
  locationText,
  className,
  showHeader = false,
  showFooter = false,
  children,
}: DigibotHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden font-sans',
        className
      )}
    >
      {/* Background - Unilancer Style */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA10_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-70" />
      </div>

      {/* Header - Optional */}
      {showHeader && (
        <header className="relative z-30 flex w-full max-w-[1340px] mx-auto items-center justify-between px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold tracking-wider text-slate-900 dark:text-white"
          >
            {logoText}
          </motion.div>
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-1.5 md:hidden"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-6 bg-slate-900 dark:bg-white"></span>
            <span className="block h-0.5 w-6 bg-slate-900 dark:bg-white"></span>
            <span className="block h-0.5 w-5 bg-slate-900 dark:bg-white"></span>
          </motion.button>
        </header>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 grid w-full max-w-[1340px] mx-auto flex-grow grid-cols-1 items-center px-4 pt-20 pb-8 sm:px-6 sm:pt-24 sm:pb-12 lg:grid-cols-3 lg:px-8">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-30 order-2 mt-6 text-center lg:order-1 lg:mt-0 lg:text-left rounded-2xl p-4 sm:p-0 bg-white/70 dark:bg-dark/70 backdrop-blur-md lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none"
        >
          {/* Logo above text */}
          {logoSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="-mb-2 flex justify-center lg:justify-start"
            >
              <img 
                src={logoSrc} 
                alt="digiBot" 
                className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 object-contain drop-shadow-lg"
              />
            </motion.div>
          )}
          <p className="mx-auto max-w-md sm:max-w-lg text-[15px] sm:text-[16.5px] md:text-[20px] leading-relaxed text-slate-600 dark:text-gray-300 lg:mx-0">
            {mainText}
          </p>
          {readMoreLink && (
            <a 
              href={readMoreLink} 
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group"
            >
              {readMoreLabel}
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
          {/* Custom content slot */}
          {children}
        </motion.div>

        {/* Center Image with Gradient Circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:relative lg:order-2">
          {/* Main Circle - Solid like original - reduced by 20% */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 h-[220px] w-[220px] rounded-full bg-gradient-to-br from-primary/90 to-primary-light/80 sm:h-[280px] sm:w-[280px] md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
          />
          {/* Decorative Ring - reduced by 20% */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="absolute z-0 h-[250px] w-[250px] rounded-full border-2 border-primary/40 sm:h-[320px] sm:w-[320px] md:h-[400px] md:w-[400px] lg:h-[460px] lg:w-[460px]"
          />
          
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-auto w-[260px] object-contain drop-shadow-2xl sm:w-[340px] md:w-[440px] lg:w-[520px]"
            style={{ transform: 'translateY(10%)' }}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/400x600/5FC8DA/ffffff?text=digiBot`;
            }}
          />
        </div>

        {/* Right Text - Big Typography - ON TOP of image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-30 order-3 mt-6 flex items-center justify-center text-center lg:mt-0 lg:justify-end lg:text-right"
        >
          <h1 className="text-4xl font-extrabold leading-[0.85] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block text-slate-900 dark:text-white">{overlayText.part1}</span>
            <span className="block text-slate-900 dark:text-white">{overlayText.part2}</span>
          </h1>
        </motion.div>
      </div>

      {/* Footer Elements - Optional */}
      {showFooter && (
        <footer className="relative z-30 flex w-full max-w-[1340px] mx-auto items-center justify-between px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex items-center space-x-4"
          >
            {socialLinks.map((link, index) => (
              <SocialIcon key={index} href={link.href} icon={link.icon} />
            ))}
          </motion.div>
          {locationText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="text-sm font-medium text-slate-500 dark:text-gray-400"
            >
              {locationText}
            </motion.div>
          )}
        </footer>
      )}
    </div>
  );
};

export default DigibotHero;
