import {useState, useEffect, useMemo, useCallback} from 'react';
import {Link, redirect, useLoaderData, useNavigate} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import authorAvatar from '~/assets/author-aisyah-putri.jpg';
import {ProductCard} from '~/components/ProductCard';
import {ArticleCard} from '~/components/ArticleCard';
import {Breadcrumb} from '~/components/Breadcrumb';
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  Clock,
  Share2,
  BookOpen,
  Heart,
  ChevronUp,
} from 'lucide-react';
import {
  getSeoMeta,
  buildArticleJsonLd,
  buildArticleBreadcrumbJsonLd,
} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.article) {
    return getSeoMeta({title: 'Article Not Found — Beautyinu'});
  }
  const {article, canonicalUrl, blogHandle} = data;
  const title = article.seo?.title || `${article.title} — Beautyinu`;
  const description =
    article.seo?.description ||
    article.contentHtml?.replace(/<[^>]+>/g, '').trim().slice(0, 160) ||
    `${article.title} — Beautyinu Official Blog.`;
  const imageUrl = article.image?.url;

  const articleJsonLd = buildArticleJsonLd(article, canonicalUrl);
  const breadcrumbJsonLd = buildArticleBreadcrumbJsonLd(
    article.title,
    blogHandle,
    canonicalUrl,
  );

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    image: imageUrl,
    imageAlt: article.image?.altText || article.title,
    type: 'article',
    publishedTime: article.publishedAt,
    jsonLd: [articleJsonLd, breadcrumbJsonLd],
  });
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  if (
    blogHandle === 'berita' ||
    blogHandle === 'journal' ||
    blogHandle === 'articles'
  ) {
    throw redirect(`/blogs/news/${articleHandle}`, 301);
  }

  const [{blog}, {products}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    context.storefront.query(ARTICLE_PRODUCTS_QUERY),
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {handle: articleHandle, data: blog.articleByHandle},
    {handle: blogHandle, data: blog},
  );

  const relatedArticles =
    blog.articles?.nodes
      ?.filter((item: any) => item.handle !== articleHandle)
      ?.slice(0, 3) || [];

  return {
    article: blog.articleByHandle,
    blogHandle,
    relatedArticles,
    recommendedProducts: products?.nodes || [],
    canonicalUrl: `${new URL(request.url).origin}/blogs/${blogHandle}/${articleHandle}`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Article() {
  const {
    article,
    blogHandle,
    canonicalUrl,
    relatedArticles,
    recommendedProducts,
  } = useLoaderData<typeof loader>();
  const {title, image, contentHtml} = article;

  const navigate = useNavigate();

  const publishedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  const authorName = article.author?.name || 'Tim Editorial Beautyinu';
  const readTime = Math.max(2, Math.ceil((contentHtml?.length || 0) / 900));

  // 1. Sanitize HTML & extract H2 headings for Table of Contents
  // Removes in-body "Rekomendasi Produk Terkait" as requested (products are cleanly shown below)
  const {enhancedHtml, headings} = useMemo(() => {
    if (!contentHtml) return {enhancedHtml: '', headings: []};

    // Strip out redundant in-article product recommendation section and its trailing list
    const cleaned = contentHtml
      .replace(
        /<h2[^>]*>(?:Rekomendasi Produk Terkait|Panduan &amp; Produk Rekomendasi|Produk Rekomendasi)[\s\S]*?(?=<h2|$)/gi,
        '',
      )
      .trim();

    const items: {id: string; text: string}[] = [];
    const enhanced = cleaned.replace(
      /<h2([^>]*)>(.*?)<\/h2>/gi,
      (match: string, attrs: string, inner: string) => {
        const plainText = inner.replace(/<[^>]+>/g, '').trim();
        const id = plainText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (plainText && id) {
          items.push({id, text: plainText});
          return `<h2 id="${id}"${attrs}>${inner}</h2>`;
        }
        return match;
      },
    );

    return {enhancedHtml: enhanced, headings: items};
  }, [contentHtml]);

  // 2. Client-side SPA navigation handler for internal links inside dangerouslySetInnerHTML
  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;

      // Intercept local relative paths (e.g. /products/...)
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        navigate(href);
      }
    },
    [navigate],
  );

  // 3. Medium-style Interactive Claps (persisted locally)
  const [claps, setClaps] = useState(128);
  const [hasClapped, setHasClapped] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`claps_${article.handle}`);
      if (saved) {
        setClaps(parseInt(saved, 10));
        setHasClapped(true);
      } else {
        // Deterministic organic seed based on title length
        setClaps(85 + (title.length % 75));
      }
    } catch {
      // Ignore SSR / privacy storage errors
    }
  }, [article.handle, title]);

  const handleClap = useCallback(() => {
    setClaps((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(`claps_${article.handle}`, String(next));
      } catch {}
      return next;
    });
    setHasClapped(true);
  }, [article.handle]);

  return (
    <article className="w-full bg-white relative selection:bg-primary/20">
      {/* 1. Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* 2. Top Wayfinding Glass Breadcrumb (Light Mode) */}
      <Breadcrumb
        variant="bar"
        items={[
          {label: 'Skincare Journal', to: `/blogs/${blogHandle}`},
          {label: title},
        ]}
      />

      {/* 3. Medium-Style Story Header */}
      <header className="max-w-[720px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 text-left">
        {/* Medium-Grade Editorial Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-text font-normal leading-[1.18] tracking-tight mb-6">
          {title}
        </h1>

        {/* Medium-Style Intimate Author Byline & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-black/[0.08]">
          <div className="flex items-center gap-3.5">
            {/* Author Avatar with Photo */}
            <div className="w-11 h-11 rounded-full overflow-hidden border border-black/[0.08] shadow-2xs flex-shrink-0 bg-[#FAF9FB]">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm sm:text-[15px] text-text leading-tight">
                  {authorName}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mt-0.5 font-normal">
                <time dateTime={article.publishedAt}>{publishedDate}</time>
                <span className="text-black/25">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-text-secondary/70" />
                  <span>~{readTime} menit baca</span>
                </span>
              </div>
            </div>
          </div>

          {/* Inline Action Bar (Claps, Share, Copy Link) */}
          <div className="flex items-center gap-2 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
            <ArticleShareActions
              title={title}
              canonicalUrl={canonicalUrl}
              claps={claps}
              onClap={handleClap}
              hasClapped={hasClapped}
            />
          </div>
        </div>
      </header>

      {/* 4. Story Featured Image (Locked 3:2, Full-Width on Mobile, In-Column on Desktop) */}
      {image && (
        <figure className="w-full max-w-[720px] mx-auto px-0 sm:px-6 mt-6 sm:mt-10">
          <div className="overflow-hidden aspect-[3/2] rounded-none sm:rounded-2xl bg-[#FAF9FB] border-y sm:border border-black/[0.06] shadow-xs">
            <Image
              data={image}
              aspectRatio="3/2"
              sizes="(min-width: 768px) 720px, 100vw"
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
          </div>
          {image.altText && (
            <figcaption className="mt-2.5 text-center text-xs text-text-secondary/70 italic font-sans px-4">
              {image.altText}
            </figcaption>
          )}
        </figure>
      )}

      {/* 5. Golden Measure Reading Column (Max 680px for ultimate reading comfort) */}
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-16">
        {/* Table of Contents (Clean, Medium "In this story" Box) */}
        {headings.length > 1 && (
          <nav
            aria-label="Daftar Isi Artikel"
            className="mb-10 sm:mb-12 p-6 sm:p-7 rounded-2xl bg-[#FAF9FB] border border-black/[0.06] shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-3.5">
              <BookOpen className="w-4 h-4 text-primary" strokeWidth={2} />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-text block">
                Topik Utama dalam Artikel Ini
              </span>
            </div>
            <ol className="space-y-2.5 text-xs sm:text-sm text-text-secondary">
              {headings.map((heading, i) => (
                <li key={heading.id} className="flex items-baseline gap-2.5">
                  <span className="font-mono font-bold text-xs text-primary/80 select-none">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <a
                    href={`#${heading.id}`}
                    className="hover:text-primary transition-colors leading-relaxed hover:underline"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Medium-Grade Editorial Body Typography */}
        <div
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{__html: enhancedHtml}}
          className="prose prose-lg max-w-none
            [&_h2]:font-serif [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:text-text [&_h2]:font-normal [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h2]:scroll-mt-24
            [&_h3]:font-serif [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:text-text [&_h3]:font-normal [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:scroll-mt-24
            [&_p]:leading-[1.85] [&_p]:mb-6 [&_p]:text-[#242424] [&_p]:text-[17px] sm:[&_p]:text-[18.5px] [&_p]:font-normal
            [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary-hover [&_a]:font-medium transition-colors
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2.5 [&_ul]:text-[#242424] [&_ul]:text-[17px] sm:[&_ul]:text-[18px]
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2.5 [&_ol]:text-[#242424] [&_ol]:text-[17px] sm:[&_ol]:text-[18px]
            [&_li]:leading-relaxed
            [&_hr]:hidden
            [&_img]:w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-8 [&_img]:border [&_img]:border-black/[0.06] [&_img]:shadow-xs
            [&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:pl-5 sm:[&_blockquote]:pl-6 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-[#333333] [&_blockquote]:my-8 [&_blockquote]:font-serif [&_blockquote]:text-lg sm:[&_blockquote]:text-xl [&_blockquote]:bg-[#FFF9FA] [&_blockquote]:rounded-r-xl
            [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:block [&_th]:border-b [&_th]:border-black/10 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_td]:border-b [&_td]:border-black/5 [&_td]:p-3 [&_td]:text-sm
          "
        />

        {/* Author Bio Box at Article End (Refined & Mobile-Precise) */}
        <div className="mt-12 sm:mt-14 mb-8 p-4.5 sm:p-6 rounded-2xl bg-[#FAF9FB] border border-black/[0.06] flex items-start gap-3.5 sm:gap-4.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-black/[0.08] flex-shrink-0 shadow-2xs bg-white">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-sm sm:text-base font-semibold text-text leading-tight truncate">
                Ditulis oleh {authorName}
              </p>
              <span className="text-[10px] sm:text-[11px] font-mono text-primary font-medium flex-shrink-0">
                Edukator Kulit
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed font-normal">
              Tim riset dan edukasi Beautyinu berfokus menyajikan panduan perawatan kulit tubuh, transparansi bahan aktif, dan tips merawat skin barrier sehat bagi wanita Indonesia.
            </p>
          </div>
        </div>

        {/* End of Story Navigation & Share Bar */}
        <div className="pt-6 border-t border-black/[0.08] flex items-center justify-between">
          <Link
            to={`/blogs/${blogHandle}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Skincare Journal</span>
          </Link>

          <ArticleShareActions
            title={title}
            canonicalUrl={canonicalUrl}
            claps={claps}
            onClap={handleClap}
            hasClapped={hasClapped}
          />
        </div>
      </div>

      {/* 6. Signature Medium Floating Action Bar (Sticky at Bottom) */}
      <MediumFloatingBar
        title={title}
        canonicalUrl={canonicalUrl}
        claps={claps}
        onClap={handleClap}
        hasClapped={hasClapped}
      />

      {/* 7. Products from the Article (Lengkapi Routine Glowing Kamu) */}
      {recommendedProducts.length > 0 && (
        <section
          className="border-t border-black/[0.06] pt-14 sm:pt-20 pb-10 sm:pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-labelledby="section-recommended-products"
        >
          <div className="mb-8 text-center md:text-left">
            <h2
              id="section-recommended-products"
              className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight"
            >
              Rekomendasi Produk Terkait
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4 md:gap-6 min-w-0">
            {recommendedProducts.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Related Articles Grid (Medium-Style 3 Cards) */}
      {relatedArticles.length > 0 && (
        <section
          className="border-t border-black/[0.06] pt-14 sm:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-labelledby="section-related-articles"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2
                id="section-related-articles"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text font-normal tracking-tight"
              >
                Artikel Terkait
              </h2>
            </div>
            <Link
              to={`/blogs/${blogHandle}`}
              className="text-xs font-mono font-semibold uppercase tracking-wider text-text hover:text-primary flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>Lihat Semua Artikel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {relatedArticles.slice(0, 3).map((rel: any) => (
              <ArticleCard
                key={rel.id}
                article={rel}
                blogHandle={blogHandle}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

// ── Subcomponent: Reading Progress Bar ──
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-primary z-50 transition-all duration-75 shadow-[0_1px_4px_rgba(249,127,158,0.5)]"
      style={{width: `${progress}%`}}
    />
  );
}

// ── Subcomponent: Share Actions with Native Share, Claps & Copy Feedback ──
function ArticleShareActions({
  title,
  canonicalUrl,
  claps,
  onClap,
  hasClapped,
}: {
  title: string;
  canonicalUrl: string;
  claps: number;
  onClap: () => void;
  hasClapped: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleNativeShare = async () => {
    if (!canShare) return;
    try {
      await navigator.share({
        title,
        text: `${title} — Beautyinu Skincare Journal`,
        url: canonicalUrl,
      });
    } catch {}
  };

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title}\n\nBaca selengkapnya di Beautyinu:\n${canonicalUrl}`,
  )}`;

  return (
    <div className="flex items-center gap-2.5 text-xs text-text-secondary font-medium">
      {/* Interactive Clap Button */}
      <button
        type="button"
        onClick={onClap}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
          hasClapped
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-[#FAF8FC] hover:bg-surface border-black/[0.08] text-text hover:border-primary/30'
        }`}
        title="Apresiasi artikel ini (Clap)"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-transform ${
            hasClapped ? 'fill-primary text-primary scale-110' : 'text-text-secondary'
          }`}
        />
        <span className="font-mono text-xs">{claps}</span>
      </button>

      {/* Web Share (Native) */}
      {canShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="p-1.5 rounded-full hover:bg-black/[0.04] text-text-secondary hover:text-text transition-colors cursor-pointer"
          title="Bagikan artikel"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-black/[0.04] text-text-secondary hover:text-text transition-colors cursor-pointer"
        title="Salin tautan artikel"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-semibold text-xs">Tersalin</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="text-xs">Salin</span>
          </>
        )}
      </button>

      {/* WhatsApp Share */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-full hover:bg-[#25D366]/10 text-text-secondary hover:text-[#25D366] transition-colors cursor-pointer"
        title="Bagikan ke WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </a>
    </div>
  );
}

// ── Subcomponent: Medium Signature Floating Bottom Action Bar ──
function MediumFloatingBar({
  title,
  canonicalUrl,
  claps,
  onClap,
  hasClapped,
}: {
  title: string;
  canonicalUrl: string;
  claps: number;
  onClap: () => void;
  hasClapped: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating bar once scrolled past header (~350px)
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title}\n\n${canonicalUrl}`,
  )}`;

  if (!visible) return null;

  return (
    <aside
      aria-label="Aksi Artikel"
      className="fixed bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-[0_12px_35px_rgba(0,0,0,0.12)] rounded-full px-4 sm:px-5 py-2 flex items-center gap-3 sm:gap-4 text-xs text-text animate-in fade-in slide-in-from-bottom-3 duration-300">
        {/* Interactive Claps */}
        <button
          type="button"
          onClick={onClap}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer active:scale-90 ${
            hasClapped
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-text-secondary hover:text-text'
          }`}
          title="Beri tepukan apresiasi"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              hasClapped ? 'fill-primary text-primary scale-110' : ''
            }`}
          />
          <span className="font-mono text-xs">{claps}</span>
        </button>

        <span className="text-black/15 select-none" aria-hidden="true">|</span>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text transition-colors cursor-pointer px-1 py-1"
          title="Salin link artikel"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary font-semibold text-xs">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-xs">Salin</span>
            </>
          )}
        </button>

        {/* WhatsApp Share */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-[#25D366] transition-colors cursor-pointer px-1 py-1"
          title="Bagikan ke WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden xs:inline text-xs">WhatsApp</span>
        </a>

        <span className="text-black/15 select-none" aria-hidden="true">|</span>

        {/* Scroll to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="p-1 rounded-full text-text-secondary hover:text-text hover:bg-black/[0.04] transition-colors cursor-pointer"
          title="Kembali ke atas"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

// ── GraphQL Queries ──
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
      articles(first: 6) {
        nodes {
          id
          handle
          title
          publishedAt
          image {
            id
            altText
            url
            width
            height
          }
        }
      }
    }
  }
` as const;

const ARTICLE_PRODUCTS_QUERY = `#graphql
  query ArticleProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;
