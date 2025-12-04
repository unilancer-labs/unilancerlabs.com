import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowUpRight, Clock, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { EmblaCarouselType } from 'embla-carousel';
import { getBlogPosts, type BlogPost } from '../lib/config/supabase';
import { getCategories, type BlogCategory } from '../lib/api/blog';
import { useTranslation } from '../hooks/useTranslation';

const BlogHeroSkeleton = () => (
  <div className="w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-slate-200 dark:bg-white/5 animate-pulse relative">
    <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-12 lg:p-16 w-full max-w-4xl space-y-3 sm:space-y-4">
      <div className="h-6 sm:h-8 w-24 sm:w-32 bg-slate-300 dark:bg-white/10 rounded-full" />
      <div className="h-8 sm:h-12 w-3/4 bg-slate-300 dark:bg-white/10 rounded-lg" />
      <div className="h-5 sm:h-6 w-1/2 bg-slate-300 dark:bg-white/10 rounded-lg" />
    </div>
  </div>
);

const BlogCardSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-[4/3] bg-slate-200 dark:bg-white/5 rounded-2xl" />
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="h-4 w-24 bg-slate-200 dark:bg-white/5 rounded" />
        <div className="h-4 w-4 bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-4 w-16 bg-slate-200 dark:bg-white/5 rounded" />
      </div>
      <div className="h-6 w-full bg-slate-200 dark:bg-white/5 rounded" />
      <div className="h-6 w-2/3 bg-slate-200 dark:bg-white/5 rounded" />
    </div>
  </div>
);

const Blog = () => {
  const { t, language } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlugFromUrl = searchParams.get('category');
  
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 9;

  // Embla Carousel with smoother transitions
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 30, // Daha yumuşak geçiş için süre
      skipSnaps: false
    },
    [
      Autoplay({ 
        delay: 5000, 
        stopOnInteraction: true,
        stopOnMouseEnter: true 
      })
    ]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Autoplay is now handled by the Autoplay plugin
  // Respect user's motion preferences
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      autoplay.stop();
    }
  }, [emblaApi]);

  useEffect(() => {
    loadBlogPosts();
    loadCategories();
  }, []);

  // Handle category from URL
  useEffect(() => {
    if (categorySlugFromUrl && categories.length > 0) {
      const cat = categories.find(c => c.slug === categorySlugFromUrl);
      if (cat) {
        setSelectedCategoryId(cat.id);
      }
    }
  }, [categorySlugFromUrl, categories]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories(true);
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // useMemo ile filtreleme optimizasyonu - gereksiz re-render'ları önler
  const visiblePosts = useMemo(() => {
    return posts.filter(post => {
      // Check if category matches by ID or name
      const matchesCategory = !selectedCategoryId || 
                            post.category_id === selectedCategoryId ||
                            (categories.find(c => c.id === selectedCategoryId)?.name === post.category);
                            
      const matchesSearch =
        post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, debouncedQuery, posts, categories]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
    
    // Update URL
    if (categoryId) {
      const cat = categories.find(c => c.id === categoryId);
      if (cat) {
        setSearchParams({ category: cat.slug });
      }
    } else {
      setSearchParams({});
    }
  };

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getBlogPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError(t('blog.loadError', 'Blog yazıları yüklenirken bir hata oluştu.'));
    } finally {
      setLoading(false);
    }
  };

  // Show hero slider if we have any posts and we are not searching
  // Banner is independent of the category filter
  const shouldShowHero = posts.length > 0 && !debouncedQuery;
  
  // Always show the latest 3 posts from the global list in the banner
  const featuredPosts = shouldShowHero ? posts.slice(0, 3) : [];
  
  // Grid shows the filtered list (visiblePosts)
  // We do NOT slice the first 3 anymore, so posts in banner are also shown in the list
  const gridPosts = visiblePosts;
  
  // Pagination logic
  const totalPages = Math.ceil(gridPosts.length / postsPerPage);
  const currentGridPosts = gridPosts.slice((page - 1) * postsPerPage, page * postsPerPage);

  // SEO: Blog listing structured data
  const blogListingSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": language === 'tr' ? "Unilancer Blog" : "Unilancer Blog",
    "description": language === 'tr' 
      ? "Teknoloji, tasarım, yapay zeka ve dijital dönüşüm hakkında güncel blog yazıları."
      : "Latest blog posts about technology, design, AI and digital transformation.",
    "url": `https://unilancer.co/${language}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "Unilancer",
      "logo": {
        "@type": "ImageObject",
        "url": "https://unilancer.co/images/logo.png"
      }
    },
    "blogPost": posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image_url,
      "datePublished": post.created_at,
      "dateModified": post.updated_at || post.created_at,
      "author": { "@type": "Organization", "name": "Unilancer" },
      "url": `https://unilancer.co/${language}/blog/${post.slug}`
    }))
  }), [posts, language]);

  const seoTitle = useMemo(() => {
    const selectedCat = categories.find(c => c.id === selectedCategoryId);
    if (selectedCat) {
      return language === 'tr' 
        ? `${selectedCat.name} Yazıları | Unilancer Blog`
        : `${selectedCat.name_en || selectedCat.name} Posts | Unilancer Blog`;
    }
    return language === 'tr' 
      ? "Blog | Teknoloji, Tasarım ve Dijital Dönüşüm - Unilancer"
      : "Blog | Technology, Design and Digital Transformation - Unilancer";
  }, [language, selectedCategoryId, categories]);
  
  const seoDescription = useMemo(() => {
    const selectedCat = categories.find(c => c.id === selectedCategoryId);
    if (selectedCat) {
      return language === 'tr'
        ? selectedCat.description || `${selectedCat.name} kategorisindeki en güncel blog yazıları.`
        : selectedCat.description_en || `Latest blog posts in ${selectedCat.name_en || selectedCat.name} category.`;
    }
    return language === 'tr'
      ? "Teknoloji, tasarım, yapay zeka, web geliştirme ve dijital dönüşüm hakkında güncel blog yazıları. Uzman içerikler ve sektörel analizler."
      : "Latest blog posts about technology, design, AI, web development and digital transformation. Expert content and industry analysis.";
  }, [language, selectedCategoryId, categories]);

  return (
    <div className="relative min-h-screen">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={`https://unilancer.co/${language}/blog`} />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:image" content={posts[0]?.image_url || 'https://unilancer.co/images/og-blog.jpg'} />
        <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={posts[0]?.image_url || 'https://unilancer.co/images/og-blog.jpg'} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`https://unilancer.co/${language}/blog`} />
        <meta name="keywords" content={language === 'tr' 
          ? "blog, teknoloji, tasarım, yapay zeka, web geliştirme, dijital dönüşüm, yazılım"
          : "blog, technology, design, AI, web development, digital transformation, software"} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(blogListingSchema)}
        </script>
      </Helmet>

      {/* Arka plan - Statik gradient (performans için) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-dark dark:via-dark-light dark:to-dark" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5FC8DA08_1px,transparent_1px),linear-gradient(to_bottom,#5FC8DA08_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
      </div>

      {/* Navbar Spacer - Mobilde navbar yüksekliği + boşluk */}
      <div className="h-[88px] sm:h-20 md:h-24" />

      {/* HERO SECTION - Full Image Slider */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-10 md:mb-16 relative z-10">
        {loading ? (
          <BlogHeroSkeleton />
        ) : featuredPosts.length > 0 ? (
          <div className="relative group">
            <div className="overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5" ref={emblaRef}>
              <div className="flex will-change-transform">
                {featuredPosts.map((post) => (
                  <div key={post.id} className="flex-[0_0_100%] min-w-0 relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover object-right md:object-center"
                        loading="eager"
                        fetchPriority="high"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end sm:justify-center p-6 sm:p-8 md:p-12 lg:p-16 max-w-4xl">
                      <div className="space-y-3 sm:space-y-4 md:space-y-6">
                        <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-white/10 text-white text-xs sm:text-sm font-medium rounded-full backdrop-blur-md border border-white/20">
                          {t(post.category)}
                        </span>
                        
                        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.5)] line-clamp-3 md:line-clamp-none">
                          {post.title}
                        </h1>
                        
                        <p className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
                          {post.excerpt}
                        </p>
                        
                        <div className="pt-3 sm:pt-4 md:pt-6 flex flex-wrap gap-4 sm:gap-6 items-center">
                          <Link 
                            to={`/${language}/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-slate-900 rounded-full text-sm sm:text-base font-bold transition-all duration-300 hover:bg-primary hover:scale-105 shadow-lg"
                          >
                            {t('blog.readFullArticle')}
                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20" role="tablist" aria-label={t('blog.slider.navigation', 'Slider navigasyonu')}>
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  aria-label={t('blog.slider.goToSlide', 'Slayt {{number}} git').replace('{{number}}', String(index + 1))}
                  aria-selected={index === selectedIndex}
                  role="tab"
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex 
                      ? "bg-white w-8" 
                      : "bg-white/40 w-2 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Slider Controls - Hidden on mobile, visible on tablet+ */}
            <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 hidden sm:flex gap-2 sm:gap-3 z-20">
              <button 
                onClick={scrollPrev}
                aria-label={t('blog.slider.previous', 'Önceki slayt')}
                className="p-2.5 sm:p-3 md:p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={scrollNext}
                aria-label={t('blog.slider.next', 'Sonraki slayt')}
                className="p-2.5 sm:p-3 md:p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Header & Filters - Centered Pill Style */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-4 sm:pb-8 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {/* Categories - Grid on mobile, Pill on desktop */}
          <div className="w-full">
            {/* Mobile: 3-column grid - 44px min touch target */}
            <div className="grid grid-cols-3 gap-2 sm:hidden">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`
                  px-2 py-2.5 min-h-[44px] rounded-xl text-xs font-medium transition-all duration-200 text-center active:scale-95
                  ${!selectedCategoryId
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white/90 dark:bg-white/10 text-slate-700 dark:text-gray-200 border border-slate-200/50 dark:border-white/10'}
                `}
              >
                {t('blog.category.all', 'Tümü')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`
                    px-2 py-2.5 min-h-[44px] rounded-xl text-xs font-medium transition-all duration-200 text-center active:scale-95
                    ${selectedCategoryId === cat.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/90 dark:bg-white/10 text-slate-700 dark:text-gray-200 border border-slate-200/50 dark:border-white/10'}
                  `}
                >
                  {language === 'en' && cat.name_en ? cat.name_en : cat.name}
                </button>
              ))}
            </div>
            {/* Desktop: Pill style */}
            <div className="hidden sm:flex justify-center">
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-1.5 rounded-full inline-flex flex-wrap justify-center gap-1 shadow-lg">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`
                    px-4 md:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                    ${!selectedCategoryId
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                      : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10'}
                  `}
                >
                  {t('blog.category.all', 'Tümü')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`
                      px-4 md:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                      ${selectedCategoryId === cat.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                        : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10'}
                    `}
                  >
                    {language === 'en' && cat.name_en ? cat.name_en : cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Title Row */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3">
             <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 text-center md:text-left">
               {!selectedCategoryId ? (
                 <>
                   {t('blog.latestUpdates')} <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
                 </>
               ) : (language === 'en' && categories.find(c => c.id === selectedCategoryId)?.name_en) || categories.find(c => c.id === selectedCategoryId)?.name}
             </h2>
             
             <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t('blog.searchPlaceholder', 'Blog yazılarında ara')}
                  className="w-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 min-h-[44px] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        {/* POSTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl p-8 max-w-lg mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
                <button 
                  onClick={loadBlogPosts} 
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-bold"
                >
                  {t('blog.tryAgain')}
                </button>
              </div>
            </div>
          ) : currentGridPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
                <p className="text-slate-600 dark:text-gray-400 font-medium">
                  {searchQuery ? t('blog.noPostsFound') : t('blog.noPostsYet')}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="mt-4 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:opacity-90 transition-opacity text-sm font-bold"
                  >
                    {t('blog.clearSearch')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            currentGridPosts.map((post, index) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:shadow-xl"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.4s ease-out forwards',
                  opacity: 0
                }}
              >
                <Link to={`/${language}/blog/${post.slug}`} className="block mb-4 sm:mb-6 relative overflow-hidden rounded-xl sm:rounded-[1.5rem] aspect-[4/3]">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-right md:object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="px-2.5 py-1 sm:px-3 bg-white/90 dark:bg-black/50 backdrop-blur-md text-slate-900 dark:text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                      {t(post.category)}
                    </span>
                  </div>
                </Link>
                
                <div className="space-y-3 sm:space-y-4 px-1 sm:px-2 pb-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{post.read_time}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600" />
                    <span className="truncate">{new Date(post.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  
                  <Link to={`/${language}/blog/${post.slug}`}>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed text-xs sm:text-sm">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-3 sm:pt-4 mt-auto border-t border-slate-100 dark:border-white/5">
                    <Link to={`/${language}/blog/${post.slug}`} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:text-primary-dark transition-colors ml-auto">
                      {t('blog.readMore')}
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-full bg-white dark:bg-white/5 text-slate-900 dark:text-white hover:bg-primary hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm border border-slate-200 dark:border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`
                  w-12 h-12 rounded-full text-sm font-bold transition-all shadow-sm border
                  ${page === i + 1
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                    : 'bg-white dark:bg-white/5 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 hover:bg-primary hover:text-slate-900 hover:border-primary'}
                `}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-full bg-white dark:bg-white/5 text-slate-900 dark:text-white hover:bg-primary hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm border border-slate-200 dark:border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* CTA SECTION */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -left-40 -top-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className="absolute -right-40 -bottom-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('blog.cta.title', 'Hadi Başlayalım!')}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            {t('blog.cta.description', 'İster müşteri olun ister freelancer, sizin için doğru yerdesiniz.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href={`/${language}/basvuru`}
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{t('blog.cta.freelancer_apply', 'Freelancer Başvurusu')}</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://wa.me/+905061523255"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{t('blog.cta.project_request', 'Proje Talebi')}</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
