import { useState, useCallback, memo } from "react";
import { 
  ChevronDown, 
  Briefcase, 
  Code2, 
  MessageCircleQuestion,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const employerFaqs = [
  { qKey: "home.faq.employer.q1", aKey: "home.faq.employer.a1" },
  { qKey: "home.faq.employer.q2", aKey: "home.faq.employer.a2" },
  { qKey: "home.faq.employer.q3", aKey: "home.faq.employer.a3" },
  { qKey: "home.faq.employer.q4", aKey: "home.faq.employer.a4" },
  { qKey: "home.faq.employer.q5", aKey: "home.faq.employer.a5" },
];

const freelancerFaqs = [
  { qKey: "home.faq.freelancer.q1", aKey: "home.faq.freelancer.a1" },
  { qKey: "home.faq.freelancer.q2", aKey: "home.faq.freelancer.a2" },
  { qKey: "home.faq.freelancer.q3", aKey: "home.faq.freelancer.a3" },
  { qKey: "home.faq.freelancer.q4", aKey: "home.faq.freelancer.a4" },
  { qKey: "home.faq.freelancer.q5", aKey: "home.faq.freelancer.a5" },
];

// Memoized FAQ Item for better performance
const FaqItem = memo(({
  faq,
  index,
  isOpen,
  onToggle,
  t,
}: {
  faq: { qKey: string; aKey: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  t: (key: string) => string;
}) => {
  return (
    <div className="group">
      <button
        onClick={onToggle}
        className={cn(
          "w-full text-left rounded-2xl border overflow-hidden",
          isOpen
            ? "bg-white dark:bg-white/5 border-primary/30 shadow-sm"
            : "bg-white/80 dark:bg-white/5 border-slate-200/60 dark:border-white/10"
        )}
      >
        {/* Question Header */}
        <div className="p-5 md:p-6 flex items-center gap-4">
          {/* Number Badge */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
            isOpen
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
          )}>
            {String(index + 1).padStart(2, '0')}
          </div>
          
          {/* Question Text */}
          <h4 className={cn(
            "flex-1 font-semibold text-base md:text-lg",
            isOpen
              ? "text-slate-900 dark:text-white"
              : "text-slate-700 dark:text-slate-200"
          )}>
            {t(faq.qKey)}
          </h4>
          
          {/* Toggle Icon - No animation */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            isOpen
              ? "bg-primary/10 text-primary"
              : "bg-slate-100 dark:bg-white/10 text-slate-400"
          )}>
            <ChevronDown className={cn("w-5 h-5", isOpen && "rotate-180")} />
          </div>
        </div>
        
        {/* Answer - Simple show/hide for better mobile performance */}
        {isOpen && (
          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 pl-[4.5rem] md:pl-[5rem]">
            <p className="text-[15px] md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t(faq.aKey)}
            </p>
          </div>
        )}
      </button>
    </div>
  );
});

FaqItem.displayName = 'FaqItem';

export function FaqSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"employer" | "freelancer">("employer");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentFaqs = activeTab === "employer" ? employerFaqs : freelancerFaqs;
  const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
  const contactPath = currentLang === 'tr' ? '/tr/iletisim' : '/en/contact';

  const handleTabChange = useCallback((tab: "employer" | "freelancer") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setOpenIndex(0);
    }
  }, [activeTab]);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <section id="sss" className="py-12 md:py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            {currentLang === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ'}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            {t("home.faq.title")}
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("home.faq.description")}
          </p>
        </div>

        {/* Tabs - Simple Design for Performance */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl inline-flex gap-1 shadow-inner">
            <button
              onClick={() => handleTabChange("employer")}
              className={cn(
                "flex items-center gap-2.5 px-5 md:px-8 py-3 md:py-3.5 rounded-xl text-sm md:text-base font-semibold min-h-[44px]",
                activeTab === "employer" 
                  ? "bg-white dark:bg-primary text-primary dark:text-white shadow-md" 
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
              <span>{t("home.faq.employers.title")}</span>
            </button>

            <button
              onClick={() => handleTabChange("freelancer")}
              className={cn(
                "flex items-center gap-2.5 px-5 md:px-8 py-3 md:py-3.5 rounded-xl text-sm md:text-base font-semibold min-h-[44px]",
                activeTab === "freelancer" 
                  ? "bg-white dark:bg-primary text-primary dark:text-white shadow-md" 
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              <Code2 className="w-4 h-4 md:w-5 md:h-5" />
              <span>{t("home.faq.freelancers.title")}</span>
            </button>
          </div>
        </div>

        {/* FAQ List - No AnimatePresence for better performance */}
        <div 
          key={activeTab} 
          className="space-y-3 md:space-y-4"
        >
          {currentFaqs.map((faq, i) => (
            <FaqItem
              key={`${activeTab}-${i}`}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
              t={t}
            />
          ))}
        </div>

        {/* Bottom CTA - Clean Design */}
        <div className="mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircleQuestion className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="text-center md:text-left flex-1">
                <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {currentLang === 'tr' ? 'Aradığınız cevabı bulamadınız mı?' : "Couldn't find your answer?"}
                </p>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                  {currentLang === 'tr' ? 'Ekibimiz size yardımcı olmaktan mutluluk duyacaktır.' : 'Our team will be happy to help you.'}
                </p>
              </div>
              <Link to={contactPath}>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white gap-2 text-base font-semibold px-6 shadow-lg shadow-primary/20 min-h-[48px]"
                >
                  {currentLang === 'tr' ? 'Bize Ulaşın' : 'Contact Us'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
