import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Briefcase, 
  Code2, 
  Sparkles, 
  MessageCircleQuestion,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const getEmployerFaqs = () => [
  { qKey: "home.faq.employer.q1", aKey: "home.faq.employer.a1" },
  { qKey: "home.faq.employer.q2", aKey: "home.faq.employer.a2" },
  { qKey: "home.faq.employer.q3", aKey: "home.faq.employer.a3" },
  { qKey: "home.faq.employer.q4", aKey: "home.faq.employer.a4" },
  { qKey: "home.faq.employer.q5", aKey: "home.faq.employer.a5" },
];

const getFreelancerFaqs = () => [
  { qKey: "home.faq.freelancer.q1", aKey: "home.faq.freelancer.a1" },
  { qKey: "home.faq.freelancer.q2", aKey: "home.faq.freelancer.a2" },
  { qKey: "home.faq.freelancer.q3", aKey: "home.faq.freelancer.a3" },
  { qKey: "home.faq.freelancer.q4", aKey: "home.faq.freelancer.a4" },
  { qKey: "home.faq.freelancer.q5", aKey: "home.faq.freelancer.a5" },
];

const FaqItem = ({
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <div
        className={cn(
          "rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer",
          isOpen
            ? "bg-white dark:bg-white/5 border-primary/30 shadow-lg shadow-primary/5"
            : "bg-white/50 dark:bg-white/5 border-slate-200/70 dark:border-white/10 hover:border-primary/20 hover:bg-white/80 dark:hover:bg-white/10"
        )}
        onClick={onToggle}
      >
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4
              className={cn(
                "font-semibold text-base md:text-lg transition-colors duration-200",
                isOpen
                  ? "text-primary"
                  : "text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
              )}
            >
              {t(faq.qKey)}
            </h4>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
              isOpen
                ? "bg-primary text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-0">
                <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t(faq.aKey)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export function FaqSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"employer" | "freelancer">("employer");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const employerFaqs = getEmployerFaqs();
  const freelancerFaqs = getFreelancerFaqs();
  
  const currentFaqs = activeTab === "employer" ? employerFaqs : freelancerFaqs;

  const handleTabChange = (tab: "employer" | "freelancer") => {
    setActiveTab(tab);
    setOpenIndex(0); // Reset open item when switching tabs
  };

  return (
    <section id="sss" className="py-12 md:py-16 relative overflow-hidden">
      {/* Background Elements - Optimized for performance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              {t("home.faq.title")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t("home.faq.description")}
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl inline-flex relative">
            {/* Sliding Background */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-xl bg-white dark:bg-primary shadow-sm z-0"
              initial={false}
              animate={{
                left: activeTab === "employer" ? "6px" : "50%",
                width: "calc(50% - 6px)",
                x: activeTab === "employer" ? 0 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <button
              onClick={() => handleTabChange("employer")}
              className={cn(
                "relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-colors duration-200 min-w-[160px] justify-center",
                activeTab === "employer" 
                  ? "text-primary dark:text-white" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Briefcase className="w-4 h-4" />
              {t("home.faq.employers.title")}
            </button>

            <button
              onClick={() => handleTabChange("freelancer")}
              className={cn(
                "relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-colors duration-200 min-w-[160px] justify-center",
                activeTab === "freelancer" 
                  ? "text-primary dark:text-white" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Code2 className="w-4 h-4" />
              {t("home.faq.freelancers.title")}
            </button>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentFaqs.map((faq, i) => (
                <FaqItem
                  key={i}
                  faq={faq}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  t={t}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 max-w-4xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircleQuestion className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Aradığınız cevabı bulamadınız mı?
              </p>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
              </p>
            </div>
            <Button 
              size="lg"
              variant="ghost" 
              className="text-primary hover:text-primary hover:bg-primary/5 gap-2 text-base font-medium px-6"
              onClick={() => window.location.href = '/contact'}
            >
              Bize Ulaşın <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
