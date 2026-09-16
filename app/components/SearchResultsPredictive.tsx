import {Link, useFetcher, type Fetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from './Aside';
import {ChevronRight, Search} from 'lucide-react';

const PRODUCT_FALLBACK_MAP: Record<string, string> = {
  'kefir-collagen-soap-60gr':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
  'kefir-collagen-soap-bar-60g':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
  'bright-glow-body-lotion-uv-filter-750ml':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
  'body-lotion-uv-750ml':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
  'brightening-booster-gold-powder-25g':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_5.png?v=1781661868',
  'the-glowing-set':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  'glowing-set-3-in-1':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  'complete-brightening-set-5-in-1':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  'lotion-booster-set-2-in-1':
    'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
};

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles.length) return null;

  return (
    <div className="p-4 pt-1" key="articles">
      <h5 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2.5">
        Artikel &amp; Panduan ({articles.length})
      </h5>
      <ul className="space-y-1">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li key={article.id}>
              <Link
                onClick={closeSearch}
                to={articleUrl}
                className="group flex items-center gap-3.5 py-2 px-2 -mx-2 rounded-2xl hover:bg-[#F7F6F9] transition-colors"
              >
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-xl object-cover bg-[#F7F6F9] flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <div className="p-4 pt-1" key="collections">
      <h5 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
        Kategori Terkait
      </h5>
      <div className="flex flex-wrap gap-1.5">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <Link
              key={collection.id}
              onClick={closeSearch}
              to={collectionUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-text bg-[#F7F6F9] hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
            >
              <span>{collection.title}</span>
              <ChevronRight className="w-3 h-3 text-text-secondary/50" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <div className="p-4 pt-1" key="pages">
      <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
        Halaman Informasi
      </h5>
      <ul className="space-y-1">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li key={page.id}>
              <Link
                onClick={closeSearch}
                to={pageUrl}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium text-text hover:bg-[#FAF8FC] hover:text-primary transition-colors"
              >
                <span>{page.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const ROUTINE_STEP_MAP: Record<string, {step: string; label: string; badgeClass: string}> = {
  'the-glowing-set': {
    step: '3-in-1',
    label: 'Complete Ritual',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
  },
  'glowing-set-3-in-1': {
    step: '3-in-1',
    label: 'Complete Ritual',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
  },
  'kefir-collagen-soap-60gr': {
    step: 'Step 01',
    label: 'Cleanse',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  'kefir-collagen-soap-bar-60g': {
    step: 'Step 01',
    label: 'Cleanse',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  'brightening-booster-gold-powder-25g': {
    step: 'Step 02',
    label: 'Boost',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  'body-booster-powder-50gr': {
    step: 'Step 02',
    label: 'Boost',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  'body-lotion-uv-750ml': {
    step: 'Step 03',
    label: 'Protect',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  'bright-glow-body-lotion-uv-filter-750ml': {
    step: 'Step 03',
    label: 'Protect',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

function HighlightMatch({text, query}: {text: string; query: string}) {
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <span key={i} className="text-primary font-bold bg-primary/10 rounded-xs px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="p-4" key="products">
      <div className="flex items-center justify-between mb-2.5">
        <h5 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
          Produk ({products.length})
        </h5>
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-full">
          Resmi BPOM RI
        </span>
      </div>
      <ul className="space-y-1">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const rawImage =
            product?.selectedOrFirstAvailableVariant?.image ||
            (product as any)?.featuredImage;
          const fallbackImageUrl =
            PRODUCT_FALLBACK_MAP[product.handle] ||
            'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179';
          const imageUrl = rawImage?.url || fallbackImageUrl;
          const imageAlt = rawImage?.altText ?? product.title;
          const routineInfo = ROUTINE_STEP_MAP[product.handle];

          return (
            <li key={product.id}>
              <Link
                to={productUrl}
                onClick={closeSearch}
                className="group flex items-center gap-3.5 py-2.5 px-2 -mx-2 rounded-2xl hover:bg-[#F7F6F9] transition-colors"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#F7F6F9] group-hover:bg-white p-1.5 flex items-center justify-center flex-shrink-0 transition-colors">
                  <img
                    alt={imageAlt}
                    src={imageUrl}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {routineInfo && (
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${routineInfo.badgeClass}`}>
                        {routineInfo.step}
                      </span>
                      <span className="text-[9px] text-text-secondary/70 font-medium">
                        {routineInfo.label}
                      </span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
                    <HighlightMatch text={product.title} query={term.current} />
                  </p>
                  {price && (
                    <span className="text-xs font-bold text-text mt-0.5 block">
                      <Money data={price} withoutTrailingZeros />
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) {
    return null;
  }

  const SUGGESTED_RECOVERY = [
    'Sabun Kefir',
    'Body Lotion UV',
    'Booster Powder',
    'Paket Glowing',
    'Kulit Kusam',
  ];

  return (
    <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
        <Search className="w-5 h-5" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-bold text-text mb-1">
        Formula belum ditemukan untuk &ldquo;{term.current}&rdquo;
      </p>
      <p className="text-xs text-text-secondary max-w-xs leading-relaxed mb-4">
        Coba gunakan kata kunci formula atau rangkaian perawatan berikut:
      </p>

      {/* Suggested Quick Recovery Chips */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mb-5">
        {SUGGESTED_RECOVERY.map((suggested) => (
          <Link
            key={suggested}
            to={`/search?q=${encodeURIComponent(suggested)}`}
            className="px-3 py-1 bg-[#FAF8FC] hover:bg-primary/10 hover:text-primary text-text text-xs font-medium rounded-full border border-black/[0.05] transition-all"
          >
            {suggested}
          </Link>
        ))}
      </div>

      {/* WhatsApp Help Consultation */}
      <a
        href={`https://wa.me/6287777118186?text=Halo%20Beautyinu%2C%20saya%20mencari%20produk%20untuk%20${encodeURIComponent(
          term.current,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-semibold border border-[#25D366]/20 transition-all cursor-pointer"
      >
        <span>Konsultasi Kulit via WhatsApp</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading' && fetcher.formAction) {
    try {
      const url = new URL(fetcher.formAction, 'http://localhost');
      const q = url.searchParams.get('q');
      if (q !== null) {
        term.current = q;
      }
    } catch {
      // ignore
    }
  }

  if (fetcher?.data?.term) {
    term.current = fetcher.data.term;
  }

  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}
