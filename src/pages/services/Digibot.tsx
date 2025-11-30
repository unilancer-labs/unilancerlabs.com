import React from 'react';
import ServiceDetailLayout from '../../components/layout/ServiceDetailLayout';

const Digibot = () => {
  const data = {
    title: "Digibot & Yapay Zeka",
    heroTitle: "7/24 Çalışan Dijital Asistanınız",
    heroDescription: "Müşteri hizmetlerinizi yapay zeka destekli chatbotlar ile otomatikleştirin. Müşterilerinizin sorularını anında yanıtlayın, satışları artırın ve operasyonel yükünüzü hafifletin.",
    heroImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop",
    benefits: [
      {
        title: "7/24 Kesintisiz Hizmet",
        description: "Mesai saatlerine bağlı kalmadan, müşterilerinize günün her saati anında destek sağlayın."
      },
      {
        title: "Maliyet Tasarrufu",
        description: "Müşteri temsilcisi maliyetlerini düşürün ve insan kaynağınızı daha stratejik işlere yönlendirin."
      },
      {
        title: "Hızlı Yanıt Süresi",
        description: "Bekleme sürelerini ortadan kaldırarak müşteri memnuniyetini ve sadakatini artırın."
      },
      {
        title: "Çoklu Dil Desteği",
        description: "Yapay zeka sayesinde farklı dillerdeki müşterilerinizle kendi dillerinde iletişim kurun."
      }
    ],
    businessBenefits: [
      {
        title: "Verimlilik Artışı",
        description: "Tekrarlayan soruları ve basit işlemleri otomatikleştirerek ekibinizin verimliliğini %40'a kadar artırın."
      },
      {
        title: "Satış Dönüşümü",
        description: "Ürün önerileri yapan ve satın alma sürecini yönlendiren botlarla satışlarınızı artırın."
      },
      {
        title: "Veri Toplama ve Analiz",
        description: "Müşteri konuşmalarından elde edilen verilerle hizmetlerinizi ve ürünlerinizi geliştirin."
      }
    ],
    sectorScenarios: [
      {
        title: "E-Ticaret",
        description: "'Kargom nerede?', 'İade nasıl yaparım?' gibi soruları otomatik yanıtlayın ve ürün önerileri sunun."
      },
      {
        title: "Sağlık",
        description: "Randevu oluşturma, doktor bilgisi verme ve ön teşhis sorularını yanıtlama süreçlerini yönetin."
      },
      {
        title: "Turizm ve Otelcilik",
        description: "Rezervasyon işlemleri, otel bilgileri ve tur önerileri için 7/24 asistan hizmeti sunun."
      },
      {
        title: "Eğitim",
        description: "Öğrenci kayıt süreçleri, ders programı bilgileri ve sık sorulan sorular için anında destek sağlayın."
      }
    ],
    subServices: [
      {
        title: "Kural Tabanlı Chatbotlar",
        description: "Belirli senaryolar ve butonlar üzerinden ilerleyen, yönlendirici ve hızlı çözüm sunan botlar."
      },
      {
        title: "Yapay Zeka (NLP) Destekli Botlar",
        description: "Doğal dili anlayabilen, öğrenen ve karmaşık sorulara insansı yanıtlar verebilen gelişmiş asistanlar."
      },
      {
        title: "WhatsApp Business Entegrasyonu",
        description: "Dünyanın en popüler mesajlaşma uygulamasında müşterilerinizle otomatik iletişim kurun."
      },
      {
        title: "Canlı Destek Entegrasyonu",
        description: "Botun çözemediği durumlarda konuşmayı sorunsuz bir şekilde insan temsilciye aktaran hibrit sistemler."
      }
    ],
    process: [
      {
        title: "Senaryo Tasarımı",
        description: "Müşterilerinizin en çok sorduğu soruları ve işlem akışlarını belirleyerek konuşma senaryolarını tasarlıyoruz."
      },
      {
        title: "Geliştirme ve Entegrasyon",
        description: "Seçilen platforma (Web, WhatsApp vb.) uygun botu geliştiriyor ve sistemlerinize (CRM, Veritabanı) entegre ediyoruz."
      },
      {
        title: "Test ve Eğitim",
        description: "Botun farklı senaryolarda doğru yanıtlar verdiğini test ediyor ve yapay zekayı eğitiyoruz."
      },
      {
        title: "Canlıya Alma ve İyileştirme",
        description: "Botu yayına alıyor, konuşma kayıtlarını analiz ederek sürekli daha akıllı hale getiriyoruz."
      }
    ],
    technologies: [
      "OpenAI GPT-4", "Dialogflow", "Microsoft Bot Framework", "Python", "Node.js", "WhatsApp API", "TensorFlow"
    ],
    faq: [
      {
        question: "Chatbot kurulumu ne kadar sürer?",
        answer: "Basit kural tabanlı botlar 1-2 haftada, kapsamlı yapay zeka botları ise entegrasyon gereksinimlerine göre 4-8 hafta arasında tamamlanabilir."
      },
      {
        question: "Bot her soruyu anlayabilir mi?",
        answer: "Yapay zeka destekli botlar çoğu soruyu anlar. Anlayamadığı durumlarda ise nazikçe tekrar isteyebilir veya görüşmeyi bir insan temsilciye aktarabilir."
      },
      {
        question: "Mevcut CRM sistemime entegre olabilir mi?",
        answer: "Evet, modern chatbot altyapıları API'ler aracılığıyla çoğu CRM ve veritabanı sistemiyle haberleşebilir."
      }
    ]
  };

  return <ServiceDetailLayout data={data} />;
};

export default Digibot;
