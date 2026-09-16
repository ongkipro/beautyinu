import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ArticleCard} from '~/components/ArticleCard';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getSeoMeta} from '~/lib/seo';
import {
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const blogTitle = data?.blog?.title || 'Journal';
  const title = `Skincare Journal & Panduan Edukasi — Beautyinu`;
  const description =
    data?.blog?.seo?.description ||
    'Tips perawatan tubuh, panduan skincare tropis harian, sains formulasi BPOM, dan informasi resmi dari Beautyinu.';

  return getSeoMeta({
    title,
    description,
    url: data?.canonicalUrl,
    type: 'website',
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* 1. Standard Editorial Header */}
        <header className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-3">
            Jurnal &amp; Edukasi Kulit
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] text-text font-normal leading-[1.15] tracking-tight mb-4">
            Sains Formulasi &amp; Panduan Kulit Cerah Tropis.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl font-normal">
            Edukasi perawatan tubuh tropis, sains di balik formulasi aktif berizin BPOM RI (Niacinamide 5.22% + Alpha Arbutin 2.30%), serta ritual harian untuk kulit sehat bercahaya.
          </p>
        </header>

        {/* 2. Unified Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-6 mb-12 sm:mb-14 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          <span className="text-primary font-bold cursor-pointer">
            Semua Artikel
          </span>
          <span className="hover:text-primary transition-colors cursor-pointer">
            Skin Science
          </span>
          <span className="hover:text-primary transition-colors cursor-pointer">
            Skinification
          </span>
          <span className="hover:text-primary transition-colors cursor-pointer">
            Daily Routine
          </span>
          <span className="hover:text-primary transition-colors cursor-pointer">
            Komunitas
          </span>
        </div>

        {/* 3. Paginated Articles Grid (Max 12 Articles, Unified ArticleCard) */}
        <PaginatedResourceSection<ArticleItemFragment>
          connection={articles}
          resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
        <div className="mt-20 sm:mt-24 rounded-2xl bg-[#FAF8FC] p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-2">
            Rangkaian Harian
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text font-normal mb-3">
            Siap Memulai Rutinitas Kulit Glowing?
          </h3>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Temukan kombinasi tepat untuk jenis kulitmu dengan Glowing Set 3-in-1 berizin BPOM RI atau konsultasi gratis bersama Beauty Bestie.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/collections/bundles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-8 py-3.5 shadow-xs transition-all cursor-pointer text-center"
            >
              <span>Lihat Paket Glowing Set (Diskon 47%)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20ingin%20konsultasi%20skincare"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-surface text-text border border-black/[0.08] text-sm font-semibold px-7 py-3.5 shadow-2xs transition-all cursor-pointer text-center"
            >
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Chat WhatsApp Konsultasi</span>
            </a>
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

  const excerpt = article.contentHtml
    ? article.contentHtml.replace(/<[^>]+>/g, '').trim().slice(0, 180) + '...'
    : '';

  return (
    <div className="col-span-full mb-6">
      <Link
        to={`/blogs/${article.blog.handle}/${article.handle}`}
        className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left"
      >
        {article.image && (
          <div className="lg:col-span-7 overflow-hidden aspect-[3/2] rounded-2xl bg-[#F0EAF8]">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
            />
          </div>
        )}
        <div className={`flex flex-col justify-center ${article.image ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2.5">
            <span className="text-primary font-bold">Artikel Unggulan</span>
            <span className="text-black/20">·</span>
            <time dateTime={article.publishedAt!}>{publishedAt}</time>
            <span className="text-black/20">·</span>
            <span>{authorName}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text group-hover:text-primary transition-colors leading-snug mb-3 font-normal">
            {article.title}
          </h2>
          {excerpt && (
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-5 font-normal">
              {excerpt}
            </p>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
            <span>Baca Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
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
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
