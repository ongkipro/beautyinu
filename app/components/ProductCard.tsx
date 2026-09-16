import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {Star} from 'lucide-react';

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
      className="group flex flex-col items-center text-center w-full"
    >
      {/* 1. Image Canvas — Thin Rounded (rounded-lg / 8px), Borderless & Clean */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#FAF8FC] mb-3">
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

        {/* Floating Discount Pill Badge — Top Left */}
        {isDiscounted && (
          <span className="absolute top-2.5 left-2.5 bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-2xs">
            Hemat {savePercentage}%
          </span>
        )}
      </div>

      {/* 2. Rating Row — Centered */}
      <div className="flex items-center justify-center gap-1 mb-1.5">
        <div className="flex items-center text-[#F59E0B]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>
        <span className="text-[11px] text-text-secondary font-medium">4.9</span>
      </div>

      {/* 3. Product Title — Centered */}
      <h3 className="text-xs sm:text-sm font-semibold text-text leading-snug line-clamp-2 px-1 group-hover:text-primary transition-colors text-center">
        {title}
      </h3>

      {/* 4. Price & Strikethrough — Centered */}
      <div className="mt-1.5 flex items-center justify-center gap-2 flex-wrap">
        {price && (
          <span className="text-xs sm:text-sm font-bold text-text">
            <Money data={price as any} withoutTrailingZeros />
          </span>
        )}
        {isDiscounted && compareAtPrice && (
          <span className="text-[11px] sm:text-xs text-text-secondary/70 line-through">
            <Money data={compareAtPrice as any} withoutTrailingZeros />
          </span>
        )}
      </div>
    </Link>
  );
}
