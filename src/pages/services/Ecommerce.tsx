import React from 'react';
import ServiceDetailLayout from '../../components/layout/ServiceDetailLayout';

const Ecommerce = () => {
  const data = {
    title: "E-Ticaret",
    heroTitle: "Satışlarınızı Katlayan Akıllı E-Ticaret Çözümleri",
    heroDescription: "Sadece bir online mağaza değil, 7/24 çalışan bir satış makinesi inşa ediyoruz. Kullanıcı deneyimi odaklı, hızlı, güvenli ve dönüşüm oranı yüksek e-ticaret altyapılarıyla işinizi global pazara taşıyoruz.",
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      {
        title: "Yüksek Dönüşüm Oranları",
        description: "Kullanıcı psikolojisine uygun tasarımlarla ziyaretçileri müşteriye dönüştürün."
      },
      {
        title: "Gelişmiş Stok Yönetimi",
        description: "Tüm ürünlerinizi, varyasyonlarını ve stok durumlarını tek panelden kolayca yönetin."
      },
      {
        title: "Pazaryeri Entegrasyonları",
        description: "Trendyol, Hepsiburada, Amazon gibi platformlarla tam entegre çalışarak satış kanallarınızı birleştirin."
      },
      {
        title: "Güvenli Ödeme Altyapısı",
        description: "Müşterilerinize güven veren, tüm banka ve ödeme kuruluşlarıyla uyumlu ödeme sistemleri."
      }
    ],
    businessBenefits: [
      {
        title: "7/24 Satış İmkanı",
        description: "Mağazanız hiç kapanmaz, uyurken bile satış yapmaya devam edersiniz."
      },
      {
        title: "Düşük Operasyonel Maliyet",
        description: "Fiziksel mağaza giderleri olmadan, daha düşük maliyetle daha geniş kitlelere ulaşırsınız."
      },
      {
        title: "Veri Odaklı Büyüme",
        description: "Müşteri davranışlarını analiz ederek, en çok satan ürünleri ve doğru pazarlama stratejilerini belirlersiniz."
      }
    ],
    sectorScenarios: [
      {
        title: "Moda & Giyim",
        description: "Beden tabloları, renk seçenekleri ve kombin önerileriyle zenginleştirilmiş ürün sayfaları."
      },
      {
        title: "Elektronik",
        description: "Detaylı teknik özellik filtreleri ve karşılaştırma modülleriyle müşterinin doğru ürünü bulmasını kolaylaştırma."
      },
      {
        title: "Gıda & Market",
        description: "Hızlı sipariş, tekrarla (abonelik) satın alma ve teslimat saati seçimi gibi özelliklerle pratik alışveriş."
      },
      {
        title: "B2B Toptan Satış",
        description: "Bayilere özel fiyatlar, toplu sipariş formları ve cari hesap yönetimi sunan kapalı devre sistemler."
      }
    ],
    subServices: [
      {
        title: "Özel E-Ticaret Yazılımı",
        description: "İş modelinize tam uyum sağlayan, ölçeklenebilir ve size özel geliştirilmiş e-ticaret platformları."
      },
      {
        title: "Hazır Altyapı Kurulumu",
        description: "Shopify, WooCommerce veya Ticimax gibi popüler altyapıların profesyonel kurulumu, tema özelleştirmesi ve optimizasyonu."
      },
      {
        title: "B2B E-Ticaret Çözümleri",
        description: "Bayileriniz için özel fiyatlandırma, toplu sipariş ve cari hesap yönetimi sunan toptan satış portalları."
      },
      {
        title: "Dönüşüm Optimizasyonu (CRO)",
        description: "Ziyaretçilerinizi müşteriye dönüştürmek için sepet terk oranlarını düşüren ve satın alma sürecini kolaylaştıran iyileştirmeler."
      }
    ],
    process: [
      {
        title: "Analiz ve Strateji",
        description: "Hedef kitlenizi, ürün gamınızı ve rakiplerinizi analiz ederek en doğru altyapı ve satış stratejisini belirliyoruz."
      },
      {
        title: "Tasarım ve UX",
        description: "Satın alma psikolojisine uygun, güven veren ve kullanımı kolay arayüz tasarımları hazırlıyoruz."
      },
      {
        title: "Geliştirme ve Entegrasyon",
        description: "Ödeme sistemleri, kargo entegrasyonları ve ERP bağlantılarını yaparak sistemi satışa hazır hale getiriyoruz."
      },
      {
        title: "Test ve Lansman",
        description: "Tüm satın alma senaryolarını test ediyor, güvenlik kontrollerini yapıyor ve mağazanızı açıyoruz."
      }
    ],
    technologies: [
      "Shopify", "WooCommerce", "Magento", "Opencart", "React", "Next.js", "Node.js", "Stripe", "Iyzico"
    ],
    faq: [
      {
        question: "Hangi e-ticaret altyapısını seçmeliyim?",
        answer: "Bu tamamen ürün sayınız, bütçeniz ve teknik ihtiyaçlarınıza bağlıdır. Küçük ve orta ölçekli işler için Shopify veya WooCommerce, büyük ve özel ihtiyaçlar için özel yazılım öneriyoruz."
      },
      {
        question: "Pazaryerleri ile entegrasyon mümkün mü?",
        answer: "Evet, geliştirdiğimiz sistemler Trendyol, Hepsiburada, Amazon ve N11 gibi pazaryerleri ile tam entegre çalışarak stok ve fiyatları tek panelden yönetmenizi sağlar."
      },
      {
        question: "Sitem ne kadar güvenli olacak?",
        answer: "Tüm e-ticaret projelerimizde SSL sertifikası, güvenli ödeme altyapıları ve düzenli yedekleme sistemleri standart olarak sunulmaktadır."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default Ecommerce;
