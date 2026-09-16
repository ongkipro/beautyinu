import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {Minus, Plus} from 'lucide-react';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="mt-5 flex flex-col gap-2.5" key={option.name}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-black/60">
                Pilih {option.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const baseClasses =
                  'flex h-9 sm:h-10 items-center justify-center rounded-full px-4 sm:px-5 text-xs font-semibold transition-all duration-150 cursor-pointer';
                const stateClasses = selected
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F8F7FA] text-black/80 hover:bg-[#EFECEF]';
                const disabledClasses = available ? '' : 'opacity-40 line-through';

                const className = `${baseClasses} ${stateClasses} ${disabledClasses}`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={className}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={className}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-6 flex items-center gap-3">
        {/* Quantity Stepper (Pill Capsule - Flat Minimalist) */}
        <div className="flex items-center rounded-full bg-[#F8F7FA] px-3 h-12 flex-shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-7 h-7 flex items-center justify-center text-text hover:text-primary transition-colors disabled:opacity-25 cursor-pointer"
            aria-label="Kurangi jumlah"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold font-mono text-text">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 flex items-center justify-center text-text hover:text-primary transition-colors cursor-pointer"
            aria-label="Tambah jumlah"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add To Cart Button (Pill Capsule) */}
        <div className="flex-1">
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity,
                      selectedVariant,
                    },
                  ]
                : []
            }
            className="w-full h-12 flex items-center justify-center bg-[#111111] hover:bg-black active:scale-[0.99] text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {selectedVariant?.availableForSale ? '+ Tambah ke Keranjang' : 'Stok Habis'}
          </AddToCartButton>
        </div>
      </div>

      {/* Clean Shipping & Authenticity micro reassurance */}
      <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-text-secondary/75">
        <span className="flex items-center gap-1.5 font-medium text-text">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
          100% BPOM Resmi
        </span>
        <span className="text-black/20">•</span>
        <span>Bebas Ongkir min. Rp 150K</span>
        <span className="text-black/20">•</span>
        <span>Kirim dari Surabaya</span>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="w-5 h-5 rounded-full border border-border"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />}
    </div>
  );
}
