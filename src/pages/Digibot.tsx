import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Twitter, Youtube, Instagram, Bot, Sparkles, MessageSquare, Cpu, Brain, Terminal, Code2 } from 'lucide-react';

// Custom Grid Background Component
const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="absolute inset-0" 
           style={{
             backgroundImage: `radial-gradient(circle at 2px 2px, rgba(150, 150, 150, 0.3) 2px, transparent 0)`,
             backgroundSize: '40px 40px',
             opacity: 0.3
           }} 
      />
      {/* Simulated "Tiles" look using a mask or repeated gradient could be heavy, 
          so we'll use a grid of divs for the visual effect in the center area */}
      <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-2 opacity-20 pointer-events-none select-none overflow-hidden">
         {Array.from({ length: 100 }).map((_, i) => (
           <div key={i} className="w-24 h-24 rounded-xl bg-gray-200/50 dark:bg-zinc-800/50 border border-gray-300/20 dark:border-white/5" />
         ))}
      </div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0a0a0a] via-transparent to-gray-50 dark:to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 dark:from-[#0a0a0a] via-transparent to-gray-50 dark:to-[#0a0a0a]" />
    </div>
  );
};

const FloatingToken = ({ 
  icon: Icon, 
  color, 
  x, 
  y, 
  rotate, 
  delay 
}: { 
  icon: any, 
  color: string, 
  x: number, 
  y: number, 
  rotate: number, 
  delay: number 
}) => {
  const colorClasses = {
    primary: "bg-[#5FC8DA] text-black border-[#4BA3B2]",
    purple: "bg-purple-500 text-white border-purple-400",
    yellow: "bg-yellow-400 text-black border-yellow-300",
    cyan: "bg-cyan-400 text-black border-cyan-300",
    dark: "bg-white dark:bg-zinc-900 text-[#5FC8DA] border-[#5FC8DA]"
  };

  return (
    <motion.div
      className={`absolute hidden md:flex items-center justify-center w-12 h-12 md:w-24 md:h-24 rounded-full border-2 md:border-4 shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${colorClasses[color as keyof typeof colorClasses]}`}
      initial={{ x, y, rotate, opacity: 0, scale: 0 }}
      animate={{ 
        y: [y - 10, y + 10, y - 10],
        rotate: [rotate - 10, rotate + 10, rotate - 10],
        opacity: 1,
        scale: 1
      }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5, type: "spring" }
      }}
      style={{ zIndex: 20 }}
    >
      <div className="w-8 h-8 md:w-14 md:h-14 rounded-full border md:border-2 border-current border-dashed flex items-center justify-center">
        <Icon className="w-4 h-4 md:w-7 md:h-7" strokeWidth={2.5} />
      </div>
    </motion.div>
  );
};

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center mx-2">
    <div className="bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-lg w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-2 shadow-lg relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-[#5FC8DA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-3xl md:text-5xl font-black text-[#5FC8DA] font-mono tracking-tighter">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
  </div>
);

const Digibot = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center font-sans">
      <GridBackground />

      {/* Repeated Background Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute -inset-[100%] w-[300%] h-[300%] flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-[0.03] -rotate-12">
           {Array.from({ length: 80 }).map((_, i) => (
             <span key={i} className="text-5xl md:text-9xl font-black text-gray-800 dark:text-white whitespace-nowrap">
               ÇOK YAKINDA
             </span>
           ))}
        </div>
      </div>

      {/* Floating Tokens - Distributed across the screen */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Top Right Area */}
        <div className="absolute top-[12%] right-[10%] md:top-1/4 md:right-1/4">
          <FloatingToken icon={Brain} color="dark" x={0} y={0} rotate={-15} delay={0} />
        </div>
        
        {/* Bottom Right Area -> Mobile: Middle Right */}
        <div className="absolute top-[30%] right-[8%] md:top-auto md:bottom-1/4 md:right-1/4">
          <FloatingToken icon={Bot} color="primary" x={0} y={0} rotate={10} delay={1} />
        </div>
        
        {/* Far Right Middle -> Mobile: Lower Middle Right */}
        <div className="absolute top-[48%] right-[12%] md:top-1/2 md:right-[10%]">
          <FloatingToken icon={MessageSquare} color="primary" x={0} y={0} rotate={15} delay={0.5} />
        </div>

        {/* Top Left Area */}
        <div className="absolute top-[12%] left-[10%] md:top-1/4 md:left-[15%]">
           <FloatingToken icon={Code2} color="primary" x={0} y={0} rotate={5} delay={2.5} />
        </div>

        {/* Bottom Left Area -> Mobile: Middle Left */}
        <div className="absolute top-[30%] left-[8%] md:top-auto md:bottom-1/4 md:left-[15%]">
          <FloatingToken icon={Terminal} color="dark" x={0} y={0} rotate={-5} delay={2} />
        </div>

        {/* Far Left Middle -> Mobile: Lower Middle Left */}
        <div className="absolute top-[48%] left-[12%] md:top-1/2 md:left-[5%]">
          <FloatingToken icon={Sparkles} color="dark" x={0} y={0} rotate={-10} delay={1.5} />
        </div>
      </div>

      <div className="relative z-30 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Character / Robot Representation (Behind) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:top-[13%] md:left-[48%] md:-translate-x-1/2 md:bottom-auto z-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow behind character */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#5FC8DA]/20 blur-[100px] rounded-full" />
            
            <img 
              src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/digibotefendi.webp"
              alt="Digibot"
              className="w-[90vw] max-w-[400px] md:max-w-none md:w-[450px] lg:w-[580px] h-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Digibot;
