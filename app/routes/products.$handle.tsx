import {Suspense} from 'react';
import {redirect, useLoaderData, Await, Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {Accordion} from '~/components/Accordion';
import {ProductCard} from '~/components/ProductCard';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {checkLegacyProductRedirect} from '~/lib/productRedirects';
import {ShieldCheck, Heart, Package, ChevronRight} from 'lucide-react';
import {getSeoMeta, buildProductJsonLd} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.product) {
    return getSeoMeta({title: 'Product Not Found — Beautyinu'});
  }
  const {product, canonicalUrl} = data;
  const title = product.seo?.title || `${product.title} — Beautyinu`;
  const description =
    product.seo?.description ||
    product.descriptionHtml?.replace(/<[^>]+>/g, '').trim().slice(0, 160) ||
    `${product.title} by Beautyinu. Official BPOM certified body care.`;
  const imageUrl = product.images?.nodes?.[0]?.url;
  const jsonLd = buildProductJsonLd(product, canonicalUrl);

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    image: imageUrl,
    imageAlt: product.title,
    type: 'product',
    jsonLd,
  });
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args, criticalData.product.id);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  checkLegacyProductRedirect(request, handle);

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    canonicalUrl: `${new URL(request.url).origin}/products/${product.handle}`,
  };
}

function loadDeferredData({context}: Route.LoaderArgs, productId: string) {
  const recommendedProducts = context.storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId},
  });

  return {
    recommendedProducts,
  };
}

export default function Product() {
  const {product, recommendedProducts} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, collections, images} = product;
  const collection = collections?.nodes?.[0];

  const accordionItems: {title: string; content: React.ReactNode; defaultOpen?: boolean}[] = [
    {
      title: 'Description',
      content: <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />,
      defaultOpen: true,
    },
  ];

  if (product.caraPakai?.value) {
    accordionItems.push({
      title: 'How to Use',
      content: <div dangerouslySetInnerHTML={{__html: product.caraPakai.value}} />,
    });
  }

  if (product.ingredients?.value) {
    accordionItems.push({
      title: 'Ingredients',
      content: <div dangerouslySetInnerHTML={{__html: product.ingredients.value}} />,
    });
  }

  accordionItems.push({
    title: 'Shipping',
    content: (
      <p>
        Ships within 1-2 business days from Surabaya.<br />
        Indonesia: 2-5 days.<br />
        Malaysia/Singapore: 5-10 days.
      </p>
    ),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* Minimalist Micro Breadcrumb */}
      <nav className="mb-6 text-xs font-mono uppercase tracking-wider text-black/40 flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        {collection ? (
          <>
            <Link to={`/collections/${collection.handle}`} className="hover:text-primary transition-colors">
              {collection.title}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-black/80 font-medium truncate max-w-xs">{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
        {/* Left: Image Gallery (55%) */}
        <div className="md:col-span-7 lg:col-span-6 xl:col-span-7">
          <ProductImage images={images?.nodes || []} />
        </div>

        {/* Right: Product Info (45%) */}
        <div className="md:col-span-5 lg:col-span-6 xl:col-span-5">
          <h1 className="font-serif text-3xl sm:text-4xl text-text font-normal tracking-tight">{title}</h1>
          
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />

          <div className="mt-8">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* Trust Highlights — Minimalist Clean Strip */}
          <div className="mt-8 border-y border-black/[0.06] py-3.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-black/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-black/40" />
              BPOM Resmi
            </span>
            <span className="text-black/20">•</span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-black/40" />
              Cruelty-Free
            </span>
            <span className="text-black/20">•</span>
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-black/40" />
              Surabaya, ID
            </span>
          </div>

          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24">
        <h2 className="mb-8 font-serif text-2xl text-center md:text-left">Complete Your Routine</h2>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-accent-light" />}>
          <Await resolve={recommendedProducts}>
            {(data) => (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {data?.productRecommendations?.map((rec: any) => (
                  <ProductCard key={rec.id} product={rec} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    collections(first: 1) {
      nodes {
        title
        handle
      }
    }
    images(first: 12) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    caraPakai: metafield(namespace: "custom", key: "cara_pakai") {
      value
    }
    ingredients: metafield(namespace: "custom", key: "ingredients") {
      value
    }
    manfaat: metafield(namespace: "custom", key: "manfaat") {
      value
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: RELATED) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        id
        url
        altText
        width
        height
      }
    }
  }
` as const;
