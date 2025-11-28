// src/components/ui/core/audience-card.tsx
import React from "react";
import { motion } from "framer-motion";

interface AudienceCardProps {
  index: number;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

const AudienceCard: React.FC<AudienceCardProps> = ({
  index,
  image,
  imageAlt,
  title,
  description,
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="group relative flex flex-col w-full max-w-sm mx-auto h-[400px] md:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-xl shadow-slate-300/40 dark:shadow-black/50"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90"></div>

      {/* Content */}
      <div className="relative flex flex-col h-full p-5 md:p-8 z-10 justify-between">
        {/* Top Section for Title */}
        <div>
          <h3 className="text-[18px] md:text-[24px] font-bold text-white tracking-wide leading-tight">
            {title}
          </h3>
        </div>

        {/* Bottom Section for Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
        >
          <p className="text-[15px] md:text-[16.5px] text-slate-100 leading-relaxed [text-shadow:_0_1px_4px_rgb(0_0_0_/_0.8)]">
            {description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AudienceCard;
