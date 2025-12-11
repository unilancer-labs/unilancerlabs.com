import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { memo } from 'react';

// Target Decoration
const TargetDecoration = memo(() => (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="text-slate-200 dark:text-slate-800">
        <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="25" stroke="currentColor" strokeWidth="1" />
    </svg>
));

// Spiral Arrow
const SpiralArrow = memo(() => (
    <svg width="300" height="150" viewBox="0 0 300 150" fill="none" className="text-slate-900 dark:text-white">
        <path 
            d="M50 100 C 50 100, 80 140, 130 120 C 170 100, 150 50, 110 60 C 80 70, 80 110, 110 120 C 150 140, 210 100, 250 80" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            fill="none"
        />
        <path 
            d="M240 75 L 250 80 L 242 88" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
));

const MemberCard = memo(({ member, index }: { member: { name: string; role: string; avatar: string; linkedin?: string; email?: string }; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group flex flex-col"
    >
        <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-sm">
            <img
                src={member.avatar}
                alt={member.name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                loading="lazy"
            />
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {member.email && (
                    <a 
                        href={`mailto:${member.email}`}
                        className="p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl text-slate-900 dark:text-white hover:scale-110 transition-transform shadow-lg"
                        title={member.email}
                    >
                        <Mail size={18} />
                    </a>
                )}
                {member.linkedin && (
                    <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl text-slate-900 dark:text-white hover:scale-110 transition-transform shadow-lg"
                    >
                        <Linkedin size={18} />
                    </a>
                )}
            </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
            {member.name}
        </h3>
        <p className="text-sm font-medium text-primary dark:text-primary/90">
            {member.role}
        </p>
    </motion.div>
));

export default function TeamSection({ limit }: { limit?: number }) {
    const { t, language } = useTranslation();

    const members = [
        // Co-Founders
        {
            name: 'Emrah Er',
            role: t('team.role.ceoCofounder', 'CEO & Kurucu Ortak'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/emrah-er.webp',
            linkedin: 'https://www.linkedin.com/in/emrah-er-550b52228/',
            email: 'emrah@unilancerlabs.com',
        },
        {
            name: 'Taha Karahüseyinoğlu',
            role: t('team.role.cooCofounder', 'COO & Kurucu Ortak'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/taha-karahuseyinoglu.webp',
            linkedin: 'https://www.linkedin.com/in/taha-karahüseyinoğlu-324924214/',
            email: 'taha@unilancerlabs.com',
        },
        {
            name: 'Koray Andırınlı',
            role: t('team.role.programManager', 'Program Yöneticisi & Kurucu Ortak'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/koray-andirinli.webp',
            linkedin: 'https://www.linkedin.com/in/koray-a-9aaa6822a/',
            email: 'koray@unilancerlabs.com',
        },
        {
            name: 'Selvinaz Deniz Koca',
            role: t('team.role.cmo', 'CMO'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/selvinaz-deniz-koca.webp',
            linkedin: 'https://www.linkedin.com/in/selvinaz-deniz-koca/',
            email: 'deniz@unilancerlabs.com',
        },
        // Team Members
        {
            name: 'Berna Kalyon',
            role: t('team.role.fashionGraphicDesigner', 'Moda ve Grafik Tasarımcı'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/berna-kalyon.webp',
            linkedin: 'https://www.linkedin.com/in/berna-kalyon-120bb6386/',
        },
        {
            name: 'Deniz Aytekin',
            role: t('team.role.contentCommunication', 'İçerik ve İletişim Uzmanı'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/deniz-aytekin.webp',
            linkedin: 'https://www.linkedin.com/in/deniz-aytekin-283469216/',
            email: 'denizaytekin@unilancerlabs.com',
        },
        {
            name: 'Dudunur Özdamar',
            role: t('team.role.businessDevelopment', 'İş Geliştirme Uzmanı'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/dudunur-ozdamar.webp',
            linkedin: 'https://www.linkedin.com/in/dudunur-özdamar-6348a122b/',
            email: 'dudu@unilancerlabs.com',
        },
        {
            name: 'Muhammed Berkhan Karlık',
            role: t('team.role.salesRepresentative', 'Satış Sorumlusu'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/muhammed-berkhan-karlik.webp',
            linkedin: 'https://www.linkedin.com/in/muhammed-berkhan-karlık-191079327/',
            email: 'berkhamkarlik@unilancerlabs.com',
        },
        {
            name: 'Muhammed Sergen Çetintürk',
            role: t('team.role.webDeveloper', 'Web Geliştirici'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/muhammed-sergen-cetinturk.webp',
            linkedin: 'https://www.linkedin.com/in/sergen-cetinturk-a774b136a/',
        },
        {
            name: 'Ömer Çetin',
            role: t('team.role.aiAutomationEngineer', 'Yapay Zeka ve Otomasyon Mühendisi'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/omer-cetin.webp',
            linkedin: 'https://www.linkedin.com/in/ömer-çetin-77a864240/',
            email: 'omercetin@unilancerlabs.com',
        },
        {
            name: 'Rabia Fidan',
            role: t('team.role.webDeveloper', 'Web Geliştirici'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/rabia-fidan.webp',
            linkedin: 'https://www.linkedin.com/in/rabia-fidan-695a3a275/',
            email: 'rabiafidan@unilancerlabs.com',
        },
        {
            name: 'Salih Cesur',
            role: t('team.role.webDeveloper', 'Web Geliştirici'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/salih-cesur.webp',
            linkedin: 'https://www.linkedin.com/in/salih-cesur-461a14332/',
            email: 'salihcesur@unilancerlabs.com',
        },
        {
            name: 'Tanya Polat',
            role: t('team.role.aiAutomationDeveloper', 'Yapay Zeka ve Otomasyon Geliştirici'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/tanya-polat.webp',
            linkedin: 'https://www.linkedin.com/in/tanya-polat-546a53321/',
            email: 'tanya@unilancerlabs.com',
        },
        {
            name: 'Yusuf Pehlivan',
            role: t('team.role.socialMediaSpecialist', 'Sosyal Medya Uzmanı'),
            avatar: 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/ekip/yusuf-pehlivan%20(1).webp',
            linkedin: 'https://www.linkedin.com/in/ypehlivan/',
            email: 'yusufpehlivan@unilancerlabs.com',
        },
    ];

    const displayedMembers = limit ? members.slice(0, limit) : members;

    return (
        <section className="py-4 md:py-8 relative overflow-hidden">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                {/* Header */}
                <motion.div 
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                        <span className="text-primary">Unilancer</span>{language === 'tr' ? "'a" : ''} {t('team.header', "yön veren insanları yakından tanıyın.")}
                    </h2>
                    {limit && (
                        <a 
                            href={language === 'tr' ? '/tr/ekibimiz' : '/en/team'}
                            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-xl transition-all duration-300 group"
                        >
                            <span>{t('team.viewAll', 'Tüm Ekibi Gör')}</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    )}
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {displayedMembers.map((member, index) => (
                        <MemberCard key={member.name} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
