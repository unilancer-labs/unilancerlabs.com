import { memo } from "react";
import { cn } from "../../../lib/utils";

type MarqueeAnimationProps = {
  children: string;
  className?: string;
  direction?: "left" | "right";
  baseVelocity?: number;
};

// CSS-based marquee for better performance - no JS animation frame
const MarqueeAnimation = memo(function MarqueeAnimation({
  children,
  className,
  direction = "left",
}: MarqueeAnimationProps) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div 
        className="flex whitespace-nowrap"
        style={{
          animation: `scroll-${direction} 25s linear infinite`,
        }}
      >
        {/* Repeat content multiple times for seamless loop */}
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex-shrink-0 px-8 font-bold uppercase text-xl sm:text-2xl md:text-3xl">
            {children}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
});

export { MarqueeAnimation };
