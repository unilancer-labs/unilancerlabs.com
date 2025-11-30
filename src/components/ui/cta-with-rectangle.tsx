import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { motion } from "framer-motion";

function CTASection() {
  return (
    <section className="w-full py-12 md:py-16 bg-transparent relative">
      {/* Ambient Lighting Effects - Simplified for Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Glow for blending with previous section */}
        <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[100px] rounded-full" />
        
        {/* Center Primary Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[28px] sm:text-[35px] md:text-[50px] lg:text-[60px] font-bold tracking-tight max-w-5xl text-foreground leading-[1.1]"
          >
            Projenizi Hayata Geçirmek İçin <br />
            <span className="text-primary">
              Doğru Zaman Şimdi!
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[15px] sm:text-[16.5px] md:text-[20px] text-muted-foreground max-w-2xl leading-relaxed"
          >
            Türkiye'nin en yetenekli üniversiteli ekipleriyle çalışın. 
            Web sitesinden mobil uygulamaya, tasarımdan pazarlamaya kadar tüm dijital ihtiyaçlarınız için profesyonel destek alın.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white min-w-[180px] h-14 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 rounded-xl"
              onClick={() => window.location.href = '/project-request'}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Projeni Başlat
            </Button>
            
            <Button 
              size="lg" 
              className="text-white min-w-[180px] h-14 text-lg shadow-lg transition-all duration-300 rounded-xl hover:opacity-90"
              style={{ backgroundColor: '#b370ab' }}
              onClick={() => window.location.href = '/join-us'}
            >
              Bize Katıl
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { CTASection };
