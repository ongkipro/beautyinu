import {useState, useEffect, useMemo} from 'react';
import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/ProductCard';
import {ArticleCard} from '~/components/ArticleCard';
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import {getSeoMeta, buildArticleJsonLd} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.article) {
    return getSeoMeta({title: 'Article Not Found — Beautyinu'});
  }
  const {article, canonicalUrl} = data;
  const title = article.seo?.title || `${article.title} — Beautyinu`;
  const description =
    article.seo?.description ||
    article.contentHtml?.replace(/<[^>]+>/g, '').trim().slice(0, 160) ||
    `${article.title} — Beautyinu Official Blog.`;
  const imageUrl = article.image?.url;
  const jsonLd = buildArticleJsonLd(article, canonicalUrl);

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    image: imageUrl,
    imageAlt: article.image?.altText || article.title,
    type: 'article',
    publishedTime: article.publishedAt,
    jsonLd,
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

  if (blogHandle === 'berita' || blogHandle === 'journal' || blogHandle === 'articles') {
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

  const publishedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  const authorName = article.author?.name || 'Tim Editorial Beautyinu';
  const readTime = Math.max(2, Math.ceil((contentHtml?.length || 0) / 900));

  // Extract H2 headings for Table of Contents & inject anchor IDs
  const {enhancedHtml, headings} = useMemo(() => {
    if (!contentHtml) return {enhancedHtml: '', headings: []};

    const items: {id: string; text: string}[] = [];
    const enhanced = contentHtml.replace(
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

  return (
    <article className="w-full bg-white relative">
      {/* 1. Subtle Reading Progress Bar */}
      <ReadingProgressBar />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* 2. Standard Breadcrumb Navigation */}
        <nav className="text-xs sm:text-sm text-text-secondary mb-6 sm:mb-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
          <Link to={`/blogs/${blogHandle}`} className="hover:text-primary transition-colors">
            Skincare Journal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-text font-medium truncate max-w-xs sm:max-w-md">{title}</span>
        </nav>

        {/* 3. Editorial Header */}
        <header className="max-w-3xl mx-auto mb-8 sm:mb-12">
          <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
            Beautyinu · Skincare Journal
          </p>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] text-text font-normal leading-[1.15] tracking-tight mb-6">
            {title}
          </h1>

          {/* Clean Flat Byline Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-text-secondary pb-6 border-b border-black/[0.06]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-text font-semibold">{authorName}</span>
              <span className="text-black/20">·</span>
              <time dateTime={article.publishedAt}>{publishedDate}</time>
              <span className="text-black/20">·</span>
              <span>{readTime} menit baca</span>
            </div>

            <ArticleShareActions title={title} canonicalUrl={canonicalUrl} />
          </div>
        </header>

        {/* 4. Hero Photography — Matching Standard aspect-[3/2] rounded-2xl */}
        {image && (
          <div className="w-full max-w-4xl mx-auto mb-12 sm:mb-16 aspect-[3/2] overflow-hidden rounded-3xl bg-[#F0EAF8] border border-black/[0.05]">
            <Image
              data={image}
              aspectRatio="3/2"
              sizes="(min-width: 1024px) 896px, 100vw"
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* 5. Editorial Content Measure (max-w-3xl) */}
        <div className="max-w-3xl mx-auto">
          {/* Table of Contents (Clean, Consistent Font Pattern) */}
          {headings.length > 1 && (
            <div className="mb-10 sm:mb-12 p-6 sm:p-7 rounded-3xl bg-[#FAF9FB] border border-black/[0.05]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary block mb-3">
                Daftar Isi Artikel
              </span>
              <ol className="space-y-2.5 text-xs sm:text-sm text-text-secondary">
                {headings.map((heading, i) => (
                  <li key={heading.id} className="flex items-baseline gap-2.5">
                    <span className="font-semibold text-xs text-primary/80 select-none">
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
            </div>
          )}

          {/* Article Typography */}
          <div
            dangerouslySetInnerHTML={{__html: enhancedHtml}}
            className="prose prose-lg max-w-none
              [&_h2]:font-serif [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:text-text [&_h2]:font-normal [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h2]:scroll-mt-20
              [&_h3]:font-serif [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:text-text [&_h3]:font-normal [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:scroll-mt-20
              [&_p]:leading-[1.75] [&_p]:mb-5 [&_p]:text-text/90 [&_p]:text-base sm:[&_p]:text-[17px]
              [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary-hover [&_a]:font-medium
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-text/90
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-text/90
              [&_li]:leading-relaxed
              [&_hr]:hidden
              [&_img]:w-full [&_img]:h-auto [&_img]:rounded-3xl [&_img]:my-8 [&_img]:border [&_img]:border-black/[0.05]
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-text-secondary [&_blockquote]:my-8 [&_blockquote]:text-lg
            "
          />

          {/* 6. Routine Bridge Box (Luminous Glass) */}
          <div className="mt-14 sm:mt-18 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/90 via-white/80 to-[#FFF3F6]/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_35px_rgba(249,127,158,0.07)] text-left relative overflow-hidden">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold uppercase tracking-widest text-primary inline-block mb-3">
              Rekomendasi Rutinitas
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight mb-2.5">
              Siap Rawat Kulit Tubuh Lebih Sehat &amp; Glowing?
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 max-w-xl font-normal">
              Terapkan panduan artikel ini dengan rangkaian harian Cleanse, Boost, dan Lock dari Beautyinu. Diformulasikan dengan Niacinamide 5.22% + Alpha Arbutin resmi BPOM RI untuk iklim tropis Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/collections/bundles"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold px-7 py-3.5 shadow-xs transition-all cursor-pointer text-center hover:scale-[1.02]"
              >
                <span>Lihat Paket Glowing Set (Hemat 47%)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20membaca%20artikel%20dan%20ingin%20konsultasi%20skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-surface text-text border border-black/[0.08] text-xs sm:text-sm font-semibold px-6 py-3.5 shadow-2xs transition-all cursor-pointer text-center hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 7. Bottom Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <Link
              to={`/blogs/${blogHandle}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Skincare Journal</span>
            </Link>

            <ArticleShareActions title={title} canonicalUrl={canonicalUrl} />
          </div>
        </div>

        {/* 8. Products from the Article (Shop the Routine) */}
        {recommendedProducts.length > 0 && (
          <div className="mt-20 sm:mt-24 max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Pilihan Terbaik
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text mt-2 mb-2">
                Lengkapi Rutinitas Perawatanmu
              </h2>
              <p className="text-sm text-text-secondary">
                Produk favorit yang direkomendasikan para beauty enthusiasts Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {recommendedProducts.slice(0, 3).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* 9. Related Articles Grid — Exact Unified ArticleCard from Homepage */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 sm:mt-24 max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Edukasi Lanjutan
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text mt-2">
                  Artikel Terkait Lainnya
                </h2>
              </div>
              <Link
                to={`/blogs/${blogHandle}`}
                className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
              >
                <span>Lihat Semua Artikel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((rel: any) => (
                <ArticleCard
                  key={rel.id}
                  article={rel}
                  blogHandle={blogHandle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
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

// ── Subcomponent: Share Actions ──
function ArticleShareActions({
  title,
  canonicalUrl,
}: {
  title: string;
  canonicalUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Ignore
    }
  };

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} — Baca selengkapnya di Beautyinu: ${canonicalUrl}`,
  )}`;

  return (
    <div className="flex items-center gap-3 text-xs">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 text-text-secondary hover:text-text transition-colors cursor-pointer"
        title="Salin tautan artikel"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-bold">Tersalin</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Link</span>
          </>
        )}
      </button>

      <span className="text-black/20 select-none">·</span>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-text-secondary hover:text-[#25D366] transition-colors cursor-pointer"
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
    products(first: 3, sortKey: BEST_SELLING) {
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
