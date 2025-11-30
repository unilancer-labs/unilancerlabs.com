import React from 'react';
import ServiceDetailLayout from '../../components/layout/ServiceDetailLayout';

const Branding = () => {
  const data = {
    title: "Marka Yönetimi",
    heroTitle: "Markanızın Hikayesini Birlikte Yazalım",
    heroDescription: "Sadece bir logo değil, yaşayan ve nefes alan bir marka kimliği oluşturuyoruz. Müşterilerinizin zihninde kalıcı bir yer edinmenizi sağlayan stratejik marka yönetimi hizmetleri.",
    heroImage: "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      {
        title: "Güçlü Kimlik",
        description: "Rakiplerinizden ayrışan, özgün ve akılda kalıcı bir marka kimliğine sahip olun."
      },
      {
        title: "Tutarlı İletişim",
        description: "Web sitenizden sosyal medyanıza kadar her mecrada aynı dili konuşan bütünleşik bir marka algısı."
      },
      {
        title: "Duygusal Bağ",
        description: "Hedef kitlenizle sadece ticari değil, duygusal bir bağ kurarak sadık müşteriler yaratın."
      },
      {
        title: "Değer Artışı",
        description: "Güçlü bir marka algısı ile ürün ve hizmetlerinizin katma değerini artırın."
      }
    ],
    businessBenefits: [
      {
        title: "Pazar Payı",
        description: "Bilinirliği yüksek bir marka ile pazar payınızı artırmak ve yeni pazarlara girmek kolaylaşır."
      },
      {
        title: "Yetenek Çekimi",
        description: "Güçlü bir işveren markası, sektördeki en iyi yetenekleri şirketinize çekmenizi sağlar."
      },
      {
        title: "Kriz Yönetimi",
        description: "Sağlam bir marka itibarı, olası kriz dönemlerinde işletmenizi koruyan bir kalkan görevi görür."
      }
    ],
    sectorScenarios: [
      {
        title: "Start-up'lar",
        description: "Pazara güçlü bir giriş yapmak için isim bulma, logo tasarımı ve kurumsal kimlik oluşturma."
      },
      {
        title: "Perakende",
        description: "Mağaza içi deneyim tasarımı, ambalaj tasarımı ve görsel mağazacılık standartları."
      },
      {
        title: "Hizmet Sektörü",
        description: "Personel kıyafetlerinden sunum dosyalarına kadar profesyonel bir kurumsal duruş sergileme."
      },
      {
        title: "Holdingler",
        description: "Alt markaların mimarisini oluşturma ve kurumsal itibar yönetimi."
      }
    ],
    subServices: [
      {
        title: "Logo ve Kurumsal Kimlik",
        description: "Logonuzdan kartvizitinize, antetli kağıdınızdan e-posta imzanıza kadar tüm görsel öğelerin tasarımı."
      },
      {
        title: "Marka Stratejisi",
        description: "Markanızın vizyonunu, misyonunu, değerlerini ve konumlandırmasını belirleyen stratejik yol haritası."
      },
      {
        title: "İsimlendirme (Naming)",
        description: "Markanız için akılda kalıcı, tescil edilebilir ve hikayesi olan isimlerin bulunması."
      },
      {
        title: "Marka Kılavuzu",
        description: "Markanızın kullanım kurallarını belirleyen, tutarlılığı sağlayan kapsamlı rehberin hazırlanması."
      }
    ],
    process: [
      {
        title: "Keşif ve Araştırma",
        description: "Sizi, sektörünüzü ve rakiplerinizi derinlemesine analiz ederek markanızın özünü keşfediyoruz."
      },
      {
        title: "Strateji Geliştirme",
        description: "Markanızın nasıl konuşacağını, nasıl görüneceğini ve ne hissettireceğini tanımlıyoruz."
      },
      {
        title: "Tasarım ve Yaratım",
        description: "Stratejiye uygun görsel dünyayı tasarlıyor, logo ve kurumsal kimlik öğelerini hayata geçiriyoruz."
      },
      {
        title: "Uygulama ve Lansman",
        description: "Markanızı tüm mecralara uyguluyor ve dünyaya tanıtmanız için gerekli lansman desteğini veriyoruz."
      }
    ],
    technologies: [
      "Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Figma", "Cinema 4D", "Brand Archetypes", "SWOT Analizi"
    ],
    faq: [
      {
        question: "Logo tasarımı ne kadar sürer?",
        answer: "Profesyonel bir logo tasarım süreci, araştırma ve eskiz aşamalarıyla birlikte ortalama 2-3 hafta sürer."
      },
      {
        question: "Sadece logo yaptırabilir miyim?",
        answer: "Evet, ancak markanızın tutarlılığı için logoyu kurumsal kimlik öğeleriyle (kartvizit, antetli vb.) birlikte tasarlatmanızı öneririz."
      },
      {
        question: "Marka tescili yapıyor musunuz?",
        answer: "Biz marka ismini ve görselini tasarlıyoruz, tescil işlemleri için ise çalıştığımız patent ofislerine yönlendirme yapıyoruz."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default Branding;
