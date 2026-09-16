import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';

export interface ArticleCardArticle {
  id?: string;
  handle: string;
  title: string;
  publishedAt: string;
  image?: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  blog?: {
    handle: string;
  } | null;
}

interface ArticleCardProps {
  article: ArticleCardArticle;
  blogHandle?: string;
  loading?: HTMLImageElement['loading'];
}

/**
 * Unified, precise Article Card used identically across:
 * - Homepage (_index.tsx BlogPreview)
 * - Blog Archive (blogs.$blogHandle._index.tsx)
 * - Single Article Related Articles (blogs.$blogHandle.$articleHandle.tsx)
 */
export function ArticleCard({
  article,
  blogHandle = 'news',
  loading = 'lazy',
}: ArticleCardProps) {
  const actualBlogHandle = article.blog?.handle || blogHandle;
  const publishedDate = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <Link
      to={`/blogs/${actualBlogHandle}/${article.handle}`}
      className="group block"
    >
      <div className="aspect-[3/2] overflow-hidden rounded-xl bg-[#F0EAF8] mb-4">
        {article.image ? (
          <Image
            data={article.image as any}
            alt={article.image.altText || article.title}
            aspectRatio="3/2"
            loading={loading}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary/40 text-xs font-serif">
            Beautyinu Journal
          </div>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
        {publishedDate}
      </p>
      <h3 className="font-serif text-xl text-text leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
        {article.title}
      </h3>
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
        <span>Baca Selengkapnya</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
  );
}
