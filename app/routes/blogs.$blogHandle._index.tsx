import {useState, useMemo} from 'react';
import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getSeoMeta, buildBreadcrumbJsonLd} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';
import authorAvatar from '~/assets/author-aisyah-putri.jpg';
import {
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  Tag,
  Share2,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const blogTitle = data?.blog?.title || 'Skincare Journal';
  const canonicalUrl = data?.canonicalUrl || 'https://beautyinu.co/blogs/news';
  return getSeoMeta({
    title: `${blogTitle} — Beautyinu Official Store`,
    description:
      'Catatan edukasi perawatan tubuh, panduan bahan aktif, dan tips merawat skin barrier harian dari tim riset Beautyinu.',
    url: canonicalUrl,
    type: 'website',
    jsonLd: [
      buildBreadcrumbJsonLd([
        {name: 'Home', url: 'https://beautyinu.co'},
        {name: 'Skincare Journal', url: canonicalUrl},
      ]),
    ],
  });
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {pageBy: 20});

  if (!params.blogHandle) {
    throw new Response('blog not found', {status: 404});
  }

  if (
    params.blogHandle === 'berita' ||
    params.blogHandle === 'journal' ||
    params.blogHandle === 'articles'
  ) {
    throw redirect('/blogs/news', 301);
  }

  const [{blog}, {products}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {blogHandle: params.blogHandle, ...paginationVariables},
    }),
    context.storefront.query(BLOG_PRODUCTS_QUERY),
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});
  return {
    blog,
    featuredProducts: products?.nodes || [],
    canonicalUrl: `${new URL(request.url).origin}/blogs/${params.blogHandle}`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

// ── Medium Category Topics ──
const TOPICS = [
  {id: 'all', label: 'Semua Topik'},
  {id: 'skinification', label: 'Skinification'},
  {id: 'bahan-aktif', label: 'Bahan Aktif'},
  {id: 'perawatan', label: 'Panduan Rutinitas'},
  {id: 'cuaca-tropis', label: 'Cuaca Tropis'},
  {id: 'kemitraan', label: 'Kemitraan & Bisnis'},
];

export default function Blog() {
  const {blog, featuredProducts} = useLoaderData<typeof loader>();
  const allArticles = blog.articles.nodes;
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Client-side topic filtering
  const filteredArticles = useMemo(() => {
    if (selectedTopic === 'all') return allArticles;
    return allArticles.filter((article: ArticleItemFragment) => {
      const titleLower = article.title.toLowerCase();
      const contentLower = (article.contentHtml || '').toLowerCase();
      const tagsString = (article.tags || []).join(' ').toLowerCase();
      const combined = `${titleLower} ${contentLower} ${tagsString}`;

      if (selectedTopic === 'skinification') {
        return combined.includes('skinification') || combined.includes('trend');
      }
      if (selectedTopic === 'bahan-aktif') {
        return (
          combined.includes('niacinamide') ||
          combined.includes('arbutin') ||
          combined.includes('kefir') ||
          combined.includes('collagen') ||
          combined.includes('aktif')
        );
      }
      if (selectedTopic === 'perawatan') {
        return combined.includes('rutinitas') || combined.includes('urutan') || combined.includes('perawatan');
      }
      if (selectedTopic === 'cuaca-tropis') {
        return combined.includes('tropis') || combined.includes('remaja') || combined.includes('luar ruang');
      }
      if (selectedTopic === 'kemitraan') {
        return combined.includes('distributor') || combined.includes('sosial') || combined.includes('tumbuh');
      }
      return true;
    });
  }, [allArticles, selectedTopic]);

  const featuredArticle = filteredArticles[0];
  const streamArticles = filteredArticles.slice(1);

  return (
    <div className="w-full bg-white selection:bg-primary/20 min-h-screen">
      {/* 1. Wayfinding Breadcrumb Bar */}
      <Breadcrumb variant="bar" items={[{label: 'Skincare Journal'}]} />

      {/* 2. Medium-Style Editorial Masthead */}
      <section className="border-b border-black/[0.06] bg-[#FAF9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal leading-[1.14] tracking-tight mb-3">
              Catatan &amp; Edukasi Kulit
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal">
              Panduan perawatan kulit tubuh, formulasi bahan aktif, dan rutinitas harian resmi Beautyinu.
            </p>
          </div>

          {/* Medium Topic Navigation Pills */}
          <nav
            aria-label="Filter Topik Artikel"
            className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar pb-1 text-xs"
          >
            {TOPICS.map((topic) => {
              const isActive = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-2xs font-semibold'
                      : 'bg-white text-text-secondary hover:text-text border border-black/[0.08] hover:border-black/20'
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* 3. Main Editorial Feed & Desktop Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Story Feed (8 Columns) */}
          <div className="lg:col-span-8">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-[#FAF9FB] rounded-2xl border border-black/[0.06] p-8">
                <BookOpen className="w-10 h-10 text-text-secondary/40 mx-auto mb-3" />
                <p className="font-serif text-xl text-text mb-2">Belum ada artikel pada topik ini</p>
                <p className="text-xs sm:text-sm text-text-secondary mb-5">
                  Coba pilih topik lain atau kembali ke semua topik artikel.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedTopic('all')}
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Tampilkan Semua Artikel
                </button>
              </div>
            ) : (
              <>
                {/* A. Featured Story (Top Article) */}
                {featuredArticle && (
                  <div className="mb-10 sm:mb-12">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-text-secondary flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        <span>Sorotan Utama</span>
                      </span>
                    </div>

                    <MediumFeaturedStory
                      article={featuredArticle}
                      blogHandle={blog.handle}
                    />

                    <div className="hairline-divider w-full my-8 sm:my-10" />
                  </div>
                )}

                {/* B. The Feed Stream */}
                {streamArticles.length > 0 && (
                  <div className="space-y-8 sm:space-y-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-text-secondary">
                        Artikel Terbaru ({streamArticles.length})
                      </span>
                    </div>

                    {streamArticles.map((article: ArticleItemFragment, index: number) => (
                      <div key={article.id}>
                        <MediumArticleRow
                          article={article}
                          blogHandle={blog.handle}
                          loading={index < 3 ? 'eager' : 'lazy'}
                        />
                        {index < streamArticles.length - 1 && (
                          <div className="hairline-divider w-full my-7 sm:my-9" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Medium Signature Desktop Sidebar (4 Columns, Hidden on Mobile/Tablet) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-10 pl-4 border-l border-black/[0.06] sticky top-24">
            {/* 1. Editor's Pick Products */}
            {featuredProducts.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#FAF9FB] border border-black/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
                    Rekomendasi Routine
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-4 leading-relaxed font-normal">
                  Rangkaian formula resmi BPOM RI yang sering diulas dalam jurnal kami:
                </p>

                <div className="space-y-3.5">
                  {featuredProducts.slice(0, 3).map((prod: any) => {
                    const price = prod.priceRange?.minVariantPrice?.amount
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(parseFloat(prod.priceRange.minVariantPrice.amount))
                      : 'Lihat Harga';

                    return (
                      <Link
                        key={prod.id}
                        to={`/products/${prod.handle}`}
                        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-all border border-transparent hover:border-black/[0.04] shadow-2xs hover:shadow-xs"
                      >
                        {prod.featuredImage && (
                          <div className="w-14 h-14 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-black/[0.06]">
                            <Image
                              data={prod.featuredImage}
                              aspectRatio="1/1"
                              width={56}
                              height={56}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-text truncate group-hover:text-primary transition-colors">
                            {prod.title}
                          </h4>
                          <p className="text-[11px] font-mono text-primary font-bold mt-0.5">
                            {price}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-text-secondary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Popular Tags */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
                  Topik Populer
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Niacinamide 5.22%',
                  'Alpha Arbutin',
                  'Kefir Collagen',
                  'Skin Barrier',
                  'Kulit Belang',
                  'Bebas Ongkir',
                  'BPOM Resmi',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-[#FAF9FB] hover:bg-[#F3EEFA] text-text-secondary hover:text-text border border-black/[0.06] text-xs font-medium transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. About Beautyinu Journal */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF8FA] to-[#FAF8FC] border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text">
                  Jaminan Transparansi
                </h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-normal">
                Setiap artikel dirancang bersama formulator resmi untuk mengedukasi konsumen mengenai persentase bahan aktif, sertifikasi izin edar BPOM RI, dan keamanan jangka panjang bagi kulit tubuh tropis.
              </p>
            </div>

            {/* 4. Consultation CTA */}
            <div className="p-5 rounded-2xl border border-black/[0.06] bg-white flex items-center justify-between gap-3 shadow-2xs">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text leading-tight">Konsultasi Kulit</p>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">Tanya langsung ke tim kami</p>
              </div>
              <a
                href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold shadow-2xs transition-all flex-shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </aside>
        </div>

        {/* 4. Mobile Routine Banner at Bottom */}
        <div className="lg:hidden mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#FFF8FA] via-white to-[#F3EEFA] border border-primary/20 text-center">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold uppercase tracking-widest inline-block mb-3">
            Konsultasi Perawatan
          </span>
          <h3 className="font-serif text-2xl text-text font-normal tracking-tight mb-2">
            Butuh Rekomendasi Rutinitas?
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto mb-6">
            Konsultasikan masalah kulitmu langsung dengan tim kami atau temukan paket perawatan tubuh berizin BPOM resmi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/collections/bundles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-6 py-3 shadow-xs transition-all cursor-pointer"
            >
              <span>Lihat Paket Perawatan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20skincare"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-surface text-text border border-black/[0.08] text-xs font-semibold px-6 py-3 shadow-2xs transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Chat WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Subcomponent: Medium Featured Story (Top of the feed) ──
function MediumFeaturedStory({
  article,
  blogHandle,
}: {
  article: ArticleItemFragment;
  blogHandle: string;
}) {
  const publishedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt!));

  const authorName = article.author?.name || 'Tim Riset Beautyinu';
  const readTime = Math.max(2, Math.ceil((article.contentHtml?.length || 0) / 900));

  const excerpt = article.contentHtml
    ? article.contentHtml.replace(/<[^>]+>/g, '').trim().slice(0, 200) + '...'
    : '';

  return (
    <article className="group">
      <Link
        to={`/blogs/${blogHandle}/${article.handle}`}
        className="block"
      >
        {/* Cover Image with Locked 3:2 Aspect Ratio */}
        {article.image && (
          <div className="overflow-hidden aspect-[3/2] rounded-2xl bg-[#FAF9FB] border border-black/[0.06] shadow-xs mb-5">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading="eager"
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </div>
        )}

        {/* Story Meta Header */}
        <div className="flex items-center gap-2.5 text-xs text-text-secondary mb-2.5 font-normal">
          <img
            src={authorAvatar}
            alt=""
            className="w-5 h-5 rounded-full object-cover border border-black/[0.08] flex-shrink-0"
          />
          <span className="font-semibold text-text text-xs">{authorName}</span>
          <span className="text-black/25">·</span>
          <time dateTime={article.publishedAt!}>{publishedDate}</time>
          <span className="text-black/25">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-text-secondary/70" />
            <span>~{readTime} menit baca</span>
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-text font-normal leading-[1.2] tracking-tight group-hover:text-primary transition-colors mb-2.5">
          {article.title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 font-normal mb-4">
            {excerpt}
          </p>
        )}

        {/* Footer Read Action */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
            <span>Baca Cerita Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}

// ── Subcomponent: Medium Article Row (The signature Medium feed item) ──
function MediumArticleRow({
  article,
  blogHandle,
  loading = 'lazy',
}: {
  article: ArticleItemFragment;
  blogHandle: string;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(article.publishedAt!));

  const authorName = article.author?.name || 'Tim Riset Beautyinu';
  const readTime = Math.max(2, Math.ceil((article.contentHtml?.length || 0) / 900));

  const excerpt = article.contentHtml
    ? article.contentHtml.replace(/<[^>]+>/g, '').trim().slice(0, 140) + '...'
    : '';

  return (
    <article className="group">
      <Link
        to={`/blogs/${blogHandle}/${article.handle}`}
        className="block"
      >
        {/* Top Byline Row */}
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
          <img
            src={authorAvatar}
            alt=""
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full object-cover border border-black/[0.08] flex-shrink-0"
          />
          <span className="font-medium text-text text-[11px] sm:text-xs truncate max-w-[150px]">
            {authorName}
          </span>
          <span className="text-black/20 text-[10px]">•</span>
          <span className="text-[11px] font-mono text-text-secondary/80">
            Edukasi Kulit
          </span>
        </div>

        {/* Main Content Grid: Text on Left, Thumbnail on Right */}
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-normal text-text group-hover:text-primary transition-colors leading-snug tracking-tight line-clamp-2 mb-1.5 sm:mb-2">
              {article.title}
            </h3>

            {/* Excerpt (hidden on very small screens, visible on sm+) */}
            {excerpt && (
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2 font-normal mb-3">
                {excerpt}
              </p>
            )}

            {/* Metadata Footer */}
            <div className="flex items-center gap-3 text-[11px] text-text-secondary/80 font-normal">
              <time dateTime={article.publishedAt!}>{publishedDate}</time>
              <span className="text-black/20">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-text-secondary/60" />
                <span>{readTime} min read</span>
              </span>
            </div>
          </div>

          {/* Compact Right Thumbnail (Signature Medium 1:1 or 4:3 image) */}
          {article.image && (
            <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF9FB] border border-black/[0.06] shadow-2xs flex-shrink-0">
              <Image
                alt={article.image.altText || article.title}
                aspectRatio="1/1"
                data={article.image}
                loading={loading}
                sizes="(min-width: 640px) 128px, 80px"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

// ── GraphQL Queries ──
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    tags
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;

const BLOG_PRODUCTS_QUERY = `#graphql
  query BlogProducts(
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
