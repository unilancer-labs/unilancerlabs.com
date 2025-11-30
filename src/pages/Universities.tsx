import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Ticket, 
  Users, 
  Building2, 
  Rocket, 
  ArrowRight, 
  BrainCircuit,
  Zap
} from 'lucide-react';
import AuroraBackground from '../components/ui/effects/aurora-background';

const BentoCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay, 
  className = "",
  gradient = "from-primary/20 to-blue-500/20"
}: { 
  icon: any, 
  title: string, 
  description: string, 
  delay: number, 
  className?: string,
  gradient?: string 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-primary/30 transition-all group ${className}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    
    <div className="relative z-10">
      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-black/20">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>

    {/* Decorative Elements */}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
  </motion.div>
);

const Universities = () => {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <AuroraBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="flex-grow relative z-10 px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-24">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-light mb-8 backdrop-blur-md shadow-lg shadow-primary/5"
            >
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-semibold tracking-wide text-sm">ÇOK YAKINDA SİZLERLE</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight"
            >
              Geleceğin <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400">Kampüsü</span> <br />
              Burada İnşa Ediliyor
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Sadece bir iş platformu değil, kariyer yolculuğunda seni destekleyen dev bir ekosistem. Eğitimler, mentorluk ve gerçek deneyimler için yerini ayırt.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/tr/basvuru"
                className="inline-flex items-center px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] hover:-translate-y-1 group"
              >
                <Zap className="w-5 h-5 mr-2 text-primary fill-current" />
                Erken Erişim Listesine Katıl
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Bento Grid Features */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Large Card - Education & Mentorship */}
            <BentoCard 
              icon={GraduationCap}
              title="Eğitim ve Mentorluk"
              description="Sektörün önde gelen isimlerinden birebir mentorluk al, özel eğitimlerle yetkinliklerini geliştir ve kariyerine yön ver."
              delay={0.4}
              className="md:col-span-2 bg-gradient-to-br from-white/5 to-white/0"
              gradient="from-purple-500/20 to-blue-500/20"
            />

            <BentoCard 
              icon={BrainCircuit}
              title="Yapay Zeka Pilotluğu"
              description="Geleceğin mesleklerine bugünden hazırlan. AI araçlarını profesyonelce kullanmayı öğren."
              delay={0.5}
            />

            <BentoCard 
              icon={Users}
              title="Freelance Kulüpleri"
              description="Kampüsündeki freelancer merkezlerinde çalış, sosyalleş ve network kur."
              delay={0.6}
            />

            <BentoCard 
              icon={Rocket}
              title="Gerçek Deneyim"
              description="Teoride kalma. Gerçek müşteri projelerinde yer alarak portfolyonu büyüt."
              delay={0.7}
            />

            <BentoCard 
              icon={Ticket}
              title="Marka İndirimleri"
              description="En sevdiğin markalarda ve yazılımlarda üniversitelilere özel fırsatlar."
              delay={0.8}
            />
            
            {/* Wide Card - Internships */}
            <BentoCard 
              icon={Building2}
              title="Staj İmkanları"
              description="Partner şirketlerimizde staj yapma ve kariyerine 1-0 önde başlama şansı yakala."
              delay={0.9}
              className="md:col-span-3"
              gradient="from-primary/20 to-emerald-500/20"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Universities;
