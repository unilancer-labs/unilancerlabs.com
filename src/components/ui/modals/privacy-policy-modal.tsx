import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-dark-light/95 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white dark:bg-dark-light/95 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white">{t('privacy.title', 'Gizlilik Politikası')}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-76px)] space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('privacy.section1.title', '1. Veri Toplama ve Kullanım')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section1.content', 'Unilancer olarak, hizmetlerimizi sunmak ve geliştirmek için bazı kişisel verilerinizi topluyoruz. Bu veriler arasında isim, e-posta adresi, telefon numarası ve şirket bilgileri bulunabilir. Toplanan veriler, hizmet kalitemizi artırmak, iletişim kurmak ve yasal yükümlülüklerimizi yerine getirmek için kullanılmaktadır.')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('privacy.section2.title', '2. Veri Güvenliği')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section2.content', 'Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. SSL şifreleme, güvenli veri depolama ve düzenli güvenlik denetimleri bu önlemler arasındadır.')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('privacy.section3.title', '3. Çerezler ve İzleme')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section3.content', 'Web sitemizde çerezler ve benzer izleme teknolojileri kullanıyoruz. Bu teknolojiler, kullanıcı deneyimini iyileştirmek, site trafiğini analiz etmek ve hizmetlerimizi geliştirmek için kullanılmaktadır.')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('privacy.section4.title', '4. Veri Paylaşımı')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section4.content', 'Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Hizmet sağlayıcılarımızla paylaşılan veriler, gizlilik anlaşmaları kapsamında korunmaktadır.')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('privacy.section5.title', '5. Veri Saklama Süresi')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section5.content', 'Kişisel verileriniz, hizmet ilişkimiz devam ettiği sürece ve yasal saklama yükümlülüklerimiz kapsamında belirlenen süre boyunca saklanmaktadır.')}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('privacy.section6.title', '6. Haklarınız')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section6.intro', 'KVKK kapsamında aşağıdaki haklara sahipsiniz:')}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-300">
                <li>{t('privacy.rights.1', 'Kişisel verilerinizin işlenip işlenmediğini öğrenme')}</li>
                <li>{t('privacy.rights.2', 'Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme')}</li>
                <li>{t('privacy.rights.3', 'Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme')}</li>
                <li>{t('privacy.rights.4', 'Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme')}</li>
                <li>{t('privacy.rights.5', 'Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme')}</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('privacy.section7.title', '7. İletişim')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section7.content', 'Gizlilik politikamız hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:')} <a href="mailto:info@unilancerlabs.com" className="text-primary hover:text-primary-light">info@unilancerlabs.com</a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};