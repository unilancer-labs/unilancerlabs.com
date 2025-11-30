// src/components/ui/effects/aurora-background.tsx
import React, { memo } from 'react';

// CSS-based aurora background - no JS animations for better performance
const AuroraBackground = memo(function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Static gradient orbs with CSS animation */}
      <div
        className="absolute -top-[20%] -left-[20%] w-[1200px] h-[800px] rounded-full opacity-20 animate-aurora-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[30%] w-[1000px] h-[700px] rounded-full opacity-15 animate-aurora-slow-reverse"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 60%)',
          filter: 'blur(100px)',
          animationDelay: '-10s',
        }}
      />
    </div>
  );
});

export default AuroraBackground;
