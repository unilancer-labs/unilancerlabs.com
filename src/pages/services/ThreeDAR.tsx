import React from 'react';
import ServiceDetailLayout from '../../components/layout/ServiceDetailLayout';

const ThreeDAR = () => {
  const data = {
    title: "3D & AR",
    heroTitle: "Gerçekliği Yeniden Şekillendiren Sürükleyici Deneyimler",
    heroDescription: "Ürünlerinizi ve projelerinizi sadece göstermeyin, müşterilerinize deneyimletin. 3D modelleme ve Artırılmış Gerçeklik (AR) teknolojileri ile fiziksel ve dijital dünya arasındaki sınırları kaldırıyor, markanız için unutulmaz etkileşimler yaratıyoruz.",
    heroImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      {
        title: "Ürünleri Her Açıdan İnceleme",
        description: "Müşterileriniz ürünlerinizi 360 derece döndürebilir, yakınlaştırabilir ve her detayını inceleyebilir."
      },
      {
        title: "Fiziksel Mağaza Deneyimi",
        description: "E-ticaret sitenizde fiziksel mağazadaki gibi ürün deneme hissi yaratarak satın alma kararını hızlandırın."
      },
      {
        title: "Satış Dönüşüm Artışı",
        description: "AR deneyimi sunan ürün sayfalarında dönüşüm oranlarının %94'e kadar arttığı kanıtlanmıştır."
      },
      {
        title: "İade Oranlarında Azalma",
        description: "Müşteriler ürünü satın almadan önce kendi ortamlarında gördükleri için iade oranları ciddi ölçüde düşer."
      }
    ],
    businessBenefits: [
      {
        title: "Rakiplerden Ayrışma",
        description: "Yenilikçi teknolojileri kullanarak markanızı rakiplerinizden ayırır ve teknoloji lideri imajı çizersiniz."
      },
      {
        title: "Viral Etki Yaratma",
        description: "Eğlenceli ve etkileşimli AR filtreleri, sosyal medyada kullanıcılar tarafından paylaşılarak organik erişiminizi artırır."
      },
      {
        title: "Müşteri Bağlılığı",
        description: "Sürükleyici deneyimler, müşterilerinizin markanızla geçirdiği süreyi ve duygusal bağını artırır."
      }
    ],
    sectorScenarios: [
      {
        title: "Mobilya & Dekorasyon",
        description: "Müşteriler koltuğun salonlarında nasıl duracağını, renginin uyup uymadığını telefon kamerasıyla anında görebilir."
      },
      {
        title: "Moda & Aksesuar",
        description: "Sanal deneme (Virtual Try-On) ile gözlük, ayakkabı veya saat gibi ürünleri müşterilerinizin yüzünde veya bileğinde gösterin."
      },
      {
        title: "Gayrimenkul",
        description: "Henüz inşa edilmemiş projeleri 360° sanal turlarla gezdirin, örnek daireleri her yerden erişilebilir kılın."
      },
      {
        title: "Eğitim & Müze",
        description: "Tarihi eserleri veya karmaşık eğitim materyallerini interaktif 3D modellerle canlandırarak öğrenmeyi kolaylaştırın."
      }
    ],
    subServices: [
      {
        title: "3D Ürün Modelleme",
        description: "E-ticaret siteleriniz veya kataloglarınız için ürünlerinizin fotorealistik, detaylı ve optimize edilmiş 3 boyutlu modellerinin oluşturulması."
      },
      {
        title: "WebAR Entegrasyonu",
        description: "Herhangi bir uygulama indirmeye gerek kalmadan, doğrudan web tarayıcısı üzerinden çalışan artırılmış gerçeklik deneyimleri."
      },
      {
        title: "Sosyal Medya AR Filtreleri",
        description: "Instagram, TikTok ve Snapchat için markanıza özel, kullanıcıların etkileşime geçebileceği eğlenceli ve viral potansiyeli yüksek filtreler."
      },
      {
        title: "360° Sanal Tur",
        description: "Fabrika, showroom, otel veya gayrimenkul projelerinizin iç mekanlarının 360 derece gezilebilir sanal kopyalarının oluşturulması."
      }
    ],
    process: [
      {
        title: "Konsept ve Senaryo",
        description: "Projenin amacına uygun görsel dili belirliyor, kullanıcı deneyimi senaryosunu kurguluyoruz."
      },
      {
        title: "3D Üretim",
        description: "Referans görseller üzerinden yüksek kaliteli modelleme, dokulama ve ışıklandırma işlemlerini gerçekleştiriyoruz."
      },
      {
        title: "Yazılım ve Entegrasyon",
        description: "Oluşturulan 3D varlıkları AR platformlarına veya web sitenize entegre ediyor, etkileşim kodlarını yazıyoruz."
      },
      {
        title: "Optimizasyon ve Yayın",
        description: "Farklı cihazlarda akıcı çalışması için performans optimizasyonlarını yapıyor ve projeyi canlıya alıyoruz."
      }
    ],
    technologies: [
      "Three.js", "WebGL", "Unity", "Blender", "Spark AR", "Lens Studio", "8th Wall", "React Three Fiber"
    ],
    faq: [
      {
        question: "AR deneyimi için uygulama indirmek gerekir mi?",
        answer: "WebAR teknolojimiz sayesinde kullanıcılar herhangi bir uygulama indirmeden, sadece telefonlarının kamerasını kullanarak veya bir linke tıklayarak deneyimi yaşayabilirler."
      },
      {
        question: "Hangi sektörler için uygundur?",
        answer: "Mobilya, dekorasyon, moda, kozmetik, gayrimenkul, otomotiv ve eğitim başta olmak üzere ürün veya mekan gösterimi gerektiren tüm sektörler için idealdir."
      },
      {
        question: "Mevcut ürün fotoğraflarından 3D model yapılabilir mi?",
        answer: "Evet, ürününüzün farklı açılardan çekilmiş yüksek çözünürlüklü fotoğraflarını referans alarak birebir 3D modellemesini yapabiliyoruz."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default ThreeDAR;
