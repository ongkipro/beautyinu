import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ArticleCard} from '~/components/ArticleCard';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getSeoMeta, buildBreadcrumbJsonLd} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';
import heroEditorialDesktop from '~/assets/beautyinu-hero-editorial.webp';
import heroEditorialMobile from '~/assets/beautyinu-hero-editorial-mobile.webp';
import {
  ArrowRight,
  Clock,
  MessageCircle,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const blogTitle = data?.blog?.title || 'Journal';
  const canonicalUrl = data?.canonicalUrl || 'https://beautyinu.id/blogs/news';
  return getSeoMeta({
    title: `${blogTitle} — Beautyinu Official Store`,
    description:
      'Edukasi seputar skin brightening, panduan ingredients, dan tips merawat skin barrier harian.',
    url: canonicalUrl,
    type: 'website',
    jsonLd: [
      buildBreadcrumbJsonLd([
        {name: 'Home', url: 'https://beautyinu.id'},
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
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  if (!params.blogHandle) {
    throw new Response('blog not found', {status: 404});
  }

  if (params.blogHandle === 'berita' || params.blogHandle === 'journal' || params.blogHandle === 'articles') {
    throw redirect('/blogs/news', 301);
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {blogHandle: params.blogHandle, ...paginationVariables},
    }),
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});
  return {
    blog,
    canonicalUrl: `${new URL(request.url).origin}/blogs/${params.blogHandle}`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div className="w-full bg-white">
      {/* 1. Standardized Breadcrumbs Wayfinding Bar */}
      <Breadcrumb
        variant="bar"
        items={[{label: 'Skincare Journal'}]}
      />

      {/* 2. Full-Width Editorial Hero with Adaptable Precision Height */}
      <div className="relative w-full overflow-hidden bg-[#FBF9FC] border-b border-black/[0.04] min-h-[300px] sm:min-h-[360px] lg:h-[400px] py-8 sm:py-10 flex items-center">
        {/* Full-width Model Editorial Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <picture>
            <source media="(max-width: 640px)" srcSet={heroEditorialMobile} />
            <img
              src={heroEditorialDesktop}
              alt="Beautyinu Skincare Journal"
              className="w-full h-full object-cover object-right lg:object-[center_right] opacity-35 sm:opacity-90 lg:opacity-95"
            />
          </picture>

          {/* Smooth Directional Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9FC] via-[#FBF9FC]/95 via-60% to-[#FBF9FC]/80 sm:bg-gradient-to-r sm:from-[#FBF9FC] sm:via-[#FBF9FC]/90 sm:via-55% lg:via-[#FBF9FC]/80 lg:via-60% sm:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FBF9FC] to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl lg:max-w-2xl flex flex-col justify-center">
            <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-primary mb-2.5">
              The Journal
            </p>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] text-text font-normal leading-[1.12] tracking-tight mb-3">
              Skincare Notes &amp; Education
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal max-w-lg">
              Catatan edukasi perawatan tubuh, panduan bahan aktif, dan tips merawat skin barrier harian dari tim Beautyinu.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Articles Grid Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <PaginatedResourceSection<ArticleItemFragment>
          connection={articles}
          resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
          loadMoreText="Muat Lebih Banyak Artikel"
          loadPreviousText="Muat Artikel Sebelumnya"
        >
          {({node: article, index}) =>
            index === 0 ? (
              <FeaturedArticleCard
                article={article}
                key={article.id}
                loading="eager"
              />
            ) : (
              <ArticleCard
                article={article}
                blogHandle={blog.handle}
                key={article.id}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            )
          }
        </PaginatedResourceSection>

        {/* 4. Routine CTA Banner */}
        <div className="mt-16 sm:mt-20 relative rounded-2xl bg-gradient-to-r from-white/95 via-white/85 to-[#FFF0F5]/85 backdrop-blur-xl border border-primary/20 shadow-[0_10px_35px_rgba(249,127,158,0.08)] p-8 sm:p-12 text-center max-w-4xl mx-auto overflow-hidden">
          <div className="relative z-1">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold uppercase tracking-widest text-primary inline-block mb-3">
              Konsultasi &amp; Paket Perawatan
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text font-normal tracking-tight mb-3">
              Butuh Rekomendasi Rutinitas yang Tepat?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed font-normal">
              Konsultasikan kebutuhan kulitmu langsung dengan tim kami atau temukan paket perawatan tubuh resmi berizin BPOM.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/collections/bundles"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold px-8 py-3.5 shadow-xs transition-all cursor-pointer text-center hover:scale-[1.02]"
              >
                <span>Lihat Paket Perawatan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20skincare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-surface text-text border border-black/[0.08] text-xs sm:text-sm font-semibold px-7 py-3.5 shadow-2xs transition-all cursor-pointer text-center hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedArticleCard({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));

  const authorName = article.author?.name || 'Tim Editorial Beautyinu';
  const readTime = Math.max(2, Math.ceil((article.contentHtml?.length || 0) / 900));

  const excerpt = article.contentHtml
    ? article.contentHtml.replace(/<[^>]+>/g, '').trim().slice(0, 190) + '...'
    : '';

  return (
    <div className="col-span-full">
      <div className="border-b border-black/[0.08] pb-10 sm:pb-14 mb-6 sm:mb-10">
        <Link
          to={`/blogs/${article.blog.handle}/${article.handle}`}
          className="group grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center text-left"
        >
          {article.image && (
            <div className="lg:col-span-7 overflow-hidden aspect-[3/2] rounded-2xl bg-[#F0EAF8] border border-black/[0.06] shadow-xs">
              <Image
                alt={article.image.altText || article.title}
                aspectRatio="3/2"
                data={article.image}
                loading={loading}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
              />
            </div>
          )}
          <div className={`flex flex-col justify-center ${article.image ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-3">
              <time dateTime={article.publishedAt!}>{publishedAt}</time>
              <span className="text-black/20">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-black/40" />
                <span>~{readTime} Menit Baca</span>
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[38px] text-text group-hover:text-primary transition-colors leading-[1.2] mb-3.5 font-normal tracking-tight">
              {article.title}
            </h2>
            {excerpt && (
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 mb-6 font-normal">
                {excerpt}
              </p>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#F4EFFB] border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xs">
                  B
                </div>
                <div>
                  <p className="text-xs font-medium text-text leading-tight">{authorName}</p>
                  <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Beautyinu Editorial</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
                <span>Baca Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Section Header separator for following articles */}
      <div className="pt-2 pb-2">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-text-secondary">
          Artikel Lainnya
        </h2>
      </div>
    </div>
  );
}

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
