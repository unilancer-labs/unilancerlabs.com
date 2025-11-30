import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import {
  Code2, Database, Globe, Palette, PenTool, Layout,
  LineChart, Search, TrendingUp, Smartphone, Cpu,
  MessageSquare, BarChart2, Layers, Zap, Box,
  PaintBucket, FileImage, Image, Figma, Monitor,
  Briefcase, Target, Users, BrainCircuit, ArrowUpRight,
  CheckCircle
} from 'lucide-react';
import { ServiceCarousel, type Service } from '../components/ui/core/services-card';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.2 }
};

const ServiceCard = ({ icon: Icon, title, items }: { 
  icon: React.ElementType;
  title: string;
  items: string[];
}) => (
  <motion.div 
    variants={fadeInUp}
    className="bg-white dark:bg-dark-light/50 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/20 transition-all group shadow-sm"
  >
    <Icon className="h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600 dark:text-gray-400 flex items-start space-x-2">
          <CheckCircle className="w-4 h-4 text-primary/70 shrink-0 mt-1" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ImageSection = ({ image, title, description }: {
  image: string;
  title: string;
  description: string;
}) => (
  <motion.div
    variants={fadeInUp}
    className="relative aspect-[4/3] rounded-xl overflow-hidden group"
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent dark:from-dark/90 dark:via-dark/50 dark:to-transparent flex items-end">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-200 dark:text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Services = () => {
  const { t } = useTranslation();

  const featuredServices: Service[] = [
    {
      number: "001",
      title: t('services.featured.web.title', 'Web Tasarım'),
      description: t('services.featured.web.desc', 'Modern ve responsive web siteleri, e-ticaret platformları ve web uygulamaları geliştiriyoruz.'),
      icon: Code2,
      gradient: "from-blue-100 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-800/50",
      slug: "web-tasarim"
    },
    {
      number: "002",
      title: t('services.featured.3d.title', '3D & AR'),
      description: t('services.featured.3d.desc', 'Ürünlerinizi ve projelerinizi 3D modelleme ve Artırılmış Gerçeklik ile etkileyici bir deneyime dönüştürün.'),
      icon: Box,
      gradient: "from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-800/50",
      slug: "3d-ar"
    },
    {
      number: "003",
      title: t('services.featured.ecommerce.title', 'E-Ticaret'),
      description: t('services.featured.ecommerce.desc', 'Satışlarınızı artıran, güvenli ve yönetimi kolay e-ticaret altyapıları kuruyoruz.'),
      icon: Globe,
      gradient: "from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50",
      slug: "e-ticaret-cozumleri"
    },
    {
      number: "004",
      title: t('services.featured.marketing.title', 'Pazarlama & Reklam'),
      description: t('services.featured.marketing.desc', 'Veri odaklı dijital pazarlama stratejileri ile markanızın bilinirliğini ve satışlarını artırın.'),
      icon: Search,
      gradient: "from-orange-100 to-red-200 dark:from-orange-900/50 dark:to-red-800/50",
      slug: "pazarlama-reklam"
    },
    {
      number: "005",
      title: t('services.featured.ai.title', 'Yapay Zeka - Digibot'),
      description: t('services.featured.ai.desc', 'İş süreçlerinizi yapay zeka ve akıllı chatbot çözümleri ile otomatize edin.'),
      icon: BrainCircuit,
      gradient: "from-violet-100 to-fuchsia-200 dark:from-violet-900/50 dark:to-fuchsia-800/50",
      slug: "yapay-zeka-digibot"
    },
    {
      number: "006",
      title: t('services.featured.software.title', 'Yazılım Geliştirme'),
      description: t('services.featured.software.desc', 'İhtiyacınıza özel, güvenli ve ölçeklenebilir web ve mobil yazılım çözümleri.'),
      icon: Smartphone,
      gradient: "from-blue-100 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-800/50",
      slug: "yazilim-gelistirme"
    },
    {
      number: "007",
      title: t('services.featured.branding.title', 'Kurumsal Kimlik'),
      description: t('services.featured.branding.desc', 'Markanızın değerlerini yansıtan, akılda kalıcı ve profesyonel bir kurumsal kimlik oluşturuyoruz.'),
      icon: Figma,
      gradient: "from-pink-100 to-rose-200 dark:from-pink-900/50 dark:to-rose-800/50",
      slug: "kurumsal-kimlik-marka"
    },
    {
      number: "008",
      title: t('services.featured.graphic.title', 'Grafik Tasarım'),
      description: t('services.featured.graphic.desc', 'Sosyal medya ve basılı materyaller için yaratıcı grafik tasarım hizmetleri.'),
      icon: Palette,
      gradient: "from-yellow-100 to-orange-200 dark:from-yellow-900/50 dark:to-orange-800/50",
      slug: "grafik-tasarim"
    },
  ];

  return (
    <div className="pt-24 pb-16 bg-white dark:bg-dark">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
            alt="Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-dark/90 dark:via-dark/70 dark:to-dark" />
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary-light/20 text-primary mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span>{t('services.hero.badge', 'Modern Çözümler')}</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              {t('services.hero.title', 'DigitAll')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('services.hero.subtitle', 'İşletmenizi dijital dünyada öne çıkaracak kapsamlı çözümler sunuyoruz')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Services Carousel */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-dark-light dark:to-dark">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">
              {t('services.featured.heading', 'Hizmetlerimiz.')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
              {t('services.featured.subheading', 'İşletmenizi dijital dünyada öne çıkaracak kapsamlı çözümlerimizi keşfedin')}
            </p>
          </motion.div>
        </div>
        <ServiceCarousel services={featuredServices} />
      </section>

      {/* Design Services */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">{t('services.design.title', 'Tasarım')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('services.design.subtitle', 'Modern ve kullanıcı odaklı tasarım çözümleri ile markanızı öne çıkarın')}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            <ServiceCard
              icon={Monitor}
              title={t('services.design.digital.title', 'Dijital & Web Tasarım')}
              items={[
                t('services.design.digital.item1', 'Web & Mobil Uygulama Tasarımı'),
                t('services.design.digital.item2', 'UI & UX Tasarımı'),
                t('services.design.digital.item3', 'E-Ticaret ve Satış Sayfası Tasarımları')
              ]}
            />

            <ServiceCard
              icon={PaintBucket}
              title={t('services.design.corporate.title', 'Kurumsal Kimlik & Marka')}
              items={[
                t('services.design.corporate.item1', 'Logo ve Kurumsal Kimlik Oluşturma'),
                t('services.design.corporate.item2', 'Marka Konsept Tasarımı'),
                t('services.design.corporate.item3', 'Reklam ve Promosyon Tasarımları')
              ]}
            />

            <ServiceCard
              icon={FileImage}
              title={t('services.design.print.title', 'Basılı & Grafik Tasarım')}
              items={[
                t('services.design.print.item1', 'Katalog ve Broşür Tasarımı'),
                t('services.design.print.item2', 'Ambalaj ve Etiket Tasarımı'),
                t('services.design.print.item3', 'Poster ve Afiş Tasarımı')
              ]}
            />

            <ServiceCard
              icon={Figma}
              title={t('services.design.illustration.title', 'İllüstrasyon & Özel Grafik')}
              items={[
                t('services.design.illustration.item1', 'Dijital Çizim & Karakter Tasarımı'),
                t('services.design.illustration.item2', '3D Modelleme & Render Tasarım'),
                t('services.design.illustration.item3', 'Özel Grafik Çözümleri')
              ]}
            />
          </motion.div>

          {/* Design Examples */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            <ImageSection
              image="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
              title={t('services.design.example1.title', 'UI/UX Tasarım')}
              description={t('services.design.example1.description', 'Kullanıcı deneyimini ön planda tutan, modern ve etkileyici arayüz tasarımları')}
            />
            <ImageSection
              image="https://images.unsplash.com/photo-1613909207039-6b173b755cc1?auto=format&fit=crop&q=80&w=800"
              title={t('services.design.example2.title', 'Marka Kimliği')}
              description={t('services.design.example2.description', 'Markanızı yansıtan özgün ve profesyonel kurumsal kimlik tasarımları')}
            />
            <ImageSection
              image="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800"
              title={t('services.design.example3.title', '3D Tasarım')}
              description={t('services.design.example3.description', 'Etkileyici 3D modelleme ve görselleştirme çözümleri')}
            />
          </motion.div>
        </div>
      </section>

      {/* Software Development */}
      <section className="py-20 bg-blue-50/50 dark:bg-dark-light/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">{t('services.software.title', 'Yazılım')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('services.software.subtitle', 'Modern teknolojiler ve en iyi pratiklerle özel yazılım çözümleri')}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            <ServiceCard
              icon={Globe}
              title={t('services.software.web.title', 'Web Geliştirme')}
              items={[
                t('services.software.web.item1', 'Statik Kurumsal Web Siteleri'),
                t('services.software.web.item2', 'Dinamik ve Fonksiyonel Web Siteleri'),
                t('services.software.web.item3', 'E-Ticaret Web Siteleri'),
                t('services.software.web.item4', 'Özel Web Çözümleri')
              ]}
            />

            <ServiceCard
              icon={Smartphone}
              title={t('services.software.mobile.title', 'Mobil Uygulama')}
              items={[
                t('services.software.mobile.item1', 'Kurumsal Mobil Uygulamalar'),
                t('services.software.mobile.item2', 'Saha Operasyonları Uygulamaları'),
                t('services.software.mobile.item3', 'Müşteri Servisi Uygulamaları')
              ]}
            />

            <ServiceCard
              icon={Database}
              title={t('services.software.saas.title', 'S.a.a.S Çözümleri')}
              items={[
                t('services.software.saas.item1', 'Yönetim ve CRM Sistemleri'),
                t('services.software.saas.item2', 'Proje ve Görev Yönetim Araçları'),
                t('services.software.saas.item3', 'Özel İş Süreçleri Yazılımları')
              ]}
            />

            <ServiceCard
              icon={BrainCircuit}
              title={t('services.software.ai.title', 'AI Entegrasyonları')}
              items={[
                t('services.software.ai.item1', 'Yapay Zeka Chatbot Sistemleri'),
                t('services.software.ai.item2', 'Robotik Süreç Otomasyonu (RPA)'),
                t('services.software.ai.item3', 'AI Destekli İş Süreçleri')
              ]}
            />
          </motion.div>

          {/* Software Examples */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-16"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            <ImageSection
              image="https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800"
              title={t('services.software.example1.title', 'Web Uygulamaları')}
              description={t('services.software.example1.desc', 'Modern teknolojilerle geliştirilmiş, ölçeklenebilir web uygulamaları')}
            />
            <ImageSection
              image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
              title={t('services.software.example2.title', 'Mobil Uygulamalar')}
              description={t('services.software.example2.desc', 'iOS ve Android için native mobil uygulama geliştirme')}
            />
            <ImageSection
              image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
              title={t('services.software.example3.title', 'AI Çözümleri')}
              description={t('services.software.example3.desc', 'Yapay zeka ve makine öğrenmesi destekli akıllı sistemler')}
            />
          </motion.div>
        </div>
      </section>

      {/* Digital Marketing */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">{t('services.marketing.title', 'Dijital Pazarlama ve Strateji')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('services.marketing.subtitle', 'Markanızı dijital dünyada güçlendiren stratejik çözümler')}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            <ServiceCard
              icon={Search}
              title={t('services.marketing.seo.title', 'SEO ve Dijital Reklam Yönetimi')}
              items={[
                t('services.marketing.seo.item1', 'Arama Motoru Optimizasyonu (SEO)'),
                t('services.marketing.seo.item2', 'Google Ads, Facebook Ads, Instagram ve LinkedIn Reklamları'),
                t('services.marketing.seo.item3', 'Remarketing ve Hedef Kitle Optimizasyonu'),
                t('services.marketing.seo.item4', 'Sosyal Medya Yönetimi')
              ]}
            />

            <ServiceCard
              icon={Target}
              title={t('services.marketing.strategy.title', 'Pazar Araştırması & Marka Stratejisi')}
              items={[
                t('services.marketing.strategy.item1', 'Sektör ve Rakip Analizi'),
                t('services.marketing.strategy.item2', 'Stratejik Proje Geliştirme'),
                t('services.marketing.strategy.item3', 'Hedef Kitleye Yönelik İçerik Çalışmaları'),
                t('services.marketing.strategy.item4', 'Marka Danışmanlık Hizmetleri')
              ]}
            />
          </motion.div>

          {/* Marketing Examples */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 mt-16"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={stagger.viewport}
          >
            <ImageSection
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              title={t('services.marketing.example1.title', 'Dijital Pazarlama')}
              description={t('services.marketing.example1.desc', 'Veriye dayalı dijital pazarlama stratejileri ve kampanya yönetimi')}
            />
            <ImageSection
              image="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800"
              title={t('services.marketing.example2.title', 'Marka Stratejisi')}
              description={t('services.marketing.example2.desc', 'Markanızı güçlendiren kapsamlı stratejik planlama ve danışmanlık')}
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50/50 dark:bg-dark-light/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-dark-light/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
            </div>
            
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                {t('services.cta.title', 'Projenizi Hayata Geçirmeye Hazır mısınız?')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {t('services.cta.subtitle', 'Size özel çözümler için hemen iletişime geçin')}
              </p>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg font-medium group"
              >
                <span>{t('services.cta.button', 'Teklif Alın')}</span>
                <ArrowUpRight className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;