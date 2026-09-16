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
    <div className="mt-3">
      <div aria-label="Harga Produk" className="flex items-baseline gap-2.5 flex-wrap" role="group">
        {price && (
          <span className="text-2xl sm:text-3xl font-bold font-mono text-text tracking-tight">
            <Money data={price} withoutTrailingZeros />
          </span>
        )}
        {isDiscounted && compareAtPrice && (
          <span className="text-sm sm:text-base text-text-secondary/50 font-mono line-through">
            <Money data={compareAtPrice} withoutTrailingZeros />
          </span>
        )}
        {isDiscounted && (
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider">
            Hemat {savePercentage}%
          </span>
        )}
      </div>
    </div>
  );
}
