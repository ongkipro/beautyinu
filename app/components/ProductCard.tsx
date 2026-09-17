import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {Star} from 'lucide-react';

/**
 * Reusable unified product card for all grids across the storefront.
 * Clean, borderless, center-aligned with Shopee-style social proof.
 */
export interface ProductCardProduct {
  id?: string;
  title?: string;
  handle?: string;
  featuredImage?: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange?: {
    minVariantPrice: {amount: string; currencyCode: CurrencyCode | string};
  };
  compareAtPriceRange?: {
    minVariantPrice: {amount: string; currencyCode: CurrencyCode | string};
  };
}

interface ProductCardProps {
  product: ProductCardProduct;
  loading?: HTMLImageElement['loading'];
}

import {getShopeeProductData} from '~/data/shopeeData';

const CATALOG_FALLBACK_IMAGES: Record<string, string> = {
  'brightening-body-cream-grape-100g': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/1.jpg?v=1778573988',
  'brightening-body-cream-grape': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_10.png?v=1781661867',
  'bright-glow-body-lotion-uv-filter-750ml-classic': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/1_33c48405-e65f-4791-a014-87ddaad4ec22.jpg?v=1778574665',
  'bright-glow-body-lotion-uv-filter-750ml': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
  'body-lotion-uv-750ml': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_9.png?v=1781661846',
  'english-pear-body-toner-100ml': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/1_a5fe8674-cd62-4d2a-bdff-8e27fe64cb0d.jpg?v=1778575018',
  'bright-glow-body-wash-250ml': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_8.png?v=1781661875',
  'brightening-booster-gold-powder-25gr-classic': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/1_fa2fa487-ff80-4fbb-9bb1-b366c125b49b.jpg?v=1778575675',
  'brightening-booster-gold-powder-25gr': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
  'booster-gold-powder': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_6.png?v=1781661891',
  'kefir-collagen-soap-60gr': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/Website_Beautyinu_-_7.png?v=1781661857',
  'brightening-body-cream-grape-200g': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu.png?v=1782375202',
  'glowing-set-3-in-1': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-5_12a28318-0aca-4740-917e-6f614c7ec49c.png?v=1784271060',
  'the-glowing-set': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  'body-lotion-booster-set': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-2.png?v=1784275687',
  'body-cream-booster-set': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-1.png?v=1784277185',
  'complete-brightening-set': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-3.png?v=1784278179',
  'booster-gold-powder-7-pack': 'https://cdn.shopify.com/s/files/1/0826/3372/0029/files/WebsiteBeautyinu-4.png?v=1784279186',
};

export function ProductCard({product, loading}: ProductCardProps) {
  const {title, handle, priceRange, compareAtPriceRange, featuredImage} =
    product;

  const fallbackUrl = handle ? CATALOG_FALLBACK_IMAGES[handle] : undefined;
  const socialProof = getShopeeProductData(handle);

  const price = priceRange?.minVariantPrice;
  const compareAtPrice = compareAtPriceRange?.minVariantPrice;
  const isDiscounted =
    price &&
    compareAtPrice &&
    Number(price.amount) < Number(compareAtPrice.amount);

  let savePercentage = 0;
  if (isDiscounted) {
    savePercentage = Math.round(
      ((Number(compareAtPrice.amount) - Number(price.amount)) /
        Number(compareAtPrice.amount)) *
        100,
    );
  }

  return (
    <Link
      to={`/products/${handle}`}
      prefetch="intent"
      className="group flex flex-col items-center text-center w-full"
    >
      {/* 1. Image Canvas — Minimalist Rounded 2XL, Clean Neutral Canvas */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F8F7FA] mb-3">
        {featuredImage?.url ? (
          <Image
            data={featuredImage as any}
            alt={title ?? ''}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={loading}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : fallbackUrl ? (
          <img
            src={fallbackUrl}
            alt={title ?? ''}
            loading={loading || 'lazy'}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-secondary/40 text-xs">
            Beautyinu
          </div>
        )}

        {/* High-Contrast Editorial Glass Badge (Transparent, No Shadow) */}
        {isDiscounted && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-white/80 backdrop-blur-md border border-black/[0.08] px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#D8456C] font-bold">
              HEMAT
            </span>
            <span className="font-bold text-text">{savePercentage}%</span>
          </span>
        )}
      </div>

      {/* 2. Product Title */}
      <h3 className="text-sm sm:text-base font-medium text-text leading-snug line-clamp-2 text-center group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* 3. Price & Strikethrough */}
      <div className="mt-1 flex items-baseline justify-center gap-1.5 sm:gap-2 flex-wrap">
        {price && (
          <span className="text-sm sm:text-base font-bold text-text">
            <Money data={price as any} withoutTrailingZeros />
          </span>
        )}
        {isDiscounted && compareAtPrice && (
          <span className="text-xs sm:text-sm text-text-secondary/60 line-through">
            <Money data={compareAtPrice as any} withoutTrailingZeros />
          </span>
        )}
      </div>

      {/* 4. Shopee-style Social Proof (Rating & Sold) */}
      <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-text-secondary">
        <div className="flex items-center gap-0.5 font-semibold text-text">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
          <span>{socialProof.rating}</span>
        </div>
        <span className="hidden sm:inline text-text-secondary/60">
          ({socialProof.reviews})
        </span>
        <span className="text-black/20 text-xs">•</span>
        <span className="font-medium text-text-secondary">
          {socialProof.sold} terjual
        </span>
      </div>
    </Link>
  );
}
