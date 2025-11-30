import React from 'react';
import ServiceDetailLayout from '../../components/layout/ServiceDetailLayout';

const SoftwareDevelopment = () => {
  const data = {
    title: "Yazılım Geliştirme",
    heroTitle: "İşinize Özel, Ölçeklenebilir Yazılım Çözümleri",
    heroDescription: "Hazır paketlerin sınırlarına takılmayın. İş süreçlerinize tam uyum sağlayan, güvenli ve yüksek performanslı özel yazılımlarla dijital dönüşümünüzü tamamlayın.",
    heroImage: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      {
        title: "Tam Uyum",
        description: "İş akışlarınıza %100 uyum sağlayan, gereksiz özelliklerden arındırılmış size özel çözümler."
      },
      {
        title: "Yüksek Güvenlik",
        description: "Verilerinizin güvenliği için en güncel şifreleme ve koruma standartlarına uygun mimari."
      },
      {
        title: "Ölçeklenebilirlik",
        description: "İşiniz büyüdükçe sizinle birlikte büyüyebilen, performanstan ödün vermeyen altyapı."
      },
      {
        title: "Entegrasyon Kolaylığı",
        description: "Mevcut sistemlerinizle (Muhasebe, ERP, CRM) sorunsuz konuşan entegre yapılar."
      }
    ],
    businessBenefits: [
      {
        title: "Operasyonel Verimlilik",
        description: "Manuel süreçleri dijitalleştirerek hata oranını azaltın ve işlerinizi hızlandırın."
      },
      {
        title: "Veriye Dayalı Kararlar",
        description: "Özel raporlama panelleri ile işletmenizin tüm verilerini anlık izleyin ve doğru kararlar alın."
      },
      {
        title: "Rekabet Üstünlüğü",
        description: "Sektörünüze özel geliştirdiğimiz inovatif özelliklerle rakiplerinizden ayrışın."
      }
    ],
    sectorScenarios: [
      {
        title: "Finans ve Bankacılık",
        description: "Güvenli ödeme sistemleri, kredi skorlama algoritmaları ve mobil bankacılık uygulamaları."
      },
      {
        title: "Lojistik",
        description: "Araç takip sistemleri, rota optimizasyonu ve depo yönetim yazılımları."
      },
      {
        title: "Üretim",
        description: "Üretim takip sistemleri (MES), stok yönetimi ve kalite kontrol otomasyonları."
      },
      {
        title: "Eğitim",
        description: "Uzaktan eğitim platformları (LMS), öğrenci bilgi sistemleri ve sınav modülleri."
      }
    ],
    subServices: [
      {
        title: "Web Uygulama Geliştirme",
        description: "Tarayıcı üzerinden çalışan, kurulum gerektirmeyen, hızlı ve modern web tabanlı iş yazılımları."
      },
      {
        title: "Mobil Uygulama Geliştirme",
        description: "iOS ve Android platformları için native veya cross-platform mobil uygulamalar."
      },
      {
        title: "Masaüstü Yazılımları",
        description: "Yüksek performans gerektiren işlemler için Windows, Mac veya Linux uyumlu masaüstü programları."
      },
      {
        title: "API ve Entegrasyon",
        description: "Farklı yazılımların birbiriyle konuşmasını sağlayan RESTful ve GraphQL API servisleri."
      }
    ],
    process: [
      {
        title: "Analiz ve Planlama",
        description: "İhtiyaçlarınızı dinliyor, teknik gereksinimleri belirliyor ve proje takvimini oluşturuyoruz."
      },
      {
        title: "Tasarım ve Mimari",
        description: "Veritabanı şemasını, yazılım mimarisini ve kullanıcı arayüzlerini (UI/UX) tasarlıyoruz."
      },
      {
        title: "Kodlama ve Geliştirme",
        description: "Agile metodolojisi ile yazılımı modüller halinde geliştiriyor ve düzenli olarak size sunuyoruz."
      },
      {
        title: "Test ve Teslimat",
        description: "Kapsamlı testlerden (Birim, Entegrasyon, UAT) geçen yazılımı sunucularınıza kuruyor ve eğitimi veriyoruz."
      }
    ],
    technologies: [
      ".NET Core", "Java Spring Boot", "Python Django", "Node.js", "React & Angular", "PostgreSQL", "Docker & Kubernetes"
    ],
    faq: [
      {
        question: "Yazılımın mülkiyeti kime ait oluyor?",
        answer: "Geliştirdiğimiz özel yazılımların tüm kaynak kodları ve fikri mülkiyet hakları, proje tesliminde size devredilir."
      },
      {
        question: "Proje sonrası destek veriyor musunuz?",
        answer: "Evet, proje tesliminden sonra bakım ve destek anlaşmaları ile yazılımınızın güncel ve sorunsuz kalmasını sağlıyoruz."
      },
      {
        question: "Hangi teknolojileri kullanıyorsunuz?",
        answer: "Projenin gereksinimlerine göre en uygun ve güncel teknolojileri seçiyoruz. Genellikle ölçeklenebilir ve popüler stack'leri tercih ediyoruz."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default SoftwareDevelopment;
