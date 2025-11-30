import React from 'react';
import ServiceDetailLayout, { ServiceDetailLayoutProps } from '../../components/layout/ServiceDetailLayout';

const WebDesign = () => {
  const data: ServiceDetailLayoutProps['data'] = {
    title: "Web Tasarım",
    heroTitle: "Modern ve Etkileyici Web Tasarımları",
    heroDescription: "Markanızı dijital dünyada güçlü ve güven veren bir şekilde temsil eden, kullanıcı dostu ve hızlı web siteleri tasarlıyoruz.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    benefits: [
      {
        title: "Mobil Uyumlu Tasarım",
        description: "Telefon, tablet ve masaüstünde kusursuz görünen, tamamen responsive arayüzler hazırlıyoruz."
      },
      {
        title: "SEO Dostu Yapı",
        description: "Arama motorlarının rahatça tarayabildiği, teknik olarak doğru kurgulanmış sayfa yapıları oluşturuyoruz."
      },
      {
        title: "Hızlı Yükleme Süreleri",
        description: "Performans odaklı geliştirme ile ziyaretçilerinizin beklemeden gezebildiği hızlı sayfalar geliştiriyoruz."
      },
      {
        title: "Kullanıcı Odaklı Arayüz",
        description: "Ziyaretçilerin aradığını kolayca bulabildiği, dönüşüm odaklı kullanıcı deneyimleri tasarlıyoruz."
      }
    ],
    businessBenefits: [
      {
        title: "Güven ve İtibar Kazandırır",
        description: "Profesyonel bir web sitesi, markanıza ilk kez bakan potansiyel müşterilerde “kurumsal ve güvenilir” algısı oluşturur."
      },
      {
        title: "Yeni Müşteri Kanalı Açar",
        description: "Doğru kurgulanmış sayfa yapısı ve formlar, telefon ve WhatsApp dışında size düzenli bir dijital başvuru kanalı kazandırır."
      },
      {
        title: "Satış Ekiplerinin İşini Kolaylaştırır",
        description: "Satış görüşmelerinde ürün ve hizmetlerinizi tek bir link üzerinden net bir şekilde gösterebilir, sürekli dosya göndermekle uğraşmazsınız."
      },
      {
        title: "Rekabette Geri Kalmanızı Engeller",
        description: "Sektörünüzdeki rakiplerle aynı sahnede yer almanızı sağlar; eski veya eksik bir site yüzünden kaybedilen güven ve fırsatların önüne geçer."
      },
      {
        title: "Pazarlama Çalışmalarının Temelini Oluşturur",
        description: "Reklam, sosyal medya ve SEO çalışmalarınız için sağlam ve ölçülebilir bir hedef sayfa altyapısı sunar."
      }
    ],
    sectorScenarios: [
      {
        title: "Restoran & Kafe",
        description: "Menü, fotoğraf ve konum bilgilerinin net olduğu bir site, müşterilerin sizi harita ve arama sonuçlarından kolayca bulmasını sağlar. Online rezervasyon veya WhatsApp üzerinden hızlı sipariş bağlantılarıyla, telefon trafiğini azaltıp masa doluluğunu artırabilirsiniz."
      },
      {
        title: "Klinik & Sağlık Merkezi",
        description: "Doktor kadronuzu, hizmetlerinizi ve sık sorulan soruları net şekilde anlatan bir site, güven bariyerini düşürür. Online randevu talepleri toplayabilir, Google Haritalar ve yorum sayfalarına giden akışı kontrol ederek itibarınızı yönetebilirsiniz."
      },
      {
        title: "İnşaat & Gayrimenkul",
        description: "Devam eden ve tamamlanan projeleriniz için ayrı proje sayfaları oluşturarak referanslarınızı güçlü şekilde sergileyebilirsiniz. Kat planları, 3D görseller ve konum bilgileriyle hem yerel hem de yurt dışı yatırımcılara net bir sunum yaparsınız."
      },
      {
        title: "Eğitim Kurumu & Kurs",
        description: "Programlar, eğitmenler, takvim ve ücret bilgilerini tek yerde toplayarak kayıt sürecini sadeleştirirsiniz. Online başvuru formlarıyla ilgilenen kişilerin bilgilerini toplayıp daha sistemli takip edebilirsiniz."
      },
      {
        title: "Üretim & B2B İşletmeler",
        description: "Katalog mantığında hazırlanmış ürün/hizmet sayfalarıyla, bayiler ve kurumsal müşteriler için net bir referans noktası oluşturursunuz. Teklif talep formları ve dosya indirme alanları ile satış sürecini hızlandırabilirsiniz."
      },
      {
        title: "Hizmet İşletmeleri",
        description: "Çalışma saatleri, konum, fiyat aralığı ve portfolyo görsellerini net anlatarak randevu kararını kolaylaştırırsınız. Online randevu bağlantılarıyla hem çağrı merkezine yük bindirmeden hem de daha düzenli bir planlama yapabilirsiniz."
      },
      {
        title: "Ajans & Danışmanlık",
        description: "Proje örnekleri, referans markalar ve uzmanlık alanlarınızı güçlü bir hikâyeyle sunarak, potansiyel müşterilerin sizi rakiplerinizden ayırmasını sağlarsınız. Formlar ve CTA’lar aracılığıyla direkt toplantı veya teklif talebi alabilirsiniz."
      }
    ],
    subServices: [
      {
        title: "Kurumsal Web Sitesi",
        description: "Şirketinizin prestijini, değerlerini ve hizmetlerini net biçimde anlatan, güven veren kurumsal web siteleri tasarlıyoruz."
      },
      {
        title: "Landing Page Tasarımı",
        description: "Kampanya, ürün lansmanı veya reklam trafiği için tek hedefe odaklanmış, dönüşüm odaklı landing page tasarımları hazırlıyoruz."
      },
      {
        title: "UI/UX Tasarımı",
        description: "Web siteleri ve dijital ürünleriniz için kullanıcı deneyimini merkeze alan, sade ve anlaşılır arayüz tasarımları geliştiriyoruz."
      },
      {
        title: "Blog & İçerik Sayfaları",
        description: "Organik trafik ve içerik pazarlaması için düzenli içerik üretimine uygun blog ve içerik sayfası yapıları kuruyoruz."
      }
    ],
    process: [
      {
        title: "Analiz",
        description: "İşinizi, hedef kitlenizi ve web sitenizden beklentilerinizi birlikte netleştiriyoruz."
      },
      {
        title: "Tasarım",
        description: "Bilgi mimarisini ve sayfa akışını çıkarıyor, marka kimliğinize uygun modern tasarım taslakları hazırlıyoruz."
      },
      {
        title: "Geliştirme",
        description: "Onaylanan tasarımları seçilen altyapı üzerinde kodlayarak yönetilebilir bir web sitesine dönüştürüyoruz."
      },
      {
        title: "Test ve Yayına Alma",
        description: "Mobil ve masaüstü testlerini yapıyor, performans ve güvenlik kontrollerini tamamlayıp sitenizi yayına alıyoruz."
      }
    ],
    technologies: [
      "HTML5", "CSS3", "React", "Next.js", "Tailwind CSS", "Figma", "WordPress", "Node.js"
    ],
    faq: [
      {
        question: "Bir web tasarım projesi ne kadar sürer?",
        answer: "Süre; sayfa sayısı, içerik yoğunluğu ve özel taleplere göre değişir. Ortalama bir kurumsal web sitesi projesi 2–6 hafta arasında tamamlanır."
      },
      {
        question: "Metin ve görselleri bizim mi hazırlamamız gerekiyor?",
        answer: "Elinizde hazır içerikler varsa bunları kullanırız. İsterseniz metin yazımı, görsel seçimi ve temel içerik üretimi konusunda da destek sağlayabiliriz."
      },
      {
        question: "Site yayına alındıktan sonra kendimiz güncelleme yapabilir miyiz?",
        answer: "Evet. İçerik yönetim paneli üzerinden metin, görsel ve bazı bileşenleri kolayca güncelleyebileceğiniz şekilde yapı kuruyoruz ve kısa bir kullanım eğitimi veriyoruz."
      },
      {
        question: "Mevcut web sitemizi tamamen baştan yapmak zorunda mıyız?",
        answer: "Duruma göre sadece tasarımı yenileyebilir, altyapıyı iyileştirebilir veya ihtiyaç varsa sıfırdan, güncel standartlara uygun yeni bir site tasarlayabiliriz. Kararı analiz sonrasında birlikte veriyoruz."
      },
      {
        question: "Domain, hosting ve SSL ayarlarıyla da ilgileniyor musunuz?",
        answer: "Evet. Mevcut altyapınızı inceleyip uygun çözümleri öneriyor; domain, hosting ve SSL kurulumu gibi teknik adımlar konusunda rehberlik ve kurulum desteği sağlıyoruz."
      },
      {
        question: "Web tasarım fiyatları nasıl belirleniyor?",
        answer: "Fiyat; ihtiyaç analizi sonrası belirlenen sayfa sayısı, tasarım kapsamı, özel entegrasyonlar ve ek hizmetlere göre şekillenir. Kapsamı netleştirdikten sonra sürpriz maliyet olmadan, tek bir toplam teklif sunuyoruz."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default WebDesign;
