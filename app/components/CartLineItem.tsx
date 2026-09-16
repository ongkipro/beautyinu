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
import {Minus, Plus} from 'lucide-react';

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

  return (
    <li key={id} className="flex flex-col gap-4">
      <div className="flex gap-4">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={80}
            loading="lazy"
            width={80}
            className="rounded-2xl object-contain w-20 h-20 bg-[#F6F5F8] p-1.5"
          />
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start gap-2">
            <div>
              <Link
                prefetch="intent"
                to={lineItemUrl}
                onClick={() => {
                  if (layout === 'aside') {
                    close();
                  }
                }}
                className="hover:text-primary text-text font-semibold text-sm transition-colors"
              >
                {product.title}
              </Link>
              <ul className="text-xs text-text-secondary mt-1 space-y-0.5">
                {selectedOptions.map((option) => (
                  <li key={option.name}>
                    {option.name}: {option.value}
                  </li>
                ))}
              </ul>
            </div>
            {line?.cost?.totalAmount && (
              <span className="font-semibold text-text text-sm">
                <Money data={line.cost.totalAmount} />
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <CartLineQuantity line={line} />
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="ml-24">
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="space-y-4">
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
    <div className="inline-flex items-center rounded-full bg-[#FAF8FC] overflow-hidden">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="w-7 h-7 flex items-center justify-center text-text hover:bg-neutral-200/50 transition-colors disabled:opacity-30"
        >
          <Minus className="w-3 h-3" />
        </button>
      </CartLineUpdateButton>
      <span className="w-7 text-center text-xs font-semibold text-text">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="w-7 h-7 flex items-center justify-center text-text hover:bg-neutral-200/50 transition-colors disabled:opacity-30"
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
        className="text-xs text-text-secondary hover:text-error transition-colors disabled:opacity-50"
      >
        Remove
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
