import React from 'react';
import ServiceDetailLayout from '../../components/layout/ServiceDetailLayout';

const GraphicDesign = () => {
  const data = {
    title: "Grafik Tasarım",
    heroTitle: "Görsel İletişimin Gücüyle Mesajınızı İletin",
    heroDescription: "Sözcüklerin yetersiz kaldığı yerde tasarım konuşur. Sosyal medya görsellerinden basılı materyallere kadar tüm ihtiyaçlarınız için estetik, modern ve etkileyici grafik tasarım çözümleri sunuyoruz.",
    heroImage: "https://images.unsplash.com/photo-1626785774573-4b7993125651?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      {
        title: "Dikkat Çekici Görsel İletişim",
        description: "Markanızın mesajını saniyeler içinde ileten, akılda kalıcı ve etkileyici tasarımlar."
      },
      {
        title: "Profesyonel Marka Algısı",
        description: "Tutarlı ve kaliteli görsellerle müşterilerinizin gözünde güvenilir bir imaj oluşturun."
      },
      {
        title: "Sosyal Medyada Yüksek Etkileşim",
        description: "Paylaşılabilir, beğenilebilir ve yorum almaya müsait kreatif içerikler."
      },
      {
        title: "Satış Odaklı Tasarımlar",
        description: "Sadece güzel görünen değil, harekete geçiren ve dönüşüm sağlayan görsel stratejiler."
      }
    ],
    businessBenefits: [
      {
        title: "Marka Bilinirliğini Artırır",
        description: "Özgün tasarımlar, markanızın kalabalık dijital dünyada fark edilmesini ve hatırlanmasını sağlar."
      },
      {
        title: "Reklam Maliyetlerini Düşürür",
        description: "İyi tasarlanmış reklam görselleri (kreatifler), tıklama oranlarını (CTR) artırarak birim maliyetlerinizi düşürür."
      },
      {
        title: "Profesyonellik Göstergesidir",
        description: "Kaliteli görseller, işinize verdiğiniz önemi ve profesyonelliğinizi müşterilerinize yansıtır."
      }
    ],
    sectorScenarios: [
      {
        title: "E-Ticaret",
        description: "Ürün fotoğraflarının düzenlenmesi, kampanya bannerları ve sosyal medya reklamları ile satışları artırma."
      },
      {
        title: "Restoran & Kafe",
        description: "İştah kabartan menü tasarımları, sosyal medya için yemek görselleri ve etkinlik afişleri."
      },
      {
        title: "Etkinlik & Organizasyon",
        description: "Konser, seminer veya festival duyuruları için dikkat çekici poster ve dijital davetiye tasarımları."
      },
      {
        title: "Kurumsal Firmalar",
        description: "Yatırımcı sunumları, yıllık faaliyet raporları ve şirket içi iletişim materyallerinin profesyonel tasarımı."
      }
    ],
    subServices: [
      {
        title: "Sosyal Medya Tasarımı",
        description: "Instagram, LinkedIn ve diğer platformlar için post, story, reel kapakları ve kampanya görselleri."
      },
      {
        title: "Reklam Kreatifleri",
        description: "Google Ads ve sosyal medya reklamları için yüksek tıklama oranlı (CTR) banner ve görsel setleri."
      },
      {
        title: "Basılı Materyaller",
        description: "Katalog, broşür, afiş, billboard, dergi ilanı ve menü gibi fiziksel baskı ürünlerinin tasarımı."
      },
      {
        title: "Sunum Tasarımı",
        description: "Yatırımcı sunumları, şirket tanıtımları ve raporlar için profesyonel, anlaşılır ve şık sunum şablonları."
      }
    ],
    process: [
      {
        title: "İhtiyaç Analizi",
        description: "Tasarımın nerede kullanılacağını, hedef kitleyi ve verilmek istenen mesajı netleştiriyoruz."
      },
      {
        title: "Görsel Araştırma",
        description: "Trendleri takip ediyor, moodboard'lar oluşturarak tasarımın genel havasını belirliyoruz."
      },
      {
        title: "Tasarım Süreci",
        description: "Belirlenen konsept doğrultusunda tasarımları hazırlıyor, tipografi ve renk uyumuna özen gösteriyoruz."
      },
      {
        title: "Revizyon ve Teslim",
        description: "Geri bildirimlerinize göre gerekli düzenlemeleri yapıyor ve baskıya/yayına hazır formatlarda teslim ediyoruz."
      }
    ],
    technologies: [
      "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Canva Pro", "Figma"
    ],
    faq: [
      {
        question: "Aylık düzenli tasarım hizmeti veriyor musunuz?",
        answer: "Evet, özellikle sosyal medya yönetimi kapsamında aylık düzenli post ve story tasarım paketlerimiz mevcuttur."
      },
      {
        question: "Acil işlerde teslim süreniz nedir?",
        answer: "İşin niteliğine göre değişmekle birlikte, acil durumlarda 24 saat içinde teslimat yapabildiğimiz ekspres hizmetimiz vardır."
      },
      {
        question: "Tasarımın kaynak dosyalarını alabilir miyim?",
        answer: "Evet, proje bitiminde düzenlenebilir açık kaynak dosyaları (PSD, AI vb.) talep üzerine teslim edilmektedir."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default GraphicDesign;
