# 🚀 Unilancer Labs - Dijital Ajans Platformu

<div align="center">

![Unilancer Logo](https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/Unilancer%20logo%202.webp)

**Modern, Hızlı ve Ölçeklenebilir Dijital Ajans Web Sitesi**

[🌐 Canlı Site](https://unilancer.co) • [📖 Dokümantasyon](#-dokümantasyon)

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## 📋 İçindekiler

1. [Proje Nedir?](#-proje-nedir)
2. [Özellikler](#-özellikler)
3. [Teknolojiler](#️-teknolojiler)
4. [Başlamadan Önce](#-başlamadan-önce)
5. [Kurulum Adımları](#-kurulum-adımları)
6. [Proje Yapısı](#-proje-yapısı)
7. [Sayfa ve URL Yapısı](#-sayfa-ve-url-yapısı)
8. [Admin Paneli](#-admin-paneli)
9. [Veritabanı](#-veritabanı)
10. [Çeviri Sistemi](#-çeviri-sistemi)
11. [Yeni Sayfa Ekleme](#-yeni-sayfa-ekleme)
12. [Sık Karşılaşılan Sorunlar](#-sık-karşılaşılan-sorunlar)
13. [Yayınlama (Deploy)](#-yayınlama-deploy)
14. [Faydalı Kaynaklar](#-faydalı-kaynaklar)

---

## 📖 Proje Nedir?

**Unilancer**, profesyonel dijital hizmetler sunan bir ajans platformudur. Bu web sitesi şunları içerir:

| Bölüm | Açıklama |
|-------|----------|
| 🏠 **Kurumsal Site** | Şirket tanıtımı, hizmetler, portfolyo, blog |
| 👥 **Freelancer Sistemi** | Freelancer başvuru ve yönetim sistemi |
| 📋 **Proje Talep** | Müşterilerin proje talebi göndermesi |
| 🔐 **Admin Paneli** | Blog, portfolyo, freelancer ve proje yönetimi |
| 🤖 **DigiBot** | Yapay zeka destekli chatbot |
| 📊 **Dijital Analiz** | Web sitesi analiz aracı |

---

## ✨ Özellikler

### Kullanıcı Özellikleri
- 🌍 **Çift Dil**: Türkçe ve İngilizce (otomatik algılama)
- 🌙 **Karanlık/Aydınlık Tema**: Sistem tercihine göre değişir
- 📱 **Responsive**: Telefon, tablet, bilgisayar uyumlu
- 🔍 **SEO Optimizasyonu**: Google'da iyi sıralama için
- ⚡ **Hızlı Yükleme**: Lazy loading ile performans
- 🎨 **3D Deneyimler**: Three.js ile interaktif modeller

### Admin Özellikleri
- ✅ Blog yazısı ekleme/düzenleme/silme
- ✅ Portfolyo projesi yönetimi
- ✅ Freelancer başvuru onay/red
- ✅ Proje talepleri takibi
- ✅ Otomatik çeviri (DeepL ile)

---

## 🛠️ Teknolojiler

### Bu Projede Ne Kullanılıyor?

#### Frontend (Görünen Kısım)

| Teknoloji | Ne İşe Yarıyor? | Öğrenmek İçin |
|-----------|-----------------|---------------|
| **React** | Kullanıcı arayüzü oluşturma | [react.dev](https://react.dev) |
| **TypeScript** | JavaScript + tip güvenliği | [typescriptlang.org](https://www.typescriptlang.org/) |
| **Vite** | Hızlı geliştirme sunucusu | [vitejs.dev](https://vitejs.dev/) |
| **Tailwind CSS** | Hızlı stil yazma | [tailwindcss.com](https://tailwindcss.com/) |
| **React Router** | Sayfa yönlendirme | [reactrouter.com](https://reactrouter.com/) |
| **Framer Motion** | Animasyonlar | [framer.com/motion](https://www.framer.com/motion/) |

#### Backend (Arka Plan)

| Teknoloji | Ne İşe Yarıyor? |
|-----------|-----------------|
| **Supabase** | Veritabanı + Kimlik doğrulama + Dosya depolama |
| **PostgreSQL** | İlişkisel veritabanı (Supabase içinde) |
| **Edge Functions** | Sunucusuz API fonksiyonları |

#### Harici Servisler

| Servis | Ne İşe Yarıyor? |
|--------|-----------------|
| **DeepL API** | Otomatik çeviri |
| **Google Analytics** | Site istatistikleri |
| **Vercel** | Web sitesi barındırma |

---

## 📋 Başlamadan Önce

### Bilgisayarınızda Olması Gerekenler

1. **Node.js** (v18 veya üzeri)
   - İndir: https://nodejs.org/
   - Kurulumu kontrol et: `node --version`

2. **Git**
   - İndir: https://git-scm.com/
   - Kurulumu kontrol et: `git --version`

3. **VS Code** (Önerilen editör)
   - İndir: https://code.visualstudio.com/

### VS Code Eklentileri (Önerilen)

| Eklenti | Ne İşe Yarar? |
|---------|---------------|
| **ES7+ React Snippets** | React kod parçacıkları |
| **Tailwind CSS IntelliSense** | Tailwind otomatik tamamlama |
| **Prettier** | Kod formatlama |
| **ESLint** | Kod kalitesi kontrolü |
| **Turkish Language Pack** | VS Code Türkçe |

---

## 🚀 Kurulum Adımları

### Adım 1: Projeyi İndir

```bash
# Terminal/PowerShell aç ve şunu yaz:
git clone https://github.com/unilancer-labs/unilancerlabs.com.git

# Proje klasörüne gir
cd unilancerlabs.com
```

### Adım 2: Bağımlılıkları Yükle

```bash
npm install
```

> ⏳ Bu işlem 1-2 dakika sürebilir. `node_modules` klasörü oluşacak.

### Adım 3: Ortam Değişkenlerini Ayarla

Proje klasöründe `.env` dosyası oluştur:

```env
# Supabase Bağlantı Bilgileri
VITE_SUPABASE_URL=https://ctncspdgguclpeijikfp.supabase.co
VITE_SUPABASE_ANON_KEY=buraya_anahtar_gelecek
```

> ⚠️ **Önemli**: `.env` dosyası gizlidir ve GitHub'a yüklenmez. Gerçek anahtarı ekip liderinizden isteyin.

### Adım 4: Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

### Adım 5: Tarayıcıda Aç

Tarayıcıda şu adresi aç: **http://localhost:5173**

🎉 **Tebrikler!** Proje çalışıyor!

---

## 📁 Proje Yapısı

```
📦 unilancerlabs.com/
│
├── 📂 public/                  # Statik dosyalar
│   ├── robots.txt             # SEO ayarları
│   ├── sitemap.xml            # Site haritası
│   └── 📂 images/             # Görseller
│
├── 📂 src/                     # 🔥 ANA KAYNAK KODLARI
│   │
│   ├── 📄 App.tsx              # ⭐ Ana uygulama (tüm routing burada)
│   ├── 📄 main.tsx             # Giriş noktası
│   ├── 📄 index.css            # Global stiller
│   │
│   ├── 📂 components/          # 🧩 Tekrar kullanılan parçalar
│   │   ├── Navbar.tsx         # Üst menü
│   │   ├── Footer.tsx         # Alt bilgi
│   │   ├── PrivateRoute.tsx   # Admin koruma
│   │   ├── 📂 ui/             # Buton, badge, modal vb.
│   │   ├── 📂 3d/             # 3D bileşenler
│   │   └── 📂 modals/         # Pop-up diyaloglar
│   │
│   ├── 📂 pages/               # 📄 Sayfalar
│   │   ├── Home.tsx           # Ana sayfa
│   │   ├── About.tsx          # Hakkımızda
│   │   ├── Services.tsx       # Hizmetler
│   │   ├── Portfolio.tsx      # Portfolyo
│   │   ├── Blog.tsx           # Blog listesi
│   │   ├── BlogDetail.tsx     # Blog detay
│   │   ├── Contact.tsx        # İletişim
│   │   ├── Team.tsx           # Ekibimiz
│   │   ├── JoinUs.tsx         # Freelancer başvuru
│   │   ├── ProjectRequest.tsx # Proje talebi
│   │   ├── Login.tsx          # Admin giriş
│   │   └── 📂 services/       # Hizmet detay sayfaları
│   │
│   ├── 📂 features/            # 🔧 Özellik modülleri
│   │   └── 📂 admin/          # Admin paneli
│   │       ├── routes.tsx     # Admin yönlendirme
│   │       ├── 📂 blog/       # Blog yönetimi
│   │       ├── 📂 portfolio/  # Portfolyo yönetimi
│   │       ├── 📂 freelancers/# Freelancer yönetimi
│   │       └── 📂 translations/ # Çeviri yönetimi
│   │
│   ├── 📂 contexts/            # 🌐 Global state
│   │   ├── LanguageContext.tsx # Dil (TR/EN)
│   │   └── ThemeContext.tsx    # Tema (karanlık/aydınlık)
│   │
│   ├── 📂 hooks/               # 🪝 Özel hook'lar
│   │   └── useTranslation.ts  # Çeviri hook'u
│   │
│   ├── 📂 lib/                 # 🔧 Yardımcı fonksiyonlar
│   │   ├── translations.ts    # Çeviri verileri
│   │   ├── utils.ts           # Yardımcı fonksiyonlar
│   │   ├── auth.ts            # Kimlik doğrulama
│   │   ├── 📂 api/            # API çağrıları
│   │   └── 📂 config/
│   │       └── supabase.ts    # Supabase bağlantısı
│   │
│   └── 📂 types/               # TypeScript tipleri
│
├── 📂 supabase/                # Supabase ayarları
│   ├── 📂 migrations/         # Veritabanı değişiklikleri
│   └── 📂 functions/          # Edge fonksiyonları
│
├── 📂 docs/                    # 📚 Dokümantasyon
│
├── 📄 package.json             # Bağımlılıklar ve scriptler
├── 📄 tailwind.config.js       # Tailwind ayarları
├── 📄 vite.config.ts           # Vite ayarları
└── 📄 vercel.json              # Vercel deploy ayarları
```

### En Önemli Dosyalar

| Dosya | Ne Yapar? |
|-------|-----------|
| `src/App.tsx` | Tüm sayfa yönlendirmeleri burada |
| `src/lib/translations.ts` | Tüm çeviriler burada |
| `src/lib/config/supabase.ts` | Veritabanı bağlantısı |
| `src/components/Navbar.tsx` | Üst menü |
| `src/contexts/LanguageContext.tsx` | Dil değiştirme mantığı |
| `src/contexts/ThemeContext.tsx` | Tema değiştirme mantığı |

---

## 🗺 Sayfa ve URL Yapısı

Site **iki dilli** olduğu için her sayfa `/tr` veya `/en` ile başlar.

### Genel Sayfalar

| Sayfa | Türkçe URL | İngilizce URL |
|-------|------------|---------------|
| Ana Sayfa | `/tr` | `/en` |
| Portfolyo | `/tr/portfolyo` | `/en/portfolio` |
| Hizmetler | `/tr/hizmetler` | `/en/services` |
| Hakkımızda | `/tr/hakkimizda` | `/en/about` |
| Blog | `/tr/blog` | `/en/blog` |
| İletişim | `/tr/iletisim` | `/en/contact` |
| Ekibimiz | `/tr/ekibimiz` | `/en/team` |
| Başvuru | `/tr/basvuru` | `/en/join` |
| Proje Talebi | `/tr/proje-talebi` | `/en/project-request` |

### Hizmet Detay Sayfaları

| Hizmet | URL |
|--------|-----|
| Web Tasarım | `/tr/hizmetler/web-tasarim` |
| 3D & AR | `/tr/hizmetler/3d-ar` |
| E-Ticaret | `/tr/hizmetler/e-ticaret-cozumleri` |
| Pazarlama | `/tr/hizmetler/pazarlama-reklam` |
| Yapay Zeka | `/tr/hizmetler/yapay-zeka-digibot` |
| Yazılım | `/tr/hizmetler/yazilim-gelistirme` |
| Kurumsal Kimlik | `/tr/hizmetler/kurumsal-kimlik-marka` |
| Grafik Tasarım | `/tr/hizmetler/grafik-tasarim` |

### Admin Sayfaları

| Sayfa | URL |
|-------|-----|
| Giriş | `/login` |
| Dashboard | `/admin/dashboard` |
| Blog Yönetimi | `/admin/blog` |
| Portfolyo | `/admin/portfolio` |
| Freelancerlar | `/admin/freelancers` |
| Proje Talepleri | `/admin/project-requests` |
| Çeviriler | `/admin/translations` |
| DigiBot AI | `/admin/ai-dashboard` |

> 💡 Ana URL (`/`) otomatik olarak `/tr`'ye yönlendirir.

---

## 🔐 Admin Paneli

### Giriş Yapma

1. Tarayıcıda `/login` adresine git
2. E-posta ve şifre ile giriş yap
3. Başarılı girişte `/admin/dashboard`'a yönlendirilirsin

### Admin Modülleri

#### 📝 Blog Yönetimi
- **URL**: `/admin/blog`
- **Özellikler**:
  - Yeni blog yazısı oluştur
  - Mevcut yazıları düzenle/sil
  - Yayınla veya taslak olarak kaydet
  - Kategori ve etiket ekle
  - Görsel yükle

#### 🖼️ Portfolyo Yönetimi
- **URL**: `/admin/portfolio`
- **Özellikler**:
  - Proje ekle/düzenle/sil
  - Görsel galeri yönetimi
  - Teknoloji etiketleri
  - Öne çıkan proje işaretleme

#### 👥 Freelancer Yönetimi
- **URL**: `/admin/freelancers`
- **Özellikler**:
  - Başvuruları görüntüle
  - Onayla / Reddet
  - Durum değiştir

#### 📋 Proje Talepleri
- **URL**: `/admin/project-requests`
- **Özellikler**:
  - Müşteri taleplerini görüntüle
  - Durum güncelle

#### 🌐 Çeviri Yönetimi
- **URL**: `/admin/translations`
- **Özellikler**:
  - Eksik çevirileri senkronize et
  - Otomatik çeviri (DeepL)

---

## 🗄 Veritabanı

Proje **Supabase PostgreSQL** kullanır.

### Ana Tablolar

| Tablo | Açıklama |
|-------|----------|
| `blog_posts` | Blog yazıları |
| `blog_authors` | Blog yazarları |
| `portfolio_items` | Portfolyo projeleri |
| `freelancers` | Freelancer profilleri |
| `project_requests` | Müşteri proje talepleri |
| `translations` | Çeviri key-value çiftleri |

### Supabase'e Erişim

1. https://supabase.com/dashboard adresine git
2. "Unilancer" projesini seç
3. Sol menüden "Table Editor" seç
4. Tabloları görüntüle ve düzenle

---

## 🌍 Çeviri Sistemi

### Nasıl Çalışıyor?

1. Çeviriler `src/lib/translations.ts` dosyasında saklanır
2. Sayfalarda `t('anahtar')` fonksiyonu ile kullanılır
3. Dil değiştiğinde tüm metinler otomatik güncellenir

### Çeviri Kullanımı

```tsx
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>Şu anki dil: {language}</p>
    </div>
  );
}
```

### Yeni Çeviri Ekleme

`src/lib/translations.ts` dosyasını aç:

```typescript
export const translations = {
  tr: {
    // ... mevcut çeviriler
    'yeni.anahtar': 'Türkçe metin',
  },
  en: {
    // ... mevcut çeviriler
    'yeni.anahtar': 'English text',
  }
};
```

---

## ➕ Yeni Sayfa Ekleme

### Adım 1: Sayfa Dosyası Oluştur

`src/pages/YeniSayfa.tsx` dosyası oluştur:

```tsx
import { useTranslation } from '../hooks/useTranslation';

const YeniSayfa = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Yeni Sayfa
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Sayfa içeriği buraya gelecek.
        </p>
      </div>
    </div>
  );
};

export default YeniSayfa;
```

### Adım 2: Route Ekle

`src/App.tsx` dosyasını aç:

```tsx
// 1. Import ekle (dosyanın üstüne)
const YeniSayfa = lazy(() => import('./pages/YeniSayfa'));

// 2. Route ekle (Routes içine)
<Route path="/tr/yeni-sayfa" element={<YeniSayfa />} />
<Route path="/en/new-page" element={<YeniSayfa />} />
```

### Adım 3: Navbar'a Link Ekle (İsteğe Bağlı)

`src/components/Navbar.tsx` dosyasında ilgili yere link ekle.

---

## ❓ Sık Karşılaşılan Sorunlar

### 🔴 "Supabase bağlantı bilgileri eksik!" hatası

**Sebep**: `.env` dosyası eksik veya yanlış.

**Çözüm**:
1. Proje kök dizininde `.env` dosyası oluştur
2. Supabase bilgilerini ekle:
```env
VITE_SUPABASE_URL=https://ctncspdgguclpeijikfp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

### 🔴 "npm install" hata veriyor

**Çözüm**:
```bash
# node_modules ve lock dosyasını sil
rm -rf node_modules
rm package-lock.json

# Tekrar yükle
npm install
```

Windows için:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### 🔴 Sayfa yenilenince 404 hatası

**Sebep**: SPA routing sorunu.

**Çözüm**: Bu Vercel'de otomatik çözülüyor. Yerel geliştirmede sorun olmaz.

---

### 🔴 Stiller çalışmıyor

**Çözüm**:
```bash
# Sunucuyu durdur (Ctrl+C) ve yeniden başlat
npm run dev
```

---

### 🔴 Admin paneline giremiyorum

**Çözüm**:
1. `/login` adresine git
2. Doğru e-posta ve şifre kullan
3. Supabase'de kullanıcının `app_metadata`'sında `role: "admin"` olmalı

---

### 🔴 TypeScript hatası alıyorum

**Çözüm**:
```bash
# Tip kontrolü yap
npm run lint
```

Hata mesajını okuyup ilgili dosyayı düzelt.

---

## 🚀 Yayınlama (Deploy)

### Otomatik Deploy (Önerilen)

1. Değişiklikleri commit et:
```bash
git add .
git commit -m "feat: yeni özellik"
```

2. GitHub'a push et:
```bash
git push origin main
```

3. **Vercel otomatik olarak deploy eder** (~2 dakika)

4. Canlı site: https://unilancer.co

### Manuel Build

```bash
# Prodüksiyon build al
npm run build

# dist/ klasöründe çıktılar oluşur
```

---

## 📜 Komutlar

| Komut | Ne Yapar? |
|-------|-----------|
| `npm run dev` | Geliştirme sunucusu başlat |
| `npm run build` | Prodüksiyon için derle |
| `npm run preview` | Build'i önizle |
| `npm run lint` | Kod kontrolü |

---

## 📚 Faydalı Kaynaklar

### Öğrenmek İçin

| Konu | Kaynak |
|------|--------|
| React | [React Dokümantasyonu](https://react.dev/learn) |
| TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) |
| Tailwind CSS | [Tailwind Docs](https://tailwindcss.com/docs) |
| Supabase | [Supabase Docs](https://supabase.com/docs) |

### Proje Dokümantasyonu

| Dosya | İçerik |
|-------|--------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Sistem mimarisi |
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Geliştirici rehberi |
| [docs/FEATURES.md](docs/FEATURES.md) | Özellik listesi |
| [docs/TRANSLATION_SYSTEM.md](docs/TRANSLATION_SYSTEM.md) | Çeviri sistemi |

---

## 🤝 Katkıda Bulunma

### Git Workflow

1. Yeni branch oluştur:
```bash
git checkout -b feature/yeni-ozellik
```

2. Değişiklik yap ve commit et:
```bash
git add .
git commit -m "feat: yeni özellik açıklaması"
```

3. Push et:
```bash
git push origin feature/yeni-ozellik
```

4. GitHub'da Pull Request aç

### Commit Mesaj Formatı

| Prefix | Kullanım |
|--------|----------|
| `feat:` | Yeni özellik |
| `fix:` | Hata düzeltme |
| `docs:` | Dokümantasyon |
| `style:` | Stil değişiklikleri |
| `refactor:` | Kod düzenleme |
| `chore:` | Genel bakım |

**Örnek**: `feat: kullanıcı profil sayfası eklendi`

---

## 📞 Yardım

Sorun yaşarsan:

1. Bu README'yi tekrar oku
2. `docs/` klasöründeki belgelere bak
3. Ekip liderine sor

---

<div align="center">

**Unilancer Labs** ❤️

[🌐 unilancer.co](https://unilancer.co)

*Son güncelleme: Ocak 2026*

</div>
