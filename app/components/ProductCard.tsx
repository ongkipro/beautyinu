import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

/**
 * Reusable unified product card for all grids across the storefront.
 * Clean, borderless, thin rounded (8px / rounded-lg), center-aligned.
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

export function ProductCard({product, loading}: ProductCardProps) {
  const {title, handle, priceRange, compareAtPriceRange, featuredImage} =
    product;

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
      className="group flex flex-col w-full text-left"
    >
      {/* 1. Image Canvas — Minimalist Rounded 2XL, Clean Neutral Canvas */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F8F7FA] mb-3">
        {featuredImage ? (
          <Image
            data={featuredImage as any}
            alt={title ?? ''}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={loading}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-secondary/40 text-xs">
            Beautyinu
          </div>
        )}

        {/* Minimal Monochrome Discount Pill */}
        {isDiscounted && (
          <span className="absolute top-2.5 left-2.5 bg-black/85 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
            -{savePercentage}%
          </span>
        )}
      </div>

      {/* 2. Product Title */}
      <h3 className="text-xs sm:text-sm font-medium text-text leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* 3. Price & Strikethrough */}
      <div className="mt-1 flex items-baseline gap-2 flex-wrap">
        {price && (
          <span className="text-xs sm:text-sm font-semibold text-text">
            <Money data={price as any} withoutTrailingZeros />
          </span>
        )}
        {isDiscounted && compareAtPrice && (
          <span className="text-[11px] sm:text-xs text-text-secondary/60 line-through">
            <Money data={compareAtPrice as any} withoutTrailingZeros />
          </span>
        )}
      </div>
    </Link>
  );
}
