import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, Tag, ChevronUp, ArrowLeft, Share2, Bookmark, User, List, ArrowUpRight } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogPost, getBlogPosts, type BlogPost } from '../lib/config/supabase';
import { useTranslation } from '../hooks/useTranslation';
import AuroraBackground from '../components/ui/effects/aurora-background';

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
          {error || 'Blog yazısı bulunamadı'}
        </h1>
        <Link 
          to={`/${language}/blog`}
          className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
        >
          Blog'a Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark relative">
      <Helmet>
        <title>{post.title} | Unilancer Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-white dark:from-black/60 dark:via-black/40 dark:to-dark" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Link 
                to={`/${language}/blog`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Blog'a Dön
              </Link>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-primary/90 text-white text-sm font-bold rounded-full backdrop-blur-sm">
                  {post.category}
                </span>
                {post.tags?.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full backdrop-blur-sm border border-white/20">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg max-w-4xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.read_time}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar (Left) */}
          <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="sticky top-32 space-y-8">
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-white/10">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-primary" />
                    İçindekiler
                  </h3>
                  <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
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

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-white/10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Diğer Yazılar
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
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            {new Date(related.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Card */}
                <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-6 text-white shadow-lg text-center">
                  <h3 className="font-bold text-lg mb-2">Bu yazıyı beğendiniz mi?</h3>
                  <p className="text-white/80 text-sm mb-4">Arkadaşlarınızla paylaşarak bize destek olabilirsiniz.</p>
                  <button 
                    onClick={() => navigator.share({ title: post.title, url: window.location.href })}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-slate-100 px-4 py-2 rounded-xl font-bold transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Paylaş
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content (Right) */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <div className="py-8 md:py-0">
              <div 
                ref={contentRef}
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-slate-900 dark:prose-h2:text-white
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-slate-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-a:text-primary hover:prose-a:text-primary-dark prose-a:no-underline
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                  prose-code:bg-slate-100 dark:prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-primary
                  prose-li:marker:text-primary"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
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