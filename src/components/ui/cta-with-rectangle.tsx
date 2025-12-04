import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { trackCTAClick } from "@/lib/analytics";

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
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-5xl text-foreground leading-tight"
          >
            <span className="block sm:inline">Projenizi Hayata Geçirmek İçin</span>{' '}
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
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed px-2"
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
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-0"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white w-full sm:w-auto sm:min-w-[180px] h-12 sm:h-14 text-base sm:text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 rounded-xl"
              onClick={() => {
                trackCTAClick('start_project', 'cta_section', '/project-request');
                window.location.href = '/project-request';
              }}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Projeni Başlat
            </Button>
            
            <Button 
              size="lg" 
              className="text-white w-full sm:w-auto sm:min-w-[180px] h-12 sm:h-14 text-base sm:text-lg shadow-lg transition-all duration-300 rounded-xl hover:opacity-90"
              style={{ backgroundColor: '#b370ab' }}
              onClick={() => {
                trackCTAClick('join_us', 'cta_section', '/tr/bize-katil');
                window.location.href = '/tr/bize-katil';
              }}
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
