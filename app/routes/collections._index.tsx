import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {getSeoMeta, buildBreadcrumbJsonLd} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';
import {
  ShieldCheck,
  Sparkles,
  Truck,
  Clock,
  ArrowRight,
} from 'lucide-react';

const COLLECTION_SUMMARIES: Record<string, string> = {
  'body-care':
    'Rangkaian body lotion UV filter, krim malam anggur, dan toner untuk mencerahkan dan menjaga kelembapan kulit secara merata.',
  'bundles':
    'Paket bundling komplit hemat s.d 35% untuk akselerasi perawatan kulit glowing dan hasil cerah optimal.',
  'best-sellers':
    'Produk unggulan terfavorit dengan kepuasan bintang 4.9/5.0 dan ribuan ulasan positif pembeli terverifikasi.',
  'frontpage':
    'Katalog lengkap seluruh rangkaian produk perawatan tubuh resmi Beautyinu berizin BPOM RI.',
};

export const meta: Route.MetaFunction = ({data}) => {
  const canonicalUrl = data?.canonicalUrl || 'https://beautyinu.id/collections';
  return getSeoMeta({
    title: 'Koleksi Produk — Beautyinu Official Store',
    description:
      'Jelajahi seluruh koleksi perawatan tubuh Beautyinu: Body Care harian, Bundles hemat, dan jajaran produk Best Sellers berizin BPOM.',
    url: canonicalUrl,
    type: 'website',
    jsonLd: [
      buildBreadcrumbJsonLd([
        {name: 'Home', url: 'https://beautyinu.id'},
        {name: 'Koleksi', url: canonicalUrl},
      ]),
    ],
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

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {
    collections,
    canonicalUrl: `${new URL(request.url).origin}/collections`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="w-full bg-white">
      {/* 1. Standardized Breadcrumbs Wayfinding Bar */}
      <Breadcrumb
        variant="bar"
        items={[{label: 'Koleksi'}]}
      />

      {/* 2. Hero Section */}
      <div className="relative bg-[#FAF9FB] border-b border-black/[0.04] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent text-[11px] font-mono font-semibold uppercase tracking-wider mb-3.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Beautyinu · Official Directory</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-text font-normal tracking-tight mb-3">
            Koleksi Perawatan Tubuh
          </h1>

          <p className="max-w-xl text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal mb-6">
            Temukan rangkaian produk perawatan tubuh terbaik dari Beautyinu, diformulasikan dengan bahan aktif klinis berizin resmi BPOM RI untuk kulit cerah dan glowing harian.
          </p>

          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-primary text-white text-xs font-semibold tracking-tight transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25 active:scale-[0.98] cursor-pointer"
          >
            <span>Lihat Semua Produk (Katalog Lengkap)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <PaginatedResourceSection<CollectionFragment>
          connection={collections}
          resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {({node: collection, index}) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>

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

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  const summary =
    COLLECTION_SUMMARIES[collection.handle] ||
    'Jelajahi rangkaian produk pilihan terlaris Beautyinu dengan formulasi aktif teruji.';

  return (
    <Link
      className="group relative flex flex-col rounded-2xl bg-[#FAF9FB] hover:bg-white border border-black/[0.06] hover:border-black/15 transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-xs"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF7FD]">
        {collection?.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#FAF7FD] to-[#F3EEFA] text-accent">
            <span className="font-serif text-3xl opacity-30">Beautyinu</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3.5 left-3.5 z-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
            Official Koleksi
          </span>
        </div>

        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-1 text-white">
          <h3 className="font-serif text-2xl font-normal leading-tight group-hover:text-primary transition-colors">
            {collection.title}
          </h3>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          {summary}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-black/[0.04]">
          <span className="text-xs font-semibold text-text group-hover:text-primary transition-colors">
            Eksplor Koleksi
          </span>
          <span className="w-6 h-6 rounded-lg bg-black/[0.04] group-hover:bg-primary group-hover:text-white text-text flex items-center justify-center transition-all">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
