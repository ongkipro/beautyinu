import {redirect, useLoaderData, useNavigate, useSearchParams} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/ProductCard';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {getSeoMeta} from '~/lib/seo';

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

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    image: collection.image?.url,
    imageAlt: collection.image?.altText || collection.title,
    type: 'website',
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
  
  let sortKey: 'COLLECTION_DEFAULT' | 'PRICE' | 'CREATED' | 'MANUAL' = 'COLLECTION_DEFAULT';
  let reverse = false;

  if (sortParam === 'price-low-high') {
    sortKey = 'PRICE';
    reverse = false;
  } else if (sortParam === 'price-high-low') {
    sortKey = 'PRICE';
    reverse = true;
  } else if (sortParam === 'newest') {
    sortKey = 'CREATED';
    reverse = true;
  } else {
    sortKey = 'MANUAL';
  }

  if (!handle) {
    throw redirect('/collections');
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
    newParams.set('sort', newSort);
    // Reset pagination when sorting changes
    newParams.delete('cursor');
    newParams.delete('direction');
    navigate(`?${newParams.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Collection Hero */}
      <div className="bg-[#F3EEFA] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">
            {collection.title}
          </h1>
          {collection.descriptionHtml && (
            <div 
              className="max-w-2xl text-[#6B7280] prose prose-p:text-[#6B7280] prose-a:text-[#F97F9E]"
              dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
            />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <p className="text-sm font-medium text-[#6B7280]">
            Showing {collection.products.nodes.length} products
          </p>
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Sort by
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={handleSortChange}
              className="bg-[#FAF8FC] rounded-full py-2 px-4 text-sm font-medium text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {({node: product, index}) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )}
        </PaginatedResourceSection>
      </div>

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
