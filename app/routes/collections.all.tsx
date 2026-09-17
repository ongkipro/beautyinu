import type {Route} from './+types/collections.all';
import {useLoaderData, useNavigate, useSearchParams, Link} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/ProductCard';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {
  getSeoMeta,
  buildCollectionJsonLd,
  buildBreadcrumbJsonLd,
} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';
import collectionHeroDesktop from '~/assets/collection-hero-model-desktop.webp';
import collectionHeroTablet from '~/assets/collection-hero-model-tablet.webp';
import collectionHeroMobile from '~/assets/collection-hero-model-mobile.webp';
import {OfficialAssurance} from '~/components/OfficialAssurance';
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Truck,
  ArrowUpDown,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const ALL_EDITORIAL = {
  kicker: 'Beautyinu · Official Complete Catalog',
  title: 'Semua Produk',
  subtitle: 'Katalog Lengkap Seluruh Rangkaian',
  description:
    'Jelajahi seluruh rangkaian perawatan tubuh lengkap Beautyinu berizin resmi BPOM RI: body lotion UV filter, serbuk booster pencerah, krim tubuh, toner, dan sabun mandi collagen.',
  metrics: [
    {icon: 'shield' as const, label: '100% Terdaftar BPOM RI'},
    {icon: 'sparkle' as const, label: 'Active UV Filters'},
    {icon: 'check' as const, label: 'Formula Konsentrasi Tinggi'},
    {icon: 'truck' as const, label: 'Garansi Keaslian Resmi'},
  ],
};

export const meta: Route.MetaFunction = ({data}) => {
  const canonicalUrl = data?.canonicalUrl || 'https://beautyinu.co/collections/all';
  const collectionData = {
    title: 'Semua Produk',
    description:
      'Katalog lengkap seluruh rangkaian produk perawatan tubuh Beautyinu berizin BPOM: body lotion UV filter, serbuk booster pencerah, krim tubuh, toner, dan sabun mandi.',
    products: data?.products,
  };

  const collectionSchema = buildCollectionJsonLd(collectionData, canonicalUrl);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    {name: 'Home', url: 'https://beautyinu.co'},
    {name: 'Koleksi', url: 'https://beautyinu.co/collections'},
    {name: 'Semua Produk', url: canonicalUrl},
  ]);

  return getSeoMeta({
    title: 'Semua Produk — Beautyinu Official Store',
    description: collectionData.description,
    url: canonicalUrl,
    image: collectionHeroDesktop,
    type: 'website',
    jsonLd: [collectionSchema, breadcrumbSchema],
  });
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort');

  let sortKey: 'BEST_SELLING' | 'PRICE' | 'CREATED_AT' | 'RELEVANCE' = 'RELEVANCE';
  let reverse = false;

  if (sortParam === 'best-selling') {
    sortKey = 'BEST_SELLING';
    reverse = false;
  } else if (sortParam === 'price-low-high') {
    sortKey = 'PRICE';
    reverse = false;
  } else if (sortParam === 'price-high-low') {
    sortKey = 'PRICE';
    reverse = true;
  } else if (sortParam === 'newest') {
    sortKey = 'CREATED_AT';
    reverse = true;
  } else {
    sortKey = 'RELEVANCE';
    reverse = false;
  }

  const [{products}] = await Promise.all([
    context.storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        sortKey,
        reverse,
      },
    }),
  ]);

  return {
    products,
    canonicalUrl: `${new URL(request.url).origin}/collections/all`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (newSort === 'featured') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', newSort);
    }
    newParams.delete('cursor');
    newParams.delete('direction');
    const qs = newParams.toString();
    navigate(qs ? `?${qs}` : window.location.pathname);
  };

  const productCount = products.nodes.length;

  return (
    <div className="w-full bg-white">
      {/* 1. Full-Width Editorial Hero with Integrated Frosted Glass Breadcrumb */}
      <div className="relative w-full overflow-hidden bg-white border-b border-black/[0.04] min-h-[460px] sm:min-h-[420px] lg:h-[460px] flex flex-col justify-between">
        {/* Full-width Model Background Image with Desktop, Tablet, and Mobile art direction */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <picture className="w-full h-full block">
            <source media="(min-width: 1024px)" srcSet={collectionHeroDesktop} />
            <source media="(min-width: 640px)" srcSet={collectionHeroTablet} />
            <img
              src={collectionHeroMobile}
              alt="Beautyinu Glowing Skin Routine"
              className="w-full h-full object-cover object-[right_top] sm:object-[center_right] lg:object-right"
              loading="eager"
            />
          </picture>

          {/* Scrim Overlays — Precision Non-Linear Feathering (Zero Opacity Reduction on Model) */}
          {/* Top Header Scrim (for navbar/breadcrumb blend) */}
          <div
            className="absolute top-0 inset-x-0 h-16 sm:h-24 pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.40) 50%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Desktop Left Scrim: Eased horizontal fade behind text, completely transparent before reaching the model */}
          <div
            className="hidden sm:block absolute inset-y-0 left-0 w-[58%] lg:w-[50%] pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0.98) 22%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.55) 68%, rgba(255,255,255,0.18) 85%, rgba(255,255,255,0.03) 95%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Desktop Bottom Scrim: Smooth vertical fade into the product section */}
          <div
            className="hidden sm:block absolute bottom-0 inset-x-0 h-20 sm:h-28 pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.96) 20%, rgba(255,255,255,0.60) 50%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Mobile Left Scrim: Eased horizontal fade behind left-aligned text */}
          <div
            className="sm:hidden absolute inset-y-0 left-0 w-[78%] pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.65) 70%, rgba(255,255,255,0.20) 88%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Mobile Bottom Scrim: Smooth bottom edge blend */}
          <div
            className="sm:hidden absolute bottom-0 inset-x-0 h-24 pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0) 100%)',
            }}
          />
        </div>

        {/* Integrated Top Breadcrumb Bar */}
        <Breadcrumb
          variant="bar"
          items={[
            {label: 'Koleksi', to: '/collections'},
            {label: 'Semua Produk'},
          ]}
        />

        {/* Hero Content (Foreground Editorial Area) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:py-12 sm:my-auto">
          <div className="max-w-[70%] xs:max-w-[66%] sm:max-w-xl lg:max-w-2xl flex flex-col justify-center">
            {/* Clean Micro-Kicker (Zero Boxy Card Chrome) */}
            <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
                {ALL_EDITORIAL.kicker}
              </p>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] text-text font-normal tracking-tight leading-[1.08] mb-2 sm:mb-2.5">
              {ALL_EDITORIAL.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-sans font-medium text-primary tracking-normal mb-2.5 sm:mb-3">
              {ALL_EDITORIAL.subtitle}
            </p>

            {/* Editorial Description */}
            <p className="text-xs sm:text-[13.5px] text-text-secondary leading-relaxed font-normal mb-4 sm:mb-5 max-w-lg">
              {ALL_EDITORIAL.description}
            </p>

            {/* Editorial Specs Strip — Flat & Architectural */}
            <div className="flex items-center flex-wrap gap-y-2 gap-x-3 sm:gap-x-4 pt-3.5 border-t border-black/[0.08] text-xs">
              {ALL_EDITORIAL.metrics.map((item, idx) => (
                <div key={item.label} className="inline-flex items-center gap-1.5">
                  {idx > 0 && (
                    <span className="text-black/20 select-none mr-2 sm:mr-2.5 font-light">
                      /
                    </span>
                  )}
                  {item.icon === 'shield' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-text flex-shrink-0" />
                  )}
                  {item.icon === 'sparkle' && (
                    <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  )}
                  {item.icon === 'check' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  )}
                  {item.icon === 'truck' && (
                    <Truck className="w-3.5 h-3.5 text-text flex-shrink-0" />
                  )}
                  <span className="text-xs sm:text-[13px] font-medium text-text tracking-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content & Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Toolbar: Live Counter & Refined Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-black/[0.04] gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Menampilkan</span>
            <span className="font-semibold text-text">{productCount}</span>
            <span>Produk Pilihan</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <label
              htmlFor="sort"
              className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/50 flex items-center gap-1 shrink-0"
            >
              <ArrowUpDown className="w-3 h-3 text-black/40" />
              <span>Urutkan:</span>
            </label>
            <div className="relative group inline-flex items-center flex-1 sm:flex-initial sm:w-auto">
              <select
                id="sort"
                value={currentSort}
                onChange={handleSortChange}
                className="appearance-none w-full bg-white border border-black/10 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/15 rounded-xl py-2 pl-3 pr-8 text-xs font-semibold text-text shadow-2xs hover:shadow-xs transition-all cursor-pointer outline-none select-none"
              >
                <option value="featured">Rekomendasi Unggulan</option>
                <option value="best-selling">Paling Laris (Best Selling)</option>
                <option value="price-low-high">Harga: Terendah &rarr; Tertinggi</option>
                <option value="price-high-low">Harga: Tertinggi &rarr; Terendah</option>
                <option value="newest">Produk Terbaru</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-black/40 group-hover:text-primary transition-colors">
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {productCount > 0 ? (
          <PaginatedResourceSection<CollectionItemFragment>
            connection={products}
            resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10 lg:gap-y-12"
          >
            {({node: product, index}) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-[#FAF9FB] border border-black/[0.04] p-8 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl text-text mb-2">Belum ada produk</h3>
            <p className="text-sm sm:text-base text-text-secondary mb-6">
              Katalog produk sedang diperbarui. Silakan kembali lagi nanti.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25"
            >
              <span>Kembali ke Beranda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
      <OfficialAssurance />
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        price {
          ...MoneyCollectionItem
        }
        compareAtPrice {
          ...MoneyCollectionItem
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
