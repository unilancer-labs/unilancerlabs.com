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

  // Partners Section (Extended)
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
    tr: '',
    en: ''
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

  // Services Section
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
  '3dar.demo.title': {
    tr: 'Demo',
    en: 'Demo'
  },
  '3dar.demo.description': {
    tr: 'Aşağıdaki 3D modeli keşfedin',
    en: 'Explore the 3D model below'
  },
  'nav.getFreeReport': {
    tr: 'Ücretsiz Dijital Raporunuzu Alın',
    en: 'Get Your Free Digital Report'
  },
  'nav.scheduleConsultation': {
    tr: 'Görüşme Ayarlayın',
    en: 'Schedule Consultation'
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
