import type {Route} from './+types/collections.all';
import {useLoaderData, useNavigate, useSearchParams, Link} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/ProductCard';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {getSeoMeta} from '~/lib/seo';
import heroModelDesktop from '~/assets/beautyinu-hero-model.webp';
import heroModelMobile from '~/assets/beautyinu-hero-model-mobile.webp';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Clock,
  ChevronDown,
  ArrowUpDown,
  ArrowRight,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  return getSeoMeta({
    title: 'Semua Produk — Beautyinu Official Store',
    description:
      'Katalog lengkap seluruh rangkaian produk perawatan tubuh Beautyinu berizin BPOM: body lotion UV filter, serbuk booster pencerah, krim tubuh, toner, dan sabun mandi.',
    url: data?.canonicalUrl,
    image: heroModelDesktop,
    type: 'website',
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
      {/* 1. Breadcrumbs Wayfinding */}
      <div className="border-b border-black/[0.04] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Beranda</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-black/30 flex-shrink-0" />
            <Link to="/collections" className="hover:text-primary transition-colors">
              <span>Koleksi</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-black/30 flex-shrink-0" />
            <span className="font-semibold text-text truncate">
              Semua Produk
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Full-Width Editorial Hero with Right-Aligned Model Background */}
      <div className="relative w-full overflow-hidden bg-[#FBF9FC] border-b border-black/[0.04]">
        {/* Full-width Model Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <picture>
            <source media="(max-width: 640px)" srcSet={heroModelMobile} />
            <img
              src={heroModelDesktop}
              alt="Beautyinu Glowing Skin Routine"
              className="w-full h-full object-cover object-right lg:object-[center_right] opacity-90 sm:opacity-95"
            />
          </picture>

          {/* Smooth Directional Scrim: Opaque on the left for maximum text contrast, fading out to reveal glowing model on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF9FC] via-[#FBF9FC]/95 via-45% to-transparent sm:via-[#FBF9FC]/90 sm:via-55% lg:via-[#FBF9FC]/80 lg:via-60%" />
          {/* Subtle bottom edge blend */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FBF9FC] to-transparent" />
        </div>

        {/* Hero Content (Positioned on Left) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="max-w-xl lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/85 backdrop-blur-md text-accent text-[11px] font-mono font-semibold uppercase tracking-wider mb-3.5 border border-accent/20 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Beautyinu · Official Complete Catalog</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-text font-normal tracking-tight mb-2.5">
              Semua Produk
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal mb-5 max-w-lg">
              Jelajahi seluruh rangkaian perawatan tubuh lengkap Beautyinu berizin resmi BPOM RI: body lotion UV filter, serbuk booster pencerah, krim tubuh, toner, dan sabun mandi collagen.
            </p>

            {/* Editorial Highlight Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {['100% Terdaftar BPOM RI', 'Active UV Filters', 'Formula Konsentrasi Tinggi', 'Garansi Keaslian'].map(
                (highlight) => (
                  <span
                    key={highlight}
                    className="text-[11px] font-medium text-text bg-white/90 backdrop-blur-md px-3 py-1 rounded-md border border-black/[0.08] shadow-2xs"
                  >
                    ✓ {highlight}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content & Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Toolbar: Live Counter & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-black/[0.04] gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Menampilkan</span>
            <span className="font-semibold text-text">{productCount}</span>
            <span>Produk Pilihan</span>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <label
              htmlFor="sort"
              className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/50 flex items-center gap-1"
            >
              <ArrowUpDown className="w-3 h-3 text-black/40" />
              <span>Urutkan:</span>
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={handleSortChange}
              className="bg-white border border-black/10 rounded-xl py-2 px-3 text-xs font-medium text-text focus:outline-none focus:border-black/30 hover:border-black/20 transition-colors shadow-2xs cursor-pointer"
            >
              <option value="featured">Rekomendasi Unggulan</option>
              <option value="best-selling">Paling Laris (Best Selling)</option>
              <option value="price-low-high">Harga: Terendah → Tertinggi</option>
              <option value="price-high-low">Harga: Tertinggi → Terendah</option>
              <option value="newest">Produk Terbaru</option>
            </select>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all shadow-xs"
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

        {/* 5. FAQ Accordion */}
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="font-serif text-lg sm:text-xl text-text font-normal">
              Pertanyaan Seputar Perawatan Tubuh Beautyinu
            </h3>
          </div>
          <div className="space-y-3">
            <details className="group bg-[#FAF9FB] border border-black/[0.05] rounded-xl p-4 transition-all">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-text select-none">
                <span>Bagaimana urutan pemakaian body care Beautyinu yang benar?</span>
                <ChevronDown className="w-4 h-4 text-black/40 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <p className="mt-2.5 text-xs sm:text-[13px] text-text-secondary leading-relaxed border-t border-black/[0.04] pt-2.5">
                Mulai dengan mandi menggunakan Kefir Collagen Soap atau Body Wash, keringkan tubuh, lalu semprotkan English Pear Body Toner. Campurkan sedikit Booster Gold Powder ke dalam Bright Glow Body Lotion untuk perlindungan siang hari (dengan UV Filter), atau aplikasikan Brightening Body Cream Grape di malam hari sebelum tidur.
              </p>
            </details>

            <details className="group bg-[#FAF9FB] border border-black/[0.05] rounded-xl p-4 transition-all">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-text select-none">
                <span>Berapa lama hasil pemakaian rutin dapat terlihat?</span>
                <ChevronDown className="w-4 h-4 text-black/40 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <p className="mt-2.5 text-xs sm:text-[13px] text-text-secondary leading-relaxed border-t border-black/[0.04] pt-2.5">
                Peningkatan kelembapan dan kelembutan tekstur kulit mulai terasa sejak 3–7 hari pertama pemakaian teratur. Perubahan warna kulit yang lebih cerah, glowing, dan merata umumnya terlihat mulai minggu ke-2 hingga ke-4 sesuai siklus regenerasi alami kulit tubuh.
              </p>
            </details>

            <details className="group bg-[#FAF9FB] border border-black/[0.05] rounded-xl p-4 transition-all">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-text select-none">
                <span>Apakah produk Beautyinu aman untuk kulit sensitif dan ibu hamil?</span>
                <ChevronDown className="w-4 h-4 text-black/40 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <p className="mt-2.5 text-xs sm:text-[13px] text-text-secondary leading-relaxed border-t border-black/[0.04] pt-2.5">
                Semua formula Beautyinu resmi terdaftar di BPOM RI tanpa merkuri, steroid, atau hidrokuinon. Produk diformulasikan aman digunakan harian oleh ibu hamil maupun menyusui. Jika Anda memiliki kulit hipersensitif, lakukan uji tempel (patch test) pada area lengan bawah sebelum pemakaian menyeluruh.
              </p>
            </details>
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
