import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

function formatPriceAmount(money: MoneyV2) {
  const num = Number(money.amount);
  if (isNaN(num)) return money.amount;
  return num % 1 === 0
    ? num.toLocaleString('en-US')
    : num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

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
      <div
        aria-label="Harga Produk"
        className="flex items-center gap-2.5 sm:gap-3 flex-wrap"
        role="group"
      >
        {price && (
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="text-sm sm:text-base font-semibold text-text-secondary/75 tracking-normal font-sans">
              {price.currencyCode}
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-text tracking-tight">
              {formatPriceAmount(price)}
            </span>
          </div>
        )}

        {isDiscounted && compareAtPrice && (
          <span className="text-sm sm:text-base text-text-secondary/60 font-mono line-through decoration-text-secondary/40 font-normal">
            {compareAtPrice.currencyCode} {formatPriceAmount(compareAtPrice)}
          </span>
        )}

        {isDiscounted && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#FFF0F4]/90 backdrop-blur-sm border border-[#FCD0DC] text-[#9E1A40] shadow-2xs">
            Hemat {savePercentage}%
          </span>
        )}
      </div>
    </div>
  );
}

