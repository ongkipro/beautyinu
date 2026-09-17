import {useState, useEffect, useMemo, useCallback} from 'react';
import {Link, redirect, useLoaderData, useNavigate} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
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

  return (
    <article className="w-full bg-white relative">
      {/* Subtle Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* 1. Standardized Breadcrumbs Wayfinding Bar */}
      <Breadcrumb
        variant="bar"
        items={[
          {label: 'Skincare Journal', to: `/blogs/${blogHandle}`},
          {label: title},
        ]}
      />

      {/* 2. Full-Width Editorial Background Hero Section with 3:2 Precision Framing */}
      <div className="relative w-full overflow-hidden bg-[#16141D] min-h-[400px] sm:min-h-[460px] lg:h-[520px] flex items-center border-b border-black/[0.04]">
        {/* Full-width Article Cover as Background */}
        {image ? (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              data={image}
              aspectRatio="3/2"
              sizes="100vw"
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Scrim Gradient: Balanced dark overlay ensuring perfect centered text legibility */}
            <div className="absolute inset-0 bg-[#0C0B10]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B10]/95 via-[#0C0B10]/65 to-[#0C0B10]/45" />
            {/* Subtle bottom edge blend */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1C1924] via-[#2A2436] to-[#16141D]" />
        )}

        {/* Hero Content (Centered Editorial Composition) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center flex flex-col items-center justify-center">
          <div className="max-w-3xl lg:max-w-4xl mx-auto flex flex-col items-center">
            {/* Kicker Editorial */}
            <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-white/75 mb-3.5">
              The Journal
            </p>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[48px] text-white font-normal leading-[1.16] tracking-tight mb-6 max-w-3xl sm:max-w-4xl mx-auto drop-shadow-xs text-center">
              {title}
            </h1>

            {/* In-Hero Byline & Share Row (Centered Symmetrical) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 pt-5 border-t border-white/20 w-full max-w-2xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-white/85">
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-serif font-bold text-[10px]">
                  B
                </div>
                <span className="text-white font-semibold">{authorName}</span>
                <span className="text-white/30 select-none">·</span>
                <time dateTime={article.publishedAt}>{publishedDate}</time>
                <span className="text-white/30 select-none">·</span>
                <span className="inline-flex items-center gap-1 text-white/90">
                  <Clock className="w-3.5 h-3.5 text-white/60" />
                  <span>{readTime} menit baca</span>
                </span>
              </div>

              <span className="hidden sm:inline text-white/25 select-none" aria-hidden="true">
                |
              </span>

              <ArticleShareActions
                title={title}
                canonicalUrl={canonicalUrl}
                variant="light"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Article Reading Body (Optimal measure for reading comfort) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16">
        {/* Table of Contents (Clean, Architectural Precision) */}
        {headings.length > 1 && (
          <nav
            aria-label="Daftar Isi Artikel"
            className="mb-10 sm:mb-12 p-6 sm:p-7 rounded-2xl bg-[#FAF9FB] border border-black/[0.06] shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-3.5">
              <BookOpen className="w-4 h-4 text-primary" strokeWidth={2} />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-text block">
                Daftar Isi Artikel
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

        {/* Article Typography & Rendered HTML */}
        <div
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{__html: enhancedHtml}}
          className="prose prose-lg max-w-none
            [&_h2]:font-serif [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:text-text [&_h2]:font-normal [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h2]:scroll-mt-24
            [&_h3]:font-serif [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:text-text [&_h3]:font-normal [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:scroll-mt-24
            [&_p]:leading-[1.8] [&_p]:mb-6 [&_p]:text-text/90 [&_p]:text-base sm:[&_p]:text-[17px]
            [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary-hover [&_a]:font-medium transition-colors
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-text/90
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-text/90
            [&_li]:leading-relaxed
            [&_hr]:hidden
            [&_img]:w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-8 [&_img]:border [&_img]:border-black/[0.06] [&_img]:shadow-xs
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:text-text-secondary [&_blockquote]:my-8 [&_blockquote]:text-base sm:[&_blockquote]:text-lg [&_blockquote]:bg-[#FAF8FC] [&_blockquote]:rounded-r-xl
            [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:block [&_th]:border-b [&_th]:border-black/10 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_td]:border-b [&_td]:border-black/5 [&_td]:p-3 [&_td]:text-sm
          "
        />

        {/* 3. Bottom Article Navigation */}
        <div className="mt-14 pt-6 border-t border-black/[0.06] flex items-center justify-between">
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
            variant="dark"
          />
        </div>
      </div>

      {/* 4. Products from the Article (Exactly 4 Products matching PDP Related Products Grid) */}
      {recommendedProducts.length > 0 && (
        <section
          className="border-t border-black/[0.06] pt-14 sm:pt-20 pb-10 sm:pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-labelledby="section-recommended-products"
        >
          <div className="mb-8 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent font-semibold block mb-1">
              Padanan Sempurna
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2
                id="section-recommended-products"
                className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight"
              >
                Lengkapi Routine Glowing Kamu
              </h2>
              <span className="text-xs text-text-secondary">
                Formula resmi berizin BPOM RI untuk hasil optimal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4 md:gap-6 min-w-0">
            {recommendedProducts.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Related Articles Grid (Exactly 3 Articles matching Homepage The Journal Grid) */}
      {relatedArticles.length > 0 && (
        <section
          className="border-t border-black/[0.06] pt-14 sm:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-labelledby="section-related-articles"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1.5">
                The Journal
              </p>
              <h2
                id="section-related-articles"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text font-normal tracking-tight"
              >
                Artikel Terkait Lainnya
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
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 transition-all duration-75"
      style={{width: `${progress}%`}}
    />
  );
}

// ── Subcomponent: Share Actions with Native Share & Copy Feedback ──
function ArticleShareActions({
  title,
  canonicalUrl,
  variant = 'dark',
}: {
  title: string;
  canonicalUrl: string;
  variant?: 'light' | 'dark';
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
    } catch {
      // Fallback ignore
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: canonicalUrl,
        });
      } catch {
        // Ignored if cancelled
      }
    }
  };

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} — Baca selengkapnya di Beautyinu: ${canonicalUrl}`,
  )}`;

  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
      {/* Native Web Share API button for Mobile */}
      {canShare && (
        <>
          <button
            type="button"
            onClick={handleNativeShare}
            className={`inline-flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
              isLight
                ? 'text-white/80 hover:text-white'
                : 'text-text-secondary hover:text-primary'
            }`}
            title="Bagikan artikel"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
          <span className={isLight ? 'text-white/30' : 'text-black/20 select-none'}>
            ·
          </span>
        </>
      )}

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
          isLight
            ? 'text-white/80 hover:text-white'
            : 'text-text-secondary hover:text-primary'
        }`}
        title="Salin tautan artikel"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-primary" />
            <span className={`font-bold ${isLight ? 'text-white' : 'text-primary'}`}>
              Tersalin
            </span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Link</span>
          </>
        )}
      </button>

      <span className={isLight ? 'text-white/30' : 'text-black/20 select-none'}>
        ·
      </span>

      {/* WhatsApp Link */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
          isLight
            ? 'text-white/80 hover:text-[#25D366]'
            : 'text-text-secondary hover:text-[#25D366]'
        }`}
        title="Bagikan ke WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>
    </div>
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
