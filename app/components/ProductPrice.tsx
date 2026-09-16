import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
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
    <div aria-label="Price" className="mt-4 flex items-baseline gap-3 flex-wrap" role="group">
      {price && (
        <span className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
          <Money data={price} withoutTrailingZeros />
        </span>
      )}
      {isDiscounted && compareAtPrice && (
        <span className="text-base sm:text-lg text-text-secondary/50 line-through">
          <Money data={compareAtPrice} withoutTrailingZeros />
        </span>
      )}
      {isDiscounted && (
        <span className="inline-flex items-center rounded-full bg-[#111111] px-2.5 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wider text-white">
          -{savePercentage}%
        </span>
      )}
    </div>
  );
}
