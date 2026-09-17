import {redirect, useLoaderData, useNavigate, useSearchParams, Link} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/ProductCard';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {
  getSeoMeta,
  buildCollectionJsonLd,
  buildBreadcrumbJsonLd,
} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';
import collectionHeroDesktop from '~/assets/collection-hero-model-desktop.webp';
import collectionHeroTablet from '~/assets/collection-hero-model-tablet.webp';
import collectionHeroMobile from '~/assets/collection-hero-model-mobile.webp';
import collectionBodyCareDesktop from '~/assets/collection-bodycare-desktop.webp';
import collectionBodyCareTablet from '~/assets/collection-bodycare-tablet.webp';
import collectionBodyCareMobile from '~/assets/collection-bodycare-mobile.webp';
import collectionBestSellersDesktop from '~/assets/collection-bestsellers-desktop.webp';
import collectionBestSellersTablet from '~/assets/collection-bestsellers-tablet.webp';
import collectionBestSellersMobile from '~/assets/collection-bestsellers-mobile.webp';
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

const COLLECTION_HERO_ASSETS: Record<
  string,
  {desktop: string; tablet: string; mobile: string}
> = {
  'body-care': {
    desktop: collectionBodyCareDesktop,
    tablet: collectionBodyCareTablet,
    mobile: collectionBodyCareMobile,
  },
  'best-sellers': {
    desktop: collectionBestSellersDesktop,
    tablet: collectionBestSellersTablet,
    mobile: collectionBestSellersMobile,
  },
};

const COLLECTION_301_REDIRECTS: Record<string, string> = {
  'paket-hemat': 'bundles',
  'paket': 'bundles',
  'sets': 'bundles',
  'perawatan-tubuh': 'body-care',
  'body': 'body-care',
  'terlaris': 'best-sellers',
  'bestseller': 'best-sellers',
  'best-seller': 'best-sellers',
  'semua-produk': 'all',
};

interface EditorialMetric {
  label: string;
  icon?: 'star' | 'check' | 'shield' | 'pulse' | 'fire' | 'sparkle' | 'truck';
  highlight?: boolean;
}

interface CollectionEditorial {
  subtitle: string;
  kicker: string;
  description: string;
  metrics: EditorialMetric[];
}

const DEFAULT_EDITORIAL: CollectionEditorial = {
  subtitle: 'Official Beautyinu Collection',
  kicker: 'Beautyinu · Official Collection',
  description:
    'Rangkaian perawatan tubuh dermatologis dengan bahan aktif presisi berizin resmi BPOM RI untuk kulit cerah, lembap, dan glowing harian.',
  metrics: [
    {icon: 'shield', label: '100% Terdaftar BPOM RI'},
    {icon: 'sparkle', label: 'Active UV Filters'},
    {icon: 'check', label: 'Formula Konsentrasi Tinggi'},
    {icon: 'truck', label: 'Garansi Originalitas'},
  ],
};

const COLLECTION_EDITORIAL_CONFIG: Record<string, CollectionEditorial> = {
  'body-care': {
    subtitle: 'Daily Brightening & UV Protection Routine',
    kicker: 'Beautyinu · Clinical Body Care',
    description:
      'Rangkaian perawatan tubuh dermatologis dengan formulasi aktif presisi (Niacinamide, Alpha Arbutin, Kefir Collagen, dan UV Filters harian) berizin resmi BPOM RI untuk kulit cerah merata dan skin barrier terlindungi.',
    metrics: [
      {icon: 'shield', label: '100% Terdaftar BPOM RI'},
      {icon: 'sparkle', label: 'Active UV Filters'},
      {icon: 'check', label: 'Formula Non-Sticky'},
      {icon: 'check', label: 'Busui & Bumil Friendly'},
    ],
  },
  'bundles': {
    subtitle: 'Exclusive Value Sets · Hemat Hingga 47%',
    kicker: 'Beautyinu · Synergistic Sets',
    description:
      'Kombinasi formulasi terbaik yang dirancang untuk bekerja sinergis mempercepat regenerasi sel kulit mati, mengunci kelembapan, dan mencerahkan kulit tubuh secara maksimal.',
    metrics: [
      {icon: 'sparkle', label: 'Hemat s.d 47%', highlight: true},
      {icon: 'check', label: 'Hasil 3x Lebih Cepat'},
      {icon: 'check', label: 'Paket Komplit Rutin'},
      {icon: 'truck', label: 'Garansi Ganti Baru'},
    ],
  },
  'best-sellers': {
    subtitle: 'Top Rated by 10.000+ Verified Buyers',
    kicker: 'Beautyinu · Most Loved Products',
    description:
      'Produk perawatan tubuh terfavorit yang paling banyak diminati dan dipercaya ribuan konsumen di seluruh Indonesia. Dari serbuk booster pencerah 3x lebih cepat hingga body lotion jumbo 750ml untuk perlindungan harian keluarga.',
    metrics: [
      {icon: 'star', label: 'Rating 4.9 / 5.0'},
      {icon: 'pulse', label: '10.000+ Terjual'},
      {icon: 'check', label: 'Ulasan Terverifikasi'},
      {icon: 'fire', label: 'Stok Terbatas', highlight: true},
    ],
  },
  'frontpage': {
    subtitle: 'Katalog Lengkap Seluruh Rangkaian',
    kicker: 'Beautyinu · Official Store',
    description:
      'Katalog resmi seluruh varian produk perawatan tubuh Beautyinu yang telah terdaftar resmi BPOM RI: body lotion UV filter, serbuk booster pencerah, krim tubuh, toner, dan sabun kefir collagen.',
    metrics: [
      {icon: 'shield', label: '100% Terdaftar BPOM RI'},
      {icon: 'sparkle', label: 'Active UV Filters'},
      {icon: 'check', label: 'Formula Konsentrasi Tinggi'},
      {icon: 'truck', label: 'Garansi Keaslian Resmi'},
    ],
  },
};

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.collection) {
    return getSeoMeta({title: 'Collection Not Found — Beautyinu'});
  }
  const {collection, canonicalUrl} = data;
  const title =
    collection.seo?.title || `${collection.title} — Beautyinu Official Store`;
  const description =
    collection.seo?.description ||
    collection.descriptionHtml?.replace(/<[^>]+>/g, '').trim().slice(0, 160) ||
    `Koleksi ${collection.title} resmi dari Beautyinu. Diformulasikan dengan bahan aktif klinis untuk kulit sehat dan glowing.`;

  const collectionSchema = buildCollectionJsonLd(collection, canonicalUrl);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    {name: 'Home', url: 'https://beautyinu.co'},
    {name: 'Koleksi', url: 'https://beautyinu.co/collections'},
    {name: collection.title, url: canonicalUrl || `https://beautyinu.co/collections/${collection.handle}`},
  ]);

  const heroAssets = (collection.handle && COLLECTION_HERO_ASSETS[collection.handle]) || {
    desktop: collectionHeroDesktop,
    tablet: collectionHeroTablet,
    mobile: collectionHeroMobile,
  };

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    image: collection.image?.url || heroAssets.desktop,
    imageAlt: collection.image?.altText || collection.title,
    type: 'website',
    jsonLd: [collectionSchema, breadcrumbSchema],
  });
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort');
  
  let sortKey: 'COLLECTION_DEFAULT' | 'BEST_SELLING' | 'PRICE' | 'CREATED' = 'COLLECTION_DEFAULT';
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
    sortKey = 'CREATED';
    reverse = true;
  } else {
    sortKey = 'COLLECTION_DEFAULT';
    reverse = false;
  }

  if (!handle) {
    throw redirect('/collections');
  }

  const targetHandle = COLLECTION_301_REDIRECTS[handle];
  if (targetHandle) {
    const targetUrl = new URL(request.url);
    targetUrl.pathname = targetHandle === 'all' ? '/collections/all' : `/collections/${targetHandle}`;
    throw redirect(targetUrl.toString(), 301);
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        sortKey,
        reverse,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    canonicalUrl: `${new URL(request.url).origin}/collections/${collection.handle}`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
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

  const productCount = collection.products.nodes.length;
  const editorial = COLLECTION_EDITORIAL_CONFIG[collection.handle] || DEFAULT_EDITORIAL;
  const heroAssets = COLLECTION_HERO_ASSETS[collection.handle] || {
    desktop: collectionHeroDesktop,
    tablet: collectionHeroTablet,
    mobile: collectionHeroMobile,
  };

  return (
    <div className="w-full bg-white">
      {/* 1. Full-Width Editorial Hero with Integrated Frosted Glass Breadcrumb */}
      <div className="relative w-full overflow-hidden bg-white border-b border-black/[0.04] min-h-[460px] sm:min-h-[420px] lg:h-[460px] flex flex-col justify-between">
        {/* Full-width Model Background Image with Desktop, Tablet, and Mobile art direction */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <picture className="w-full h-full block">
            <source media="(min-width: 1024px)" srcSet={heroAssets.desktop} />
            <source media="(min-width: 640px)" srcSet={heroAssets.tablet} />
            <img
              src={heroAssets.mobile}
              alt={`${collection.title} — Beautyinu Glowing Skin Routine`}
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
            {label: collection.title},
          ]}
        />

        {/* Hero Content (Foreground Editorial Area) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:py-12 sm:my-auto">
          <div className="max-w-[70%] xs:max-w-[66%] sm:max-w-xl lg:max-w-2xl flex flex-col justify-center">
            {/* Clean Micro-Kicker (Zero Boxy Card Chrome) */}
            <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
                {editorial.kicker}
              </p>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] text-text font-normal tracking-tight leading-[1.08] mb-2 sm:mb-2.5">
              {collection.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-sans font-medium text-primary tracking-normal mb-2.5 sm:mb-3">
              {editorial.subtitle}
            </p>

            {/* Editorial Description */}
            <p className="text-xs sm:text-[13.5px] text-text-secondary leading-relaxed font-normal mb-4 sm:mb-5 max-w-lg">
              {editorial.description}
            </p>

            {/* Editorial Specs / Social Proof Strip — Flat & Architectural */}
            <div className="flex items-center flex-wrap gap-y-2 gap-x-3 sm:gap-x-4 pt-3.5 border-t border-black/[0.08] text-xs">
              {editorial.metrics.map((item, idx) => (
                <div key={item.label} className="inline-flex items-center gap-1.5">
                  {idx > 0 && (
                    <span className="text-black/20 select-none mr-2 sm:mr-2.5 font-light">
                      /
                    </span>
                  )}
                  {item.icon === 'star' && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                  )}
                  {item.icon === 'check' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  )}
                  {item.icon === 'shield' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-text flex-shrink-0" />
                  )}
                  {item.icon === 'sparkle' && (
                    <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  )}
                  {item.icon === 'truck' && (
                    <Truck className="w-3.5 h-3.5 text-text flex-shrink-0" />
                  )}
                  {item.icon === 'pulse' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  )}
                  {item.icon === 'fire' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-[13px] tracking-tight ${
                      item.highlight ? 'font-semibold text-rose-600' : 'font-medium text-text'
                    }`}
                  >
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
          <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
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
          <PaginatedResourceSection<ProductItemFragment>
            connection={collection.products}
            resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10 lg:gap-y-12"
          >
            {({node: product}) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-[#FAF9FB] border border-black/[0.04] p-8 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl text-text mb-2">Belum ada produk</h3>
            <p className="text-xs sm:text-sm text-text-secondary mb-6">
              Koleksi ini sedang diperbarui. Jelajahi pilihan terlaris kami lainnya.
            </p>
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25"
            >
              <span>Lihat Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
      <OfficialAssurance />

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        price {
          ...MoneyProductItem
        }
        compareAtPrice {
          ...MoneyProductItem
        }
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      image {
        id
        url
        altText
        width
        height
      }
      seo {
        title
        description
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
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
` as const;
