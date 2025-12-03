import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  GraduationCap,
  Zap,
  Check,
  ArrowRight,
  Tag,
  Clock
} from 'lucide-react';
import AuroraBackground from '../components/ui/effects/aurora-background';
import { GlitchyText } from "../components/ui/glitchy-text";

interface TabItem {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  status: 'active' | 'coming-soon';
}

const Universities = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabItems: TabItem[] = [
    {
      id: 1,
      title: 'İş & Gelir',
      description: 'Gerçek müşteri projelerinde yer alarak profesyonel deneyim kazan ve gelir elde etmeye hemen başla.',
      icon: Briefcase,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      borderColor: 'border-green-600 dark:border-green-400',
      status: 'active'
    },
    {
      id: 2,
      title: 'Kulüpler',
      description: 'Kampüsündeki Freelancer Merkezleri ve kulüplerde sosyalleş, takım arkadaşları bul ve networkünü genişlet.',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      borderColor: 'border-purple-600 dark:border-purple-400',
      status: 'coming-soon'
    },
    {
      id: 3,
      title: 'Ayrıcalıklar',
      description: 'En sevdiğin markalarda ve teknoloji ürünlerinde üniversitelilere özel indirimlerin tadını çıkar.',
      icon: Tag,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
      borderColor: 'border-pink-600 dark:border-pink-400',
      status: 'coming-soon'
    },
    {
      id: 4,
      title: 'Kariyer',
      description: 'Sektör liderlerinden eğitimler al ve partner şirketlerimizde staj yaparak kariyerine 1-0 önde başla.',
      icon: GraduationCap,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-600 dark:border-yellow-400',
      status: 'coming-soon'
    }
  ];

  const activeItem = tabItems[activeTab];

  return (
    <div className="relative min-h-screen font-sans">
      {/* Background from Home.tsx */}
      <div className="fixed inset-0 z-0" style={{ contain: 'strict' }}>
        <AuroraBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/20 to-blue-100/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'linear-gradient(to right, #5FC8DA10 1px, transparent 1px), linear-gradient(to bottom, #5FC8DA10 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse at center, transparent 10%, black 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 10%, black 80%)',
          }}
        />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between min-h-screen py-12 lg:py-0">
          
          {/* Left Content */}
          <div className="flex-1 relative z-20 pt-10 lg:pt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mb-6 shadow-sm"
            >
              <Zap className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
              <span className="font-bold tracking-wide text-xs">YENİ NESİL EKOSİSTEM</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Üniversiteli <br />
              </h1>
              <div className="h-[1.1em]">
                 <GlitchyText text="Ekosistemi" fontSize={60} className="origin-left scale-75 sm:scale-100 -ml-[10%] sm:ml-0" />
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md leading-relaxed font-medium"
            >
              Sadece bir çalışma platformu değil; deneyim kazandığın, sosyalleştiğin ve kariyerini inşa ettiğin dev bir kampüs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/tr/basvuru"
                className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
              >
                <Zap className="w-5 h-5 mr-2 fill-current" />
                Aramıza Katıl
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Modern Glass Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end relative z-10"
          >
            <div className="relative w-[400px] h-[540px] bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl p-4 flex flex-col">
              
              {/* Screen Area */}
              <div className="flex-1 bg-slate-50/50 dark:bg-black/20 rounded-[28px] border border-white/10 relative overflow-hidden flex flex-col">
                
                {/* Center Icons */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 mb-12">
                    {tabItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = index === activeTab;
                      
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => setActiveTab(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
                            ${isActive 
                              ? `${item.bgColor} ${item.borderColor} shadow-lg -translate-y-1` 
                              : 'bg-white/50 dark:bg-white/5 border-transparent hover:bg-white/80 dark:hover:bg-white/10'}
                          `}
                        >
                          <Icon 
                            className={`w-8 h-8 ${isActive ? item.color : 'text-slate-400 dark:text-slate-500'}`} 
                            strokeWidth={2.5}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Active Content Preview */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center max-w-xs"
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        {activeItem.status === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"/>
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <Clock className="w-3 h-3 mr-1.5"/>
                            Çok Yakında
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                        {activeItem.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">
                        {activeItem.description}
                      </p>
                      
                      <div className="mt-6">
                        <Link to="/tr/basvuru" className="text-primary font-bold text-sm hover:underline inline-flex items-center">
                          {activeItem.status === 'active' ? 'Hemen Başla' : 'Haberdar Ol'} <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* Bottom Dots */}
              <div className="h-12 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20"></div>
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20"></div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Universities;
