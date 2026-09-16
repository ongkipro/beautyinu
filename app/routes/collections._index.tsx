import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  return getSeoMeta({
    title: 'Collections — Beautyinu Official Store',
    description:
      'Jelajahi seluruh koleksi perawatan tubuh Beautyinu: Body Care harian, Bundles hemat, dan jajaran produk Best Sellers berizin BPOM.',
    url: data?.canonicalUrl,
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
    <div className="w-full">
      {/* Hero */}
      <div className="bg-[#FAF9FB] border-b border-black/[0.04] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          <p className="text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-black/50 mb-2">
            Directory
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text font-normal tracking-tight mb-3">
            Shop by Collection
          </h1>
          <p className="max-w-xl text-xs sm:text-sm text-text-secondary leading-relaxed">
            Temukan rangkaian produk perawatan tubuh terbaik dari Beautyinu, diformulasikan untuk kulit glowing dan sehat setiap hari.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
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
  return (
    <Link
      className="group block rounded-3xl bg-[#FAF9FB] hover:bg-[#F5F3F8] border border-black/[0.05] transition-all duration-300 overflow-hidden"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF7FD]">
        {collection?.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#FAF7FD] text-[#AF8FD1]">
            <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6 text-center">
        <h3 className="font-serif text-2xl text-[#1A1A1A] mb-2">{collection.title}</h3>
        <span className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F97F9E]">
          Lihat Koleksi &rarr;
        </span>
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
