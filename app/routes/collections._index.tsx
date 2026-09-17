import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {getSeoMeta, buildBreadcrumbJsonLd} from '~/lib/seo';
import {Breadcrumb} from '~/components/Breadcrumb';
import {OfficialAssurance} from '~/components/OfficialAssurance';
import {Sparkles, ArrowRight, Star, Percent, ShieldCheck} from 'lucide-react';

interface CollectionConfig {
  displayTitle: string;
  categoryTag: string;
  badgeText: string;
  badgeIcon: React.ComponentType<{className?: string}>;
  iconClass: string;
  tapeLabel: string;
  tapeRotate: string;
  cardTilt: string;
}

const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  'body-care': {
    displayTitle: 'Body Care Routine',
    categoryTag: 'Perawatan Tubuh Harian',
    badgeText: 'Duo UV & Night Care',
    badgeIcon: Sparkles,
    iconClass: 'text-primary',
    tapeLabel: 'BEAUTYINU · 01',
    tapeRotate: '-rotate-2',
    cardTilt: 'md:-rotate-[0.6deg]',
  },
  'bundles': {
    displayTitle: 'Bundles & Paket Hemat',
    categoryTag: 'Paket Komplit Pilihan',
    badgeText: 'Hemat s.d 47%',
    badgeIcon: Percent,
    iconClass: 'text-[#D8456C]',
    tapeLabel: 'BEAUTYINU · 02',
    tapeRotate: 'rotate-1.5',
    cardTilt: 'md:rotate-[0.8deg]',
  },
  'best-sellers': {
    displayTitle: 'Best Sellers',
    categoryTag: 'Paling Diminati Pelanggan',
    badgeText: 'Rating 4.9 · Terfavorit',
    badgeIcon: Star,
    iconClass: 'fill-amber-400 text-amber-400',
    tapeLabel: 'BEAUTYINU · 03',
    tapeRotate: 'rotate-1',
    cardTilt: 'md:rotate-[0.5deg]',
  },
  'frontpage': {
    displayTitle: 'Katalog Lengkap',
    categoryTag: 'Semua Koleksi Resmi',
    badgeText: '100% BPOM Resmi',
    badgeIcon: ShieldCheck,
    iconClass: 'text-emerald-600',
    tapeLabel: 'BEAUTYINU · 04',
    tapeRotate: '-rotate-2.5',
    cardTilt: 'md:-rotate-[0.7deg]',
  },
};

const DEFAULT_CONFIG: CollectionConfig = {
  displayTitle: 'Koleksi Resmi',
  categoryTag: 'Beautyinu Archive',
  badgeText: 'Koleksi BPOM',
  badgeIcon: ShieldCheck,
  iconClass: 'text-emerald-600',
  tapeLabel: 'BEAUTYINU · ATELIER',
  tapeRotate: '-rotate-1',
  cardTilt: 'md:rotate-0',
};

const COLLECTION_SUMMARIES: Record<string, string> = {
  'body-care':
    'Rangkaian body lotion UV filter, krim malam anggur, & sabun kefir untuk kulit cerah merata dan lembap seharian.',
  'bundles':
    'Paket komplit bundling hemat s.d 47% untuk akselerasi hasil perawatan glowing maksimal.',
  'best-sellers':
    'Rangkaian produk unggulan terfavorit dengan kepuasan bintang 4.9/5.0 dari ribuan ulasan pembeli.',
  'frontpage':
    'Katalog resmi seluruh varian produk perawatan tubuh Beautyinu yang telah terdaftar resmi BPOM RI.',
};

export const meta: Route.MetaFunction = ({data}) => {
  const canonicalUrl = data?.canonicalUrl || 'https://beautyinu.co/collections';
  return getSeoMeta({
    title: 'Koleksi Produk — Beautyinu Official Store',
    description:
      'Jelajahi seluruh koleksi perawatan tubuh Beautyinu: Body Care harian, Bundles hemat, dan jajaran produk Best Sellers berizin BPOM.',
    url: canonicalUrl,
    type: 'website',
    jsonLd: [
      buildBreadcrumbJsonLd([
        {name: 'Home', url: 'https://beautyinu.co'},
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

  const sortOrder = ['body-care', 'bundles', 'best-sellers', 'frontpage'];
  const sortedNodes = [...collections.nodes].sort((a, b) => {
    const iA = sortOrder.indexOf(a.handle);
    const iB = sortOrder.indexOf(b.handle);
    return (iA === -1 ? 99 : iA) - (iB === -1 ? 99 : iB);
  });

  return {
    collections: {
      ...collections,
      nodes: sortedNodes,
    },
    canonicalUrl: `${new URL(request.url).origin}/collections`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="w-full bg-[#FAF9FC]">
      {/* 1. Integrated Top Breadcrumb Bar */}
      <Breadcrumb
        variant="bar"
        items={[{label: 'Koleksi'}]}
      />

      {/* 2. Unified Hero & Collections Moodboard Section */}
      <div className="relative pt-8 pb-14 sm:pt-12 sm:pb-18 md:pt-14 md:pb-20 overflow-hidden">
        {/* Ambient Wall Lighting Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/90 via-transparent to-black/[0.02]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Streamlined Hero Header */}
          <div className="text-center flex flex-col items-center mb-10 sm:mb-14">
            {/* Clean Micro-Kicker (Zero Boxy Pill Chrome) */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-3 sm:mb-3.5 text-center">
              <div className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-accent">
                  Beautyinu · Official Directory
                </span>
              </div>
              <span className="text-black/20 text-xs font-light select-none">/</span>
              <span className="font-mono text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-secondary">
                4 Koleksi Pilihan
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-text font-normal tracking-tight mb-3">
              Koleksi Perawatan Tubuh
            </h1>

            <p className="max-w-xl text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal mb-6">
              Empat rangkaian formulasi perawatan tubuh intensif berizin resmi BPOM RI, dirancang khusus untuk memenuhi setiap tahapan ritual kulit cerah dan glowing harianmu.
            </p>

            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-primary text-white text-xs font-semibold tracking-tight transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25 active:scale-[0.98] cursor-pointer"
            >
              <span>Lihat Semua Produk (Katalog Lengkap)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2x2 Wall Moodboard Grid */}
          <PaginatedResourceSection<CollectionFragment>
            connection={collections}
            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 pt-3"
          >
            {({node: collection, index}) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                index={index}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>

      {/* 3. Official Assurance — Flat Minimalist Modern */}
      <OfficialAssurance />
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
  const config = COLLECTION_CONFIGS[collection.handle] || DEFAULT_CONFIG;
  const summary =
    COLLECTION_SUMMARIES[collection.handle] ||
    'Jelajahi rangkaian produk pilihan terlaris Beautyinu dengan formulasi aktif teruji.';

  return (
    <Link
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className={`group relative flex flex-col bg-white p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-[0_12px_32px_-6px_rgba(35,15,35,0.07),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-8px_rgba(70,20,70,0.14),0_6px_16px_rgba(0,0,0,0.05)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01] ${config.cardTilt} hover:rotate-0`}
    >
      {/* Washi Tape / Wall Mount Pin Accent */}
      <div
        className={`absolute -top-3 sm:-top-3.5 left-1/2 -translate-x-1/2 z-20 w-28 sm:w-32 h-6 sm:h-7 rounded-[2px] bg-white/85 backdrop-blur-md border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center pointer-events-none transition-transform duration-500 group-hover:scale-105 ${config.tapeRotate}`}
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(243,238,248,0.5) 100%)',
        }}
      >
        <span className="font-mono text-[9px] sm:text-[10px] uppercase font-semibold tracking-[0.2em] text-black/55">
          {config.tapeLabel}
        </span>
      </div>

      {/* Photographic Canvas inside White Mat Border */}
      <div className="relative aspect-[16/10.5] sm:aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6F2F8]">
        {collection?.image ? (
          <Image
            alt={collection.image.altText || config.displayTitle}
            data={collection.image}
            loading={index < 2 ? 'eager' : undefined}
            sizes="(min-width: 1024px) 520px, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#FAF7FD] to-[#F3EEFA] text-accent">
            <span className="font-serif text-3xl opacity-30">Beautyinu</span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-white/70 backdrop-blur-md text-text shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <config.badgeIcon className={`w-3 h-3 ${config.iconClass}`} />
            <span>{config.badgeText}</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-white font-mono text-[10px] tracking-wider">
            0{index + 1} / 04
          </span>
        </div>
      </div>

      {/* Card Caption / Footnote */}
      <div className="pt-4 sm:pt-5 pb-1 px-1 sm:px-2 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-black/50 font-medium">
              {config.categoryTag}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-[26px] text-text font-normal group-hover:text-primary transition-colors tracking-tight leading-snug mb-2">
            {config.displayTitle}
          </h3>

          <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed font-normal mb-4 min-h-[36px] sm:min-h-[40px]">
            {summary}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-black/[0.05]">
          <span className="text-xs font-semibold text-text group-hover:text-primary transition-colors inline-flex items-center gap-1.5">
            <span>Eksplor Koleksi</span>
          </span>
          <span className="w-7 h-7 rounded-full bg-black/[0.04] group-hover:bg-primary group-hover:text-white text-text flex items-center justify-center transition-all duration-300 shadow-2xs">
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
