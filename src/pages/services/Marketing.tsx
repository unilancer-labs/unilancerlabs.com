import React from 'react';
import ServiceDetailLayout from '../../components/layout/ServiceDetailLayout';

const Marketing = () => {
  const data = {
    title: "Dijital Pazarlama",
    heroTitle: "Doğru Kitleye, Doğru Zamanda, Doğru Mesaj",
    heroDescription: "Markanızı dijital dünyada görünür kılıyor, potansiyel müşterilerinize ulaşıyor ve onları sadık müşterilere dönüştürüyoruz. Veri odaklı stratejilerle reklam bütçenizi en verimli şekilde yönetiyoruz.",
    heroImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      {
        title: "Ölçülebilir Sonuçlar",
        description: "Hangi reklamın ne kadar kazandırdığını net bir şekilde görün, bütçenizi boşa harcamayın."
      },
      {
        title: "Hedef Kitleye Erişim",
        description: "Yaş, konum, ilgi alanı gibi detaylı hedeflemelerle sadece potansiyel müşterilerinize ulaşın."
      },
      {
        title: "Marka Bilinirliği",
        description: "Sürekli görünür olarak markanızı akıllara kazıyın ve güven oluşturun."
      },
      {
        title: "Düşük Maliyetli Müşteri",
        description: "Geleneksel medyaya göre çok daha düşük maliyetlerle yeni müşteriler kazanın."
      }
    ],
    businessBenefits: [
      {
        title: "Yatırım Getirisi (ROI)",
        description: "Her harcadığınız 1 TL'nin size ne kadar ciro olarak döndüğünü hesaplayarak kârlılığınızı artırın."
      },
      {
        title: "Rekabet Avantajı",
        description: "Rakiplerinizin önüne geçerek pazar payınızı artırın ve sektörde lider konuma yükselin."
      },
      {
        title: "Müşteri Sadakati",
        description: "Yeniden pazarlama (remarketing) ve e-posta kampanyalarıyla mevcut müşterilerinizi elde tutun."
      }
    ],
    sectorScenarios: [
      {
        title: "Hizmet Sektörü",
        description: "Google Arama reklamlarıyla 'tesisatçı', 'avukat', 'diş hekimi' gibi acil ihtiyaç aramalarında en üstte çıkın."
      },
      {
        title: "E-Ticaret",
        description: "Alışveriş reklamları ve dinamik yeniden pazarlama ile sepetinde ürün bırakanları geri kazanın."
      },
      {
        title: "B2B Şirketler",
        description: "LinkedIn reklamlarıyla karar vericilere ulaşın ve nitelikli iş fırsatları (lead) toplayın."
      },
      {
        title: "Yerel İşletmeler",
        description: "Harita reklamları ve yerel SEO ile çevrenizdeki potansiyel müşterileri dükkanınıza çekin."
      }
    ],
    subServices: [
      {
        title: "SEO (Arama Motoru Optimizasyonu)",
        description: "Web sitenizi Google aramalarında üst sıralara taşıyarak organik ve ücretsiz trafik kazanmanızı sağlıyoruz."
      },
      {
        title: "Google Ads Yönetimi",
        description: "Arama, görüntülü ve alışveriş reklamları ile ürün veya hizmetinizi arayan kullanıcılara anında ulaşıyoruz."
      },
      {
        title: "Sosyal Medya Reklamcılığı",
        description: "Instagram, Facebook, LinkedIn ve TikTok reklamları ile markanızı geniş kitlelere tanıtıyor ve etkileşim yaratıyoruz."
      },
      {
        title: "İçerik Pazarlaması",
        description: "Blog yazıları, infografikler ve videolar ile hedef kitlenize değer katan içerikler üreterek marka otoritenizi güçlendiriyoruz."
      }
    ],
    process: [
      {
        title: "Pazar ve Rakip Analizi",
        description: "Sektörünüzü, rakiplerinizi ve hedef kitlenizin dijital davranışlarını analiz ederek yol haritası çıkarıyoruz."
      },
      {
        title: "Strateji Belirleme",
        description: "Hangi kanalların kullanılacağını, bütçe dağılımını ve iletişim dilini belirleyen kapsamlı bir strateji oluşturuyoruz."
      },
      {
        title: "Kampanya Kurulumu",
        description: "Reklam hesaplarını yapılandırıyor, hedef kitleleri tanımlıyor ve dikkat çekici reklam görselleri/metinleri hazırlıyoruz."
      },
      {
        title: "Optimizasyon ve Raporlama",
        description: "Kampanyaları sürekli izliyor, performansı artıracak iyileştirmeler yapıyor ve şeffaf raporlar sunuyoruz."
      }
    ],
    technologies: [
      "Google Analytics 4", "Google Ads", "Meta Business Suite", "SEMrush", "Ahrefs", "Google Search Console", "Tag Manager"
    ],
    faq: [
      {
        question: "SEO çalışmaları ne zaman sonuç verir?",
        answer: "SEO uzun vadeli bir yatırımdır. Rekabet durumuna göre değişmekle birlikte, kalıcı ve gözle görülür sonuçlar genellikle 3-6 ay arasında alınmaya başlanır."
      },
      {
        question: "Reklam bütçemi neye göre belirlemeliyim?",
        answer: "Bütçeniz, hedeflerinize ve sektörünüzdeki rekabet oranına göre belirlenir. Başlangıçta test bütçeleri ile başlayıp, verimliliği gördükçe bütçeyi artırmak en sağlıklı yöntemdir."
      },
      {
        question: "Hangi sosyal medya platformunda olmalıyım?",
        answer: "Bu tamamen hedef kitlenizin nerede vakit geçirdiğine bağlıdır. B2B işler için LinkedIn, görsel ürünler için Instagram, genç kitle için TikTok daha uygundur."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default Marketing;
