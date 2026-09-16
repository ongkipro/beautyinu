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
    <div aria-label="Price" className="mt-4 flex flex-col gap-1" role="group">
      <div className="flex items-center gap-2">
        {price && (
          <span className="text-xl font-bold text-text">
            <Money data={price} withoutTrailingZeros />
          </span>
        )}
        {isDiscounted && compareAtPrice && (
          <span className="text-base text-text-secondary line-through">
            <Money data={compareAtPrice} withoutTrailingZeros />
          </span>
        )}
      </div>
      {isDiscounted && (
        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary w-max">
          Save {savePercentage}%
        </span>
      )}
    </div>
  );
}
