import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuroraBackground from '@/components/ui/effects/aurora-background';

// Define the props interface for type safety and reusability
interface DigibotHeroProps {
  logoText?: string;
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
        <header className="relative z-30 flex w-full max-w-7xl items-center justify-between px-8 pt-8 md:px-12">
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
      <div className="relative z-10 grid w-full max-w-[1340px] flex-grow grid-cols-1 items-center px-4 pt-24 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-20 order-2 mt-8 text-center lg:order-1 lg:mt-0 lg:text-left"
        >
          <p className="mx-auto max-w-sm text-base leading-relaxed text-slate-600 dark:text-gray-400 lg:mx-0">
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
        <div className="relative order-1 flex h-full items-center justify-center lg:order-2 min-h-[400px] md:min-h-[500px]">
          {/* Glow Effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/80 to-primary-dark/60 blur-sm md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
          />
          {/* Inner Circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="absolute z-0 h-[280px] w-[280px] rounded-full bg-gradient-to-br from-primary to-primary-light md:h-[380px] md:w-[380px] lg:h-[480px] lg:w-[480px]"
          />
          {/* Decorative Ring */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="absolute z-0 h-[340px] w-[340px] rounded-full border-2 border-primary/30 md:h-[440px] md:w-[440px] lg:h-[540px] lg:w-[540px]"
          />
          
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-auto w-56 scale-150 object-contain drop-shadow-2xl md:w-64 lg:w-72"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/400x600/5FC8DA/ffffff?text=digiBot`;
            }}
          />
        </div>

        {/* Right Text - Big Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-3 mt-8 flex items-center justify-center text-center lg:mt-0 lg:justify-start lg:text-left"
        >
          <h1 className="text-5xl font-extrabold leading-[0.9] tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">{overlayText.part1}</span>
            <span className="block bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {overlayText.part2}
            </span>
          </h1>
        </motion.div>
      </div>

      {/* Footer Elements - Optional */}
      {showFooter && (
        <footer className="relative z-30 flex w-full max-w-7xl items-center justify-between px-8 pb-8 md:px-12">
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
