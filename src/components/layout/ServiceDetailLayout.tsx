import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, HelpCircle, Layers, Zap, TrendingUp, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuroraBackground from '../ui/effects/aurora-background';

export interface ServiceDetailLayoutProps {
  data: {
    title: string;
    heroTitle: string;
    heroDescription: string;
    heroImage?: string;
    benefits: string[] | { title: string; description: string }[];
    businessBenefits?: { title: string; description: string }[];
    sectorScenarios?: { title: string; description: string }[];
    subServices: { title: string; description: string }[];
    process: { title: string; description: string }[];
    faq: { question: string; answer: string }[];
    technologies?: string[];
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { staggerChildren: 0.1 }
};

const ServiceDetailLayout: React.FC<ServiceDetailLayoutProps> = ({ data }) => {
  const isRichBenefits = data.benefits.length > 0 && typeof data.benefits[0] !== 'string';

  return (
    <div className="min-h-screen bg-white dark:bg-dark overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <AuroraBackground />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 backdrop-blur-sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-semibold tracking-wide text-sm uppercase">{data.title}</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-[1.1]">
                {data.heroTitle}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-gray-300 mb-10 leading-relaxed max-w-xl">
                {data.heroDescription}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
                >
                  Teklif Al
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button
                  onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-8 py-4 bg-white dark:bg-white/5 text-slate-700 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Detayları İncele
                </button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/20 dark:border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />
                {data.heroImage ? (
                  <img 
                    src={data.heroImage} 
                    alt={data.title} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <Layers className="w-20 h-20 text-slate-300 dark:text-white/20" />
                  </div>
                )}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section (Top Cards) */}
      <section id="benefits" className="py-20 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className={`grid md:grid-cols-2 ${isRichBenefits ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-6`}
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            {data.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-white/50 dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                {typeof benefit === 'string' ? (
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{benefit}</h3>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Business Benefits Section */}
      {data.businessBenefits && (
        <section className="py-24 bg-slate-50/50 dark:bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Bu Hizmet İşinize Nasıl Fayda Sağlar?</h2>
              <p className="text-lg text-slate-600 dark:text-gray-400">İşinizi büyüten somut kazanımlar ve ölçülebilir değerler.</p>
            </div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={stagger.viewport}
            >
              {data.businessBenefits.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white dark:bg-dark p-8 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Sector Scenarios Section */}
      {data.sectorScenarios && (
        <section className="py-24 relative">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Sektörel Çözümler</h2>
                <p className="text-lg text-slate-600 dark:text-gray-400">Her sektörün dinamiklerine uygun, özelleştirilmiş yaklaşımlar geliştiriyoruz.</p>
              </div>
            </div>

            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={stagger.viewport}
            >
              {data.sectorScenarios.map((scenario, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group flex gap-6 bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-primary/20 transition-all"
                >
                  <div className="shrink-0">
                    <div className="w-14 h-14 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{scenario.title}</h3>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{scenario.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Sub Services Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Hizmet Detayları</h2>
            <p className="text-xl text-slate-300">Kapsamlı çözümlerimizle yanınızdayız</p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            {data.subServices.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Çalışma Sürecimiz</h2>
            <p className="text-lg text-slate-600 dark:text-gray-400">Adım adım başarıya giden yol</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={stagger.viewport}
            >
              {data.process.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative pt-8 lg:pt-0"
                >
                  <div className="hidden lg:flex absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-white dark:bg-dark items-center justify-center rounded-full border-4 border-slate-50 dark:border-dark-light z-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="lg:mt-32 bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 text-center hover:border-primary/30 transition-all h-full">
                    <div className="lg:hidden w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary mx-auto mb-6">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      {data.technologies && data.technologies.length > 0 && (
        <section className="py-20 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">Kullandığımız Teknolojiler</h2>
            </div>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={stagger.viewport}
            >
              {data.technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="px-6 py-3 bg-white dark:bg-dark rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium shadow-sm hover:border-primary/50 hover:text-primary hover:shadow-md transition-all cursor-default"
                >
                  {tech}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Sıkça Sorulan Sorular</h2>
            <p className="text-lg text-slate-600 dark:text-gray-400">Aklınıza takılanları cevapladık</p>
          </div>

          <div className="space-y-4">
            {data.faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">{item.question}</h3>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-primary to-blue-600 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-primary/30"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-[1px]" />
            
            {/* Animated Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white tracking-tight">
                Projenizi Hayata Geçirelim
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-12 font-light">
                {data.title} hizmetimizle ilgili detaylı bilgi ve size özel teklifimiz için hemen iletişime geçin.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-xl"
              >
                Teklif Alın
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailLayout;
