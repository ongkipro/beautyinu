import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/ProductCard';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  return getSeoMeta({
    title: 'All Products — Beautyinu Official Store',
    description:
      'Katalog lengkap seluruh rangkaian produk perawatan tubuh Beautyinu berizin BPOM: body lotion UV filter, serbuk booster pencerah, krim tubuh, dan sabun mandi.',
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
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
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

  return (
    <div className="w-full">
      <div className="bg-[#F3EEFA] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">All Products</h1>
          <p className="max-w-2xl text-[#6B7280]">
            Jelajahi seluruh rangkaian perawatan tubuh lengkap Beautyinu berizin BPOM untuk kulit cerah, lembap, dan glowing.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        <PaginatedResourceSection<CollectionItemFragment>
          connection={products}
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {({node: product, index}) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
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
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
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
