import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from './Aside';
import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';
import {Minus, Plus, Trash2} from 'lucide-react';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * If the line is a parent line that has child components (like warranties or gift wrapping), they are
 * rendered nested below the parent line.
 */
export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  const nonDefaultOptions = selectedOptions.filter(
    (opt) => opt.value && opt.value !== 'Default Title',
  );

  return (
    <li key={id} className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0">
      <div className="flex gap-3 sm:gap-4 items-start">
        {image ? (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={80}
            loading="lazy"
            width={80}
            className="rounded-2xl object-contain w-18 h-18 sm:w-20 sm:h-20 bg-[#F7F6F9] p-1.5 flex-shrink-0"
          />
        ) : (
          <div className="rounded-2xl w-18 h-18 sm:w-20 sm:h-20 bg-[#F7F6F9] flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link
                prefetch="intent"
                to={lineItemUrl}
                onClick={() => {
                  if (layout === 'aside') {
                    close();
                  }
                }}
                className="hover:text-primary text-text font-semibold text-xs sm:text-sm line-clamp-2 transition-colors leading-snug"
              >
                {product.title}
              </Link>
              {nonDefaultOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {nonDefaultOptions.map((option) => (
                    <span
                      key={option.name}
                      className="text-[11px] text-text-secondary/80 font-normal"
                    >
                      {option.name}: {option.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {line?.cost?.totalAmount ? (
              <span className="font-bold text-text text-xs sm:text-sm flex-shrink-0">
                <Money data={line.cost.totalAmount} withoutTrailingZeros />
              </span>
            ) : line?.merchandise?.price ? (
              <span className="font-bold text-text text-xs sm:text-sm flex-shrink-0">
                <Money data={line.merchandise.price} withoutTrailingZeros />
              </span>
            ) : (line as any)?.selectedVariant?.price ? (
              <span className="font-bold text-text text-xs sm:text-sm flex-shrink-0">
                <Money data={(line as any).selectedVariant.price} withoutTrailingZeros />
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 mt-2.5 pt-2 border-t border-black/[0.04]">
            <CartLineQuantity line={line} />
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="ml-20 sm:ml-24">
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="space-y-3">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="inline-flex items-center rounded-full bg-[#F7F6F9] p-0.5">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Kurangi jumlah"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="w-6 h-6 flex items-center justify-center rounded-full text-text hover:bg-white hover:text-primary hover:shadow-xs transition-all duration-200 disabled:opacity-30 cursor-pointer active:scale-90"
        >
          <Minus className="w-3 h-3" />
        </button>
      </CartLineUpdateButton>
      <span className="w-7 text-center text-xs font-mono font-bold text-text select-none">
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Tambah jumlah"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="w-6 h-6 flex items-center justify-center rounded-full text-text hover:bg-white hover:text-primary hover:shadow-xs transition-all duration-200 disabled:opacity-30 cursor-pointer active:scale-90"
        >
          <Plus className="w-3 h-3" />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        disabled={disabled} 
        type="submit"
        aria-label="Hapus produk dari keranjang"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary/60 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 disabled:opacity-30 px-2 py-0.5 rounded-full cursor-pointer active:scale-95"
      >
        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Hapus</span>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
