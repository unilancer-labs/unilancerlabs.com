import { Language, getOrCreateTranslation } from './services/deepl';

export const staticTranslations: Record<string, Record<Language, string>> = {
  'nav.digitall': {
    tr: 'DigitAll',
    en: 'DigitAll'
  },
  'nav.portfolio': {
    tr: 'Portfolyo',
    en: 'Portfolio'
  },
  'nav.about': {
    tr: 'Hakkımızda',
    en: 'About Us'
  },
  'nav.blog': {
    tr: 'Blog',
    en: 'Blog'
  },
  'nav.contact': {
    tr: 'İletişim',
    en: 'Contact'
  },
  'nav.getQuote': {
    tr: 'Teklif Al',
    en: 'Get Quote'
  },
  'nav.joinUs': {
    tr: 'Bize Katıl',
    en: 'Join Us'
  },
  'nav.lightTheme': {
    tr: 'Aydınlık Tema',
    en: 'Light Theme'
  },
  'nav.darkTheme': {
    tr: 'Koyu Tema',
    en: 'Dark Theme'
  },
  'home.hero.badge': {
    tr: "Türkiye'nin Yeni Nesil Freelance Platformu",
    en: "Turkey's Next Generation Freelance Platform"
  },
  'home.hero.title': {
    tr: "Türkiye'nin üniversiteli freelancer ekosistemi",
    en: "Turkey's university freelancer ecosystem"
  },
  'home.hero.description': {
    tr: "Unilancer'da projelerinizi seçilmiş üniversiteli ekipler üretir, deneyimli proje yöneticileri uçtan uca yönetir; siz hem uygun bütçeyle çalışır hem de genç yeteneklerin büyümesine katkı sağlarsınız.",
    en: "At Unilancer, selected university teams produce your projects, experienced project managers manage them end-to-end; you work with an affordable budget while contributing to the growth of young talents."
  },
  'home.hero.students': {
    tr: 'Üniversiteli',
    en: 'Students'
  },
  'home.hero.projects': {
    tr: 'Proje',
    en: 'Projects'
  },
  'home.hero.partners': {
    tr: 'İş Ortağı',
    en: 'Partners'
  },
  'home.hero.startProject': {
    tr: 'Projenizi Başlatalım',
    en: "Let's Start Your Project"
  },
  'home.hero.viewPortfolio': {
    tr: 'Portfolyomuzu İnceleyin',
    en: 'View Our Portfolio'
  },
  'home.howItWorks.title': {
    tr: 'Nasıl Çalışır?',
    en: 'How it Works?'
  },
  'home.howItWorks.subtitle': {
    tr: 'Adım Adım Unilancer Yolculuğu',
    en: 'Unilancer Journey Step by Step'
  },
  'home.howItWorks.step1.title': {
    tr: 'Keşif & Analiz',
    en: 'Discovery & Analysis'
  },
  'home.howItWorks.step1.desc': {
    tr: 'İhtiyaçlarınızı dinliyor, projeniz için ücretsiz dijital analiz ve yol haritası çıkarıyoruz.',
    en: 'We listen to your needs and create a free digital analysis and roadmap for your project.'
  },
  'home.howItWorks.step2.title': {
    tr: 'Ekip & Yönetim',
    en: 'Team & Management'
  },
  'home.howItWorks.step2.desc': {
    tr: 'Size özel üniversiteli ekibi kuruyor ve süreci yönetecek deneyimli proje yöneticinizi atıyoruz.',
    en: 'We build your custom university team and assign an experienced project manager to lead the process.'
  },
  'home.howItWorks.step3.title': {
    tr: 'Plan & Güven',
    en: 'Plan & Trust'
  },
  'home.howItWorks.step3.desc': {
    tr: 'Net kapsam ve bütçe ile sözleşme imzalıyor, ödemenizi Unilancer güvencesine alıyoruz.',
    en: 'We sign a contract with clear scope and budget, securing your payment with Unilancer assurance.'
  },
  'home.howItWorks.step4.title': {
    tr: 'Teslim & Büyüme',
    en: 'Delivery & Growth'
  },
  'home.howItWorks.step4.desc': {
    tr: 'Kalite kontrolü yapılmış işinizi teslim ediyor, dilerseniz aynı ekiple büyümeye devam ediyoruz.',
    en: 'We deliver your quality-checked work and continue to grow with the same team if you wish.'
  },
  'home.partners.title': {
    tr: 'Partnerlerimiz',
    en: 'Our Partners'
  },
  'home.partners.description': {
    tr: 'Güvenilir iş ortaklarımızla birlikte büyüyoruz',
    en: 'Growing together with our trusted business partners'
  },
  'home.cta.title': {
    tr: 'Projenizi Hayata Geçirmeye Hazır mısınız?',
    en: 'Ready to Bring Your Project to Life?'
  },
  'home.cta.description': {
    tr: 'Size özel çözümler için hemen iletişime geçin',
    en: 'Contact us now for customized solutions'
  },
  'home.cta.action': {
    tr: 'Teklif Alın',
    en: 'Get a Quote'
  },
  'footer.about.title': {
    tr: 'Hakkımızda',
    en: 'About'
  },
  'footer.about.description': {
    tr: 'Genç yetenekleri iş dünyasıyla buluşturan yenilikçi platform',
    en: 'Innovative platform connecting young talents with the business world'
  },
  'footer.description': {
    tr: 'Modern teknolojiler ve yaratıcı çözümlerle işletmenizi dijital dünyada öne çıkarıyoruz.',
    en: 'We make your business stand out in the digital world with modern technologies and creative solutions.'
  },
  'footer.quickLinks': {
    tr: 'Hızlı Bağlantılar',
    en: 'Quick Links'
  },
  'footer.portfolio': {
    tr: 'Portfolyo',
    en: 'Portfolio'
  },
  'footer.services': {
    tr: 'Hizmetler',
    en: 'Services'
  },
  'footer.about': {
    tr: 'Hakkımızda',
    en: 'About Us'
  },
  'footer.blog': {
    tr: 'Blog',
    en: 'Blog'
  },
  'footer.contact': {
    tr: 'İletişim',
    en: 'Contact'
  },
  'footer.newsletter': {
    tr: 'Bülten',
    en: 'Newsletter'
  },
  'footer.newsletterDesc': {
    tr: 'Güncel teknoloji haberlerini ve blog yazılarımızı takip edin.',
    en: 'Follow the latest technology news and our blog posts.'
  },
  'footer.emailPlaceholder': {
    tr: 'E-posta adresiniz',
    en: 'Your email address'
  },
  'footer.subscribe': {
    tr: 'Abone Ol',
    en: 'Subscribe'
  },
  'footer.privacyPolicy': {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy'
  },
  'footer.termsOfService': {
    tr: 'Kullanım Koşulları',
    en: 'Terms of Service'
  },
  'footer.quick.title': {
    tr: 'Hızlı Linkler',
    en: 'Quick Links'
  },
  'footer.services.title': {
    tr: 'Hizmetlerimiz',
    en: 'Our Services'
  },
  'footer.contact.title': {
    tr: 'İletişim',
    en: 'Contact'
  },
  'footer.rights': {
    tr: 'Tüm hakları saklıdır.',
    en: 'All rights reserved.'
  },
  'service.webDesign': {
    tr: 'Web Tasarım',
    en: 'Web Design'
  },
  'service.3dAr': {
    tr: '3D & AR',
    en: '3D & AR'
  },
  'service.ecommerce': {
    tr: 'E Ticaret Çözümleri',
    en: 'E-Commerce Solutions'
  },
  'service.marketing': {
    tr: 'Pazarlama & Reklam',
    en: 'Marketing & Advertising'
  },
  'service.ai': {
    tr: 'Yapay Zeka - Digibot',
    en: 'Artificial Intelligence - Digibot'
  },
  'service.development': {
    tr: 'Yazılım Geliştirme',
    en: 'Software Development'
  },
  'service.branding': {
    tr: 'Kurumsal Kimlik & Marka',
    en: 'Corporate Identity & Brand'
  },
  'service.graphics': {
    tr: 'Grafik ve Tasarım',
    en: 'Graphics and Design'
  },
  'service.website': {
    tr: 'Web Sitesi',
    en: 'Website'
  },
  'service.ecommerce.short': {
    tr: 'E-Ticaret',
    en: 'E-Commerce'
  },
  'service.design': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'service.content': {
    tr: 'İçerik',
    en: 'Content'
  },
  'service.seo': {
    tr: 'SEO',
    en: 'SEO'
  },

  // Home Page Translations
  'home.hero.newBadge': {
    tr: 'Türkiyeyi Dijitalleştiriyoruz',
    en: 'Digitalizing Turkey'
  },
  'home.hero.mainTitle': {
    tr: 'Türkiye\'nin',
    en: 'Turkey\'s'
  },
  'home.hero.mainTitleHighlight': {
    tr: 'Üniversiteli Freelancer Ekosistemi',
    en: 'University Freelancer Ecosystem'
  },
  'home.hero.mainDescription': {
    tr: 'Seçilmiş üniversiteli ekipler üretir, deneyimli proje yöneticileri süreci uçtan uca yönetir; siz uygun bütçeyle güvenle dijitalleşirsiniz.',
    en: 'Selected university teams produce, experienced project managers manage the process end-to-end; you digitalize safely with an affordable budget.'
  },
  'home.hero.servicesNote': {
    tr: 'Web sitesi, e-ticaret, tasarım, içerik, SEO ve daha fazlası…',
    en: 'Website, e-commerce, design, content, SEO and more…'
  },
  'home.hero.startProjectButton': {
    tr: 'Projenizi Başlatın',
    en: 'Start Your Project'
  },
  'home.hero.getFreeReport': {
    tr: 'Ücretsiz Dijital Rapor Alın',
    en: 'Get Free Digital Report'
  },
  'home.hero.stats.projects': {
    tr: '100+ proje',
    en: '100+ projects'
  },
  'home.hero.stats.freelancers': {
    tr: '500+ üniversiteli freelancer ekosistemi',
    en: '500+ university freelancer ecosystem'
  },

  // For Whom Section
  'home.forWhom.title': {
    tr: 'Kimin için?',
    en: 'For Whom?'
  },
  'home.forWhom.description': {
    tr: 'Unilancer, hem işverenler hem de üniversiteli freelancerlar için tasarlanmış bir ekosistemdir.',
    en: 'Unilancer is an ecosystem designed for both employers and university freelancers.'
  },
  'home.forWhom.sme.title': {
    tr: 'KOBİ ve İşletmeler',
    en: 'SMEs and Businesses'
  },
  'home.forWhom.sme.description': {
    tr: 'Web sitesi, e-ticaret ve dijital pazarlama ihtiyaçlarını tek noktadan çözmek isteyen markalar.',
    en: 'Brands that want to solve their website, e-commerce and digital marketing needs from a single point.'
  },
  'home.forWhom.sme.tag': {
    tr: 'Dijitalleşmek isteyen işletmeler',
    en: 'Businesses wanting to digitalize'
  },
  'home.forWhom.agencies.title': {
    tr: 'Ajanslar ve Startuplar',
    en: 'Agencies and Startups'
  },
  'home.forWhom.agencies.description': {
    tr: 'Yoğun dönemlerde işi güvenilir bir ekibe outsource etmek isteyen ajanslar ve hızlı büyüyen girişimler.',
    en: 'Agencies wanting to outsource work to a reliable team during busy periods and fast-growing startups.'
  },
  'home.forWhom.agencies.tag': {
    tr: 'Esnek kapasite & white-label üretim',
    en: 'Flexible capacity & white-label production'
  },
  'home.forWhom.freelancers.title': {
    tr: 'Üniversiteli Freelancerlar',
    en: 'University Freelancers'
  },
  'home.forWhom.freelancers.description': {
    tr: 'Portföyünü büyütmek ve gerçek müşterilerle proje yapmak isteyen öğrenciler.',
    en: 'Students who want to grow their portfolio and work on projects with real clients.'
  },
  'home.forWhom.freelancers.tag': {
    tr: 'Seçilmiş ekipler & proje yönetimi',
    en: 'Selected teams & project management'
  },
  'home.forWhom.sme.imageAlt': {
    tr: 'KOBİ ve işletme sahipleri',
    en: 'SMEs and business owners'
  },
  'home.forWhom.agencies.imageAlt': {
    tr: 'Startup ve teknoloji şirketleri',
    en: 'Startup and technology companies'
  },
  'home.forWhom.freelancers.imageAlt': {
    tr: 'Üniversiteli freelancer ekipleri',
    en: 'University freelancer teams'
  },
  'home.forWhom.subtitle': {
    tr: 'hem iş verenler hem de üniversiteli freelancerlar için tasarlandı',
    en: 'designed for both employers and university freelancers'
  },

  // Partners Section (Extended)
  'home.partnersSection.mainTitle': {
    tr: 'İŞ BİRLİKLERİMİZ',
    en: 'OUR PARTNERSHIPS'
  },
  'home.partnersSection.title': {
    tr: 'Partnerler',
    en: 'Partners'
  },
  'home.partnersSection.description': {
    tr: 'İş birliği yaptığımız kurumlar ve markalarla birlikte büyüyoruz.',
    en: 'We grow together with the institutions and brands we collaborate with.'
  },

  // Why Unilancer Section
  'home.why.title': {
    tr: 'neden unilancer?',
    en: 'why unilancer?'
  },
  'home.why.description': {
    tr: '',
    en: ''
  },
  'home.why.badge': {
    tr: 'Neden Biz?',
    en: 'Why Us?'
  },
  'home.why.startNow': {
    tr: 'Şimdi Başla',
    en: 'Start Now'
  },
  'home.why.stats.projects': {
    tr: 'Tamamlanan Proje',
    en: 'Completed Projects'
  },
  'home.why.stats.affordable': {
    tr: 'Uygun Fiyat',
    en: 'Affordable Pricing'
  },
  'home.why.stats.satisfaction': {
    tr: 'Müşteri Memnuniyeti',
    en: 'Customer Satisfaction'
  },
  'home.why.stats.support': {
    tr: 'Destek',
    en: 'Support'
  },
  'home.why.selectedTeams.title': {
    tr: 'Seçilmiş Üniversiteli Ekipler',
    en: 'Selected University Teams'
  },
  'home.why.selectedTeams.description': {
    tr: 'Fakülte, yetkinlik ve portföy kriterlerine göre seçilmiş ekiplerle çalışırsınız.',
    en: 'You work with teams selected based on faculty, competence and portfolio criteria.'
  },
  'home.why.projectManagement.title': {
    tr: 'Profesyonel Proje Yönetimi',
    en: 'Professional Project Management'
  },
  'home.why.projectManagement.description': {
    tr: 'Süreç boyunca tek muhatabınız olan proje yöneticisi tüm adımları sizin yerinize koordine eder.',
    en: 'The project manager, who is your single point of contact throughout the process, coordinates all steps on your behalf.'
  },
  'home.why.pricing.title': {
    tr: 'Şeffaf ve Erişilebilir Fiyatlar',
    en: 'Transparent and Accessible Prices'
  },
  'home.why.pricing.description': {
    tr: 'Freelancer esnekliği ile kurumsal süreçleri birleştiren, anlaşılır fiyat yapısı.',
    en: 'Understandable pricing structure that combines freelancer flexibility with corporate processes.'
  },
  'home.why.digitalize.title': {
    tr: 'Türkiyeyi Dijitalleştiriyoruz',
    en: 'Digitalizing Turkey'
  },
  'home.why.digitalize.description': {
    tr: 'Markaları dijitalleştirirken genç yeteneklerin global seviyede üretmesini destekliyoruz.',
    en: 'While digitalizing brands, we support young talents to produce at a global level.'
  },

  // Free Report Section
  'home.report.title': {
    tr: 'Ücretsiz Dijital Raporunuzu Alın',
    en: 'Get Your Free Digital Report'
  },
  'home.report.description': {
    tr: 'Web sitenizden sosyal medya hesaplarınıza kadar dijital varlığınızı inceliyor, sektörünüzü ve rakiplerinizi analiz ediyor, size kısa ve net bir yol haritası çıkarıyoruz.',
    en: 'We examine your digital presence from your website to your social media accounts, analyze your industry and competitors, and create a short and clear roadmap for you.'
  },
  'home.report.check1': {
    tr: 'Web & e-ticaret kontrolleri',
    en: 'Web & e-commerce checks'
  },
  'home.report.check2': {
    tr: 'Sosyal medya & içerik analizi',
    en: 'Social media & content analysis'
  },
  'home.report.check3': {
    tr: 'Reklam & SEO hazırlık durumu',
    en: 'Advertising & SEO readiness'
  },
  'home.report.check4': {
    tr: 'İlk 30 gün için aksiyon listesi',
    en: 'Action list for the first 30 days'
  },
  'home.report.exportBadge': {
    tr: 'Beyin Göçü Yerine Hizmet İhracatı',
    en: 'Service Export Instead of Brain Drain'
  },
  'home.report.note': {
    tr: 'Görüşmenizi seçin, kalan her şeyi biz hazırlayalım.',
    en: 'Choose your meeting, we will prepare everything else.'
  },
  'home.report.meetingTitle': {
    tr: '30 Dakikalık Dijital Analiz Görüşmesi',
    en: '30-Minute Digital Analysis Meeting'
  },
  'home.report.meetingDescription': {
    tr: 'Takviminizden uygun zamanı seçin.',
    en: 'Choose a convenient time from your calendar.'
  },
  'home.report.subtitle': {
    tr: 'Dijital Analiz Raporu',
    en: 'Digital Analysis Report'
  },

  // Marquee Section
  'home.marquee.brainDrain': {
    tr: 'BEYİN GÖÇÜ YERİNE HİZMET İHRACATI',
    en: 'SERVICE EXPORT INSTEAD OF BRAIN DRAIN'
  },

  // Services Section
  'home.services.headline': {
    tr: 'işletmenizi dijital dünyada öne çıkaracak çözümler',
    en: 'solutions to make your business stand out in the digital world'
  },
  'home.services.title': {
    tr: 'DigitAll hizmetlerimiz',
    en: 'Our DigitAll services'
  },
  'home.services.description': {
    tr: 'Markanızın dijital yolculuğunun her adımı için, uzman üniversiteli ekiplerle uçtan uca çözümler sunuyoruz.',
    en: 'For every step of your brand\'s digital journey, we offer end-to-end solutions with expert university teams.'
  },
  'home.services.website.title': {
    tr: 'Web Sitesi',
    en: 'Website'
  },
  'home.services.website.description': {
    tr: 'Kurumsal, kişisel marka ve landing page web siteleri.',
    en: 'Corporate, personal brand and landing page websites.'
  },
  'home.services.ecommerce.title': {
    tr: 'E-Ticaret Çözümleri',
    en: 'E-Commerce Solutions'
  },
  'home.services.ecommerce.description': {
    tr: 'Hazır altyapı veya özel geliştirme ile satışa hazır mağazalar.',
    en: 'Ready-to-sell stores with ready-made infrastructure or custom development.'
  },
  'home.services.graphics.title': {
    tr: 'Grafik ve Tasarım',
    en: 'Graphics and Design'
  },
  'home.services.graphics.description': {
    tr: 'Logo, kurumsal kimlik, sosyal medya görselleri ve daha fazlası.',
    en: 'Logo, corporate identity, social media visuals and more.'
  },
  'home.services.mobile.title': {
    tr: 'Mobil Uygulama ve SaaS',
    en: 'Mobile App and SaaS'
  },
  'home.services.mobile.description': {
    tr: 'MVP, panel, dashboard ve SaaS ürünleri için geliştirme.',
    en: 'Development for MVP, panel, dashboard and SaaS products.'
  },
  'home.services.marketing.title': {
    tr: 'Pazarlama ve Reklam',
    en: 'Marketing and Advertising'
  },
  'home.services.marketing.description': {
    tr: 'Reklam yönetimi, sosyal medya, içerik üretimi.',
    en: 'Ad management, social media, content production.'
  },
  'home.services.3dar.title': {
    tr: '3D / AR',
    en: '3D / AR'
  },
  'home.services.3dar.description': {
    tr: '3D ürün modelleme, WebAR deneyimleri ve interaktif sunumlar.',
    en: '3D product modeling, WebAR experiences and interactive presentations.'
  },
  'home.services.ai.title': {
    tr: 'Yapay Zeka – Dijibot',
    en: 'Artificial Intelligence – Digibot'
  },
  'home.services.ai.description': {
    tr: 'AI chatbotlar ve süreçleri hızlandıran akıllı çözümler.',
    en: 'AI chatbots and smart solutions that speed up processes.'
  },

  // FAQ Section
  'home.faq.badge': {
    tr: 'Sık Sorulan Sorular',
    en: 'Frequently Asked Questions'
  },
  'home.faq.title': {
    tr: 'Sık Sorulan Sorular',
    en: 'Frequently Asked Questions'
  },
  'home.faq.description': {
    tr: 'Hem iş verenler hem de freelancerlar için süreci şeffaf ve anlaşılır kılmaya çalışıyoruz.',
    en: 'We try to make the process transparent and understandable for both employers and freelancers.'
  },
  'home.faq.employers.title': {
    tr: 'İş Verenler İçin',
    en: 'For Employers'
  },
  'home.faq.freelancers.title': {
    tr: 'Freelancerlar İçin',
    en: 'For Freelancers'
  },
  'home.faq.employer.q1': {
    tr: 'Proje süreci nasıl işliyor?',
    en: 'How does the project process work?'
  },
  'home.faq.employer.a1': {
    tr: 'İhtiyaç formunu dolduruyorsunuz, size uygun ekip ve teklif hazırlıyoruz; onay sonrası proje yöneticisiyle süreç başlıyor.',
    en: 'You fill out the requirement form, we prepare a suitable team and proposal for you; after approval, the process starts with the project manager.'
  },
  'home.faq.employer.q2': {
    tr: 'Fiyatlandırma nasıl belirleniyor?',
    en: 'How is pricing determined?'
  },
  'home.faq.employer.a2': {
    tr: 'İş kapsamına göre freelancer ekibi, proje yönetimi ve Unilancer payı şeffaf şekilde planlanıyor.',
    en: 'The freelancer team, project management and Unilancer share are planned transparently according to the scope of work.'
  },
  'home.faq.employer.q3': {
    tr: 'Teslim süreleri ne kadar?',
    en: 'What are the delivery times?'
  },
  'home.faq.employer.a3': {
    tr: 'Standart web projeleri genelde 3–6 hafta arasında tamamlanıyor. Daha karmaşık işler kapsamına göre planlanıyor.',
    en: 'Standard web projects are usually completed in 3-6 weeks. More complex projects are planned according to their scope.'
  },
  'home.faq.employer.q4': {
    tr: 'Tek muhatabım kim oluyor?',
    en: 'Who is my single point of contact?'
  },
  'home.faq.employer.a4': {
    tr: 'Tüm süreci yöneten deneyimli bir proje yöneticisi ile çalışıyorsunuz.',
    en: 'You work with an experienced project manager who manages the entire process.'
  },
  'home.faq.employer.q5': {
    tr: 'Memnun kalmazsam ne oluyor?',
    en: 'What happens if I am not satisfied?'
  },
  'home.faq.employer.a5': {
    tr: 'Revizyon süreci ve memnuniyet odaklı yaklaşımımızla projenin hedefe ulaşmasını birlikte sağlıyoruz.',
    en: 'With our revision process and satisfaction-focused approach, we ensure that the project reaches its goal together.'
  },
  'home.faq.freelancer.q1': {
    tr: 'Unilancer\'a nasıl freelancer olarak katılabilirim?',
    en: 'How can I join Unilancer as a freelancer?'
  },
  'home.faq.freelancer.a1': {
    tr: 'Başvuru formunu doldurup portföyünüzü yüklüyorsunuz; uygun profilleri görüşmeye davet ediyoruz.',
    en: 'You fill out the application form and upload your portfolio; we invite suitable profiles for an interview.'
  },
  'home.faq.freelancer.q2': {
    tr: 'Projeler nasıl dağıtılıyor?',
    en: 'How are projects distributed?'
  },
  'home.faq.freelancer.a2': {
    tr: 'Proje gereksinimleri, yetkinlikler ve önceki performans skorlarına göre ekipler oluşturuluyor.',
    en: 'Teams are formed based on project requirements, competencies and previous performance scores.'
  },
  'home.faq.freelancer.q3': {
    tr: 'Ödemelerimi nasıl alıyorum?',
    en: 'How do I receive my payments?'
  },
  'home.faq.freelancer.a3': {
    tr: 'Proje teslim ve onay sürecinin ardından ödemeniz güvenli şekilde tarafınıza aktarılıyor.',
    en: 'After the project delivery and approval process, your payment is securely transferred to you.'
  },
  'home.faq.freelancer.q4': {
    tr: 'Sadece öğrenciler mi başvurabiliyor?',
    en: 'Can only students apply?'
  },
  'home.faq.freelancer.a4': {
    tr: 'Ana odağımız üniversiteliler; bazı kategorilerde mezun profillere de yer verebiliyoruz.',
    en: 'Our main focus is university students; we can also include graduate profiles in some categories.'
  },
  'home.faq.freelancer.q5': {
    tr: 'Tam zamanlı çalışmak zorunda mıyım?',
    en: 'Do I have to work full-time?'
  },
  'home.faq.freelancer.a5': {
    tr: 'Hayır, proje bazlı ve esnek çalışma modelini destekliyoruz.',
    en: 'No, we support project-based and flexible working models.'
  },

  // Testimonials Section
  'home.testimonials.1.quote': {
    tr: 'Unilancer sayesinde MVP\'mizi çok hızlı ve uygun maliyetle hayata geçirdik. Genç ekibin enerjisi ve teknik yetkinliği beklentimizin çok üzerindeydi.',
    en: 'Thanks to Unilancer, we launched our MVP very quickly and cost-effectively. The energy and technical competence of the young team far exceeded our expectations.'
  },
  'home.testimonials.1.name': {
    tr: 'Ahmet Yılmaz',
    en: 'Ahmet Yılmaz'
  },
  'home.testimonials.1.designation': {
    tr: 'Kurucu Ortak, TechStart',
    en: 'Co-Founder, TechStart'
  },
  'home.testimonials.2.quote': {
    tr: 'E-ticaret sitemizi yenilemek için çalıştık. Hem profesyonel bir proje yönetimi hem de yaratıcı bir tasarım sundular. Satışlarımız %40 arttı.',
    en: 'We worked to renew our e-commerce site. They provided both professional project management and creative design. Our sales increased by 40%.'
  },
  'home.testimonials.2.name': {
    tr: 'Zeynep Demir',
    en: 'Zeynep Demir'
  },
  'home.testimonials.2.designation': {
    tr: 'Pazarlama Müdürü, ModaVibe',
    en: 'Marketing Manager, ModaVibe'
  },
  'home.testimonials.3.quote': {
    tr: 'Yoğun dönemlerimizde dış kaynak olarak Unilancer\'ı kullanıyoruz. İş kalitesi ve teslimat süreleri konusunda çok başarılılar, sanki kendi ekibimiz gibiler.',
    en: 'We use Unilancer as an outsource during our busy periods. They are very successful in terms of work quality and delivery times, as if they were our own team.'
  },
  'home.testimonials.3.name': {
    tr: 'Caner Öztürk',
    en: 'Caner Öztürk'
  },
  'home.testimonials.3.designation': {
    tr: 'Ajans Başkanı, CreativeWorks',
    en: 'Agency President, CreativeWorks'
  },
  'home.testimonials.4.quote': {
    tr: 'Sosyal medya içeriklerimiz için düzenli olarak çalışıyoruz. Gençlerin trendleri yakalaması ve dinamik bakış açısı markamıza büyük değer kattı.',
    en: 'We work regularly for our social media content. The young people\'s ability to catch trends and their dynamic perspective added great value to our brand.'
  },
  'home.testimonials.4.name': {
    tr: 'Elif Kaya',
    en: 'Elif Kaya'
  },
  'home.testimonials.4.designation': {
    tr: 'Marka Yöneticisi, FoodCo',
    en: 'Brand Manager, FoodCo'
  },
  'home.testimonials.5.quote': {
    tr: 'Aklımdaki mobil uygulama fikrini hayata geçirmek için doğru adresti. Teknik ekip çok ilgiliydi ve süreci şeffaf bir şekilde yönettiler.',
    en: 'It was the right place to bring my mobile app idea to life. The technical team was very attentive and managed the process transparently.'
  },
  'home.testimonials.5.name': {
    tr: 'Murat Çelik',
    en: 'Murat Çelik'
  },
  'home.testimonials.5.designation': {
    tr: 'Girişimci',
    en: 'Entrepreneur'
  },

  // Meeting Section
  'home.meeting.title': {
    tr: 'Hemen Görüşelim',
    en: 'Let\'s Talk Now'
  },
  'home.meeting.description': {
    tr: 'Projenizi hemen başlatmak için 15 dakikalık ücretsiz görüşme ayarlayabilirsiniz.',
    en: 'You can schedule a 15-minute free meeting to start your project immediately.'
  },

  // About Page Translations
  'about.story.title': {
    tr: 'Hikayemiz',
    en: 'Our Story'
  },
  'about.story.p1': {
    tr: '2022 yılında, farklı alanlarda freelance hizmet veren üniversiteli gençler olarak; "Uni" (üniversiteli, bir ve bütün) ve "Freelancer" kavramlarından ilham alarak',
    en: 'In 2022, as university youth providing freelance services in different fields; inspired by the concepts of "Uni" (university, one and whole) and "Freelancer"'
  },
  'about.story.unilancer': {
    tr: 'Unilancer Labs',
    en: 'Unilancer Labs'
  },
  'about.story.p1End': {
    tr: '\'i kurduk.',
    en: ', we founded it.'
  },
  'about.story.p2': {
    tr: 'Kısa sürede',
    en: 'In a short time'
  },
  'about.story.p2Count': {
    tr: '150',
    en: '150'
  },
  'about.story.p2Middle': {
    tr: '\'den fazla',
    en: 'more than'
  },
  'about.story.p2Skilled': {
    tr: 'yetkin freelancerı',
    en: 'qualified freelancers'
  },
  'about.story.p2End': {
    tr: 'bünyemize katarak "Unilance" iş modelini geliştirdik.',
    en: 'we developed the "Unilance" business model by adding them to our organization.'
  },
  'about.story.p3': {
    tr: 'Bugün,',
    en: 'Today,'
  },
  'about.story.technopark': {
    tr: 'Teknopark İstanbul',
    en: 'Teknopark Istanbul'
  },
  'about.story.p3Middle': {
    tr: 'bünyesinde yazılım, tasarım ve pazarlama alanlarında',
    en: 'we offer'
  },
  'about.story.b2b': {
    tr: 'B2B',
    en: 'B2B'
  },
  'about.story.p3End': {
    tr: 'hizmetler sunuyoruz.',
    en: 'services in software, design and marketing fields.'
  },
  'about.badge.software': {
    tr: 'Yazılım',
    en: 'Software'
  },
  'about.badge.design': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'about.badge.marketing': {
    tr: 'Dijital Pazarlama',
    en: 'Digital Marketing'
  },
  'about.stats.freelancers': {
    tr: 'Freelancer',
    en: 'Freelancers'
  },
  'about.company.unilancerLabs': {
    tr: 'Unilancer Labs',
    en: 'Unilancer Labs'
  },
  'about.company.unilancerLabs.subtitle': {
    tr: 'Yazılım ve Teknoloji Çözümleri',
    en: 'Software and Technology Solutions'
  },
  'about.company.unilancerLabs.description': {
    tr: 'Unilancer Labs, yazılım ve teknoloji alanında yenilikçi çözümler sunan ana şirketimizdir. Web ve mobil uygulama geliştirme, yapay zeka entegrasyonları ve özel yazılım çözümleri konularında uzmanlaşmış ekibimizle, işletmelerin dijital dönüşüm süreçlerini yönetiyoruz.',
    en: 'Unilancer Labs is our main company that offers innovative solutions in software and technology. With our team specialized in web and mobile application development, artificial intelligence integrations and custom software solutions, we manage the digital transformation processes of businesses.'
  },
  'about.company.tag.webDev': {
    tr: 'Web Geliştirme',
    en: 'Web Development'
  },
  'about.company.tag.mobileApp': {
    tr: 'Mobil Uygulama',
    en: 'Mobile App'
  },
  'about.company.tag.ai': {
    tr: 'AI Entegrasyonları',
    en: 'AI Integrations'
  },
  'about.company.tag.saas': {
    tr: 'SaaS Çözümleri',
    en: 'SaaS Solutions'
  },
  'about.company.lanceArt': {
    tr: 'Lance Art',
    en: 'Lance Art'
  },
  'about.company.lanceArt.subtitle': {
    tr: 'Tasarım ve Kreatif Stüdyo',
    en: 'Design and Creative Studio'
  },
  'about.company.lanceArt.description': {
    tr: 'Lance Art, yaratıcı tasarım çözümleri sunan kreatif stüdyomuzdur. Dijital tasarım, marka kimliği, UI/UX tasarımı ve illüstrasyon alanlarında uzman ekibimizle, markaların görsel dünyasını şekillendiriyoruz.',
    en: 'Lance Art is our creative studio that offers creative design solutions. With our team specialized in digital design, brand identity, UI/UX design and illustration, we shape the visual world of brands.'
  },
  'about.company.tag.uiux': {
    tr: 'UI/UX Tasarım',
    en: 'UI/UX Design'
  },
  'about.company.tag.brand': {
    tr: 'Marka Kimliği',
    en: 'Brand Identity'
  },
  'about.company.tag.illustration': {
    tr: 'İllüstrasyon',
    en: 'Illustration'
  },
  'about.company.tag.3d': {
    tr: '3D Tasarım',
    en: '3D Design'
  },
  'about.mission.title': {
    tr: 'Misyonumuz',
    en: 'Our Mission'
  },
  'about.mission.quote': {
    tr: 'Beyin Göçü yerine Hizmet İhracatı',
    en: 'Service Export Instead of Brain Drain'
  },
  'about.mission.description': {
    tr: 'Ülkemizin önemli sorunlarından biri olan beyin göçünü hizmet ihracatı yoluyla azaltmayı ve ölçeklenebilir bir yapıyla freelancerlar, işverenler ve iş ortaklarımız için güvenilir, kârlı ve adil bir freelance ekosistemi olmayı amaçlıyoruz.',
    en: 'We aim to reduce brain drain, one of our country\'s important problems, through service export and to be a reliable, profitable and fair freelance ecosystem for freelancers, employers and our business partners with a scalable structure.'
  },
  'about.vision.title': {
    tr: 'Vizyonumuz',
    en: 'Our Vision'
  },
  'about.vision.quote': {
    tr: 'Freelancer Ekosistemin İlk Tercihi',
    en: 'First Choice of the Freelancer Ecosystem'
  },
  'about.vision.description': {
    tr: 'Öncelikle Türkiye\'de, ardından dünyada freelancerlar ile firmaların ilk tercihi olmak. Yenilikçi iş modelimiz ve teknoloji odaklı yaklaşımımızla sektöre yön veren bir marka olmayı hedefliyoruz.',
    en: 'To be the first choice of freelancers and companies in Turkey first, then in the world. We aim to be a brand that shapes the industry with our innovative business model and technology-oriented approach.'
  },
  'about.team.title': {
    tr: 'Ekibimiz',
    en: 'Our Team'
  },
  'about.team.description': {
    tr: 'Deneyimli ve tutkulu ekibimizle müşterilerimize en iyi hizmeti sunuyoruz',
    en: 'We provide the best service to our customers with our experienced and passionate team'
  },
  'about.team.members.count': {
    tr: 'Yetenekli Freelancer',
    en: 'Talented Freelancers'
  },
  'about.team.members.description': {
    tr: 'Farklı uzmanlık alanlarında deneyimli freelancer ekibimizle projelerinizi hayata geçiriyoruz',
    en: 'We bring your projects to life with our experienced freelancer team in different areas of expertise'
  },
  'about.cta.title': {
    tr: 'Ekibimize Katılın',
    en: 'Join Our Team'
  },
  'about.cta.description': {
    tr: 'Yeteneklerinizi bizimle paylaşın, birlikte büyüyelim',
    en: 'Share your talents with us, let\'s grow together'
  },
  'about.cta.freelancerApply': {
    tr: 'Freelancer Başvurusu',
    en: 'Freelancer Application'
  },
  'about.cta.contactUs': {
    tr: 'Bize Ulaşın',
    en: 'Contact Us'
  },

  // Portfolio Page Translations
  'portfolio.title': {
    tr: 'Portfolyo',
    en: 'Portfolio'
  },
  'portfolio.subtitle': {
    tr: 'Gerçekleştirdiğimiz projelerle markaları dijitale taşıyoruz',
    en: 'We bring brands to digital with our completed projects'
  },
  'portfolio.category.all': {
    tr: 'Tümü',
    en: 'All'
  },
  'portfolio.category.software': {
    tr: 'Yazılım',
    en: 'Software'
  },
  'portfolio.category.design': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'portfolio.category.marketing': {
    tr: 'Dijital Pazarlama',
    en: 'Digital Marketing'
  },
  'portfolio.category.web': {
    tr: 'Web Geliştirme',
    en: 'Web Development'
  },
  'portfolio.category.mobile': {
    tr: 'Mobil Uygulama',
    en: 'Mobile App'
  },
  'portfolio.category.saas': {
    tr: 'SaaS Çözümleri',
    en: 'SaaS Solutions'
  },
  'portfolio.category.ai': {
    tr: 'AI Entegrasyonları',
    en: 'AI Integrations'
  },
  'portfolio.category.uiux': {
    tr: 'UI/UX Tasarım',
    en: 'UI/UX Design'
  },
  'portfolio.category.brand': {
    tr: 'Kurumsal Kimlik',
    en: 'Corporate Identity'
  },
  'portfolio.category.print': {
    tr: 'Basılı Tasarım',
    en: 'Print Design'
  },
  'portfolio.category.illustration': {
    tr: '3D & İllüstrasyon',
    en: '3D & Illustration'
  },
  'portfolio.category.seo': {
    tr: 'SEO & SEM',
    en: 'SEO & SEM'
  },
  'portfolio.category.ads': {
    tr: 'Dijital Reklam',
    en: 'Digital Ads'
  },
  'portfolio.category.analytics': {
    tr: 'Analitik',
    en: 'Analytics'
  },
  'portfolio.viewProject': {
    tr: 'Projeyi Görüntüle',
    en: 'View Project'
  },
  'portfolio.viewWebsite': {
    tr: 'Web Sitesini Ziyaret Et',
    en: 'Visit Website'
  },
  'portfolio.viewGithub': {
    tr: 'GitHub Reposunu Gör',
    en: 'View GitHub Repo'
  },
  'portfolio.loading': {
    tr: 'Projeler yükleniyor...',
    en: 'Loading projects...'
  },
  'portfolio.noProjects': {
    tr: 'Henüz proje bulunmamaktadır',
    en: 'No projects available yet'
  },

  // Services Page Translations
  'services.hero.title': {
    tr: 'Dijital Çözümlerimiz',
    en: 'Our Digital Solutions'
  },
  'services.hero.subtitle': {
    tr: 'Web\'den mobil uygulamalara, tasarımdan pazarlamaya kadar tüm dijital ihtiyaçlarınız için profesyonel çözümler',
    en: 'Professional solutions for all your digital needs, from web to mobile apps, design to marketing'
  },
  'services.software.title': {
    tr: 'Yazılım Geliştirme',
    en: 'Software Development'
  },
  'services.software.desc': {
    tr: 'Modern teknolojilerle güçlü ve ölçeklenebilir yazılım çözümleri',
    en: 'Powerful and scalable software solutions with modern technologies'
  },
  'services.software.web': {
    tr: 'Web Uygulamaları',
    en: 'Web Applications'
  },
  'services.software.mobile': {
    tr: 'Mobil Uygulamalar',
    en: 'Mobile Apps'
  },
  'services.software.ecommerce': {
    tr: 'E-Ticaret Platformları',
    en: 'E-Commerce Platforms'
  },
  'services.software.api': {
    tr: 'API Entegrasyonları',
    en: 'API Integrations'
  },
  'services.design.title': {
    tr: 'Tasarım Hizmetleri',
    en: 'Design Services'
  },
  'services.design.desc': {
    tr: 'Markanızı öne çıkaran yaratıcı tasarım çözümleri',
    en: 'Creative design solutions that make your brand stand out'
  },
  'services.design.uiux': {
    tr: 'UI/UX Tasarımı',
    en: 'UI/UX Design'
  },
  'services.design.logo': {
    tr: 'Logo & Kurumsal Kimlik',
    en: 'Logo & Corporate Identity'
  },
  'services.design.graphics': {
    tr: 'Grafik Tasarım',
    en: 'Graphic Design'
  },
  'services.design.3d': {
    tr: '3D Modelleme',
    en: '3D Modeling'
  },
  'services.marketing.title': {
    tr: 'Dijital Pazarlama',
    en: 'Digital Marketing'
  },
  'services.marketing.desc': {
    tr: 'Markanızı büyüten stratejik pazarlama çözümleri',
    en: 'Strategic marketing solutions that grow your brand'
  },
  'services.marketing.seo': {
    tr: 'SEO Optimizasyonu',
    en: 'SEO Optimization'
  },
  'services.marketing.social': {
    tr: 'Sosyal Medya Yönetimi',
    en: 'Social Media Management'
  },
  'services.marketing.ads': {
    tr: 'Dijital Reklamcılık',
    en: 'Digital Advertising'
  },
  'services.marketing.content': {
    tr: 'İçerik Üretimi',
    en: 'Content Production'
  },
  'services.consulting.title': {
    tr: 'Danışmanlık',
    en: 'Consulting'
  },
  'services.consulting.desc': {
    tr: 'Dijital dönüşüm sürecinizde uzman rehberlik',
    en: 'Expert guidance in your digital transformation process'
  },
  'services.consulting.strategy': {
    tr: 'Dijital Strateji',
    en: 'Digital Strategy'
  },
  'services.consulting.tech': {
    tr: 'Teknoloji Danışmanlığı',
    en: 'Technology Consulting'
  },
  'services.consulting.optimization': {
    tr: 'Süreç Optimizasyonu',
    en: 'Process Optimization'
  },
  'services.consulting.training': {
    tr: 'Eğitim & Workshop',
    en: 'Training & Workshop'
  },
  'services.cta.title': {
    tr: 'Projenizi Başlatalım',
    en: 'Let\'s Start Your Project'
  },
  'services.cta.description': {
    tr: 'Size özel çözümler için hemen iletişime geçin',
    en: 'Contact us now for customized solutions'
  },
  'services.cta.button': {
    tr: 'Ücretsiz Teklif Alın',
    en: 'Get Free Quote'
  },

  // Contact Page Translations
  'contact.title': {
    tr: 'İletişime Geçin',
    en: 'Get In Touch'
  },
  'contact.subtitle': {
    tr: 'Projeniz hakkında konuşalım',
    en: 'Let\'s talk about your project'
  },
  'contact.form.name': {
    tr: 'İsim Soyisim',
    en: 'Full Name'
  },
  'contact.form.email': {
    tr: 'E-posta',
    en: 'Email'
  },
  'contact.form.subject': {
    tr: 'Konu',
    en: 'Subject'
  },
  'contact.form.message': {
    tr: 'Mesajınız',
    en: 'Your Message'
  },
  'contact.form.submit': {
    tr: 'Gönder',
    en: 'Send'
  },
  'contact.info.address': {
    tr: 'Adres',
    en: 'Address'
  },
  'contact.info.phone': {
    tr: 'Telefon',
    en: 'Phone'
  },
  'contact.info.email': {
    tr: 'E-posta',
    en: 'Email'
  },
  'contact.info.hours': {
    tr: 'Çalışma Saatleri',
    en: 'Working Hours'
  },
  'contact.info.hoursValue': {
    tr: 'Pazartesi - Cuma: 09:00 - 18:00',
    en: 'Monday - Friday: 09:00 - 18:00'
  },
  'contact.socials.title': {
    tr: 'Sosyal Medya',
    en: 'Social Media'
  },
  'contact.socials.follow': {
    tr: 'Bizi takip edin',
    en: 'Follow us'
  },

  // Blog Page Translations
  'blog.title': {
    tr: 'Blog',
    en: 'Blog'
  },
  'blog.subtitle': {
    tr: 'Teknoloji, tasarım ve dijital pazarlama üzerine güncel yazılar',
    en: 'Latest articles on technology, design and digital marketing'
  },
  'blog.readMore': {
    tr: 'Devamını Oku',
    en: 'Read More'
  },
  'blog.categories': {
    tr: 'Kategoriler',
    en: 'Categories'
  },
  'blog.allPosts': {
    tr: 'Tüm Yazılar',
    en: 'All Posts'
  },
  'blog.noResults': {
    tr: 'Sonuç bulunamadı',
    en: 'No results found'
  },
  'blog.loading': {
    tr: 'Yükleniyor...',
    en: 'Loading...'
  },
  'blog.published': {
    tr: 'Yayınlanma',
    en: 'Published'
  },
  'blog.author': {
    tr: 'Yazar',
    en: 'Author'
  },
  'blog.relatedPosts': {
    tr: 'İlgili Yazılar',
    en: 'Related Posts'
  },
  'blog.sharePost': {
    tr: 'Yazıyı Paylaş',
    en: 'Share Post'
  },
  'blog.latestUpdates': {
    tr: 'Son Güncellemeler',
    en: 'Latest Updates'
  },
  'blog.readFullArticle': {
    tr: 'Yazının tamamını oku',
    en: 'Read full article'
  },
  'blog.searchPlaceholder': {
    tr: 'Yazılarda ara...',
    en: 'Search articles...'
  },
  'blog.tryAgain': {
    tr: 'Tekrar Dene',
    en: 'Try Again'
  },
  'blog.clearSearch': {
    tr: 'Aramayı Temizle',
    en: 'Clear Search'
  },
  'blog.noPostsYet': {
    tr: 'Henüz blog yazısı eklenmemiş.',
    en: 'No blog posts yet.'
  },
  'blog.noPostsFound': {
    tr: 'Aramanızla eşleşen yazı bulunamadı.',
    en: 'No posts found matching your search.'
  },

  // Join Us Page Translations
  'join.title': {
    tr: 'Bize Katıl',
    en: 'Join Us'
  },
  'join.subtitle': {
    tr: 'Yeteneklerini paylaş, birlikte büyüyelim',
    en: 'Share your talents, let\'s grow together'
  },
  'join.form.fullName': {
    tr: 'Ad Soyad',
    en: 'Full Name'
  },
  'join.form.email': {
    tr: 'E-posta',
    en: 'Email'
  },
  'join.form.phone': {
    tr: 'Telefon',
    en: 'Phone'
  },
  'join.form.university': {
    tr: 'Üniversite',
    en: 'University'
  },
  'join.form.department': {
    tr: 'Bölüm',
    en: 'Department'
  },
  'join.form.skills': {
    tr: 'Yetenekler',
    en: 'Skills'
  },
  'join.form.portfolio': {
    tr: 'Portfolio URL',
    en: 'Portfolio URL'
  },
  'join.form.message': {
    tr: 'Mesajınız',
    en: 'Your Message'
  },
  'join.form.submit': {
    tr: 'Başvuruyu Gönder',
    en: 'Submit Application'
  },
  'join.benefits.title': {
    tr: 'Neden Unilancer?',
    en: 'Why Unilancer?'
  },
  'join.benefits.flexible': {
    tr: 'Esnek Çalışma',
    en: 'Flexible Working'
  },
  'join.benefits.projects': {
    tr: 'Gerçek Projeler',
    en: 'Real Projects'
  },
  'join.benefits.mentorship': {
    tr: 'Mentorluk',
    en: 'Mentorship'
  },
  'join.benefits.income': {
    tr: 'Gelir Elde Et',
    en: 'Earn Income'
  },

  // Project Request Page Translations
  'projectRequest.title': {
    tr: 'Proje Talebi',
    en: 'Project Request'
  },
  'projectRequest.subtitle': {
    tr: 'Projenizi anlatın, size özel teklif hazırlayalım',
    en: 'Tell us about your project, we\'ll prepare a custom proposal'
  },
  'projectRequest.form.company': {
    tr: 'Şirket Adı',
    en: 'Company Name'
  },
  'projectRequest.form.contactPerson': {
    tr: 'İletişim Kişisi',
    en: 'Contact Person'
  },
  'projectRequest.form.email': {
    tr: 'E-posta',
    en: 'Email'
  },
  'projectRequest.form.phone': {
    tr: 'Telefon',
    en: 'Phone'
  },
  'projectRequest.form.projectType': {
    tr: 'Proje Tipi',
    en: 'Project Type'
  },
  'projectRequest.form.budget': {
    tr: 'Bütçe',
    en: 'Budget'
  },
  'projectRequest.form.timeline': {
    tr: 'Zaman Çizelgesi',
    en: 'Timeline'
  },
  'projectRequest.form.description': {
    tr: 'Proje Açıklaması',
    en: 'Project Description'
  },
  'projectRequest.form.submit': {
    tr: 'Talebi Gönder',
    en: 'Submit Request'
  },
  'projectRequest.types.website': {
    tr: 'Web Sitesi',
    en: 'Website'
  },
  'projectRequest.types.ecommerce': {
    tr: 'E-Ticaret',
    en: 'E-Commerce'
  },
  'projectRequest.types.mobile': {
    tr: 'Mobil Uygulama',
    en: 'Mobile App'
  },
  'projectRequest.types.design': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'projectRequest.types.marketing': {
    tr: 'Dijital Pazarlama',
    en: 'Digital Marketing'
  },
  'projectRequest.types.other': {
    tr: 'Diğer',
    en: 'Other'
  },

  // 3D AR Virtual Tour Page Translations
  '3dar.title': {
    tr: '3D AR Sanal Tur',
    en: '3D AR Virtual Tour'
  },
  '3dar.subtitle': {
    tr: 'İnteraktif 3D deneyimler ve sanal turlar',
    en: 'Interactive 3D experiences and virtual tours'
  },
  '3dar.features.title': {
    tr: 'Özellikler',
    en: 'Features'
  },
  '3dar.features.3dModeling': {
    tr: '3D Modelleme',
    en: '3D Modeling'
  },
  '3dar.features.ar': {
    tr: 'Artırılmış Gerçeklik',
    en: 'Augmented Reality'
  },
  '3dar.features.virtualTour': {
    tr: 'Sanal Tur',
    en: 'Virtual Tour'
  },
  '3dar.features.interactive': {
    tr: 'İnteraktif Deneyim',
    en: 'Interactive Experience'
  },
  'nav.getFreeReport': {
    tr: 'Ücretsiz Dijital Raporunuzu Alın',
    en: 'Get Your Free Digital Report'
  },
  'nav.scheduleConsultation': {
    tr: 'Görüşme Ayarlayın',
    en: 'Schedule Consultation'
  },
  'nav.universities': {
    tr: 'Üniversiteliler',
    en: 'Universities'
  },
  'nav.corporate': {
    tr: 'Kurumsal',
    en: 'Corporate'
  },
  'nav.team': {
    tr: 'Ekibimiz',
    en: 'Our Team'
  },
  'nav.digitAllSolutions': {
    tr: 'digitAll Çözümler',
    en: 'digitAll Solutions'
  },
  'nav.digitAllDescription': {
    tr: 'İşletmenizi geleceğe taşıyacak teknoloji çözümleri',
    en: 'Technology solutions to take your business into the future'
  },
  'nav.viewAll': {
    tr: 'Tümünü Gör',
    en: 'View All'
  },
  'nav.clickForDetails': {
    tr: 'Detaylı bilgi için tıklayın',
    en: 'Click for details'
  },
  'nav.free': {
    tr: 'Ücretsiz',
    en: 'Free'
  },
  'nav.digitalReportTitle': {
    tr: 'Dijital Karnenizi Merak Ediyor Musunuz?',
    en: 'Curious About Your Digital Report Card?'
  },
  'nav.freeReportBadge': {
    tr: '%100 Ücretsiz & Kapsamlı Rapor',
    en: '100% Free & Comprehensive Report'
  },
  'nav.bookNow': {
    tr: 'Hemen Randevu Oluştur',
    en: 'Book Now'
  },
  'nav.freeConsultation': {
    tr: 'Ücretsiz danışmanlık kazanın',
    en: 'Win free consultation'
  },

  // Blog Category Translations
  'blog.category.all': {
    tr: 'Tümü',
    en: 'All'
  },
  'blog.category.technology': {
    tr: 'Teknoloji',
    en: 'Technology'
  },
  'blog.category.design': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'blog.category.ai': {
    tr: 'Yapay Zeka',
    en: 'Artificial Intelligence'
  },
  'blog.category.webDevelopment': {
    tr: 'Web Geliştirme',
    en: 'Web Development'
  },
  'blog.category.mobile': {
    tr: 'Mobil',
    en: 'Mobile'
  },
  'blog.search.placeholder': {
    tr: 'Blog yazılarında ara...',
    en: 'Search blog posts...'
  },
  'blog.loadMore': {
    tr: 'Daha Fazla Yükle',
    en: 'Load More'
  },
  'blog.backToTop': {
    tr: 'Başa Dön',
    en: 'Back to Top'
  },

  // Project Request Form Translations
  'projectRequest.step1.title': {
    tr: 'Hizmet Seçimi',
    en: 'Service Selection'
  },
  'projectRequest.step1.subtitle': {
    tr: 'İhtiyacınız olan hizmetleri seçin',
    en: 'Select the services you need'
  },
  'projectRequest.step2.title': {
    tr: 'Proje Detayları',
    en: 'Project Details'
  },
  'projectRequest.step2.subtitle': {
    tr: 'Projeniz hakkında bilgi verin',
    en: 'Tell us about your project'
  },
  'projectRequest.step3.title': {
    tr: 'Çözüm Tipi',
    en: 'Solution Type'
  },
  'projectRequest.step3.subtitle': {
    tr: 'İhtiyacınıza uygun çözümü seçin',
    en: 'Choose the solution that fits your needs'
  },
  'projectRequest.step4.title': {
    tr: 'İletişim Bilgileri',
    en: 'Contact Information'
  },
  'projectRequest.step4.subtitle': {
    tr: 'Sizinle nasıl iletişime geçelim?',
    en: 'How can we reach you?'
  },
  'projectRequest.step5.title': {
    tr: 'Özet',
    en: 'Summary'
  },
  'projectRequest.step5.subtitle': {
    tr: 'Bilgilerinizi kontrol edin',
    en: 'Review your information'
  },
  'projectRequest.category.software': {
    tr: 'Yazılım',
    en: 'Software'
  },
  'projectRequest.category.design': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'projectRequest.category.digitalStrategy': {
    tr: 'Dijital Strateji',
    en: 'Digital Strategy'
  },
  'projectRequest.timeline.1week': {
    tr: '1 Hafta',
    en: '1 Week'
  },
  'projectRequest.timeline.1-4weeks': {
    tr: '1-4 Hafta',
    en: '1-4 Weeks'
  },
  'projectRequest.timeline.1-3months': {
    tr: '1-3 Ay',
    en: '1-3 Months'
  },
  'projectRequest.timeline.3-6months': {
    tr: '3-6 Ay',
    en: '3-6 Months'
  },
  'projectRequest.timeline.6monthsPlus': {
    tr: '6+ Ay',
    en: '6+ Months'
  },
  'projectRequest.timeline.undecided': {
    tr: 'Henüz Karar Vermedim',
    en: 'Not Decided Yet'
  },
  'projectRequest.solution.oneTime': {
    tr: 'Tek Seferlik Proje',
    en: 'One-Time Project'
  },
  'projectRequest.solution.additionalSupport': {
    tr: 'Ek Destek',
    en: 'Additional Support'
  },
  'projectRequest.solution.regularService': {
    tr: 'Düzenli Hizmet',
    en: 'Regular Service'
  },
  'projectRequest.solution.other': {
    tr: 'Diğer',
    en: 'Other'
  },
  'projectRequest.form.companyName': {
    tr: 'Şirket Adı',
    en: 'Company Name'
  },
  'projectRequest.form.contactName': {
    tr: 'İletişim Kişisi',
    en: 'Contact Person'
  },
  'projectRequest.form.projectDescription': {
    tr: 'Proje Açıklaması',
    en: 'Project Description'
  },
  'projectRequest.form.briefUrl': {
    tr: 'Brifing/Dosya Linki (Opsiyonel)',
    en: 'Brief/File Link (Optional)'
  },
  'projectRequest.button.next': {
    tr: 'İleri',
    en: 'Next'
  },
  'projectRequest.button.back': {
    tr: 'Geri',
    en: 'Back'
  },
  'projectRequest.button.submit': {
    tr: 'Gönder',
    en: 'Submit'
  },
  'projectRequest.success.title': {
    tr: 'Talebiniz Alındı!',
    en: 'Request Received!'
  },
  'projectRequest.success.message': {
    tr: 'En kısa sürede sizinle iletişime geçeceğiz.',
    en: 'We will contact you as soon as possible.'
  },
  'projectRequest.error.selectCategory': {
    tr: 'Lütfen en az bir hizmet kategorisi seçin',
    en: 'Please select at least one service category'
  },
  'projectRequest.error.fillFields': {
    tr: 'Lütfen tüm gerekli alanları doldurun',
    en: 'Please fill in all required fields'
  },

  // Join Us Form Translations
  'joinUs.step1.title': {
    tr: 'Kişisel Bilgiler',
    en: 'Personal Information'
  },
  'joinUs.step2.title': {
    tr: 'Yetenekleriniz',
    en: 'Your Skills'
  },
  'joinUs.step3.title': {
    tr: 'Portfolyo',
    en: 'Portfolio'
  },
  'joinUs.step4.title': {
    tr: 'Özgeçmiş',
    en: 'Resume'
  },
  'joinUs.form.location': {
    tr: 'Konum',
    en: 'Location'
  },
  'joinUs.form.turkey': {
    tr: 'Türkiye',
    en: 'Turkey'
  },
  'joinUs.form.international': {
    tr: 'Uluslararası',
    en: 'International'
  },
  'joinUs.form.city': {
    tr: 'Şehir',
    en: 'City'
  },
  'joinUs.form.country': {
    tr: 'Ülke',
    en: 'Country'
  },
  'joinUs.form.workPreference': {
    tr: 'Çalışma Tercihi',
    en: 'Work Preference'
  },
  'joinUs.form.remote': {
    tr: 'Uzaktan',
    en: 'Remote'
  },
  'joinUs.form.hybrid': {
    tr: 'Hibrit',
    en: 'Hybrid'
  },
  'joinUs.form.categories': {
    tr: 'Kategoriler',
    en: 'Categories'
  },
  'joinUs.form.mainExpertise': {
    tr: 'Ana Uzmanlık Alanları',
    en: 'Main Expertise'
  },
  'joinUs.form.subExpertise': {
    tr: 'Alt Uzmanlık Alanları',
    en: 'Sub Expertise'
  },
  'joinUs.form.tools': {
    tr: 'Araçlar ve Teknolojiler',
    en: 'Tools and Technologies'
  },
  'joinUs.form.educationStatus': {
    tr: 'Eğitim Durumu',
    en: 'Education Status'
  },
  'joinUs.form.graduationYear': {
    tr: 'Mezuniyet Yılı',
    en: 'Graduation Year'
  },
  'joinUs.form.portfolioTitle': {
    tr: 'Portfolyo Başlığı',
    en: 'Portfolio Title'
  },
  'joinUs.form.portfolioUrl': {
    tr: 'Portfolyo URL',
    en: 'Portfolio URL'
  },
  'joinUs.form.addPortfolio': {
    tr: 'Portfolyo Ekle',
    en: 'Add Portfolio'
  },
  'joinUs.form.socialPlatform': {
    tr: 'Platform',
    en: 'Platform'
  },
  'joinUs.form.socialUrl': {
    tr: 'URL',
    en: 'URL'
  },
  'joinUs.form.addSocial': {
    tr: 'Sosyal Medya Ekle',
    en: 'Add Social Media'
  },
  'joinUs.form.cvUpload': {
    tr: 'Özgeçmiş Yükle',
    en: 'Upload Resume'
  },
  'joinUs.form.dropFile': {
    tr: 'Dosyayı buraya sürükleyin veya seçmek için tıklayın',
    en: 'Drag and drop file here or click to select'
  },
  'joinUs.form.pdfOnly': {
    tr: 'Sadece PDF dosyası (Maks. 5MB)',
    en: 'PDF only (Max. 5MB)'
  },
  'joinUs.success.title': {
    tr: 'Başvurunuz Alındı!',
    en: 'Application Received!'
  },
  'joinUs.success.message': {
    tr: 'Başvurunuzu inceleyip en kısa sürede geri dönüş yapacağız.',
    en: 'We will review your application and get back to you soon.'
  },
  'joinUs.button.previous': {
    tr: 'Önceki',
    en: 'Previous'
  },
  'joinUs.button.next': {
    tr: 'Sonraki',
    en: 'Next'
  },
  'joinUs.button.submit': {
    tr: 'Başvuruyu Gönder',
    en: 'Submit Application'
  },
  'joinUs.category.software': {
    tr: 'Yazılım',
    en: 'Software'
  },
  'joinUs.category.design': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'joinUs.category.marketing': {
    tr: 'Dijital Pazarlama',
    en: 'Digital Marketing'
  },
  
  // 3D AR Virtual Tour Page
  '3dar.hero.badge': {
    tr: '3D Modelleme & AR Teknolojisi',
    en: '3D Modeling & AR Technology'
  },
  '3dar.hero.title1': {
    tr: '3D Ürün Modelleme',
    en: '3D Product Modeling'
  },
  '3dar.hero.title2': {
    tr: '& Artırılmış Gerçeklik',
    en: '& Augmented Reality'
  },
  '3dar.hero.description': {
    tr: 'Ürünlerinizi interaktif 3D modeller ve artırılmış gerçeklik (AR) teknolojisi ile sunun. Müşterileriniz ürünleri her açıdan inceleyebilir, kendi mekanlarında sanal olarak test edebilir.',
    en: 'Present your products with interactive 3D models and augmented reality (AR) technology. Your customers can examine products from every angle and virtually test them in their own space.'
  },
  '3dar.hero.whatCanYouDo': {
    tr: '3D & AR İle Neler Yapabilirsiniz?',
    en: 'What Can You Do With 3D & AR?'
  },
  '3dar.hero.feature1.title': {
    tr: '360° Ürün Görselleri:',
    en: '360° Product Visuals:'
  },
  '3dar.hero.feature1.desc': {
    tr: 'Müşterileriniz ürünü her açıdan döndürerek inceleyebilir',
    en: 'Your customers can rotate and examine the product from every angle'
  },
  '3dar.hero.feature2.title': {
    tr: 'Renk & Materyal Seçenekleri:',
    en: 'Color & Material Options:'
  },
  '3dar.hero.feature2.desc': {
    tr: 'Farklı varyasyonları anında gösterin',
    en: 'Show different variations instantly'
  },
  '3dar.hero.feature3.title': {
    tr: 'AR ile Yerinde Test:',
    en: 'AR On-Site Testing:'
  },
  '3dar.hero.feature3.desc': {
    tr: 'Mobilya, dekorasyon ürünlerini kendi mekanında görün',
    en: 'See furniture, decoration products in your own space'
  },
  '3dar.hero.feature4.title': {
    tr: 'Web & Mobil Uyumlu:',
    en: 'Web & Mobile Compatible:'
  },
  '3dar.hero.feature4.desc': {
    tr: 'Tüm platformlarda sorunsuz çalışır',
    en: 'Works seamlessly on all platforms'
  },
  '3dar.hero.cta': {
    tr: '3D Model Talebi',
    en: '3D Model Request'
  },
  '3dar.hero.colorHint': {
    tr: 'Sol üstten renk seçeneklerini deneyin',
    en: 'Try color options from the top left'
  },
  '3dar.benefits.title': {
    tr: '3D Modelleme & AR\'ın Faydaları',
    en: 'Benefits of 3D Modeling & AR'
  },
  '3dar.benefits.subtitle': {
    tr: 'İşletmeniz için 3D ürün görselleri ve AR teknolojisinin sağladığı avantajlar',
    en: 'Advantages of 3D product visuals and AR technology for your business'
  },
  '3dar.benefits.sales.title': {
    tr: 'Satışları Artırın',
    en: 'Increase Sales'
  },
  '3dar.benefits.sales.description': {
    tr: '3D ürün görselleri ile müşterilerinizin satın alma güvenini %80 oranında artırın',
    en: 'Increase your customers\' purchase confidence by 80% with 3D product visuals'
  },
  '3dar.benefits.view.title': {
    tr: 'Her Açıdan İnceleme',
    en: 'View From Every Angle'
  },
  '3dar.benefits.view.description': {
    tr: 'Müşterileriniz ürünü 360° döndürerek tüm detayları görebilir',
    en: 'Your customers can see all details by rotating the product 360°'
  },
  '3dar.benefits.ar.title': {
    tr: 'AR ile Yerinde Görün',
    en: 'See In Place With AR'
  },
  '3dar.benefits.ar.description': {
    tr: 'Artırılmış gerçeklik ile ürünü kendi mekanında deneyimle',
    en: 'Experience the product in your own space with augmented reality'
  },
  '3dar.benefits.returns.title': {
    tr: 'İade Oranını Düşürün',
    en: 'Reduce Return Rate'
  },
  '3dar.benefits.returns.description': {
    tr: 'Detaylı 3D görsellerle beklenti-gerçeklik uyumsuzluğunu azaltın',
    en: 'Reduce expectation-reality mismatch with detailed 3D visuals'
  },
  '3dar.benefits.colors.title': {
    tr: 'Renk & Varyasyon',
    en: 'Color & Variation'
  },
  '3dar.benefits.colors.description': {
    tr: 'Farklı renk ve materyal seçeneklerini anında gösterin',
    en: 'Show different color and material options instantly'
  },
  '3dar.benefits.web.title': {
    tr: 'Web & Mobil Uyumlu',
    en: 'Web & Mobile Compatible'
  },
  '3dar.benefits.web.description': {
    tr: 'Tüm cihazlarda sorunsuz 3D deneyimi sunun',
    en: 'Offer seamless 3D experience on all devices'
  },
  '3dar.useCases.title': {
    tr: '3D & AR Kullanım Alanları',
    en: '3D & AR Use Cases'
  },
  '3dar.useCases.subtitle': {
    tr: 'Farklı sektörlerde 3D modelleme ve AR ile fark yaratın',
    en: 'Make a difference with 3D modeling and AR in different sectors'
  },
  '3dar.useCases.ecommerce.title': {
    tr: 'E-Ticaret',
    en: 'E-Commerce'
  },
  '3dar.useCases.ecommerce.description': {
    tr: 'Online mağazanızda ürünleri gerçeğe yakın şekilde sergileyin',
    en: 'Display products realistically in your online store'
  },
  '3dar.useCases.automotive.title': {
    tr: 'Otomotiv',
    en: 'Automotive'
  },
  '3dar.useCases.automotive.description': {
    tr: 'Araç modellerini tüm detaylarıyla ve iç mekan ile gösterin',
    en: 'Show vehicle models with all details and interior'
  },
  '3dar.useCases.furniture.title': {
    tr: 'Mobilya & Dekorasyon',
    en: 'Furniture & Decoration'
  },
  '3dar.useCases.furniture.description': {
    tr: 'Ürünlerin mekan uyumunu AR ile test ettirin',
    en: 'Let customers test product space compatibility with AR'
  },
  '3dar.useCases.jewelry.title': {
    tr: 'Mücevherat',
    en: 'Jewelry'
  },
  '3dar.useCases.jewelry.description': {
    tr: 'Değerli taşları ve ürünleri her açıdan inceletebilir',
    en: 'Let customers examine precious stones and products from every angle'
  },
  '3dar.useCases.architecture.title': {
    tr: 'Mimari & Tasarım',
    en: 'Architecture & Design'
  },
  '3dar.useCases.architecture.description': {
    tr: 'Tasarım projelerini 3D olarak müşterilerinize sunun',
    en: 'Present design projects to your customers in 3D'
  },
  '3dar.useCases.industrial.title': {
    tr: 'Endüstriyel Ürünler',
    en: 'Industrial Products'
  },
  '3dar.useCases.industrial.description': {
    tr: 'Karmaşık makineleri ve ekipmanları görselleştirin',
    en: 'Visualize complex machines and equipment'
  },
  '3dar.divider.title': {
    tr: 'Sanal Turlar Farklı Bir Deneyim',
    en: 'Virtual Tours Are A Different Experience'
  },
  '3dar.divider.description': {
    tr: '3D modelleme ve AR ürünleri sergilerken, sanal turlar tüm mekanınızı, işletmenizi veya lokasyonunuzu 360° panoramik görüntülerle dijital olarak gezdirir',
    en: 'While 3D modeling and AR showcase products, virtual tours digitally walk you through your entire space, business or location with 360° panoramic images'
  },
  '3dar.virtualTour.badge': {
    tr: '360° Sanal Tur Teknolojisi',
    en: '360° Virtual Tour Technology'
  },
  '3dar.virtualTour.title': {
    tr: 'Sanal Tur Nedir?',
    en: 'What is a Virtual Tour?'
  },
  '3dar.virtualTour.description': {
    tr: '360° panoramik fotoğraflar ve videolarla oluşturulan interaktif mekan gezintileri. Müşterileriniz işletmenizi sanki oradaymış gibi keşfedebilir.',
    en: 'Interactive space tours created with 360° panoramic photos and videos. Your customers can explore your business as if they were there.'
  },
  '3dar.demo.title': {
    tr: 'Örnek Sanal Tur Deneyimi',
    en: 'Sample Virtual Tour Experience'
  },
  '3dar.demo.description': {
    tr: 'Modern ofis alanı, üretim tesisi veya otel odası - tüm mekanlarınızı dijital olarak gezintiye dönüştürün',
    en: 'Modern office space, production facility or hotel room - turn all your spaces into digital tours'
  },
  '3dar.vtBenefits.title': {
    tr: 'Sanal Turların İşletmenize Katkıları',
    en: 'Benefits of Virtual Tours for Your Business'
  },
  '3dar.vtBenefits.subtitle': {
    tr: '360° sanal turlar ile mekanınızı dijital dünyada öne çıkarın',
    en: 'Highlight your space in the digital world with 360° virtual tours'
  },
  '3dar.vtBenefits.conversion.title': {
    tr: 'Yüksek Dönüşüm Oranı',
    en: 'High Conversion Rate'
  },
  '3dar.vtBenefits.conversion.description': {
    tr: 'Sanal tur deneyimi yaşayan potansiyel müşteriler %40 daha fazla dönüşüm sağlar',
    en: 'Potential customers who experience virtual tours convert 40% more'
  },
  '3dar.vtBenefits.access.title': {
    tr: '7/24 Erişilebilirlik',
    en: '24/7 Accessibility'
  },
  '3dar.vtBenefits.access.description': {
    tr: 'Müşterileriniz istedikleri zaman, istedikleri yerden işletmenizi ziyaret edebilir',
    en: 'Your customers can visit your business anytime, anywhere'
  },
  '3dar.vtBenefits.cost.title': {
    tr: 'Maliyet Tasarrufu',
    en: 'Cost Savings'
  },
  '3dar.vtBenefits.cost.description': {
    tr: 'Fiziksel ziyaret maliyetlerini düşürün, daha fazla potansiyel müşteriyle buluşun',
    en: 'Reduce physical visit costs, meet more potential customers'
  },
  '3dar.vtBenefits.qualified.title': {
    tr: 'Nitelikli Müşteri Kazanımı',
    en: 'Qualified Customer Acquisition'
  },
  '3dar.vtBenefits.qualified.description': {
    tr: 'Sanal tur öncesi karar veren müşteriler daha bilinçli ve hazır alıcılardır',
    en: 'Customers who decide before virtual tour are more conscious and ready buyers'
  },
  '3dar.vtBenefits.global.title': {
    tr: 'Küresel Erişim',
    en: 'Global Reach'
  },
  '3dar.vtBenefits.global.description': {
    tr: 'Coğrafi sınırlamaları ortadan kaldırın, dünya çapında müşteriye ulaşın',
    en: 'Remove geographic limitations, reach customers worldwide'
  },
  '3dar.vtBenefits.advantage.title': {
    tr: 'Rekabet Avantajı',
    en: 'Competitive Advantage'
  },
  '3dar.vtBenefits.advantage.description': {
    tr: 'Modern teknoloji kullanarak rakiplerinizin önüne geçin ve fark yaratın',
    en: 'Get ahead of your competitors and make a difference using modern technology'
  },
  '3dar.industries.title': {
    tr: 'Sanal Tur Kullanım Alanları',
    en: 'Virtual Tour Use Cases'
  },
  '3dar.industries.subtitle': {
    tr: 'Farklı sektörlerde sanal turlarla fark yaratın',
    en: 'Make a difference with virtual tours in different sectors'
  },
  '3dar.industries.realestate.title': {
    tr: 'Gayrimenkul',
    en: 'Real Estate'
  },
  '3dar.industries.realestate.description': {
    tr: 'Emlak vitrinini dijitalleştirin, uzaktan ev gezintileri düzenleyin',
    en: 'Digitize your real estate showcase, organize remote home tours'
  },
  '3dar.industries.hospitality.title': {
    tr: 'Konaklama & Turizm',
    en: 'Hospitality & Tourism'
  },
  '3dar.industries.hospitality.description': {
    tr: 'Oteller, resortlar ve tatil köyleri için immersive deneyimler',
    en: 'Immersive experiences for hotels, resorts and holiday villages'
  },
  '3dar.industries.education.title': {
    tr: 'Eğitim',
    en: 'Education'
  },
  '3dar.industries.education.description': {
    tr: 'Kampüs turları, laboratuvarlar ve eğitim tesisleri',
    en: 'Campus tours, laboratories and educational facilities'
  },
  '3dar.industries.manufacturing.title': {
    tr: 'Üretim & Sanayi',
    en: 'Manufacturing & Industry'
  },
  '3dar.industries.manufacturing.description': {
    tr: 'Fabrika gezileri, üretim hatları ve tesis tanıtımları',
    en: 'Factory tours, production lines and facility introductions'
  },
  '3dar.industries.retail.title': {
    tr: 'Perakende & Showroom',
    en: 'Retail & Showroom'
  },
  '3dar.industries.retail.description': {
    tr: 'Mağazalar, showroomlar ve sergi alanları',
    en: 'Stores, showrooms and exhibition areas'
  },
  '3dar.industries.museum.title': {
    tr: 'Müze & Kültür',
    en: 'Museum & Culture'
  },
  '3dar.industries.museum.description': {
    tr: 'Müzeler, galeriler ve tarihi mekanlar için sanal turlar',
    en: 'Virtual tours for museums, galleries and historical places'
  },
  '3dar.comparison.title': {
    tr: 'Hangi Teknoloji Sizin İçin?',
    en: 'Which Technology is Right For You?'
  },
  '3dar.comparison.subtitle': {
    tr: '3D Modelleme, AR ve Sanal Tur teknolojilerini karşılaştırın',
    en: 'Compare 3D Modeling, AR and Virtual Tour technologies'
  },
  '3dar.comparison.feature': {
    tr: 'Özellik',
    en: 'Feature'
  },
  '3dar.comparison.purpose': {
    tr: 'Kullanım Amacı',
    en: 'Purpose'
  },
  '3dar.comparison.purpose.3d': {
    tr: 'Ürün görselleştirme',
    en: 'Product visualization'
  },
  '3dar.comparison.purpose.ar': {
    tr: 'Ürünü kendi mekanında deneme',
    en: 'Try product in your own space'
  },
  '3dar.comparison.purpose.vt': {
    tr: 'Mekan & lokasyon gezisi',
    en: 'Space & location tour'
  },
  '3dar.comparison.sector': {
    tr: 'En Uygun Sektör',
    en: 'Best Suited Sector'
  },
  '3dar.comparison.sector.3d': {
    tr: 'E-ticaret, Üretim',
    en: 'E-commerce, Manufacturing'
  },
  '3dar.comparison.sector.ar': {
    tr: 'Mobilya, Dekorasyon',
    en: 'Furniture, Decoration'
  },
  '3dar.comparison.sector.vt': {
    tr: 'Gayrimenkul, Turizm',
    en: 'Real Estate, Tourism'
  },
  '3dar.comparison.device': {
    tr: 'Cihaz Gereksinimi',
    en: 'Device Requirement'
  },
  '3dar.comparison.device.3d': {
    tr: 'Tüm cihazlar',
    en: 'All devices'
  },
  '3dar.comparison.device.ar': {
    tr: 'Akıllı telefon/tablet',
    en: 'Smartphone/tablet'
  },
  '3dar.comparison.device.vt': {
    tr: 'Tüm cihazlar + VR',
    en: 'All devices + VR'
  },
  '3dar.comparison.interaction': {
    tr: 'İnteraksiyon Seviyesi',
    en: 'Interaction Level'
  },
  '3dar.comparison.interaction.3d': {
    tr: 'Yüksek - 360° dönme',
    en: 'High - 360° rotation'
  },
  '3dar.comparison.interaction.ar': {
    tr: 'Çok Yüksek - Yerleştirme',
    en: 'Very High - Placement'
  },
  '3dar.comparison.interaction.vt': {
    tr: 'Orta - Navigasyon',
    en: 'Medium - Navigation'
  },
  '3dar.comparison.duration': {
    tr: 'Uygulama Süresi',
    en: 'Implementation Time'
  },
  '3dar.comparison.duration.3d': {
    tr: '2-5 gün',
    en: '2-5 days'
  },
  '3dar.comparison.duration.ar': {
    tr: '3-7 gün',
    en: '3-7 days'
  },
  '3dar.comparison.duration.vt': {
    tr: '5-10 gün',
    en: '5-10 days'
  },
  '3dar.cta.title': {
    tr: 'İşletmenizi Dijital Dünyaya Taşıyın',
    en: 'Take Your Business to the Digital World'
  },
  '3dar.cta.description': {
    tr: '3D modelleme, AR veya sanal tur çözümlerimiz hakkında detaylı bilgi alın ve ücretsiz demo talep edin',
    en: 'Get detailed information about our 3D modeling, AR or virtual tour solutions and request a free demo'
  },
  '3dar.cta.startNow': {
    tr: 'Hemen Başlayın',
    en: 'Start Now'
  },
  '3dar.cta.contact': {
    tr: 'İletişime Geçin',
    en: 'Contact Us'
  },
  '3dar.tours.hotel.title': {
    tr: 'Lüks Otel Süiti',
    en: 'Luxury Hotel Suite'
  },
  '3dar.tours.hotel.category': {
    tr: 'Otel',
    en: 'Hotel'
  },
  '3dar.tours.hotel.description': {
    tr: 'Lüks otel süiti sanal turu - 360° panoramik görünüm',
    en: 'Luxury hotel suite virtual tour - 360° panoramic view'
  },
  '3dar.tours.factory.title': {
    tr: 'Modern Fabrika Katı',
    en: 'Modern Factory Floor'
  },
  '3dar.tours.factory.category': {
    tr: 'Fabrika',
    en: 'Factory'
  },
  '3dar.tours.factory.description': {
    tr: 'Üretim tesisi sanal turu - İşletme süreçlerinizi sergilemek için',
    en: 'Production facility virtual tour - To showcase your business processes'
  },
  '3dar.tours.university.title': {
    tr: 'Üniversite Kampüsü',
    en: 'University Campus'
  },
  '3dar.tours.university.category': {
    tr: 'Üniversite',
    en: 'University'
  },
  '3dar.tours.university.description': {
    tr: 'Üniversite kampüsü sanal turu - Öğrencilerinize kampüsü tanıtın',
    en: 'University campus virtual tour - Introduce the campus to your students'
  },

  // ProjectRequest Selection Screen
  'projectRequest.selection.subtitle': {
    tr: 'Size en uygun yöntemi seçin. Form doldurun veya ücretsiz danışmanlık görüşmesi planlayın.',
    en: 'Choose the method that suits you best. Fill out the form or schedule a free consultation.'
  },
  'projectRequest.selection.form.title': {
    tr: 'Form Doldurun',
    en: 'Fill Out Form'
  },
  'projectRequest.selection.form.description': {
    tr: 'Proje detaylarınızı paylaşın, size özel teklif hazırlayalım.',
    en: 'Share your project details, we\'ll prepare a custom proposal for you.'
  },
  'projectRequest.selection.form.feature1': {
    tr: 'Detaylı proje açıklaması',
    en: 'Detailed project description'
  },
  'projectRequest.selection.form.feature2': {
    tr: 'Brief yükleme imkanı',
    en: 'Brief upload option'
  },
  'projectRequest.selection.form.feature3': {
    tr: '24 saat içinde geri dönüş',
    en: 'Response within 24 hours'
  },
  'projectRequest.selection.form.cta': {
    tr: 'Forma Geç',
    en: 'Go to Form'
  },
  'projectRequest.selection.meeting.title': {
    tr: 'Görüşme Planlayın',
    en: 'Schedule a Meeting'
  },
  'projectRequest.selection.meeting.description': {
    tr: '30 dk ücretsiz danışmanlık ile projenizi birebir konuşalım.',
    en: '30 min free consultation to discuss your project one-on-one.'
  },
  'projectRequest.selection.meeting.feature1': {
    tr: 'Birebir danışmanlık',
    en: 'One-on-one consultation'
  },
  'projectRequest.selection.meeting.feature2': {
    tr: 'Anında sorularınıza cevap',
    en: 'Instant answers to your questions'
  },
  'projectRequest.selection.meeting.feature3': {
    tr: 'Kişiselleştirilmiş çözümler',
    en: 'Personalized solutions'
  },
  'projectRequest.selection.meeting.cta': {
    tr: 'Randevu Al',
    en: 'Book Appointment'
  },
  'projectRequest.selection.recommended': {
    tr: 'Önerilen',
    en: 'Recommended'
  },
  'projectRequest.selection.freeNote': {
    tr: 'Her iki seçenekte de',
    en: 'In both options'
  },
  'projectRequest.selection.freeHighlight': {
    tr: 'tamamen ücretsiz',
    en: 'completely free'
  },
  'projectRequest.selection.freeNoteEnd': {
    tr: 'hizmet alırsınız. Taahhüt yoktur.',
    en: 'service. No commitment.'
  },
  'projectRequest.back': {
    tr: 'Geri',
    en: 'Back'
  },
  'projectRequest.backFull': {
    tr: 'Geri Dön',
    en: 'Go Back'
  },
  'projectRequest.form.projectLabel': {
    tr: 'Proje',
    en: 'Project'
  },
  'projectRequest.form.formLabel': {
    tr: 'Formu',
    en: 'Form'
  },
  'projectRequest.form.badge': {
    tr: 'Proje Formu',
    en: 'Project Form'
  },
  'projectRequest.form.preferMeeting': {
    tr: 'Form yerine görüşme mi tercih edersiniz?',
    en: 'Do you prefer a meeting instead of a form?'
  },
  'projectRequest.form.createAppointment': {
    tr: 'Randevu Oluştur',
    en: 'Create Appointment'
  },

  // JoinUs Page
  'joinUs.error.requiredFields': {
    tr: 'Lütfen tüm zorunlu alanları doldurun ve kullanım şartlarını kabul edin.',
    en: 'Please fill in all required fields and accept the terms of use.'
  },
  'joinUs.error.submission': {
    tr: 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
    en: 'An error occurred while submitting the application. Please try again.'
  },
  'joinus.mobile.subtitle': {
    tr: 'Yeteneklerinizi bizimle paylaşın, birlikte büyüyelim.',
    en: 'Share your talents with us, let\'s grow together.'
  },

  // Contact Page - Additional Translations
  'contact.bize_ulaşın': {
    tr: 'Bize Ulaşın',
    en: 'Contact Us'
  },
  'contact.projelerinizi': {
    tr: 'Projelerinizi',
    en: 'Your Projects'
  },
  'contact.hayata_geçirelim': {
    tr: 'Hayata Geçirelim',
    en: 'Let\'s Bring to Life'
  },
  'contact.sorularınız_proje_talepleriniz': {
    tr: 'Sorularınız, proje talepleriniz veya iş birlikleri için bizimle iletişime geçin. Ekibimiz en kısa sürede size dönüş yapacaktır.',
    en: 'Contact us for your questions, project requests or collaborations. Our team will get back to you as soon as possible.'
  },
  'contact.mesaj_gönderin': {
    tr: 'Mesaj Gönderin',
    en: 'Send Message'
  },
  'contact.placeholder.name': {
    tr: 'Adınız Soyadınız',
    en: 'Your Full Name'
  },
  'contact.placeholder.email': {
    tr: 'ornek@sirket.com',
    en: 'example@company.com'
  },
  'contact.placeholder.subject': {
    tr: 'Proje, İş Birliği vb.',
    en: 'Project, Collaboration, etc.'
  },
  'contact.placeholder.message': {
    tr: 'Size nasıl yardımcı olabiliriz?',
    en: 'How can we help you?'
  },
  'contact.info.title': {
    tr: 'İletişim Bilgileri',
    en: 'Contact Information'
  },
  'contact.whatsapp': {
    tr: 'WhatsApp\'tan Yazın',
    en: 'Message on WhatsApp'
  },
  'contact.open_in_map': {
    tr: 'Haritada Aç',
    en: 'Open in Map'
  },

  // About Page - Additional Translations
  'about.hero.title_prefix': {
    tr: 'Unilancer ile',
    en: 'With Unilancer'
  },
  'about.hero.title_suffix': {
    tr: 'Geleceği İnşa Edin',
    en: 'Build the Future'
  },
  'about.hero.description': {
    tr: 'Türkiye\'nin en yetenekli üniversite öğrencileri ve mezunları ile işletmeleri buluşturan yeni nesil iş platformu.',
    en: 'A new generation business platform that connects Turkey\'s most talented university students and graduates with businesses.'
  },
  'about.hero.contact_button': {
    tr: 'İletişime Geç',
    en: 'Get in Touch'
  },
  'about.hero.portfolio_button': {
    tr: 'Projelerimizi İncele',
    en: 'View Our Projects'
  },
  'about.story.badge': {
    tr: 'Hikayemiz',
    en: 'Our Story'
  },
  'about.story.p1_part1': {
    tr: 'Unilancer, Türkiye\'nin en parlak genç yeteneklerini, vizyoner işletmelerle buluşturan',
    en: 'Unilancer brings together Turkey\'s brightest young talents with visionary businesses as'
  },
  'about.story.p1_highlight': {
    tr: 'dinamik bir ekosistemdir',
    en: 'a dynamic ecosystem'
  },
  'about.story.p1_part2': {
    tr: 'Geleneksel freelance platformlarının ötesine geçerek, sürdürülebilir iş birlikleri ve kaliteli projeler üretmeyi hedefliyoruz.',
    en: 'Going beyond traditional freelance platforms, we aim to produce sustainable collaborations and quality projects.'
  },
  'about.story.p2_part1': {
    tr: 'Teknolojiye, inovasyona ve gençlerin potansiyeline inanıyoruz. Her projenin arkasında, tutkuyla çalışan ve sürekli kendini geliştiren bir ekip var. Biz sadece iş yapmıyoruz,',
    en: 'We believe in technology, innovation and the potential of young people. Behind every project is a team that works with passion and constantly improves itself. We don\'t just do business,'
  },
  'about.story.p2_highlight': {
    tr: 'geleceği birlikte tasarlıyoruz',
    en: 'we design the future together'
  },
  'about.team_image_alt': {
    tr: 'Unilancer Ekibi',
    en: 'Unilancer Team'
  },
  'about.image_caption.family': {
    tr: 'Unilancer Ailesi',
    en: 'Unilancer Family'
  },
  'about.image_caption.stronger': {
    tr: 'Birlikte Daha Güçlüyüz',
    en: 'Stronger Together'
  },
  'about.view_all_team': {
    tr: 'Tüm Ekibi Gör',
    en: 'View All Team'
  },

  // Team Section Translations
  'team.badge': {
    tr: 'Ekibimiz',
    en: 'Our Team'
  },
  'team.title_prefix': {
    tr: 'Unilancer\'ın Arkasındaki',
    en: 'The Force Behind'
  },
  'team.title_suffix': {
    tr: 'Güç',
    en: 'Unilancer'
  },
  'team.description': {
    tr: 'Dijital dönüşüm yolculuğunuzda size eşlik eden tutkulu ve yetenekli ekibimizle tanışın.',
    en: 'Meet our passionate and talented team that accompanies you on your digital transformation journey.'
  },
  'team.roles.ceo': {
    tr: 'Kurucu & CEO',
    en: 'Founder & CEO'
  },
  'team.roles.cto': {
    tr: 'Kurucu Ortak & CTO',
    en: 'Co-Founder & CTO'
  },
  'team.roles.coo': {
    tr: 'Operasyon Direktörü',
    en: 'Operations Director'
  },
  'team.roles.marketing': {
    tr: 'Pazarlama Müdürü',
    en: 'Marketing Manager'
  },
  'team.roles.product': {
    tr: 'Ürün Yöneticisi',
    en: 'Product Manager'
  },
  'team.roles.creative': {
    tr: 'Kreatif Direktör',
    en: 'Creative Director'
  },
  'team.roles.developer': {
    tr: 'Yazılım Geliştirici',
    en: 'Software Developer'
  },
  'team.roles.hr': {
    tr: 'İnsan Kaynakları',
    en: 'Human Resources'
  },

  // Services Page - Additional Translations
  'services.hero.badge': {
    tr: 'Modern Çözümler',
    en: 'Modern Solutions'
  },
  'services.featured.heading': {
    tr: 'Hizmetlerimiz.',
    en: 'Our Services.'
  },
  'services.featured.subheading': {
    tr: 'İşletmenizi dijital dünyada öne çıkaracak kapsamlı çözümlerimizi keşfedin',
    en: 'Discover our comprehensive solutions to make your business stand out in the digital world'
  },
  'services.featured.web.title': {
    tr: 'Web Geliştirme',
    en: 'Web Development'
  },
  'services.featured.web.desc': {
    tr: 'Modern ve responsive web siteleri, e-ticaret platformları ve web uygulamaları geliştiriyoruz.',
    en: 'We develop modern and responsive websites, e-commerce platforms and web applications.'
  },
  'services.featured.design.title': {
    tr: 'UI/UX Tasarım',
    en: 'UI/UX Design'
  },
  'services.featured.design.desc': {
    tr: 'Kullanıcı deneyimini ön planda tutan, estetik ve işlevsel arayüz tasarımları yaratıyoruz.',
    en: 'We create aesthetic and functional interface designs that prioritize user experience.'
  },
  'services.featured.mobile.title': {
    tr: 'Mobil Uygulamalar',
    en: 'Mobile Apps'
  },
  'services.featured.mobile.desc': {
    tr: 'iOS ve Android platformları için native ve cross-platform mobil uygulamalar geliştiriyoruz.',
    en: 'We develop native and cross-platform mobile apps for iOS and Android platforms.'
  },
  'services.featured.seo.title': {
    tr: 'SEO & Pazarlama',
    en: 'SEO & Marketing'
  },
  'services.featured.seo.desc': {
    tr: 'Arama motorlarında üst sıralarda yer almanız için kapsamlı SEO ve dijital pazarlama stratejileri.',
    en: 'Comprehensive SEO and digital marketing strategies to rank at the top of search engines.'
  },
  'services.featured.branding.title': {
    tr: 'Markalaşma',
    en: 'Branding'
  },
  'services.featured.branding.desc': {
    tr: 'Markanızı öne çıkaracak logo, kurumsal kimlik ve marka stratejisi çalışmaları yapıyoruz.',
    en: 'We work on logo, corporate identity and brand strategy to make your brand stand out.'
  },
  'services.featured.ai.title': {
    tr: 'AI Çözümleri',
    en: 'AI Solutions'
  },
  'services.featured.ai.desc': {
    tr: 'Yapay zeka ve makine öğrenmesi teknolojileri ile işletmenizi geleceğe taşıyoruz.',
    en: 'We take your business into the future with artificial intelligence and machine learning technologies.'
  },
  'services.design.subtitle': {
    tr: 'Modern ve kullanıcı odaklı tasarım çözümleri ile markanızı öne çıkarın',
    en: 'Make your brand stand out with modern and user-focused design solutions'
  },
  'services.design.digital.title': {
    tr: 'Dijital & Web Tasarım',
    en: 'Digital & Web Design'
  },
  'services.design.digital.item1': {
    tr: 'Web & Mobil Uygulama Tasarımı',
    en: 'Web & Mobile App Design'
  },
  'services.design.digital.item2': {
    tr: 'UI & UX Tasarımı',
    en: 'UI & UX Design'
  },
  'services.design.digital.item3': {
    tr: 'E-Ticaret ve Satış Sayfası Tasarımları',
    en: 'E-Commerce and Sales Page Designs'
  },
  'services.design.corporate.title': {
    tr: 'Kurumsal Kimlik & Marka',
    en: 'Corporate Identity & Brand'
  },
  'services.design.corporate.item1': {
    tr: 'Logo ve Kurumsal Kimlik Oluşturma',
    en: 'Logo and Corporate Identity Creation'
  },
  'services.design.corporate.item2': {
    tr: 'Marka Konsept Tasarımı',
    en: 'Brand Concept Design'
  },
  'services.design.corporate.item3': {
    tr: 'Reklam ve Promosyon Tasarımları',
    en: 'Advertising and Promotion Designs'
  },
  'services.design.print.title': {
    tr: 'Basılı & Grafik Tasarım',
    en: 'Print & Graphic Design'
  },
  'services.design.print.item1': {
    tr: 'Katalog ve Broşür Tasarımı',
    en: 'Catalog and Brochure Design'
  },
  'services.design.print.item2': {
    tr: 'Ambalaj ve Etiket Tasarımı',
    en: 'Packaging and Label Design'
  },
  'services.design.print.item3': {
    tr: 'Poster ve Afiş Tasarımı',
    en: 'Poster and Banner Design'
  },
  'services.design.illustration.title': {
    tr: 'İllüstrasyon & Özel Grafik',
    en: 'Illustration & Custom Graphics'
  },
  'services.design.illustration.item1': {
    tr: 'Dijital Çizim & Karakter Tasarımı',
    en: 'Digital Drawing & Character Design'
  },
  'services.design.illustration.item2': {
    tr: '3D Modelleme & Render Tasarım',
    en: '3D Modeling & Render Design'
  },
  'services.design.illustration.item3': {
    tr: 'Özel Grafik Çözümleri',
    en: 'Custom Graphic Solutions'
  },
  'services.design.example1.title': {
    tr: 'UI/UX Tasarım',
    en: 'UI/UX Design'
  },
  'services.design.example1.description': {
    tr: 'Kullanıcı deneyimini ön planda tutan, modern ve etkileyici arayüz tasarımları',
    en: 'Modern and impressive interface designs that prioritize user experience'
  },
  'services.design.example2.title': {
    tr: 'Marka Kimliği',
    en: 'Brand Identity'
  },
  'services.design.example2.description': {
    tr: 'Markanızı yansıtan özgün ve profesyonel kurumsal kimlik tasarımları',
    en: 'Unique and professional corporate identity designs that reflect your brand'
  },
  'services.design.example3.title': {
    tr: '3D Tasarım',
    en: '3D Design'
  },
  'services.design.example3.description': {
    tr: 'Etkileyici 3D modelleme ve görselleştirme çözümleri',
    en: 'Impressive 3D modeling and visualization solutions'
  },
  'services.software.subtitle': {
    tr: 'Modern teknolojiler ve en iyi pratiklerle özel yazılım çözümleri',
    en: 'Custom software solutions with modern technologies and best practices'
  },
  'services.software.web.title': {
    tr: 'Web Geliştirme',
    en: 'Web Development'
  },
  'services.software.web.item1': {
    tr: 'Statik Kurumsal Web Siteleri',
    en: 'Static Corporate Websites'
  },
  'services.software.web.item2': {
    tr: 'Dinamik ve Fonksiyonel Web Siteleri',
    en: 'Dynamic and Functional Websites'
  },
  'services.software.web.item3': {
    tr: 'E-Ticaret Web Siteleri',
    en: 'E-Commerce Websites'
  },
  'services.software.web.item4': {
    tr: 'Özel Web Çözümleri',
    en: 'Custom Web Solutions'
  },
  'services.software.mobile.title': {
    tr: 'Mobil Uygulama',
    en: 'Mobile App'
  },
  'services.software.mobile.item1': {
    tr: 'Kurumsal Mobil Uygulamalar',
    en: 'Corporate Mobile Apps'
  },
  'services.software.mobile.item2': {
    tr: 'Saha Operasyonları Uygulamaları',
    en: 'Field Operations Apps'
  },
  'services.software.mobile.item3': {
    tr: 'Müşteri Servisi Uygulamaları',
    en: 'Customer Service Apps'
  },
  'services.software.saas.title': {
    tr: 'S.a.a.S Çözümleri',
    en: 'S.a.a.S Solutions'
  },
  'services.software.saas.item1': {
    tr: 'Yönetim ve CRM Sistemleri',
    en: 'Management and CRM Systems'
  },
  'services.software.saas.item2': {
    tr: 'Proje ve Görev Yönetim Araçları',
    en: 'Project and Task Management Tools'
  },
  'services.software.saas.item3': {
    tr: 'Özel İş Süreçleri Yazılımları',
    en: 'Custom Business Process Software'
  },
  'services.software.ai.title': {
    tr: 'AI Entegrasyonları',
    en: 'AI Integrations'
  },
  'services.software.ai.item1': {
    tr: 'Yapay Zeka Chatbot Sistemleri',
    en: 'AI Chatbot Systems'
  },
  'services.software.ai.item2': {
    tr: 'Robotik Süreç Otomasyonu (RPA)',
    en: 'Robotic Process Automation (RPA)'
  },
  'services.software.ai.item3': {
    tr: 'AI Destekli İş Süreçleri',
    en: 'AI-Powered Business Processes'
  },
  'services.software.example1.title': {
    tr: 'Web Uygulamaları',
    en: 'Web Applications'
  },
  'services.software.example1.desc': {
    tr: 'Modern teknolojilerle geliştirilmiş, ölçeklenebilir web uygulamaları',
    en: 'Scalable web applications developed with modern technologies'
  },
  'services.software.example2.title': {
    tr: 'Mobil Uygulamalar',
    en: 'Mobile Apps'
  },
  'services.software.example2.desc': {
    tr: 'iOS ve Android için native mobil uygulama geliştirme',
    en: 'Native mobile app development for iOS and Android'
  },
  'services.software.example3.title': {
    tr: 'AI Çözümleri',
    en: 'AI Solutions'
  },
  'services.software.example3.desc': {
    tr: 'Yapay zeka ve makine öğrenmesi destekli akıllı sistemler',
    en: 'Intelligent systems powered by AI and machine learning'
  },
  'services.marketing.subtitle': {
    tr: 'Markanızı dijital dünyada güçlendiren stratejik çözümler',
    en: 'Strategic solutions that strengthen your brand in the digital world'
  },
  'services.marketing.seo.title': {
    tr: 'SEO ve Dijital Reklam Yönetimi',
    en: 'SEO and Digital Ad Management'
  },
  'services.marketing.seo.item1': {
    tr: 'Arama Motoru Optimizasyonu (SEO)',
    en: 'Search Engine Optimization (SEO)'
  },
  'services.marketing.seo.item2': {
    tr: 'Google Ads, Facebook Ads, Instagram ve LinkedIn Reklamları',
    en: 'Google Ads, Facebook Ads, Instagram and LinkedIn Ads'
  },
  'services.marketing.seo.item3': {
    tr: 'Remarketing ve Hedef Kitle Optimizasyonu',
    en: 'Remarketing and Target Audience Optimization'
  },
  'services.marketing.seo.item4': {
    tr: 'Sosyal Medya Yönetimi',
    en: 'Social Media Management'
  },
  'services.marketing.strategy.title': {
    tr: 'Pazar Araştırması & Marka Stratejisi',
    en: 'Market Research & Brand Strategy'
  },
  'services.marketing.strategy.item1': {
    tr: 'Sektör ve Rakip Analizi',
    en: 'Industry and Competitor Analysis'
  },
  'services.marketing.strategy.item2': {
    tr: 'Stratejik Proje Geliştirme',
    en: 'Strategic Project Development'
  },
  'services.marketing.strategy.item3': {
    tr: 'Hedef Kitleye Yönelik İçerik Çalışmaları',
    en: 'Content Work for Target Audience'
  },
  'services.marketing.strategy.item4': {
    tr: 'Marka Danışmanlık Hizmetleri',
    en: 'Brand Consulting Services'
  },
  'services.marketing.example1.title': {
    tr: 'Dijital Pazarlama',
    en: 'Digital Marketing'
  },
  'services.marketing.example1.desc': {
    tr: 'Veriye dayalı dijital pazarlama stratejileri ve kampanya yönetimi',
    en: 'Data-driven digital marketing strategies and campaign management'
  },
  'services.marketing.example2.title': {
    tr: 'Marka Stratejisi',
    en: 'Brand Strategy'
  },
  'services.marketing.example2.desc': {
    tr: 'Markanızı güçlendiren kapsamlı stratejik planlama ve danışmanlık',
    en: 'Comprehensive strategic planning and consulting that strengthens your brand'
  },
  'services.cta.subtitle': {
    tr: 'Size özel çözümler için hemen iletişime geçin',
    en: 'Contact us now for customized solutions'
  },

  // JoinUs Form Additional Translations
  'joinus.form.portfolio.about_hint': {
    tr: 'Kendinizi, deneyimlerinizi ve kariyer hedeflerinizi anlatın',
    en: 'Describe yourself, your experiences and career goals'
  },
  'joinus.form.summary.privacy': {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy'
  },
  'joinus.form.summary.terms': {
    tr: 'Kullanım Şartları',
    en: 'Terms of Use'
  },

  // Project Request Additional Translations
  'project_request.steps.contact': {
    tr: 'İletişim & Onay',
    en: 'Contact & Confirmation'
  },
  'project_request.error.terms': {
    tr: 'Lütfen gizlilik politikasını ve kullanım koşullarını kabul edin.',
    en: 'Please accept the privacy policy and terms of use.'
  },
  'project_request.step5.title': {
    tr: '5. İletişim Bilgileri',
    en: '5. Contact Information'
  },
  'project_request.step5.contact_label': {
    tr: 'İletişim Kişisi',
    en: 'Contact Person'
  },
  'project_request.step5.privacy': {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy'
  },
  'project_request.hero.description': {
    tr: 'Hayalinizdeki projeyi gerçeğe dönüştürmek için ilk adımı atın. Size özel çözümler ve profesyonel ekibimizle yanınızdayız.',
    en: 'Take the first step to turn your dream project into reality. We are with you with customized solutions and our professional team.'
  },
  'project_request.appointment': {
    tr: 'Randevu Al',
    en: 'Book Appointment'
  },

  // ProjectRequest - Service Categories
  'project_request.services.software.label': {
    tr: 'Yazılım',
    en: 'Software'
  },
  'project_request.services.software.web': {
    tr: 'Web Sitesi - Kurumsal, Statik ve E-Ticaret',
    en: 'Website - Corporate, Static and E-Commerce'
  },
  'project_request.services.software.mobile': {
    tr: 'Mobil Uygulama',
    en: 'Mobile App'
  },
  'project_request.services.software.saas': {
    tr: 'S.a.a.S (Software as a Service)',
    en: 'S.a.a.S (Software as a Service)'
  },
  'project_request.services.software.ai': {
    tr: 'Yapay Zeka',
    en: 'Artificial Intelligence'
  },
  'project_request.services.design.label': {
    tr: 'Tasarım',
    en: 'Design'
  },
  'project_request.services.design.ui_ux': {
    tr: 'Web & Mobil Uygulama UI/UX Tasarımı',
    en: 'Web & Mobile App UI/UX Design'
  },
  'project_request.services.design.print': {
    tr: 'Basılı & Grafik Tasarım',
    en: 'Print & Graphic Design'
  },
  'project_request.services.design.illustration': {
    tr: 'İllüstrasyon & Özel Grafik Çalışmaları',
    en: 'Illustration & Custom Graphic Works'
  },
  'project_request.services.design.branding': {
    tr: 'Kurumsal Kimlik & Marka Tasarımı',
    en: 'Corporate Identity & Brand Design'
  },
  'project_request.services.strategy.label': {
    tr: 'Dijital Pazarlama ve Strateji',
    en: 'Digital Marketing and Strategy'
  },
  'project_request.services.strategy.seo': {
    tr: 'SEO ve Dijital Reklam Yönetimi',
    en: 'SEO and Digital Ad Management'
  },
  'project_request.services.strategy.market_research': {
    tr: 'Pazar Araştırması & Marka Stratejisi',
    en: 'Market Research & Brand Strategy'
  },
  'project_request.services.strategy.content': {
    tr: 'İçerik Stratejisi ve Yönetimi',
    en: 'Content Strategy and Management'
  },

  // ProjectRequest - Solution Types
  'project_request.solutions.one_time.title': {
    tr: 'Tek Seferlik Projeler',
    en: 'One-Time Projects'
  },
  'project_request.solutions.one_time.desc': {
    tr: 'İhtiyacınızı dinliyor, uygun ekibi kuruyor ve işinizi tamamlıyoruz.',
    en: 'We listen to your needs, build the right team, and complete your work.'
  },
  'project_request.solutions.support.title': {
    tr: 'Ek Freelancer Desteği',
    en: 'Additional Freelancer Support'
  },
  'project_request.solutions.support.desc': {
    tr: 'Mevcut ekibinizin kapasitesini artırmak için freelancerlarımızı devreye alıyoruz.',
    en: 'We deploy our freelancers to increase the capacity of your existing team.'
  },
  'project_request.solutions.regular.title': {
    tr: 'Yıllık ve Aylık Düzenli İşler',
    en: 'Annual and Monthly Regular Work'
  },
  'project_request.solutions.regular.desc': {
    tr: 'Sürekli destek gerektiren işleriniz için düzenli hizmet paketlerimizle yanınızdayız.',
    en: 'We are with you with our regular service packages for your work that requires continuous support.'
  },
  'project_request.solutions.other.title': {
    tr: 'Farklı Bir Çözüme İhtiyacım Var',
    en: 'I Need a Different Solution'
  },
  'project_request.solutions.other.desc': {
    tr: 'Özel ihtiyaçlarınızı bizimle paylaşın, size uygun çözümü birlikte geliştirelim.',
    en: 'Share your specific needs with us, let\'s develop the right solution for you together.'
  },

  // ProjectRequest - Durations
  'project_request.durations.1_week': {
    tr: '1 haftadan kısa sürede',
    en: 'Less than 1 week'
  },
  'project_request.durations.1_4_weeks': {
    tr: '1 ila 4 hafta',
    en: '1 to 4 weeks'
  },
  'project_request.durations.1_3_months': {
    tr: '1 ila 3 ay',
    en: '1 to 3 months'
  },
  'project_request.durations.3_6_months': {
    tr: '3 ila 6 ay',
    en: '3 to 6 months'
  },
  'project_request.durations.6_months_plus': {
    tr: '6 aydan uzun',
    en: 'More than 6 months'
  },
  'project_request.durations.undecided': {
    tr: 'Daha sonra karar vereceğim',
    en: 'I\'ll decide later'
  },

  // ProjectRequest - Steps
  'project_request.steps.services': {
    tr: 'Hizmet Alanları',
    en: 'Service Areas'
  },
  'project_request.steps.solution': {
    tr: 'Çözüm Türü',
    en: 'Solution Type'
  },
  'project_request.steps.timeline': {
    tr: 'Zaman Çizelgesi',
    en: 'Timeline'
  },
  'project_request.steps.brief': {
    tr: 'Açıklama & Brief',
    en: 'Description & Brief'
  },

  // Blog Page - Additional Translations
  'blog.cta.title': {
    tr: 'Hadi Başlayalım!',
    en: 'Let\'s Get Started!'
  },
  'blog.cta.description': {
    tr: 'İster müşteri olun ister freelancer, sizin için doğru yerdesiniz.',
    en: 'Whether you are a client or a freelancer, you are in the right place.'
  },
  'blog.cta.freelancer_apply': {
    tr: 'Freelancer Başvurusu',
    en: 'Freelancer Application'
  },
  'blog.cta.project_request': {
    tr: 'Proje Talebi',
    en: 'Project Request'
  },

  // Navbar - Additional Translations
  'nav.solutions': {
    tr: 'Çözümler',
    en: 'Solutions'
  },
  'nav.solutionsDesc': {
    tr: 'İşletmenizi geleceğe taşıyacak profesyonel hizmetler',
    en: 'Professional services to take your business into the future'
  },
  'nav.digitalReport.title': {
    tr: 'Dijital Karnenizi Merak Ediyor Musunuz?',
    en: 'Curious About Your Digital Report Card?'
  },
  'nav.digitalReport.desc': {
    tr: 'Web sitenizi ve dijital varlıklarınızı yapay zeka destekli araçlarımızla analiz edelim, eksikleri birlikte belirleyelim.',
    en: 'Let us analyze your website and digital assets with our AI-powered tools, and identify gaps together.'
  },
  'nav.freeReport': {
    tr: '%100 Ücretsiz & Kapsamlı Rapor',
    en: '100% Free & Comprehensive Report'
  },
  'nav.scheduleNow': {
    tr: 'Hemen Randevu Oluştur',
    en: 'Schedule Appointment Now'
  },

  // Home - Testimonials Section
  'home.testimonials.badge': {
    tr: 'Müşteri Deneyimleri',
    en: 'Customer Experiences'
  },
  'home.testimonials.title': {
    tr: 'Başarı Hikayelerimiz',
    en: 'Our Success Stories'
  },
  'home.testimonials.subtitle': {
    tr: 'Unilancer ile çalışan markaların ve girişimlerin deneyimleri',
    en: 'Experiences of brands and startups working with Unilancer'
  },

  // ProjectRequest - Hero Section
  'project_request.badge': {
    tr: 'Proje Teklifi',
    en: 'Project Quote'
  },
  'project_request.hero.title': {
    tr: 'Projenizi',
    en: 'Your Project'
  },
  'project_request.hero.title_highlight': {
    tr: 'Hayata Geçirelim',
    en: 'Let\'s Bring to Life'
  },

  // ProjectRequest - Form Steps
  'project_request.step1.title': {
    tr: '1. Size Hangi Alanlarda Yardımcı Olabiliriz?',
    en: '1. In Which Areas Can We Help You?'
  },
  'project_request.step1.subtitle': {
    tr: 'Önce ana alanları seçin, ardından alt alanları belirleyin.',
    en: 'First select main areas, then specify sub-areas.'
  },
  'project_request.step2.title': {
    tr: '2. Hangi Çözümümüz Sizin İçin Uygun?',
    en: '2. Which Solution is Right for You?'
  },
  'project_request.step3.title': {
    tr: '3. Ne Kadar Sürede Projenin Tamamlanmasını İstersiniz?',
    en: '3. How Soon Do You Want the Project Completed?'
  },
  'project_request.step4.title': {
    tr: '4. İstediğiniz Hizmetten Biraz Bahsedebilir Misiniz?',
    en: '4. Can You Tell Us About the Service You Need?'
  },
  'project_request.step4.description_label': {
    tr: 'Proje Açıklaması',
    en: 'Project Description'
  },
  'project_request.step4.description_placeholder': {
    tr: 'Projenizi kısaca anlatın...',
    en: 'Briefly describe your project...'
  },
  'project_request.step4.brief_label': {
    tr: 'Brief Belgesi (Opsiyonel)',
    en: 'Brief Document (Optional)'
  },
  'project_request.step4.brief_placeholder': {
    tr: 'Brief Belgesi Yükle (PDF, Word)',
    en: 'Upload Brief Document (PDF, Word)'
  },
  'project_request.step4.file_size_limit': {
    tr: 'Maksimum dosya boyutu: 8MB',
    en: 'Maximum file size: 8MB'
  },
  'project_request.step5.company_label': {
    tr: 'Şirket Adı',
    en: 'Company Name'
  },
  'project_request.step5.company_placeholder': {
    tr: 'Şirketinizin adı',
    en: 'Your company name'
  },
  'project_request.step5.contact_placeholder': {
    tr: 'Adınız ve soyadınız',
    en: 'Your full name'
  },
  'project_request.step5.email_label': {
    tr: 'E-posta',
    en: 'Email'
  },
  'project_request.step5.email_placeholder': {
    tr: 'E-posta adresiniz',
    en: 'Your email address'
  },
  'project_request.step5.phone_label': {
    tr: 'Telefon',
    en: 'Phone'
  },
  'project_request.step5.terms_prefix': {
    tr: '',
    en: 'I have read and accept the'
  },
  'project_request.step5.terms_and': {
    tr: 've',
    en: 'and'
  },
  'project_request.step5.terms_suffix': {
    tr: '\'nı okudum ve kabul ediyorum.',
    en: '.'
  },
  'project_request.step5.terms_use': {
    tr: 'Kullanım Koşulları',
    en: 'Terms of Use'
  },
  'project_request.next': {
    tr: 'Devam',
    en: 'Continue'
  },
  'project_request.prev': {
    tr: 'Geri',
    en: 'Back'
  },
  'project_request.submit': {
    tr: 'Formu Gönder',
    en: 'Submit Form'
  },
  'project_request.submitting': {
    tr: 'Gönderiliyor...',
    en: 'Submitting...'
  },

  // Footer Calendly Modal
  'calendly.badge': {
    tr: 'Ücretsiz Danışmanlık',
    en: 'Free Consultation'
  },

  // How It Works Section
  'howItWorks.title.with': {
    tr: 'ile dijitalleşmek',
    en: 'makes going digital'
  },
  'howItWorks.title.easy': {
    tr: 'çok kolay',
    en: 'so easy'
  },
  'howItWorks.step1.label': {
    tr: 'ADIM 1',
    en: 'STEP 1'
  },
  'howItWorks.step1.title': {
    tr: 'Analiz ve Yol Haritası',
    en: 'Analysis and Roadmap'
  },
  'howItWorks.step1.description': {
    tr: "İhtiyacınızı dinliyoruz, Digibot'la dijital analiz raporunuzu çıkarıp yol haritanızı oluşturuyoruz.",
    en: "We listen to your needs, create your digital analysis report with Digibot and build your roadmap."
  },
  'howItWorks.step2.label': {
    tr: 'ADIM 2',
    en: 'STEP 2'
  },
  'howItWorks.step2.title': {
    tr: 'Teklif ve Planlama',
    en: 'Proposal and Planning'
  },
  'howItWorks.step2.description': {
    tr: 'İş kapsamını, süreyi ve bütçeyi netleştiriyoruz. Onayınızdan sonra sözleşme ve faturalama dahil tüm resmi süreçler, tek muhatapla ilerliyor.',
    en: 'We clarify the scope, timeline and budget. After your approval, all official processes including contract and invoicing proceed with a single point of contact.'
  },
  'howItWorks.step3.label': {
    tr: 'ADIM 3',
    en: 'STEP 3'
  },
  'howItWorks.step3.title': {
    tr: 'Üretim ve Raporlama',
    en: 'Production and Reporting'
  },
  'howItWorks.step3.description': {
    tr: 'Proje yöneticimiz üniversiteli ekibi kuruyor, siz ilerlemeyi düzenli raporlarla takip ediyorsunuz.',
    en: 'Our project manager assembles the university team, and you track progress with regular reports.'
  },
  'howItWorks.step4.label': {
    tr: 'ADIM 4',
    en: 'STEP 4'
  },
  'howItWorks.step4.title': {
    tr: 'Teslimat ve Destek',
    en: 'Delivery and Support'
  },
  'howItWorks.step4.description': {
    tr: 'Çıktılar kalite kontrolden geçiyor, proje zamanında teslim ediliyor; gerektiğinde destek vermeyi sürdürüyoruz.',
    en: 'Outputs go through quality control, the project is delivered on time; we continue to provide support when needed.'
  },


  'cta.trust1': {
    tr: '30+ Tamamlanan Proje',
    en: '30+ Completed Projects'
  },
  'cta.trust2': {
    tr: '50+ Üniversiteli Yetenek',
    en: '50+ University Talents'
  },
  'cta.trust3': {
    tr: '%100 Müşteri Memnuniyeti',
    en: '100% Customer Satisfaction'
  },

  'calendly.title': {
    tr: 'Dijital Dönüşüm Yolculuğunuzu Planlayalım',
    en: 'Let\'s Plan Your Digital Transformation Journey'
  },
  'calendly.subtitle': {
    tr: '30 dakikalık görüşmede size özel çözüm önerileri sunacağız.',
    en: 'We will offer customized solution recommendations in a 30-minute meeting.'
  },
  'calendly.duration': {
    tr: '30 Dakika',
    en: '30 Minutes'
  },
  'calendly.platform': {
    tr: 'Google Meet',
    en: 'Google Meet'
  },
  'calendly.topics_title': {
    tr: 'Neler Konuşacağız?',
    en: 'What Will We Discuss?'
  },
  'calendly.topic1': {
    tr: 'Dijital varlık analizi',
    en: 'Digital asset analysis'
  },
  'calendly.topic2': {
    tr: 'Büyüme fırsatları',
    en: 'Growth opportunities'
  },
  'calendly.topic3': {
    tr: 'Teknik öneriler',
    en: 'Technical recommendations'
  },
  'calendly.topic4': {
    tr: 'Yol haritası',
    en: 'Roadmap'
  },
  'calendly.loading': {
    tr: 'Takvim yükleniyor...',
    en: 'Loading calendar...'
  },
  'calendly.mobile_subtitle': {
    tr: '30 dk • Online',
    en: '30 min • Online'
  },
  'calendly.hide_info': {
    tr: 'Bilgileri Gizle',
    en: 'Hide Info'
  },
  'calendly.show_details': {
    tr: 'Detayları Gör',
    en: 'View Details'
  },
  
  // Privacy Policy Modal
  'privacy.title': {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy'
  },
  'privacy.section1.title': {
    tr: '1. Veri Toplama ve Kullanım',
    en: '1. Data Collection and Use'
  },
  'privacy.section1.content': {
    tr: 'Unilancer olarak, hizmetlerimizi sunmak ve geliştirmek için bazı kişisel verilerinizi topluyoruz. Bu veriler arasında isim, e-posta adresi, telefon numarası ve şirket bilgileri bulunabilir. Toplanan veriler, hizmet kalitemizi artırmak, iletişim kurmak ve yasal yükümlülüklerimizi yerine getirmek için kullanılmaktadır.',
    en: 'At Unilancer, we collect some of your personal data to provide and improve our services. This data may include name, email address, phone number, and company information. The collected data is used to improve our service quality, communicate with you, and fulfill our legal obligations.'
  },
  'privacy.section2.title': {
    tr: '2. Veri Güvenliği',
    en: '2. Data Security'
  },
  'privacy.section2.content': {
    tr: 'Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. SSL şifreleme, güvenli veri depolama ve düzenli güvenlik denetimleri bu önlemler arasındadır.',
    en: 'The security of your personal data is important to us. We use industry-standard security measures to protect your data. These measures include SSL encryption, secure data storage, and regular security audits.'
  },
  'privacy.section3.title': {
    tr: '3. Çerezler ve İzleme',
    en: '3. Cookies and Tracking'
  },
  'privacy.section3.content': {
    tr: 'Web sitemizde çerezler ve benzer izleme teknolojileri kullanıyoruz. Bu teknolojiler, kullanıcı deneyimini iyileştirmek, site trafiğini analiz etmek ve hizmetlerimizi geliştirmek için kullanılmaktadır.',
    en: 'We use cookies and similar tracking technologies on our website. These technologies are used to improve user experience, analyze site traffic, and enhance our services.'
  },
  'privacy.section4.title': {
    tr: '4. Veri Paylaşımı',
    en: '4. Data Sharing'
  },
  'privacy.section4.content': {
    tr: 'Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Hizmet sağlayıcılarımızla paylaşılan veriler, gizlilik anlaşmaları kapsamında korunmaktadır.',
    en: 'Your personal data is not shared with third parties except for legal requirements. Data shared with our service providers is protected under confidentiality agreements.'
  },
  'privacy.section5.title': {
    tr: '5. Veri Saklama Süresi',
    en: '5. Data Retention Period'
  },
  'privacy.section5.content': {
    tr: 'Kişisel verileriniz, hizmet ilişkimiz devam ettiği sürece ve yasal saklama yükümlülüklerimiz kapsamında belirlenen süre boyunca saklanmaktadır.',
    en: 'Your personal data is stored for as long as our service relationship continues and for the period determined within the scope of our legal retention obligations.'
  },
  'privacy.section6.title': {
    tr: '6. Haklarınız',
    en: '6. Your Rights'
  },
  'privacy.section6.intro': {
    tr: 'KVKK kapsamında aşağıdaki haklara sahipsiniz:',
    en: 'Under GDPR/KVKK, you have the following rights:'
  },
  'privacy.rights.1': {
    tr: 'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
    en: 'To learn whether your personal data is being processed'
  },
  'privacy.rights.2': {
    tr: 'Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme',
    en: 'To request information about your processed personal data'
  },
  'privacy.rights.3': {
    tr: 'Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
    en: 'To learn the purpose of processing and whether it is used accordingly'
  },
  'privacy.rights.4': {
    tr: 'Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme',
    en: 'To know the third parties to whom your personal data is transferred domestically or abroad'
  },
  'privacy.rights.5': {
    tr: 'Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme',
    en: 'To request correction if your personal data is incomplete or incorrectly processed'
  },
  'privacy.section7.title': {
    tr: '7. İletişim',
    en: '7. Contact'
  },
  'privacy.section7.content': {
    tr: 'Gizlilik politikamız hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:',
    en: 'If you have any questions or concerns about our privacy policy, please contact us:'
  },
  
  // Terms Modal
  'terms.title': {
    tr: 'Kullanım Koşulları',
    en: 'Terms of Service'
  },
  'terms.section1.title': {
    tr: '1. Hizmet Şartları',
    en: '1. Service Terms'
  },
  'terms.section1.content': {
    tr: 'Unilancer platformunu kullanarak, bu kullanım koşullarını kabul etmiş olursunuz. Platformumuz üzerinden sunulan hizmetler, belirtilen şartlar ve koşullar çerçevesinde sağlanmaktadır.',
    en: 'By using the Unilancer platform, you agree to these terms of use. Services provided through our platform are delivered within the specified terms and conditions.'
  },
  'terms.section2.title': {
    tr: '2. Hizmet Kullanımı',
    en: '2. Service Usage'
  },
  'terms.section2.content': {
    tr: 'Platformumuz üzerinden talep ettiğiniz hizmetler, profesyonel standartlara uygun olarak sunulmaktadır. Hizmetlerimizi kullanırken, tüm yasal düzenlemelere ve platform kurallarına uymayı kabul etmiş olursunuz.',
    en: 'Services you request through our platform are provided in accordance with professional standards. By using our services, you agree to comply with all legal regulations and platform rules.'
  },
  'terms.section3.title': {
    tr: '3. Fikri Mülkiyet Hakları',
    en: '3. Intellectual Property Rights'
  },
  'terms.section3.content': {
    tr: 'Proje sürecinde üretilen tüm içerikler, tasarımlar ve kodlar, aksi belirtilmedikçe müşteriye aittir. Unilancer, projelerde kullanılan açık kaynak yazılımların lisans haklarına saygı gösterir.',
    en: 'All content, designs, and code produced during the project belong to the client unless otherwise specified. Unilancer respects the license rights of open source software used in projects.'
  },
  'terms.section4.title': {
    tr: '4. Ödeme ve İade Koşulları',
    en: '4. Payment and Refund Terms'
  },
  'terms.section4.content': {
    tr: 'Proje ödemeleri, belirlenen iş planı ve aşamalara göre yapılır. İptal ve iade koşulları, her projenin özel şartlarına göre sözleşmede belirtilir. Ödemeler, güvenli ödeme sistemleri üzerinden gerçekleştirilir.',
    en: 'Project payments are made according to the determined work plan and phases. Cancellation and refund terms are specified in the contract according to each project\'s specific terms. Payments are processed through secure payment systems.'
  },
  'terms.section5.title': {
    tr: '5. Gizlilik ve Güvenlik',
    en: '5. Privacy and Security'
  },
  'terms.section5.content': {
    tr: 'Proje sürecinde paylaşılan tüm bilgiler gizlilik ilkelerimiz kapsamında korunur. Müşteri bilgileri ve proje detayları, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.',
    en: 'All information shared during the project process is protected under our privacy principles. Customer information and project details are not shared with third parties except for legal requirements.'
  },
  'terms.section6.title': {
    tr: '6. Sorumluluk Sınırları',
    en: '6. Limitation of Liability'
  },
  'terms.section6.content': {
    tr: 'Unilancer, sunduğu hizmetlerin kalitesini garanti eder ancak müşteri tarafından sağlanan içerik, bilgi ve materyallerin doğruluğundan sorumlu tutulamaz. Mücbir sebeplerden kaynaklanan gecikmeler için sorumluluk kabul edilmez.',
    en: 'Unilancer guarantees the quality of its services but cannot be held responsible for the accuracy of content, information, and materials provided by the customer. No liability is accepted for delays caused by force majeure.'
  },
  'terms.section7.title': {
    tr: '7. Sözleşme Feshi',
    en: '7. Contract Termination'
  },
  'terms.section7.content': {
    tr: 'Taraflar, belirtilen şartlara uymadığı takdirde sözleşmeyi feshetme hakkına sahiptir. Fesih durumunda, o ana kadar tamamlanan işler için ödeme yapılır ve tüm materyaller teslim edilir.',
    en: 'Parties have the right to terminate the contract if the specified terms are not met. In case of termination, payment is made for work completed up to that point and all materials are delivered.'
  },
  'terms.section8.title': {
    tr: '8. Güncellemeler',
    en: '8. Updates'
  },
  'terms.section8.content': {
    tr: 'Unilancer, bu kullanım koşullarını önceden haber vermeksizin güncelleme hakkını saklı tutar. Güncellemeler, web sitemizde yayınlandığı tarihten itibaren geçerli olur.',
    en: 'Unilancer reserves the right to update these terms of use without prior notice. Updates become effective from the date they are published on our website.'
  },
  'terms.section9.title': {
    tr: '9. İletişim',
    en: '9. Contact'
  },
  'terms.section9.content': {
    tr: 'Kullanım koşullarımız hakkında sorularınız için bize ulaşın:',
    en: 'For questions about our terms of use, contact us:'
  }
};

export async function initializeStaticTranslations() {
  const { supabase } = await import('./config/supabase');

  for (const [key, translations] of Object.entries(staticTranslations)) {
    const trText = translations.tr;
    const enText = translations.en;

    try {
      const { data: existingTr } = await supabase
        .from('translations')
        .select('id')
        .eq('content_key', key)
        .eq('language', 'tr')
        .maybeSingle();

      if (!existingTr) {
        await supabase.from('translations').insert({
          content_key: key,
          language: 'tr',
          translated_text: trText,
          content_hash: generateHash(trText)
        });
      }

      const { data: existingEn } = await supabase
        .from('translations')
        .select('id')
        .eq('content_key', key)
        .eq('language', 'en')
        .maybeSingle();

      if (!existingEn) {
        await supabase.from('translations').insert({
          content_key: key,
          language: 'en',
          translated_text: enText,
          content_hash: generateHash(enText)
        });
      }
    } catch (error) {
      console.error(`Error initializing translation for ${key}:`, error);
    }
  }
}

function generateHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function getStaticTranslation(key: string, language: Language): string | undefined {
  return staticTranslations[key]?.[language];
}

export async function translateAndCache(
  contentKey: string,
  text: string,
  language: Language = 'en'
): Promise<string> {
  if (language === 'tr') {
    return text;
  }

  if (staticTranslations[contentKey]) {
    return staticTranslations[contentKey][language];
  }

  return await getOrCreateTranslation(contentKey, text, language);
}
