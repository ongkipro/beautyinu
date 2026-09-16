import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/search';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';
import type {
  RegularSearchQuery,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';
import {getSeoMeta} from '~/lib/seo';
import {Search, ArrowRight, TrendingUp} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const term = data?.term ? `"${data.term}"` : '';
  const title = term
    ? `Hasil Pencarian untuk ${term} — Beautyinu`
    : 'Cari Produk Perawatan Kulit — Beautyinu Official Store';

  return getSeoMeta({
    title,
    description:
      'Temukan rangkaian produk bodycare Beautyinu yang diformulasikan khusus untuk mencerahkan dan melembapkan kulit secara optimal.',
    noIndex: true,
  });
};

const POPULAR_SEARCH_TAGS = [
  'Sabun Kefir Collagen',
  'Body Lotion UV 750ml',
  'Booster Gold Powder',
  'Paket Glowing 3-in-1',
  'Kulit Kusam & Belang',
  'Niacinamide 5.22%',
];

const CURATED_SEARCH_SUGGESTIONS = [
  {
    title: 'The Glowing Set (3-in-1 Complete Ritual)',
    handle: 'the-glowing-set',
    price: 'Rp 155.092',
    comparePrice: 'Rp 254.250',
    discount: 'Hemat 39%',
    step: '3-in-1 Set',
    image: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  },
  {
    title: 'Sabun Kefir Collagen Brightening Bar 60gr',
    handle: 'kefir-collagen-soap-60gr',
    price: 'Rp 45.000',
    discount: 'Best Seller',
    step: 'Step 01 · Cleanse',
    image: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
  },
  {
    title: 'Body Lotion UV Filter Brightening 750ml',
    handle: 'body-lotion-uv-750ml',
    price: 'Rp 109.000',
    discount: 'Favorit',
    step: 'Step 03 · Protect',
    image: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
  },
  {
    title: 'Booster Gold Powder Skin Brightening 50gr',
    handle: 'booster-gold-powder',
    price: 'Rp 65.000',
    discount: 'Active Booster',
    step: 'Step 02 · Boost',
    image: 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
  },
];

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise: Promise<PredictiveSearchReturn | RegularSearchReturn> =
    isPredictive
      ? predictiveSearch({request, context})
      : regularSearch({request, context});

  searchPromise.catch((error: Error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  const {type, term, result, error} = useLoaderData<typeof loader>();
  if (type === 'predictive') return null;

  return (
    <div className="bg-white min-h-[70vh]">
      {/* 1. Header & Search Bar Hero */}
      <div className="bg-gradient-to-b from-[#FAF8FC] via-surface/60 to-white py-10 sm:py-14 border-b border-black/[0.04]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-text font-medium">Pencarian</span>
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-accent bg-accent-light px-3 py-1 rounded-md mb-3 border border-accent/20">
            Katalog &amp; Formula Resmi
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-text tracking-tight mb-3">
            {term ? (
              <>Hasil Pencarian: &ldquo;<span className="text-primary">{term}</span>&rdquo;</>
            ) : (
              'Eksplorasi Formula Beautyinu'
            )}
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
            Temukan produk perawatan tubuh yang tepat dengan bahan aktif presisi untuk mencerahkan, melembapkan, dan merawat kulit harian Anda.
          </p>

          {/* Search Form */}
          <SearchForm>
            {({inputRef}) => (
              <div className="max-w-2xl mx-auto">
                <div className="relative flex items-center bg-white rounded-2xl border border-black/10 p-1.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all w-full overflow-hidden">
                  <Search className="w-4 sm:w-5 h-4 sm:h-5 text-text-secondary/60 absolute left-3.5 sm:left-4 pointer-events-none" strokeWidth={1.5} />
                  <input
                    defaultValue={term}
                    name="q"
                    placeholder="Cari sabun kefir, body lotion, booster..."
                    ref={inputRef}
                    type="search"
                    className="flex-1 min-w-0 pl-10 sm:pl-11 pr-2 py-2.5 sm:py-3 bg-transparent text-base sm:text-sm text-text placeholder:text-text-secondary/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#1A1A1A] hover:bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <span>Cari</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Popular Tags */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                    Populer:
                  </span>
                  {POPULAR_SEARCH_TAGS.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?q=${encodeURIComponent(tag)}`}
                      className="text-xs font-medium px-3 py-1 rounded-lg bg-white/80 hover:bg-[#F3EEFA] text-text hover:text-primary border border-black/[0.06] transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </SearchForm>
        </div>
      </div>

      {/* 2. Results Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs text-center mb-8">
            {error}
          </div>
        )}

        {!term ? (
          /* Zero-Query State: Curated Bestsellers Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-0.5 rounded-md mb-1 inline-block">
                  Pilihan Populer
                </span>
                <h2 className="font-serif text-2xl text-text">Rekomendasi Produk Terlaris</h2>
              </div>
              <Link
                to="/collections/frontpage"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Produk</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {CURATED_SEARCH_SUGGESTIONS.map((item) => (
                <Link
                  key={item.handle}
                  to={`/products/${item.handle}`}
                  className="group flex flex-col justify-between rounded-2xl bg-white border border-black/[0.06] p-3.5 sm:p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div>
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#FAF8FC] mb-3 flex items-center justify-center p-3 border border-black/[0.03] relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-white/90 backdrop-blur-xs text-primary rounded-md border border-primary/20 shadow-2xs">
                          {item.discount}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">
                      {item.step}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-3 border-t border-black/[0.04]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-bold text-text">
                        {item.price}
                      </span>
                      {item.comparePrice && (
                        <span className="text-xs text-text-secondary line-through">
                          {item.comparePrice}
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5 w-full py-2 rounded-xl bg-[#FAF8FC] group-hover:bg-[#1A1A1A] text-text group-hover:text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1">
                      <span>Lihat Produk</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : !result?.total ? (
          /* Empty Query Results */
          <SearchResults.Empty />
        ) : (
          /* Query Results Display */
          <SearchResults result={result} term={term}>
            {({articles, pages, products, term}) => (
              <div className="space-y-10">
                <SearchResults.Products products={products} term={term} />
                <SearchResults.Pages pages={pages} term={term} />
                <SearchResults.Articles articles={articles} term={term} />
              </div>
            )}
          </SearchResults>
        )}

        <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
      </div>
    </div>
  );
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Regular search fetcher
 */
async function regularSearch({
  request,
  context,
}: Pick<
  Route.LoaderArgs,
  'request' | 'context'
>): Promise<RegularSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const {
    errors,
    ...items
  }: {errors?: Array<{message: string}>} & RegularSearchQuery =
    await storefront.query(SEARCH_QUERY, {
      variables: {...variables, term},
    });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, {nodes}: {nodes: Array<unknown>}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}: {message: string}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    featuredImage {
      url
      altText
      width
      height
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<
  Route.ActionArgs,
  'request' | 'context'
>): Promise<PredictiveSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {
    predictiveSearch: items,
    errors,
  }: PredictiveSearchQuery & {errors?: Array<{message: string}>} =
    await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    });

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}: {message: string}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, item: Array<unknown>) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}
