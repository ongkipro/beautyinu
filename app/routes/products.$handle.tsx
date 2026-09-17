import {Suspense, useEffect} from 'react';
import {redirect, useLoaderData, Await, Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  Money,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {ProductCard} from '~/components/ProductCard';
import {ProductReviews} from '~/components/ProductReviews';
import {getShopeeProductData} from '~/data/shopeeData';
import {Accordion} from '~/components/Accordion';
import {MetafieldContent, hasMetafieldContent} from '~/components/MetafieldContent';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {checkLegacyProductRedirect} from '~/lib/productRedirects';
import {Breadcrumb} from '~/components/Breadcrumb';
import {Star, CheckCircle2, Truck} from 'lucide-react';
import {getSeoMeta, buildProductJsonLd, buildBreadcrumbJsonLd} from '~/lib/seo';

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

  const shopeeData = getShopeeProductData(product.handle);
  const jsonLdProduct = buildProductJsonLd(
    product,
    canonicalUrl,
    shopeeData ? {rating: shopeeData.ratingNum, count: shopeeData.reviewsCountNum} : null,
  );

  const primaryCollection = product.collections?.nodes?.find(
    (c: any) => c.handle !== 'frontpage' && c.handle !== 'all',
  ) || product.collections?.nodes?.[0];
  const collectionLabel = primaryCollection?.title || 'Semua Produk';
  const collectionUrl = primaryCollection
    ? `https://beautyinu.id/collections/${primaryCollection.handle}`
    : 'https://beautyinu.id/collections/all';

  const jsonLdBreadcrumb = buildBreadcrumbJsonLd([
    {name: 'Home', url: 'https://beautyinu.id'},
    {name: collectionLabel, url: collectionUrl},
    {name: product.title, url: canonicalUrl},
  ]);

  return getSeoMeta({
    title,
    description,
    url: canonicalUrl,
    image: imageUrl,
    imageAlt: product.title,
    type: 'product',
    jsonLd: [jsonLdProduct, jsonLdBreadcrumb],
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

  // 1. Permanent redirect for legacy handles
  checkLegacyProductRedirect(request, handle);

  // 2. Clean dirty URL query params (strip ?Title=Default+Title or any Default Title slop)
  const url = new URL(request.url);
  let dirtyQuery = false;
  for (const [key, val] of Array.from(url.searchParams.entries())) {
    if (
      key.toLowerCase() === 'title' ||
      val.toLowerCase() === 'default title' ||
      val.includes('Default Title')
    ) {
      url.searchParams.delete(key);
      dirtyQuery = true;
    }
  }
  if (dirtyQuery) {
    const cleanSearch = url.searchParams.toString();
    throw redirect(`${url.pathname}${cleanSearch ? `?${cleanSearch}` : ''}`, 301);
  }

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

/**
 * Custom Hook: Ensures URLs remain clean and pristine:
 * - Completely purges ?Title=Default+Title or similar Shopify internal placeholder params
 * - Only syncs search parameters if the product has multiple selectable option values (e.g. Ukuran)
 * - Single-variant products retain a clean /products/[handle] URL with NO query string
 */
function useCleanProductUrl(
  selectedVariant: any,
  productOptions: any[],
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUrl = new URL(window.location.href);
    let urlChanged = false;

    // 1. Purge all default title / AI slop params immediately
    for (const [key, val] of Array.from(currentUrl.searchParams.entries())) {
      if (
        key.toLowerCase() === 'title' ||
        val.toLowerCase() === 'default title' ||
        val.includes('Default Title')
      ) {
        currentUrl.searchParams.delete(key);
        urlChanged = true;
      }
    }

    // 2. Only sync variant options if the product genuinely has multiple selectable options
    const hasMultipleVariants = productOptions.some(
      (opt: any) => opt.optionValues && opt.optionValues.length > 1,
    );

    if (hasMultipleVariants && selectedVariant?.selectedOptions) {
      for (const opt of selectedVariant.selectedOptions) {
        if (
          opt.name.toLowerCase() !== 'title' &&
          opt.value.toLowerCase() !== 'default title'
        ) {
          if (currentUrl.searchParams.get(opt.name) !== opt.value) {
            currentUrl.searchParams.set(opt.name, opt.value);
            urlChanged = true;
          }
        }
      }
    } else if (!hasMultipleVariants) {
      // Single variant product: ensure no variant option query params linger in URL
      for (const opt of selectedVariant?.selectedOptions || []) {
        if (currentUrl.searchParams.has(opt.name)) {
          currentUrl.searchParams.delete(opt.name);
          urlChanged = true;
        }
      }
    }

    if (urlChanged) {
      const searchStr = currentUrl.searchParams.toString();
      const cleanPath = `${currentUrl.pathname}${searchStr ? `?${searchStr}` : ''}`;
      window.history.replaceState({}, '', cleanPath);
    }
  }, [selectedVariant, productOptions]);
}

export default function Product() {
  const {product, recommendedProducts} = useLoaderData<typeof loader>();
  const {open} = useAside();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  useCleanProductUrl(selectedVariant, productOptions);

  const {title, descriptionHtml, collections, images, handle} = product;
  // Prioritize specific category collection (e.g. body-care, bundles, best-sellers) over generic frontpage/all
  const primaryCollection = collections?.nodes?.find(
    (c: {handle: string; title: string}) =>
      c.handle !== 'frontpage' &&
      c.handle !== 'all' &&
      c.title.toLowerCase() !== 'all products' &&
      c.title.toLowerCase() !== 'home page' &&
      c.title.toLowerCase() !== 'semua produk',
  );

  const collectionLabel = primaryCollection?.title || 'Koleksi';
  const collectionHref = primaryCollection ? `/collections/${primaryCollection.handle}` : '/collections';
  const socialProof = getShopeeProductData(handle);

  const accordionItems: {title: string; content: React.ReactNode; defaultOpen?: boolean}[] = [];

  // 1. Deskripsi Produk (Only if non-empty)
  if (descriptionHtml && descriptionHtml.replace(/<[^>]+>/g, '').trim().length > 0) {
    accordionItems.push({
      title: 'Deskripsi Produk',
      content: (
        <div
          className="prose prose-sm max-w-none text-text-secondary/90 leading-relaxed space-y-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-text"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      ),
      defaultOpen: true,
    });
  }

  // 2. custom.manfaat (Dynamic: only if filled)
  if (hasMetafieldContent(product.manfaat)) {
    accordionItems.push({
      title: 'Manfaat Formula',
      content: <MetafieldContent value={product.manfaat?.value} />,
    });
  }

  // 3. custom.cara_pakai (Dynamic: only if filled)
  if (hasMetafieldContent(product.caraPakai)) {
    accordionItems.push({
      title: 'Cara Penggunaan',
      content: <MetafieldContent value={product.caraPakai?.value} />,
    });
  }

  // 4. custom.ingredients (Dynamic: only if filled)
  if (hasMetafieldContent(product.ingredients)) {
    accordionItems.push({
      title: 'Kandungan Aktif (Ingredients)',
      content: <MetafieldContent value={product.ingredients?.value} />,
    });
  }

  // 5. Garansi & Pengiriman
  accordionItems.push({
    title: 'Garansi & Pengiriman',
    content: (
      <div className="space-y-2 text-xs sm:text-sm text-text-secondary/85 leading-relaxed">
        <p className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Dikirim langsung dari Surabaya (estimasi proses 1-2 hari kerja).</span>
        </p>
        <p>• Pengiriman Pulau Jawa: 2-3 hari kerja.</p>
        <p>• Luar Pulau Jawa: 3-5 hari kerja.</p>
        <p>• Jaminan 100% Produk Original BPOM & packing aman bubble wrap tebal.</p>
      </div>
    ),
  });

  if (accordionItems.length > 0 && !accordionItems.some((item) => item.defaultOpen)) {
    accordionItems[0].defaultOpen = true;
  }

  return (
    <div className="w-full bg-white">
      {/* 1. Standardized Breadcrumbs Wayfinding Bar */}
      <Breadcrumb
        variant="bar"
        items={[
          {label: collectionLabel, to: collectionHref},
          {label: title},
        ]}
      />

      {/* 2. Main Product Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-16 min-w-0 w-full overflow-x-clip">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14 min-w-0 max-w-full lg:items-start">
        {/* Left: Image Gallery (Sticky on desktop) */}
        <div className="lg:col-span-7 min-w-0 max-w-full lg:sticky lg:top-24 self-start">
          <ProductImage images={images?.nodes || []} />
        </div>

        {/* Right: Product Info (Natural scroll since description & accordions are long) */}
        <div className="lg:col-span-5 flex flex-col min-w-0 max-w-full">
          {/* Social Proof & Reassurance */}
          <div className="flex items-center gap-2 sm:gap-2.5 mb-3 text-xs text-text-secondary flex-wrap">
            <a
              href="#reviews-section"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group/rating"
            >
              <div className="flex items-center gap-0.5 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                <span className="font-semibold text-text group-hover/rating:text-primary">
                  {socialProof.rating}
                </span>
              </div>
              <span className="text-text-secondary underline decoration-black/20 underline-offset-2 group-hover/rating:decoration-primary">
                ({socialProof.reviews} Penilaian)
              </span>
            </a>

            <span className="text-black/20">•</span>

            <span className="text-text-secondary">
              <strong className="text-text font-semibold">{socialProof.sold}</strong> Terjual
            </span>

            <span className="text-black/20">•</span>

            <span className="inline-flex items-center gap-1 text-[11px] font-mono tracking-wide text-text-secondary">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" strokeWidth={2} />
              <span>{socialProof.bpomNumber}</span>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight leading-[1.2] mb-3">
            {title}
          </h1>
          
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />

          <div className="mt-6">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>

          <div className="mt-8">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>

      {/* 2. Customer Reviews & Ratings Section (Shopee UI & UX) */}
      <ProductReviews productTitle={title} productHandle={handle} />

      {/* Related Products / Routine — Exactly 4 Items */}
      <div className="mt-16 sm:mt-24 border-t border-black/[0.06] pt-12 sm:pt-16 min-w-0 max-w-full">
        <div className="mb-8 text-center md:text-left">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 block mb-1.5">
            Perawatan Maksimal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-text font-normal tracking-tight">
            Lengkapi Routine Glowing Kamu
          </h2>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-[#FAF9FB]" />}>
          <Await resolve={recommendedProducts}>
            {(data) => {
              const items = (data?.productRecommendations || []).slice(0, 4);
              if (!items.length) return null;
              return (
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4 md:gap-6 min-w-0">
                  {items.map((rec: any) => (
                    <ProductCard key={rec.id} product={rec} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>

      {/* Mobile Fixed Sticky Add-to-Cart Dock */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedVariant?.image?.url || images?.nodes?.[0]?.url ? (
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F8F7FA] flex-shrink-0 flex items-center justify-center">
              <img
                src={selectedVariant?.image?.url || images?.nodes?.[0]?.url}
                alt={title}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          ) : null}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-black/40 truncate">{title}</span>
            <span className="font-bold text-sm text-text leading-tight">
              {selectedVariant?.price && (
                <Money data={selectedVariant.price} withoutTrailingZeros />
              )}
            </span>
          </div>
        </div>
        <div className="w-36 flex-shrink-0">
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => open('cart')}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                    },
                  ]
                : []
            }
            className="w-full h-11 flex items-center justify-center bg-[#111111] hover:bg-primary active:scale-[0.98] text-white rounded-full font-medium text-xs tracking-wide transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {selectedVariant?.availableForSale ? '+ Keranjang' : 'Habis'}
          </AddToCartButton>
        </div>
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
    collections(first: 5) {
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
