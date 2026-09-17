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
import heroModelDesktop from '~/assets/beautyinu-hero-model.webp';
import heroModelMobile from '~/assets/beautyinu-hero-model-mobile.webp';
import {
  ShieldCheck,
  Sparkles,
  Truck,
  Clock,
  ArrowUpDown,
  ArrowRight,
  Check,
  ChevronDown,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const canonicalUrl = data?.canonicalUrl || 'https://beautyinu.id/collections/all';
  const collectionData = {
    title: 'Semua Produk',
    description:
      'Katalog lengkap seluruh rangkaian produk perawatan tubuh Beautyinu berizin BPOM: body lotion UV filter, serbuk booster pencerah, krim tubuh, toner, dan sabun mandi.',
    products: data?.products,
  };

  const collectionSchema = buildCollectionJsonLd(collectionData, canonicalUrl);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    {name: 'Home', url: 'https://beautyinu.id'},
    {name: 'Koleksi', url: 'https://beautyinu.id/collections'},
    {name: 'Semua Produk', url: canonicalUrl},
  ]);

  return getSeoMeta({
    title: 'Semua Produk — Beautyinu Official Store',
    description: collectionData.description,
    url: canonicalUrl,
    image: heroModelDesktop,
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
      <div className="relative w-full overflow-hidden bg-[#FBF9FC] border-b border-black/[0.04] min-h-[360px] sm:min-h-[420px] lg:h-[460px] flex flex-col justify-between">
        {/* Full-width Model Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <picture>
            <source media="(max-width: 640px)" srcSet={heroModelMobile} />
            <img
              src={heroModelDesktop}
              alt="Beautyinu Glowing Skin Routine"
              className="w-full h-full object-cover object-right lg:object-[center_right] opacity-55 sm:opacity-90 lg:opacity-95"
            />
          </picture>

          {/* Smooth Directional Scrim: Text area protected, top glass breadcrumb and right photo clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9FC] via-[#FBF9FC]/80 via-50% to-[#FBF9FC]/10 sm:bg-gradient-to-r sm:from-[#FBF9FC]/90 sm:via-[#FBF9FC]/70 sm:via-55% lg:via-[#FBF9FC]/60 lg:via-60% sm:to-transparent" />
          {/* Subtle bottom edge blend */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FBF9FC] to-transparent" />
        </div>

        {/* Integrated Top Breadcrumb Bar */}
        <Breadcrumb
          variant="bar"
          items={[
            {label: 'Koleksi', to: '/collections'},
            {label: 'Semua Produk'},
          ]}
        />

        {/* Hero Content (Vertically centered on Left) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto">
          <div className="max-w-xl lg:max-w-2xl flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/90 backdrop-blur-md text-accent text-[11px] font-mono font-semibold uppercase tracking-wider mb-2.5 border border-accent/20 shadow-2xs self-start">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Beautyinu · Official Complete Catalog</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-text font-normal tracking-tight mb-2">
              Semua Produk
            </h1>

            <p className="text-xs sm:text-sm font-mono font-medium text-primary uppercase tracking-wide mb-2.5">
              Katalog Lengkap Seluruh Rangkaian
            </p>

            <p className="text-xs sm:text-sm md:text-[15px] text-text-secondary leading-relaxed font-normal mb-4 max-w-lg">
              Jelajahi seluruh rangkaian perawatan tubuh lengkap Beautyinu berizin resmi BPOM RI: body lotion UV filter, serbuk booster pencerah, krim tubuh, toner, dan sabun mandi collagen.
            </p>

            {/* Editorial Highlight Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {['100% Terdaftar BPOM RI', 'Active UV Filters', 'Formula Konsentrasi Tinggi', 'Garansi Keaslian'].map(
                (highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-black/[0.08] shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                    {highlight}
                  </span>
                ),
              )}
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
          <PaginatedResourceSection<CollectionItemFragment>
            connection={products}
            resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
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
            <p className="text-xs sm:text-sm text-text-secondary mb-6">
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

        {/* 4. Trust Assurance Pillars */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-black/[0.06]">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-1.5">
              Official Assurance
            </p>
            <h3 className="font-serif text-xl sm:text-2xl text-text font-normal">
              Jaminan Belanja Resmi Beautyinu
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FAF9FB] rounded-2xl p-5 border border-black/[0.04] flex flex-col items-start">
              <div className="w-9 h-9 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center text-primary mb-3 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-text mb-1">100% Terdaftar BPOM RI</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Seluruh formula bebas merkuri &amp; hidrokuinon, teruji klinis dan aman untuk pemakaian harian.
              </p>
            </div>

            <div className="bg-[#FAF9FB] rounded-2xl p-5 border border-black/[0.04] flex flex-col items-start">
              <div className="w-9 h-9 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center text-accent mb-3 shadow-2xs">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-text mb-1">Formula Konsentrasi Tinggi</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Niacinamide, Alpha Arbutin &amp; Collagen dipadukan dengan UV Filter untuk hasil cerah optimal.
              </p>
            </div>

            <div className="bg-[#FAF9FB] rounded-2xl p-5 border border-black/[0.04] flex flex-col items-start">
              <div className="w-9 h-9 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center text-[#25D366] mb-3 shadow-2xs">
                <Truck className="w-5 h-5 text-[#25D366]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-text mb-1">Pengiriman Cepat &amp; Aman</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Gratis bubble wrap ekstra tebal. Garansi ganti baru 100% jika botol pecah atau bocor saat ekspedisi.
              </p>
            </div>

            <div className="bg-[#FAF9FB] rounded-2xl p-5 border border-black/[0.04] flex flex-col items-start">
              <div className="w-9 h-9 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center text-text mb-3 shadow-2xs">
                <Clock className="w-5 h-5 text-text" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-text mb-1">Konsultasi Kulit Gratis</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bingung menentukan produk? Konsultasikan kondisi kulitmu langsung dengan Beauty Advisor resmi kami.
              </p>
            </div>
          </div>
        </div>
      </div>
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
