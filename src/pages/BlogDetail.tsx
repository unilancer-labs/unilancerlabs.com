import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, Share2, List, ArrowUpRight } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogPost, getBlogPosts, type BlogPost } from '../lib/config/supabase';
import { useTranslation } from '../hooks/useTranslation';
import DOMPurify from 'dompurify';

type Heading = {
  id: string;
  text: string | null;
  level: number;
};

const BlogDetail = () => {
  const { t, language } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const loadPost = async () => {
      try {
        if (!slug) {
          navigate(`/${language}/blog`);
          return;
        }

        setLoading(true);
        const fetchedPost = await getBlogPost(slug);
        
        if (!fetchedPost) {
          throw new Error(t('blog.detail.not_found', 'Blog yazısı bulunamadı.'));
        }

        setPost(fetchedPost);

        // Fetch related posts
        const allPosts = await getBlogPosts();
        const related = allPosts
          .filter(p => p.id !== fetchedPost.id && p.category === fetchedPost.category)
          .slice(0, 3);
        setRelatedPosts(related);

      } catch (err) {
        setError(t('blog.detail.error_loading', 'Blog yazısı yüklenirken bir hata oluştu.'));
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, navigate, language]);

  useEffect(() => {
    if (post && contentRef.current) {
      const elements = Array.from(contentRef.current.querySelectorAll('h2, h3'));
      const extractedHeadings = elements.map((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1))
        };
      });
      setHeadings(extractedHeadings);

      const handleScroll = () => {
        const scrollPosition = window.scrollY + 150;
        for (let i = elements.length - 1; i >= 0; i--) {
          const heading = elements[i] as HTMLElement;
          if (heading.offsetTop <= scrollPosition) {
            setActiveHeading(heading.id);
            break;
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark p-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {error || t('blog.detail.not_found', 'Blog yazısı bulunamadı')}
        </h1>
        <Link 
          to={`/${language}/blog`}
          className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
        >
          {t('blog.viewAllPosts', 'Tüm Yazıları Gör')}
        </Link>
      </div>
    );
  }

  // SEO meta from post or fallback to excerpt
  const seoTitle = (post as any).meta_title || post.title;
  const seoDescription = (post as any).meta_description || 
    (post.excerpt.length > 155 ? post.excerpt.substring(0, 152) + '...' : post.excerpt);
  const ogImageAlt = (post as any).og_image_alt || post.title;
  const noindex = (post as any).noindex || false;
  const canonicalUrl = (post as any).canonical_url || `https://unilancerlabs.com/${language}/blog/${post.slug}`;

  // SEO: Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://unilancer.co/${language}/blog/${post.slug}`
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": { "@type": "ImageObject", "url": post.image_url, "width": 1200, "height": 630 },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": { "@type": "Organization", "name": "Unilancer", "url": "https://unilancer.co" },
    "publisher": {
      "@type": "Organization",
      "name": "Unilancer",
      "logo": { "@type": "ImageObject", "url": "https://unilancer.co/images/logo.png", "width": 200, "height": 60 }
    },
    "articleSection": post.category,
    "keywords": post.tags?.join(', ') || post.category,
    "wordCount": post.content?.split(/\s+/).length || 0,
    "inLanguage": language === 'tr' ? 'tr-TR' : 'en-US'
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": language === 'tr' ? "Ana Sayfa" : "Home", "item": `https://unilancerlabs.com/${language}` },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `https://unilancerlabs.com/${language}/blog` },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark relative">
      <Helmet>
        <title>{seoTitle} | Unilancer Blog</title>
        <meta name="description" content={seoDescription} />
        
        {/* Robots - respect noindex setting */}
        <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"} />
        
        {/* Open Graph - Article */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Unilancer" />
        <meta property="og:image" content={post.image_url} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={ogImageAlt} />
        <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:modified_time" content={post.updated_at || post.created_at} />
        <meta property="article:section" content={post.category} />
        {post.tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={post.image_url} />
        <meta name="twitter:image:alt" content={ogImageAlt} />
        
        {/* Additional SEO */}
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content="Unilancer" />
        <meta name="keywords" content={(post as any).focus_keyword || post.tags?.join(', ') || post.category} />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section - Full Width Image with Overlay Content */}
      <div className="relative w-full min-h-[380px] h-[50vh] md:h-[60vh] md:min-h-[500px] overflow-hidden">
        {/* Background Image - mobilde sağ taraf görünsün */}
        <img 
          src={post.image_url} 
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Gradient Overlay - Light mode: beyaz, Dark mode: siyah */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-black/85 dark:via-black/50 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end md:items-center pb-5 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-14 md:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl lg:max-w-3xl space-y-2 md:space-y-4"
            >
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2.5 py-1 min-h-[28px] bg-primary text-white text-[11px] sm:text-xs md:text-sm font-bold rounded-full inline-flex items-center">
                  {post.category}
                </span>
                {post.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2.5 py-1 min-h-[28px] bg-slate-900/20 dark:bg-white/20 backdrop-blur-sm text-slate-800 dark:text-white text-[11px] sm:text-xs md:text-sm font-medium rounded-full inline-flex items-center">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-snug md:leading-tight line-clamp-3 sm:line-clamp-none">
                {post.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 dark:text-white/90 leading-relaxed line-clamp-2 md:line-clamp-none">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6 text-slate-600 dark:text-white/80 pt-1">
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5" />
                  <span className="text-[11px] sm:text-xs md:text-sm font-medium">
                    {new Date(post.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5" />
                  <span className="text-[11px] sm:text-xs md:text-sm font-medium">{post.read_time}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar (Left) - Sadece desktop */}
          <div className="hidden lg:block lg:col-span-3 order-2 lg:order-1">
            {/* Sticky Container */}
            <div className="sticky top-28 space-y-6">
              {/* Table of Contents - sadece heading varsa */}
              {headings.length > 0 && (
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-white/10">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-primary" />
                    {t('blog.tableOfContents', 'İçindekiler')}
                  </h3>
                  <nav className="space-y-1 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block py-2 px-3 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                          activeHeading === heading.id
                            ? 'bg-primary/10 border-primary text-primary font-medium'
                            : 'border-transparent text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        style={{ marginLeft: (heading.level - 2) * 12 }}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related Posts - her zaman görünür */}
              {relatedPosts.length > 0 && (
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-white/10">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {t('blog.relatedPosts', 'Diğer Yazılar')}
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link 
                        key={related.id} 
                        to={`/${language}/blog/${related.slug}`}
                        className="block group"
                      >
                        <div className="aspect-video rounded-xl overflow-hidden mb-2">
                          <img 
                            src={related.image_url} 
                            alt={related.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                          {new Date(related.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Card - her zaman görünür */}
              <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-6 text-white shadow-lg text-center">
                <h3 className="font-bold text-lg mb-2">{t('blog.share.title', 'Bu yazıyı beğendiniz mi?')}</h3>
                <p className="text-white/80 text-sm mb-4">{t('blog.share.description', 'Arkadaşlarınızla paylaşarak bize destek olabilirsiniz.')}</p>
                <button 
                  onClick={async () => {
                    try {
                      if (navigator.share) {
                        await navigator.share({ title: post.title, url: window.location.href });
                      } else {
                        await navigator.clipboard.writeText(window.location.href);
                        alert(t('blog.share.copied', 'Link panoya kopyalandı!'));
                      }
                    } catch (err) {
                      // User cancelled or share failed - silently ignore
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-slate-100 px-4 py-3 min-h-[44px] rounded-xl font-bold transition-colors active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  {t('blog.share.button', 'Paylaş')}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content (Right) */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <div 
              ref={contentRef}
              className="prose prose-base md:prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-xl md:prose-h2:text-3xl prose-h2:mt-8 md:prose-h2:mt-12 prose-h2:mb-4 md:prose-h2:mb-6 prose-h2:text-slate-900 dark:prose-h2:text-white
                prose-h3:text-lg md:prose-h3:text-2xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-3 md:prose-h3:mb-4
                prose-p:text-slate-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base
                prose-a:text-primary hover:prose-a:text-primary-dark prose-a:no-underline
                prose-strong:text-slate-900 dark:prose-strong:text-white
                prose-img:rounded-xl md:prose-img:rounded-2xl prose-img:shadow-lg
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-white/5 prose-blockquote:p-4 md:prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                prose-code:bg-slate-100 dark:prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-primary prose-code:text-sm
                prose-li:marker:text-primary"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />

            {/* Mobile Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="lg:hidden mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  {t('blog.relatedPosts', 'Diğer Yazılar')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {relatedPosts.map((related) => (
                    <Link 
                      key={related.id} 
                      to={`/${language}/blog/${related.slug}`}
                      className="block group active:scale-[0.98] transition-transform"
                    >
                      <div className="aspect-video rounded-lg overflow-hidden mb-2">
                        <img 
                          src={related.image_url} 
                          alt={related.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 mt-1">
                        {new Date(related.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Share Button */}
            <div className="lg:hidden mt-6">
              <button 
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({ title: post.title, url: window.location.href });
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      alert(t('blog.share.copied', 'Link panoya kopyalandı!'));
                    }
                  } catch (err) {
                    // User cancelled or share failed
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3.5 min-h-[48px] rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform"
              >
                <Share2 className="w-5 h-5" />
                {t('blog.share.button', 'Paylaş')}
              </button>
            </div>
          </div>
        </div>
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

export default BlogDetail;